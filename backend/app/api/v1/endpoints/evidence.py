"""
Evidence endpoints
"""

from datetime import datetime
import hashlib
import os
from pathlib import Path
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse, StreamingResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Evidence
from app.api.v1.schemas import EvidenceResponse
from app.core.config import settings

router = APIRouter()

# Ensure evidence storage directory exists
EVIDENCE_STORAGE_DIR = Path(settings.EVIDENCE_STORAGE_PATH)
EVIDENCE_STORAGE_DIR.mkdir(parents=True, exist_ok=True)


@router.get("/", response_model=List[EvidenceResponse])
async def get_evidence(
    case_id: Optional[int] = None,
    investigator_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """Get all evidence"""
    query = db.query(Evidence)
    if case_id is not None:
        query = query.filter(Evidence.case_id == case_id)
    if investigator_id is not None:
        query = query.filter(Evidence.investigator_id == investigator_id)

    evidence_list = query.offset(skip).limit(limit).all()
    return evidence_list


@router.get("/{evidence_id}", response_model=EvidenceResponse)
async def get_evidence_item(evidence_id: int, db: Session = Depends(get_db)):
    """Get a specific evidence item by ID"""
    evidence_item = db.query(Evidence).filter(Evidence.id == evidence_id).first()
    if not evidence_item:
        raise HTTPException(status_code=404, detail="Evidence not found")
    return evidence_item


@router.get("/{evidence_id}/download")
async def download_evidence(evidence_id: int, db: Session = Depends(get_db)):
    """Download an evidence file"""
    evidence_item = db.query(Evidence).filter(Evidence.id == evidence_id).first()
    if not evidence_item:
        raise HTTPException(status_code=404, detail="Evidence not found")
    
    if not evidence_item.file_path:
        raise HTTPException(
            status_code=404, 
            detail="Evidence file was uploaded before file storage was implemented. File is not available for download."
        )
    
    if not os.path.exists(evidence_item.file_path):
        raise HTTPException(
            status_code=404, 
            detail="Evidence file not found on disk. The file may have been deleted or moved."
        )
    
    return FileResponse(
        path=evidence_item.file_path,
        filename=evidence_item.title or f"evidence_{evidence_id}",
        media_type=evidence_item.file_type or "application/octet-stream",
    )


@router.get("/{evidence_id}/view")
async def view_evidence(evidence_id: int, db: Session = Depends(get_db)):
    """View an evidence file (for images, PDFs, etc.)"""
    evidence_item = db.query(Evidence).filter(Evidence.id == evidence_id).first()
    if not evidence_item:
        raise HTTPException(status_code=404, detail="Evidence not found")
    
    if not evidence_item.file_path:
        raise HTTPException(
            status_code=404, 
            detail="Evidence file was uploaded before file storage was implemented. File is not available for viewing."
        )
    
    if not os.path.exists(evidence_item.file_path):
        raise HTTPException(
            status_code=404, 
            detail="Evidence file not found on disk. The file may have been deleted or moved."
        )
    
    # For viewable files, return with appropriate content type
    return FileResponse(
        path=evidence_item.file_path,
        filename=evidence_item.title or f"evidence_{evidence_id}",
        media_type=evidence_item.file_type or "application/octet-stream",
    )


@router.post("/", response_model=EvidenceResponse)
async def create_evidence(
    file: UploadFile = File(...),
    wallet_id: str = Form(...),
    title: str = Form(""),
    description: str = Form(""),
    tags: str = Form(""),
    risk_level: str = Form("medium"),
    investigator_id: Optional[int] = Form(None),
    db: Session = Depends(get_db),
):
    """
    Create a new evidence entry from an uploaded file.

    This is designed to work with the Investigator UI "Evidence Upload"
    section. It accepts ANY file type (PDF, images, CSV, Excel, docs, etc.)
    via multipart/form-data and stores the file plus metadata in SQL.
    """
    # Read file bytes and compute a SHA-256 hash for integrity
    content = await file.read()
    file_hash = hashlib.sha256(content).hexdigest()
    file_size = len(content)

    # Generate a simple evidence ID based on timestamp
    evidence_id = f"EV-{int(datetime.utcnow().timestamp() * 1000)}"

    # Use provided title if present, otherwise fall back to filename / evidence_id
    resolved_title = title or file.filename or evidence_id

    # Get file extension and MIME type
    file_extension = ""
    if file.filename:
        file_extension = Path(file.filename).suffix
    file_type = file.content_type or file_extension or "application/octet-stream"

    # Save file to storage directory
    # Use evidence_id as filename to ensure uniqueness
    safe_filename = f"{evidence_id}{file_extension}" if file_extension else evidence_id
    file_path = EVIDENCE_STORAGE_DIR / safe_filename
    
    # Write file to disk
    with open(file_path, "wb") as f:
        f.write(content)

    # Enrich description with context from the form so it's visible later
    details_parts = []
    if description:
        details_parts.append(description)
    details_parts.append(f"Wallet: {wallet_id}")
    if tags:
        details_parts.append(f"Tags: {tags}")
    if risk_level:
        details_parts.append(f"Risk level: {risk_level}")
    full_description = "\n".join(details_parts)

    db_evidence = Evidence(
        evidence_id=evidence_id,
        title=resolved_title,
        description=full_description,
        hash=file_hash,
        file_path=str(file_path),
        file_size=file_size,
        file_type=file_type,
        anchor_status="pending",
        immutable=True,
        investigator_id=investigator_id,
    )

    db.add(db_evidence)
    db.commit()
    db.refresh(db_evidence)
    return db_evidence
