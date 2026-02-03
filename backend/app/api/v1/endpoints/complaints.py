"""
Complaints endpoints
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import json

from app.db.database import get_db
from app.db.models import Complaint
from app.api.v1.schemas import ComplaintCreate, ComplaintResponse

router = APIRouter()


@router.get("/", response_model=List[ComplaintResponse])
async def get_complaints(
    investigator_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """Get all filed complaints"""
    query = db.query(Complaint)
    if investigator_id is not None:
        query = query.filter(Complaint.investigator_id == investigator_id)
    
    complaints = (
        query
        .order_by(Complaint.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [c.to_dict() for c in complaints]


@router.get("/{complaint_id}", response_model=ComplaintResponse)
async def get_complaint(complaint_id: int, db: Session = Depends(get_db)):
    """Get a specific complaint by ID"""
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return complaint.to_dict()


@router.post("/", response_model=ComplaintResponse)
async def create_complaint(complaint: ComplaintCreate, db: Session = Depends(get_db)):
    """Create a new complaint"""
    db_complaint = Complaint(
        wallet_address=complaint.wallet_address,
        investigator_id=complaint.investigator_id,
        officer_designation=complaint.officer_designation,
        officer_address=complaint.officer_address,
        officer_email=json.dumps(complaint.officer_email or []),
        officer_mobile=json.dumps(complaint.officer_mobile or []),
        officer_telephone=json.dumps(complaint.officer_telephone or []),
        incident_description=complaint.incident_description,
        internal_notes=complaint.internal_notes,
        evidence_ids=json.dumps(complaint.evidence_ids or []),
        investigator_location_city=complaint.investigator_location_city,
        investigator_location_country=complaint.investigator_location_country,
        investigator_location_latitude=complaint.investigator_location_latitude,
        investigator_location_longitude=complaint.investigator_location_longitude,
        investigator_location_ip=complaint.investigator_location_ip,
        status="submitted",
    )
    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)
    return db_complaint.to_dict()


@router.patch("/{complaint_id}/status", response_model=ComplaintResponse)
async def update_complaint_status(
    complaint_id: int,
    status: str,
    db: Session = Depends(get_db),
):
    """Update complaint status"""
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    complaint.status = status
    complaint.updated_at = datetime.now()
    db.add(complaint)
    db.commit()
    db.refresh(complaint)
    return complaint.to_dict()
