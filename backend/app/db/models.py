"""
Database models
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base


class User(Base):
    """User model"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(String, default="investigator")  # investigator, admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    cases = relationship("Case", back_populates="investigator")
    audit_logs = relationship("AuditLog", back_populates="user")


class Case(Base):
    """Investigation case model"""
    __tablename__ = "cases"
    
    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    status = Column(String, default="active")  # active, closed, pending
    investigator_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    investigator = relationship("User", back_populates="cases")
    wallets = relationship("Wallet", back_populates="case")
    transactions = relationship("Transaction", back_populates="case")
    evidence = relationship("Evidence", back_populates="case")


class Wallet(Base):
    """Wallet under investigation"""
    __tablename__ = "wallets"
    
    id = Column(Integer, primary_key=True, index=True)
    address = Column(String, unique=True, index=True, nullable=False)
    label = Column(String)
    balance = Column(String)
    risk_level = Column(String, default="low")  # low, medium, high, critical
    anchor_status = Column(String, default="pending")  # pending, anchored, verified
    last_activity = Column(DateTime)
    case_id = Column(Integer, ForeignKey("cases.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    case = relationship("Case", back_populates="wallets")
    transactions = relationship("Transaction", back_populates="wallet")


class Transaction(Base):
    """Financial transaction"""
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    hash = Column(String, unique=True, index=True, nullable=False)
    from_address = Column(String, nullable=False)
    to_address = Column(String, nullable=False)
    amount = Column(String)
    transaction_type = Column(String)  # transfer, swap, contract
    flagged = Column(Boolean, default=False)
    timestamp = Column(DateTime)
    case_id = Column(Integer, ForeignKey("cases.id"))
    wallet_id = Column(Integer, ForeignKey("wallets.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    case = relationship("Case", back_populates="transactions")
    wallet = relationship("Wallet", back_populates="transactions")


class Evidence(Base):
    """Evidence chain of custody"""
    __tablename__ = "evidence"
    
    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    hash = Column(String, nullable=False)
    anchor_status = Column(String, default="pending")  # pending, anchored, verified
    immutable = Column(Boolean, default=True)
    investigator_id = Column(Integer, ForeignKey("users.id"))
    case_id = Column(Integer, ForeignKey("cases.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    case = relationship("Case", back_populates="evidence")


class RiskScore(Base):
    """Risk assessment scores"""
    __tablename__ = "risk_scores"
    
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, nullable=False)
    score = Column(Integer, nullable=False)  # 0-100
    level = Column(String, nullable=False)  # low, medium, high, critical
    description = Column(Text)
    case_id = Column(Integer, ForeignKey("cases.id"))
    created_at = Column(DateTime, default=datetime.utcnow)


class AuditLog(Base):
    """Audit log entries"""
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    action = Column(String, nullable=False)
    entity_type = Column(String)
    entity_id = Column(String)
    status = Column(String, default="success")  # success, warning, error
    details = Column(Text)
    user_id = Column(Integer, ForeignKey("users.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="audit_logs")
