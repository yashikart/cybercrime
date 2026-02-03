"""
Dashboard endpoints: activity feed, priority queue, notifications, risk trends.
"""

from datetime import datetime, timedelta
from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import AuditLog, Complaint, IncidentReport
from app.core.ai_client import call_openrouter_json


router = APIRouter()


@router.get("/activity-feed")
async def get_activity_feed(
    db: Session = Depends(get_db),
    actor_id: Optional[int] = Query(None),
    type: Optional[str] = Query(None),
    start: Optional[datetime] = Query(None),
    end: Optional[datetime] = Query(None),
    limit: int = Query(50, ge=1, le=200),
):
    """
    Combined activity stream: evidence uploads, complaints, wallet freeze/unfreeze, AI reports, etc.
    Currently derived from AuditLog; can be extended later.
    """
    query = db.query(AuditLog).order_by(AuditLog.timestamp.desc())

    if actor_id is not None:
        query = query.filter(AuditLog.user_id == actor_id)
    if start:
        query = query.filter(AuditLog.timestamp >= start)
    if end:
        query = query.filter(AuditLog.timestamp <= end)

    logs: List[AuditLog] = query.limit(limit).all()

    events = []
    for log in logs:
        action = log.action or ""
        level = (log.level or "info").lower()

        # Infer high-level type from action text
        if "wallet" in action.lower():
            event_type = "wallet"
        elif "complaint" in action.lower():
            event_type = "complaint"
        elif "evidence" in action.lower():
            event_type = "evidence"
        elif "ai" in action.lower():
            event_type = "ai"
        else:
            event_type = "system"

        if type and event_type != type:
            continue

        events.append(
            {
                "id": log.id,
                "timestamp": log.timestamp.isoformat() if log.timestamp else None,
                "actor_id": log.user_id,
                "actor_email": log.user_email,
                "type": event_type,
                "raw_action": action,
                "entity_type": log.entity_type,
                "entity_id": log.entity_id,
                "summary": log.detail or "",
                "severity": level,
                "ip_address": log.ip_address,
                "is_ai": "ai" in action.lower(),
            }
        )

    return {"events": events}


@router.get("/priority-queue")
async def get_priority_queue(
    db: Session = Depends(get_db),
    limit: int = Query(20, ge=1, le=100),
):
    """
    Build a unified queue of complaints + high-risk incident reports,
    call OpenRouter for AI priority scoring, and return sorted list.
    """
    # Open complaints
    complaints: List[Complaint] = (
        db.query(Complaint)
        .filter(Complaint.status.in_(["submitted", "under_review"]))
        .order_by(Complaint.created_at.desc())
        .limit(limit)
        .all()
    )

    # Recent incident reports
    reports: List[IncidentReport] = (
        db.query(IncidentReport)
        .order_by(IncidentReport.created_at.desc())
        .limit(limit)
        .all()
    )

    items = []

    # Complaints
    now = datetime.utcnow()
    for c in complaints:
        created_at = c.created_at or now
        age_hours = (now - created_at).total_seconds() / 3600.0
        has_evidence = bool(c.evidence_ids and c.evidence_ids != "[]")

        items.append(
            {
                "id": f"complaint-{c.id}",
                "kind": "complaint",
                "wallet_address": c.wallet_address,
                "risk_score": 0,
                "risk_level": "MEDIUM",
                "age_hours": age_hours,
                "num_related_reports": 0,
                "has_evidence": has_evidence,
                "investigator_id": c.investigator_id,
                "status": c.status,
            }
        )

    # Incident reports
    for r in reports:
        created_at = r.created_at or now
        age_hours = (now - created_at).total_seconds() / 3600.0

        items.append(
            {
                "id": f"report-{r.id}",
                "kind": "wallet",
                "wallet_address": r.wallet_address,
                "risk_score": float(r.risk_score or 0),
                "risk_level": (r.risk_level or "MEDIUM").upper(),
                "age_hours": age_hours,
                "num_related_reports": 1,
                "has_evidence": False,
                "investigator_id": r.investigator_id,
                "status": r.status or "active",
            }
        )

    if not items:
        return {"items": []}

    prompt = (
        "You are a triage assistant for a cybercrime dashboard.\n"
        "For each item, assign:\n"
        '- \"priority_score\" between 0 and 100 (higher = more urgent)\n'
        '- \"recommended_action\" from [\"freeze\", \"monitor\", \"escalate\", \"review_later\"].\n\n'
        f"Items:\n{items}\n\n"
        "Return ONLY JSON: {\"items\": [{\"id\": \"...\", \"priority_score\": 90, \"recommended_action\": \"freeze\"}, ...]}"
    )

    ai_result = await call_openrouter_json(prompt)
    scores_map = {
        row.get("id"): row for row in ai_result.get("items", []) if isinstance(row, dict) and row.get("id")
    }

    enriched = []
    for item in items:
        row = scores_map.get(item["id"], {})
        item["priority_score"] = int(row.get("priority_score", 0))
        item["recommended_action"] = row.get("recommended_action", "review_later")
        enriched.append(item)

    enriched.sort(key=lambda x: x.get("priority_score", 0), reverse=True)
    return {"items": enriched[:limit]}


@router.get("/notifications")
async def get_notifications(
    db: Session = Depends(get_db),
    type: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200),
):
    """
    Aggregated notifications: AI, complaints, wallets, system.
    For MVP, derive from recent AuditLog entries.
    """
    logs: List[AuditLog] = (
        db.query(AuditLog)
        .order_by(AuditLog.timestamp.desc())
        .limit(limit)
        .all()
    )

    notifications = []
    for log in logs:
        action = log.action or ""
        level = (log.level or "info").lower()

        if "wallet" in action.lower():
            n_type = "wallet"
        elif "complaint" in action.lower():
            n_type = "complaint"
        elif "ai" in action.lower():
            n_type = "ai"
        else:
            n_type = "system"

        notif = {
            "id": f"audit-{log.id}",
            "type": n_type,
            "severity": level,
            "title": action or "Activity",
            "message": log.detail or "",
            "entity_type": log.entity_type,
            "entity_id": log.entity_id,
            "created_at": log.timestamp.isoformat() if log.timestamp else None,
            "read": False,
            "pinned": False,
        }

        notifications.append(notif)

    if type:
        notifications = [n for n in notifications if n["type"] == type]
    if severity:
        notifications = [
            n for n in notifications if (n["severity"] or "").lower() == severity.lower()
        ]

    notifications.sort(key=lambda n: n["created_at"] or "", reverse=True)
    return {"notifications": notifications[:limit]}


@router.get("/risk-trends")
async def get_risk_trends(
    db: Session = Depends(get_db),
    days: int = Query(30, ge=1, le=365),
):
    """
    Compute risk trends from incident reports (risk levels) and complaints (regional volume)
    over the last N days.
    """
    now = datetime.utcnow()
    since = now - timedelta(days=days)

    complaints: List[Complaint] = (
        db.query(Complaint)
        .filter(Complaint.created_at >= since)
        .all()
    )

    reports: List[IncidentReport] = (
        db.query(IncidentReport)
        .filter(IncidentReport.created_at >= since)
        .all()
    )

    by_day = {}
    for r in reports:
        created_at = r.created_at or now
        d = created_at.date().isoformat()
        day = by_day.setdefault(
            d, {"date": d, "critical": 0, "high": 0, "medium": 0, "low": 0}
        )
        level = (r.risk_level or "medium").lower()
        if level == "critical":
            day["critical"] += 1
        elif level == "high":
            day["high"] += 1
        elif level == "medium":
            day["medium"] += 1
        else:
            day["low"] += 1

    distribution = {"low": 0, "medium": 0, "high": 0, "critical": 0}
    for r in reports:
        level = (r.risk_level or "medium").lower()
        if level in distribution:
            distribution[level] += 1

    by_region = {}
    for c in complaints:
        region = c.investigator_location_country or "Unknown"
        entry = by_region.setdefault(region, {"region": region, "critical": 0, "high": 0})
        # For now, count each complaint as a high-risk signal; can be refined with AI later
        entry["high"] += 1

    return {
        "by_day": sorted(by_day.values(), key=lambda x: x["date"]),
        "distribution": distribution,
        "by_region": list(by_region.values()),
    }

