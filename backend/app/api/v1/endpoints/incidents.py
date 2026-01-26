"""
Incident Report API endpoints
Analyzes wallet addresses and generates fraud risk reports
"""

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from datetime import datetime
import sys
import os
from bson import ObjectId

# Add synthetic_data_generator to path
backend_path = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
sys.path.insert(0, backend_path)

from app.db.database import get_db
from app.db.mongodb import get_database
from app.db.models_mongo import IncidentReportMongo
from app.api.v1.schemas import IncidentReportRequest, IncidentReportResponse
from app.core.ai_service import generate_ai_conclusion, check_ai_available
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
    Analyze a wallet address and generate comprehensive fraud risk report
    Saves the report to MongoDB for persistence
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
        
        # Generate system conclusion using AI (OpenRouter) or fallback to template
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
                fallback_to_template=True
            )
        except Exception as e:
            # Fallback to template if AI fails
            system_conclusion = generate_system_conclusion(
                risk_score, risk_level, pattern_type, detected_patterns
            )
        
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
                "pattern_type": pattern_type.replace("_", " ").title()
            },
            graph_data=graph_data,
            timeline=timeline,
            system_conclusion=system_conclusion
        )
        
        # Save to MongoDB
        try:
            mongo_db = get_database()
            if mongo_db:
                report_doc = {
                    "wallet_address": wallet,
                    "user_description": request.description,
                    "risk_score": risk_score,
                    "risk_level": risk_level,
                    "detected_patterns": detected_patterns,
                    "summary": {
                        "total_in": total_in,
                        "total_out": total_out,
                        "tx_count": len(txns),
                        "unique_senders": unique_senders,
                        "unique_receivers": unique_receivers,
                        "pattern_type": pattern_type.replace("_", " ").title()
                    },
                    "graph_data": graph_data,
                    "timeline": timeline,
                    "system_conclusion": system_conclusion,
                    "status": "investigating",
                    "notes": [],
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
                
                result = await mongo_db["incident_reports"].insert_one(report_doc)
                # Add report ID to response
                response_data.report_id = str(result.inserted_id)
                return response_data
        except Exception as mongo_error:
            # Log error but don't fail the request
            print(f"Warning: Failed to save report to MongoDB: {mongo_error}")
        
        return response_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing wallet: {str(e)}")


@router.get("/reports", response_model=List[Dict])
async def get_incident_reports(
    skip: int = 0,
    limit: int = 20,
    wallet_address: Optional[str] = None,
    risk_level: Optional[str] = None,
    status: Optional[str] = None
):
    """
    Get list of saved incident reports with filtering
    """
    try:
        mongo_db = get_database()
        if not mongo_db:
            raise HTTPException(status_code=503, detail="MongoDB not available")
        
        # Build query
        query = {}
        if wallet_address:
            query["wallet_address"] = {"$regex": wallet_address, "$options": "i"}
        if risk_level:
            query["risk_level"] = risk_level.upper()
        if status:
            query["status"] = status.lower()
        
        # Fetch reports
        cursor = mongo_db["incident_reports"].find(query).sort("created_at", -1).skip(skip).limit(limit)
        reports = await cursor.to_list(length=limit)
        
        # Convert ObjectId to string
        for report in reports:
            report["_id"] = str(report["_id"])
            if "created_at" in report and isinstance(report["created_at"], datetime):
                report["created_at"] = report["created_at"].isoformat()
            if "updated_at" in report and isinstance(report["updated_at"], datetime):
                report["updated_at"] = report["updated_at"].isoformat()
        
        return reports
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching reports: {str(e)}")


@router.get("/reports/{report_id}", response_model=Dict)
async def get_incident_report(report_id: str):
    """
    Get a specific incident report by ID
    """
    try:
        mongo_db = get_database()
        if not mongo_db:
            raise HTTPException(status_code=503, detail="MongoDB not available")
        
        if not ObjectId.is_valid(report_id):
            raise HTTPException(status_code=400, detail="Invalid report ID")
        
        report = await mongo_db["incident_reports"].find_one({"_id": ObjectId(report_id)})
        
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        
        # Convert ObjectId to string
        report["_id"] = str(report["_id"])
        if "created_at" in report and isinstance(report["created_at"], datetime):
            report["created_at"] = report["created_at"].isoformat()
        if "updated_at" in report and isinstance(report["updated_at"], datetime):
            report["updated_at"] = report["updated_at"].isoformat()
        
        return report
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching report: {str(e)}")


@router.patch("/reports/{report_id}/status")
async def update_report_status(report_id: str, status: str):
    """
    Update the status of an incident report
    """
    try:
        mongo_db = get_database()
        if not mongo_db:
            raise HTTPException(status_code=503, detail="MongoDB not available")
        
        if not ObjectId.is_valid(report_id):
            raise HTTPException(status_code=400, detail="Invalid report ID")
        
        valid_statuses = ["investigating", "resolved", "closed", "escalated"]
        if status.lower() not in valid_statuses:
            raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}")
        
        result = await mongo_db["incident_reports"].update_one(
            {"_id": ObjectId(report_id)},
            {"$set": {"status": status.lower(), "updated_at": datetime.utcnow()}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Report not found")
        
        return {"message": "Status updated successfully", "report_id": report_id, "status": status.lower()}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating status: {str(e)}")


@router.post("/reports/{report_id}/notes")
async def add_report_note(report_id: str, note: str, author: str = "Investigator"):
    """
    Add a note to an incident report
    """
    try:
        mongo_db = get_database()
        if not mongo_db:
            raise HTTPException(status_code=503, detail="MongoDB not available")
        
        if not ObjectId.is_valid(report_id):
            raise HTTPException(status_code=400, detail="Invalid report ID")
        
        note_entry = {
            "note": note,
            "author": author,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        result = await mongo_db["incident_reports"].update_one(
            {"_id": ObjectId(report_id)},
            {
                "$push": {"notes": note_entry},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Report not found")
        
        return {"message": "Note added successfully", "note": note_entry}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding note: {str(e)}")
