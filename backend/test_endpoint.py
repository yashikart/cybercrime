"""Test the analyze_wallet_incident endpoint directly"""
import sys
import asyncio
import traceback
from sqlalchemy.orm import Session

try:
    from app.db.database import SessionLocal
    from app.api.v1.endpoints.incidents import analyze_wallet_incident
    from app.api.v1.schemas import IncidentReportRequest
    
    async def test_endpoint():
        db = SessionLocal()
        try:
            request = IncidentReportRequest(
                wallet_address="TEST123",
                description="test wallet"
            )
            
            print("Calling analyze_wallet_incident...")
            result = await analyze_wallet_incident(request, db)
            print(f"[SUCCESS] Result: {result.wallet}")
            
        except Exception as e:
            print(f"[ERROR] {type(e).__name__}: {e}")
            if hasattr(e, 'detail'):
                print(f"[DETAIL] {e.detail}")
            traceback.print_exc()
        finally:
            db.close()
    
    asyncio.run(test_endpoint())
    
except Exception as e:
    print(f"[ERROR] Import/Setup Error: {e}")
    traceback.print_exc()
