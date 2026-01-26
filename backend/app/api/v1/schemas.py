"""
Pydantic schemas for request/response validation
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: Optional[str] = "investigator"


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# Token Schema
class Token(BaseModel):
    access_token: str
    token_type: str


# Case Schemas
class CaseBase(BaseModel):
    case_id: str
    title: str
    description: Optional[str] = None
    status: Optional[str] = "active"


class CaseCreate(CaseBase):
    investigator_id: Optional[int] = None


class CaseResponse(CaseBase):
    id: int
    investigator_id: Optional[int]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Wallet Schemas
class WalletBase(BaseModel):
    address: str
    label: Optional[str] = None
    balance: Optional[str] = None
    risk_level: Optional[str] = "low"
    anchor_status: Optional[str] = "pending"


class WalletCreate(WalletBase):
    case_id: Optional[int] = None


class WalletResponse(WalletBase):
    id: int
    case_id: Optional[int]
    last_activity: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True


# Transaction Schemas
class TransactionBase(BaseModel):
    hash: str
    from_address: str
    to_address: str
    amount: Optional[str] = None
    transaction_type: Optional[str] = None
    flagged: Optional[bool] = False


class TransactionCreate(TransactionBase):
    case_id: Optional[int] = None
    wallet_id: Optional[int] = None
    timestamp: Optional[datetime] = None


class TransactionResponse(TransactionBase):
    id: int
    case_id: Optional[int]
    wallet_id: Optional[int]
    timestamp: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True


# Evidence Schemas
class EvidenceBase(BaseModel):
    evidence_id: str
    title: str
    description: Optional[str] = None
    hash: str
    anchor_status: Optional[str] = "pending"
    immutable: Optional[bool] = True


class EvidenceCreate(EvidenceBase):
    investigator_id: Optional[int] = None
    case_id: Optional[int] = None


class EvidenceResponse(EvidenceBase):
    id: int
    investigator_id: Optional[int]
    case_id: Optional[int]
    created_at: datetime
    
    class Config:
        from_attributes = True


# Risk Score Schemas
class RiskScoreBase(BaseModel):
    category: str
    score: int
    level: str
    description: Optional[str] = None


class RiskScoreCreate(RiskScoreBase):
    case_id: Optional[int] = None


class RiskScoreResponse(RiskScoreBase):
    id: int
    case_id: Optional[int]
    created_at: datetime
    
    class Config:
        from_attributes = True


# Audit Log Schemas
class AuditLogResponse(BaseModel):
    id: int
    action: str
    entity_type: Optional[str]
    entity_id: Optional[str]
    status: str
    details: Optional[str]
    user_id: Optional[int]
    timestamp: datetime
    
    class Config:
        from_attributes = True


# Incident Report Schemas
class IncidentReportRequest(BaseModel):
    wallet_address: str
    description: str


class TransactionSummary(BaseModel):
    total_in: int
    total_out: int
    tx_count: int
    unique_senders: int
    unique_receivers: int
    pattern_type: str


class GraphEdge(BaseModel):
    from_address: str = Field(alias="from")
    to_address: str = Field(alias="to")
    amount: int
    
    class Config:
        populate_by_name = True


class TimelineEntry(BaseModel):
    time: str
    amount: int
    timestamp: str


class IncidentReportResponse(BaseModel):
    wallet: str
    risk_score: float
    risk_level: str
    detected_patterns: list[str]
    summary: TransactionSummary
    graph_data: list[GraphEdge]
    timeline: list[TimelineEntry]
    system_conclusion: str
    report_id: Optional[str] = None  # MongoDB document ID