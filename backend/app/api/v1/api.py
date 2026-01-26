"""
API v1 router
"""

from fastapi import APIRouter
from app.api.v1.endpoints import wallets, transactions, evidence, risk, audit, cases, auth, incidents

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(cases.router, prefix="/cases", tags=["cases"])
api_router.include_router(wallets.router, prefix="/wallets", tags=["wallets"])
api_router.include_router(transactions.router, prefix="/transactions", tags=["transactions"])
api_router.include_router(evidence.router, prefix="/evidence", tags=["evidence"])
api_router.include_router(risk.router, prefix="/risk", tags=["risk"])
api_router.include_router(audit.router, prefix="/audit", tags=["audit"])
api_router.include_router(incidents.router, prefix="/incidents", tags=["incidents"])