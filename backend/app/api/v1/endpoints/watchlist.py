"""
Watchlist & monitoring endpoints.
Allow saving wallets for quick analysis and tracking latest risk.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.db.database import get_db
from app.db.models import WatchlistWallet, IncidentReport
from app.api.v1.endpoints.incidents import analyze_wallet_incident
from app.api.v1.schemas import IncidentReportRequest


router = APIRouter()


@router.get("/", response_model=List[dict])
def get_watchlist(db: Session = Depends(get_db)):
    """Return all watchlisted wallets with latest monitoring status."""
    items = db.query(WatchlistWallet).order_by(WatchlistWallet.created_at.desc()).all()
    result = []
    for w in items:
        result.append(
            {
                "id": w.id,
                "wallet_address": w.wallet_address,
                "label": w.label,
                "active": w.active,
                "created_by": w.created_by,  # Include created_by for filtering
                "created_at": w.created_at.isoformat() if w.created_at else None,
                "last_risk_score": w.last_risk_score,
                "last_risk_level": w.last_risk_level,
                "last_checked_at": w.last_checked_at.isoformat() if w.last_checked_at else None,
                "last_report_id": w.last_report_id,
            }
        )
    return result


@router.post("/", response_model=dict)
def add_to_watchlist(
    wallet_address: str,
    label: str | None = None,
    db: Session = Depends(get_db),
):
    """Add a wallet to the watchlist."""
    wallet_address = wallet_address.strip()
    if not wallet_address:
        raise HTTPException(status_code=400, detail="wallet_address is required")

    existing = (
        db.query(WatchlistWallet)
        .filter(WatchlistWallet.wallet_address == wallet_address)
        .first()
    )
    if existing:
        if not existing.active:
            existing.active = True
            existing.label = label or existing.label
            db.add(existing)
            db.commit()
            db.refresh(existing)
        return {
            "id": existing.id,
            "wallet_address": existing.wallet_address,
            "label": existing.label,
            "active": existing.active,
        }

    item = WatchlistWallet(wallet_address=wallet_address, label=label)
    db.add(item)
    db.commit()
    db.refresh(item)
    return {
        "id": item.id,
        "wallet_address": item.wallet_address,
        "label": item.label,
        "active": item.active,
    }


@router.delete("/{watch_id}", response_model=dict)
def remove_from_watchlist(watch_id: int, db: Session = Depends(get_db)):
    """Soft-remove a wallet from the watchlist."""
    item = db.query(WatchlistWallet).filter(WatchlistWallet.id == watch_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Watchlist entry not found")
    item.active = False
    db.add(item)
    db.commit()
    return {"message": "Removed from watchlist", "id": watch_id}


@router.post("/{watch_id}/analyze", response_model=dict)
async def analyze_watchlist_wallet(watch_id: int, db: Session = Depends(get_db)):
    """
    Run incident analysis for a single watchlist wallet and update monitoring status.
    """
    item = db.query(WatchlistWallet).filter(WatchlistWallet.id == watch_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Watchlist entry not found")

    request = IncidentReportRequest(
        wallet_address=item.wallet_address,
        description="Periodic watchlist analysis",
    )
    # Re-use existing analysis pipeline
    report = await analyze_wallet_incident(request, db)

    # Find the last incident report row for this wallet to link
    last_report = (
        db.query(IncidentReport)
        .filter(IncidentReport.wallet_address == item.wallet_address)
        .order_by(IncidentReport.created_at.desc())
        .first()
    )

    item.last_risk_score = report.risk_score
    item.last_risk_level = report.risk_level
    item.last_checked_at = datetime.utcnow()
    item.last_report_id = last_report.id if last_report else None
    db.add(item)
    db.commit()
    db.refresh(item)

    return {
        "id": item.id,
        "wallet_address": item.wallet_address,
        "label": item.label,
        "last_risk_score": item.last_risk_score,
        "last_risk_level": item.last_risk_level,
        "last_checked_at": item.last_checked_at.isoformat() if item.last_checked_at else None,
        "last_report_id": item.last_report_id,
    }


@router.post("/batch-analyze", response_model=dict)
async def batch_analyze_watchlist(db: Session = Depends(get_db)):
    """
    Run analysis for all active watchlist wallets.
    This auto-creates new incident reports and updates monitoring status.
    """
    active_items = (
        db.query(WatchlistWallet)
        .filter(WatchlistWallet.active.is_(True))
        .all()
    )
    results = []
    for item in active_items:
        request = IncidentReportRequest(
            wallet_address=item.wallet_address,
            description="Periodic watchlist analysis",
        )
        report = await analyze_wallet_incident(request, db)

        last_report = (
            db.query(IncidentReport)
            .filter(IncidentReport.wallet_address == item.wallet_address)
            .order_by(IncidentReport.created_at.desc())
            .first()
        )

        item.last_risk_score = report.risk_score
        item.last_risk_level = report.risk_level
        item.last_checked_at = datetime.utcnow()
        item.last_report_id = last_report.id if last_report else None
        db.add(item)
        results.append(
            {
                "id": item.id,
                "wallet_address": item.wallet_address,
                "last_risk_score": item.last_risk_score,
                "last_risk_level": item.last_risk_level,
                "last_checked_at": item.last_checked_at.isoformat()
                if item.last_checked_at
                else None,
                "last_report_id": item.last_report_id,
            }
        )

    db.commit()
    return {"count": len(results), "items": results}

