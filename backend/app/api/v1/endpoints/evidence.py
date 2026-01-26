"""
Evidence endpoints
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.db.models import Evidence
from app.api.v1.schemas import EvidenceResponse, EvidenceCreate

router = APIRouter()


@router.get("/", response_model=List[EvidenceResponse])
async def get_evidence(
    case_id: int = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all evidence"""
    query = db.query(Evidence)
    if case_id:
        query = query.filter(Evidence.case_id == case_id)
    
    evidence_list = query.offset(skip).limit(limit).all()
    return evidence_list


@router.get("/{evidence_id}", response_model=EvidenceResponse)
async def get_evidence_item(evidence_id: int, db: Session = Depends(get_db)):
    """Get a specific evidence item by ID"""
    evidence_item = db.query(Evidence).filter(Evidence.id == evidence_id).first()
    if not evidence_item:
        raise HTTPException(status_code=404, detail="Evidence not found")
    return evidence_item


@router.post("/", response_model=EvidenceResponse)
async def create_evidence(evidence: EvidenceCreate, db: Session = Depends(get_db)):
    """Create a new evidence entry"""
    db_evidence = Evidence(**evidence.dict())
    db.add(db_evidence)
    db.commit()
    db.refresh(db_evidence)
    return db_evidence
