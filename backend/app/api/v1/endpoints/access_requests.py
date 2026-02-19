"""
Investigator Access Request endpoints
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from app.db.database import get_db
from app.db.models import InvestigatorAccessRequest, User
from app.core.security import get_password_hash
from app.core.audit_logging import emit_audit_log

router = APIRouter()


class AccessRequestCreate(BaseModel):
    full_name: str
    email: EmailStr
    reason: Optional[str] = None


class AccessRequestResponse(BaseModel):
    id: int
    full_name: str
    email: str
    reason: Optional[str]
    status: str
    reviewed_by: Optional[int]
    reviewed_at: Optional[str]
    rejection_reason: Optional[str]
    created_at: str
    updated_at: str


class AccessRequestUpdate(BaseModel):
    status: str  # approved, rejected
    rejection_reason: Optional[str] = None


@router.post("/request", response_model=AccessRequestResponse, status_code=status.HTTP_201_CREATED)
async def create_access_request(
    request: AccessRequestCreate,
    db: Session = Depends(get_db)
):
    """Submit a new investigator access request"""
    # Check if email already exists in users table
    existing_user = db.query(User).filter(User.email == request.email.lower().strip()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists"
        )
    
    # Check if there's already a pending request for this email
    existing_request = db.query(InvestigatorAccessRequest).filter(
        InvestigatorAccessRequest.email == request.email.lower().strip(),
        InvestigatorAccessRequest.status == "pending"
    ).first()
    if existing_request:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A pending request already exists for this email"
        )
    
    # Create new request
    db_request = InvestigatorAccessRequest(
        full_name=request.full_name,
        email=request.email.lower().strip(),
        reason=request.reason,
        status="pending"
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    
    # Create a notification/message for superadmin about the new request
    try:
        from app.db.models import Message
        from datetime import datetime
        
        # Get superadmin user
        superadmin = db.query(User).filter(User.role == "superadmin").first()
        if superadmin:
            # Create a message/notification for superadmin
            notification = Message(
                sender_id=None,  # System-generated
                recipient_id=superadmin.id,
                message_type="notification",
                subject=f"New Investigator Access Request: {request.full_name}",
                content=f"A new investigator access request has been submitted.\n\nName: {request.full_name}\nEmail: {request.email}\nReason: {request.reason or 'No reason provided'}\n\nRequest ID: {db_request.id}\n\nPlease review this request in the Access Requests section.",
                priority="high",
                is_broadcast=False,
                is_read=False
            )
            db.add(notification)
            db.commit()
    except Exception as e:
        # Don't fail the request creation if notification fails
        emit_audit_log(
            action="access_request.notify",
            status="warning",
            message="Failed to create notification for access request.",
            details={"error": str(e)},
        )
    
    return db_request.to_dict()


@router.get("/requests", response_model=List[AccessRequestResponse])
async def get_access_requests(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all access requests (superadmin only)"""
    query = db.query(InvestigatorAccessRequest)
    
    if status_filter:
        query = query.filter(InvestigatorAccessRequest.status == status_filter)
    
    requests = query.order_by(InvestigatorAccessRequest.created_at.desc()).all()
    return [req.to_dict() for req in requests]


@router.get("/requests/{request_id}", response_model=AccessRequestResponse)
async def get_access_request(
    request_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific access request"""
    request = db.query(InvestigatorAccessRequest).filter(InvestigatorAccessRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found")
    return request.to_dict()


@router.patch("/requests/{request_id}/review", response_model=AccessRequestResponse)
async def review_access_request(
    request_id: int,
    update: AccessRequestUpdate,
    http_request: Request,
    reviewed_by: Optional[int] = None,  # Superadmin user ID
    db: Session = Depends(get_db)
):
    """Approve or reject an access request (superadmin only)"""
    from datetime import datetime
    
    access_request = db.query(InvestigatorAccessRequest).filter(InvestigatorAccessRequest.id == request_id).first()
    if not access_request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found")
    
    if access_request.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Request is already {access_request.status}"
        )
    
    if update.status not in ["approved", "rejected"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status must be 'approved' or 'rejected'"
        )
    
    # Update request status
    access_request.status = update.status
    if getattr(http_request.state, "current_user", None):
        reviewed_by = http_request.state.current_user.id
    access_request.reviewed_by = reviewed_by
    access_request.reviewed_at = datetime.utcnow()
    if update.status == "rejected" and update.rejection_reason:
        access_request.rejection_reason = update.rejection_reason
    
    # If approved, create the investigator account
    if update.status == "approved":
        existing_user = db.query(User).filter(User.email == access_request.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"User with email {access_request.email} already exists"
            )
        # Generate a temporary password (investigator will need to reset it)
        import secrets
        temp_password = secrets.token_urlsafe(12)
        
        new_user = User(
            email=access_request.email,
            hashed_password=get_password_hash(temp_password),
            full_name=access_request.full_name,
            role="investigator",
            is_active=True
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # Note: In production, you would send the temporary password via email
        # For now, we'll just create the account
    
    db.commit()
    db.refresh(access_request)
    
    return access_request.to_dict()
