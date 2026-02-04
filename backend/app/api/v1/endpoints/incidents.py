"""
Incident Report API endpoints
Analyzes wallet addresses and generates fraud risk reports
"""

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from typing import List, Dict, Any, Optional
from datetime import datetime
import sys
import os
import json

# Add synthetic_data_generator to path
backend_path = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
sys.path.insert(0, backend_path)

from app.db.database import get_db
from app.db.models import IncidentReport
from app.api.v1.schemas import IncidentReportRequest, IncidentReportResponse
from app.core.ai_service import generate_ai_conclusion, check_ai_available
from app.core.ai_orchestrator import call_incident_orchestrator
from synthetic_data_generator.generator import generate_wallet_transactions, random_wallet
from synthetic_data_generator.suspicious_patterns import (
    calculate_risk_score,
    detect_rapid_consolidation,
    detect_layering,
    detect_circular_pattern
)

router = APIRouter()


def analyze_wallet_description(description: str) -> Dict[str, float]:
    """
    Analyze user description to boost certain pattern scores
    Returns pattern weights based on keywords
    """
    description_lower = description.lower()
    weights = {
        "ponzi": 0.0,
        "fraud": 0.0,
        "money_laundering": 0.0,
        "ransomware": 0.0,
    }
    
    # Ponzi scheme keywords
    ponzi_keywords = ["return", "invest", "profit", "promise", "guarantee", "scheme"]
    if any(keyword in description_lower for keyword in ponzi_keywords):
        weights["ponzi"] = 0.3
    
    # Fraud keywords
    fraud_keywords = ["scam", "victim", "stolen", "fake", "fraud"]
    if any(keyword in description_lower for keyword in fraud_keywords):
        weights["fraud"] = 0.25
    
    # Money laundering keywords
    ml_keywords = ["launder", "clean", "transfer", "multiple", "hop"]
    if any(keyword in description_lower for keyword in ml_keywords):
        weights["money_laundering"] = 0.2
    
    # Ransomware keywords
    ransomware_keywords = ["ransom", "hack", "lock", "encrypt", "payment"]
    if any(keyword in description_lower for keyword in ransomware_keywords):
        weights["ransomware"] = 0.2
    
    return weights


def detect_pattern_type(txns: List[Dict], description_weights: Dict[str, float]) -> str:
    """
    Detect the most likely pattern type based on transactions and description
    """
    pattern_scores = {}
    
    # Test each pattern
    patterns = {
        "fraud": generate_wallet_transactions("TEST", mode="fraud"),
        "money_laundering": generate_wallet_transactions("TEST", mode="money_laundering"),
        "ponzi": generate_wallet_transactions("TEST", mode="ponzi"),
        "ransomware": generate_wallet_transactions("TEST", mode="ransomware"),
    }
    
    # Calculate similarity scores (simplified - in production use ML)
    if detect_rapid_consolidation(txns):
        pattern_scores["fraud"] = 0.4 + description_weights.get("fraud", 0)
        pattern_scores["ransomware"] = 0.3 + description_weights.get("ransomware", 0)
    
    if detect_layering(txns):
        pattern_scores["money_laundering"] = 0.5 + description_weights.get("money_laundering", 0)
    
    if len(txns) > 10 and any(t.get("amount", 0) > 5000 for t in txns):
        pattern_scores["ponzi"] = 0.3 + description_weights.get("ponzi", 0)
    
    # Return pattern with highest score
    if pattern_scores:
        return max(pattern_scores, key=pattern_scores.get)
    return "Unknown"


def get_risk_level(score: float) -> str:
    """Convert risk score to human-readable level"""
    if score >= 0.8:
        return "VERY HIGH"
    elif score >= 0.6:
        return "HIGH"
    elif score >= 0.4:
        return "MEDIUM"
    elif score >= 0.2:
        return "LOW"
    return "VERY LOW"


def generate_graph_data(txns: List[Dict], wallet: str) -> List[Dict[str, Any]]:
    """
    Generate graph data for visualization
    Returns list of edges with from, to, amount
    """
    graph = []
    seen_edges = {}
    
    for txn in txns:
        from_addr = txn.get("from", "")
        to_addr = txn.get("to", "")
        amount = txn.get("amount", 0)
        
        # Create edge key
        edge_key = f"{from_addr}->{to_addr}"
        
        if edge_key in seen_edges:
            seen_edges[edge_key] += amount
        else:
            seen_edges[edge_key] = amount
    
    # Convert to graph format (use 'from' and 'to' for JSON compatibility)
    for edge, total_amount in seen_edges.items():
        from_addr, to_addr = edge.split("->")
        graph.append({
            "from": from_addr,
            "to": to_addr,
            "amount": total_amount
        })
    
    return graph


def generate_timeline(txns: List[Dict]) -> List[Dict[str, Any]]:
    """
    Generate timeline data for burst visualization
    """
    timeline = []
    
    for txn in sorted(txns, key=lambda x: x.get("timestamp", "")):
        timestamp = txn.get("timestamp", "")
        try:
            dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
            time_str = dt.strftime("%H:%M")
        except:
            time_str = timestamp[:5] if len(timestamp) > 5 else timestamp
        
        timeline.append({
            "time": time_str,
            "amount": txn.get("amount", 0),
            "timestamp": timestamp
        })
    
    return timeline


def get_detected_patterns_list(txns: List[Dict]) -> List[str]:
    """
    Get list of detected suspicious patterns
    """
    patterns = []
    
    if detect_rapid_consolidation(txns):
        patterns.append("Rapid Consolidation")
    
    if detect_layering(txns):
        patterns.append("Money Laundering (Layering)")
        patterns.append("Multiple Hop Transfers")
    
    if detect_circular_pattern(txns):
        patterns.append("Circular Movement")
    
    # Check for structuring (multiple transactions just under threshold)
    amounts = [t.get("amount", 0) for t in txns]
    if len([a for a in amounts if 9000 < a < 10000]) >= 3:
        patterns.append("Structuring Detected")
    
    # Check for high frequency
    if len(txns) > 15:
        patterns.append("High Transaction Frequency")
    
    return patterns if patterns else ["No obvious patterns detected"]


def generate_system_conclusion(
    risk_score: float,
    risk_level: str,
    pattern_type: str,
    detected_patterns: List[str]
) -> str:
    """
    Generate AI-like system conclusion text
    """
    conclusions = {
        "fraud": "This wallet exhibits behavior consistent with fraudulent activity, involving rapid fund aggregation from multiple sources followed by immediate consolidation. The pattern suggests a classic scam operation.",
        "money_laundering": "This wallet exhibits behavior consistent with money laundering via layering, involving rapid fund aggregation followed by multi-hop transfers through intermediate wallets to obscure the origin of funds.",
        "ponzi": "This wallet exhibits behavior consistent with a Ponzi scheme, showing multiple investors over time with early investors receiving returns funded by later investors.",
        "ransomware": "This wallet exhibits behavior consistent with ransomware payment collection, showing multiple round-number payments from different sources followed by periodic consolidation.",
    }
    
    base_conclusion = conclusions.get(pattern_type, "This wallet shows unusual transaction patterns that warrant further investigation.")
    
    if risk_score >= 0.8:
        severity = "The risk score of {:.0%} indicates a very high likelihood of financial crime.".format(risk_score)
    elif risk_score >= 0.6:
        severity = "The risk score of {:.0%} indicates a high likelihood of suspicious activity.".format(risk_score)
    else:
        severity = "The risk score of {:.0%} indicates moderate risk requiring monitoring.".format(risk_score)
    
    return f"{base_conclusion} {severity}"


@router.post("/analyze", response_model=IncidentReportResponse)
async def analyze_wallet_incident(
    request: IncidentReportRequest,
    db: Session = Depends(get_db)
):
    """
    Analyze a wallet address and generate comprehensive fraud risk report.
    Saves the report to the SQL database for persistence.
    """
    try:
        wallet = request.wallet_address
        
        # Analyze description to boost pattern scores
        description_weights = analyze_wallet_description(request.description)
        
        # Determine which pattern to generate based on description
        # For now, we'll generate multiple patterns and pick the best match
        # In production, you'd use ML or more sophisticated detection
        
        # Generate transactions (using fraud as default, but could be dynamic)
        pattern_modes = ["fraud", "money_laundering", "ponzi", "ransomware"]
        
        # Pick pattern based on description weights
        if description_weights["ponzi"] > 0:
            txns = generate_wallet_transactions(wallet, mode="ponzi")
        elif description_weights["money_laundering"] > 0:
            txns = generate_wallet_transactions(wallet, mode="money_laundering")
        elif description_weights["ransomware"] > 0:
            txns = generate_wallet_transactions(wallet, mode="ransomware")
        else:
            # Default to fraud or money laundering
            txns = generate_wallet_transactions(wallet, mode="fraud")
        
        # Calculate metrics
        total_in = sum(t.get("amount", 0) for t in txns if t.get("to") == wallet)
        total_out = sum(t.get("amount", 0) for t in txns if t.get("from") == wallet)
        unique_senders = len(set(t.get("from") for t in txns if t.get("from") != wallet))
        unique_receivers = len(set(t.get("to") for t in txns if t.get("to") != wallet))
        
        # Calculate risk score
        base_risk = calculate_risk_score(txns)
        
        # Boost risk based on description
        description_boost = sum(description_weights.values()) * 0.1
        risk_score = min(base_risk + description_boost, 1.0)
        
        # Detect pattern type
        pattern_type = detect_pattern_type(txns, description_weights)
        risk_level = get_risk_level(risk_score)
        
        # Get detected patterns
        detected_patterns = get_detected_patterns_list(txns)
        
        # Generate graph data
        graph_data = generate_graph_data(txns, wallet)
        
        # Generate timeline
        timeline = generate_timeline(txns)
        
        # Optionally delegate to external AI orchestrator (e.g. Primary_Bucket_Owner)
        orchestrator_result: Optional[Dict[str, Any]] = None
        try:
            orchestrator_payload = {
                "wallet": wallet,
                "description": request.description,
                "transactions": txns,
                "base_metrics": {
                    "total_in": total_in,
                    "total_out": total_out,
                    "tx_count": len(txns),
                    "unique_senders": unique_senders,
                    "unique_receivers": unique_receivers,
                },
                "base_risk": {
                    "risk_score": risk_score,
                    "risk_level": risk_level,
                    "pattern_type": pattern_type,
                    "detected_patterns": detected_patterns,
                },
            }
            orchestrator_result = call_incident_orchestrator(orchestrator_payload)
        except Exception:
            orchestrator_result = None

        # Generate system conclusion using orchestrator if available, else OpenRouter/template
        if orchestrator_result and isinstance(orchestrator_result, dict) and orchestrator_result.get("system_conclusion"):
            # Optionally override risk if orchestrator provides it
            try:
                if "risk_score" in orchestrator_result:
                    risk_score = float(orchestrator_result["risk_score"])
                    risk_level = get_risk_level(risk_score)
                if "risk_level" in orchestrator_result:
                    risk_level = orchestrator_result["risk_level"]
                extra_patterns = orchestrator_result.get("detected_patterns") or []
                if isinstance(extra_patterns, list):
                    # Merge and deduplicate patterns
                    detected_patterns = list({*detected_patterns, *[str(p) for p in extra_patterns]})
            except Exception:
                # If parsing fails, keep original risk values
                pass

            system_conclusion = str(orchestrator_result["system_conclusion"])
        else:
            try:
                system_conclusion = generate_ai_conclusion(
                    wallet=wallet,
                    risk_score=risk_score,
                    risk_level=risk_level,
                    pattern_type=pattern_type,
                    detected_patterns=detected_patterns,
                    summary={
                        "total_in": total_in,
                        "total_out": total_out,
                        "tx_count": len(txns),
                        "unique_senders": unique_senders,
                        "unique_receivers": unique_receivers,
                    },
                    user_description=request.description,
                    fallback_to_template=True,
                )
            except Exception:
                # Fallback to template if AI fails
                system_conclusion = generate_system_conclusion(
                    risk_score, risk_level, pattern_type, detected_patterns
                )
        
        # Build transaction details for frontend table
        tx_details = []
        for idx, t in enumerate(txns):
            amount = float(t.get("amount", 0))
            direction = "related"
            if t.get("from") == wallet and t.get("to") != wallet:
                direction = "outgoing"
            elif t.get("to") == wallet and t.get("from") != wallet:
                direction = "incoming"
            timestamp = t.get("timestamp")
            # Simple heuristic for "suspicious" transaction highlight
            suspicious = amount >= max(total_in, total_out) * 0.4 or amount > 10000
            tx_details.append({
                "id": idx + 1,
                "from_address": t.get("from", ""),
                "to_address": t.get("to", ""),
                "amount": amount,
                "direction": direction,
                "timestamp": timestamp,
                "type": t.get("type", None),
                "suspicious": suspicious,
            })

        # Prepare response data
        response_data = IncidentReportResponse(
            wallet=wallet,
            risk_score=risk_score,
            risk_level=risk_level,
            detected_patterns=detected_patterns,
            summary={
                "total_in": total_in,
                "total_out": total_out,
                "tx_count": len(txns),
                "unique_senders": unique_senders,
                "unique_receivers": unique_receivers,
                "pattern_type": pattern_type.replace("_", " ").title(),
                # also embed transactions in summary so they persist in SQL
                "transactions": tx_details,
            },
            graph_data=graph_data,
            timeline=timeline,
            transactions=tx_details,
            system_conclusion=system_conclusion
        )

        # Save to SQL database (IncidentReport table)
        try:
            summary_obj = {
                "total_in": total_in,
                "total_out": total_out,
                "tx_count": len(txns),
                "unique_senders": unique_senders,
                "unique_receivers": unique_receivers,
                "pattern_type": pattern_type.replace("_", " ").title(),
                "transactions": tx_details,
            }

            report = IncidentReport(
                wallet_address=wallet,
                user_description=request.description,
                risk_score=risk_score,
                risk_level=risk_level,
                detected_patterns=json.dumps(detected_patterns),
                summary=json.dumps(summary_obj),
                graph_data=json.dumps(graph_data),
                timeline=json.dumps(timeline),
                system_conclusion=system_conclusion,
                status="investigating",
                notes=json.dumps([]),
                investigator_id=request.investigator_id,
            )

            db.add(report)
            db.commit()
            db.refresh(report)

            # Add report ID to response (as string for frontend)
            response_data.report_id = str(report.id)
        except Exception as db_error:
            # Log error but don't fail the request
            print(f"[WARN] Failed to save report to SQL database: {db_error}")

        return response_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing wallet: {str(e)}")


@router.get("/reports", response_model=List[Dict])
async def get_incident_reports(
    skip: int = 0,
    limit: int = 20,
    wallet_address: Optional[str] = None,
    investigator_id: Optional[int] = None,
    risk_level: Optional[str] = None,
    status: Optional[str] = None,
    pattern_type: Optional[str] = None,  # Filter by pattern: "fraud", "normal", "money_laundering", etc.
    db: Session = Depends(get_db),
):
    """
    Get list of saved incident reports with filtering (from SQL database).
    
    pattern_type options:
    - "fraud": Fraud wallets (fraud, money_laundering, ponzi, ransomware)
    - "normal": Normal wallets
    - Specific: "fraud", "money_laundering", "ponzi", "ransomware", "normal"
    """
    try:
        query = db.query(IncidentReport)

        if investigator_id is not None:
            query = query.filter(IncidentReport.investigator_id == investigator_id)

        if wallet_address:
            # Case-insensitive match
            like_pattern = f"%{wallet_address}%"
            query = query.filter(IncidentReport.wallet_address.ilike(like_pattern))

        if risk_level and risk_level != "all":
            query = query.filter(IncidentReport.risk_level == risk_level.upper())

        if status and status != "all":
            query = query.filter(IncidentReport.status == status.lower())

        # Filter by pattern type (stored in summary JSON)
        if pattern_type and pattern_type != "all":
            pattern_type_lower = pattern_type.lower()
            
            # Special case: "fraud" means all fraud-related patterns
            if pattern_type_lower == "fraud":
                fraud_patterns = ["fraud", "money_laundering", "ponzi", "ransomware"]
                # Filter by checking summary JSON for pattern_type
                pattern_filters = []
                for pattern in fraud_patterns:
                    pattern_filters.append(
                        IncidentReport.summary.ilike(f'%"pattern_type": "{pattern.title()}"%')
                    )
                query = query.filter(or_(*pattern_filters))
            else:
                # Specific pattern type
                pattern_title = pattern_type_lower.replace("_", " ").title()
                query = query.filter(IncidentReport.summary.ilike(f'%"pattern_type": "{pattern_title}"%'))

        query = query.order_by(IncidentReport.created_at.desc())
        reports = query.offset(skip).limit(limit).all()

        return [r.to_dict() for r in reports]

    except Exception as e:
        # Log error but return empty list to prevent frontend crashes
        print(f"[ERROR] Error fetching reports from SQL: {str(e)}")
        return []


@router.get("/reports/{report_id}", response_model=Dict)
async def get_incident_report(report_id: str, db: Session = Depends(get_db)):
    """
    Get a specific incident report by ID from SQL database.
    """
    try:
        try:
            report_int_id = int(report_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid report ID")

        report = db.query(IncidentReport).filter(IncidentReport.id == report_int_id).first()

        if not report:
            raise HTTPException(status_code=404, detail="Report not found")

        return report.to_dict()

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching report: {str(e)}")


@router.patch("/reports/{report_id}/status")
async def update_report_status(report_id: str, status: str, db: Session = Depends(get_db)):
    """
    Update the status of an incident report in SQL database.
    """
    try:
        try:
            report_int_id = int(report_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid report ID")

        valid_statuses = ["investigating", "resolved", "closed", "escalated"]
        if status.lower() not in valid_statuses:
            raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}")

        report = db.query(IncidentReport).filter(IncidentReport.id == report_int_id).first()
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")

        report.status = status.lower()
        report.updated_at = datetime.utcnow()
        db.add(report)
        db.commit()
        db.refresh(report)

        return {"message": "Status updated successfully", "report_id": report_id, "status": report.status}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating status: {str(e)}")


@router.post("/reports/{report_id}/notes")
async def add_report_note(report_id: str, note: str, author: str = "Investigator", db: Session = Depends(get_db)):
    """
    Add a note to an incident report in SQL database.
    """
    try:
        try:
            report_int_id = int(report_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid report ID")

        report = db.query(IncidentReport).filter(IncidentReport.id == report_int_id).first()
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")

        try:
            notes = json.loads(report.notes or "[]")
        except Exception:
            notes = []

        note_entry = {
            "note": note,
            "author": author,
            "timestamp": datetime.utcnow().isoformat(),
        }
        notes.append(note_entry)

        report.notes = json.dumps(notes)
        report.updated_at = datetime.utcnow()
        db.add(report)
        db.commit()
        db.refresh(report)

        return {"message": "Note added successfully", "note": note_entry}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding note: {str(e)}")
