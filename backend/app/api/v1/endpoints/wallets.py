"""
Wallet endpoints
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.db.models import Wallet
from app.api.v1.schemas import WalletResponse, WalletCreate

router = APIRouter()


@router.get("/", response_model=List[WalletResponse])
async def get_wallets(
    case_id: int = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all wallets under investigation"""
    query = db.query(Wallet)
    if case_id:
        query = query.filter(Wallet.case_id == case_id)
    
    wallets = query.offset(skip).limit(limit).all()
    return wallets


@router.get("/{wallet_id}", response_model=WalletResponse)
async def get_wallet(wallet_id: int, db: Session = Depends(get_db)):
    """Get a specific wallet by ID"""
    wallet = db.query(Wallet).filter(Wallet.id == wallet_id).first()
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    return wallet


@router.post("/", response_model=WalletResponse)
async def create_wallet(wallet: WalletCreate, db: Session = Depends(get_db)):
    """Create a new wallet entry"""
    db_wallet = Wallet(**wallet.dict())
    db.add(db_wallet)
    db.commit()
    db.refresh(db_wallet)
    return db_wallet
