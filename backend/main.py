"""
Cybercrime Investigation Dashboard - FastAPI Backend
Main application entry point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from app.core.config import settings
from app.api.v1.api import api_router
from app.db.database import engine, Base, SessionLocal
from app.db.models import User
from app.core.security import get_password_hash


def init_superadmin():
    """Initialize superadmin account on startup"""
    db = SessionLocal()
    try:
        superadmin_email = "blackholeinfiverse48@gmail.com".lower().strip()
        superadmin_password = "admin"
        
        # Check if superadmin already exists
        existing_superadmin = db.query(User).filter(User.email == superadmin_email).first()
        
        if not existing_superadmin:
            # Create superadmin account
            try:
                hashed_password = get_password_hash(superadmin_password)
                superadmin = User(
                    email=superadmin_email,
                    full_name="Super Admin",
                    hashed_password=hashed_password,
                    role="superadmin",
                    is_active=True
                )
                db.add(superadmin)
                db.commit()
                print(f"[SUPERADMIN] ✓ Created superadmin account: {superadmin_email}")
            except Exception as hash_error:
                print(f"[ERROR] Failed to hash password: {hash_error}")
                raise
        else:
            # Ensure superadmin is active and has correct password
            updated = False
            if not existing_superadmin.is_active:
                existing_superadmin.is_active = True
                updated = True
            
            # Always update password to ensure it's correct
            try:
                correct_hash = get_password_hash(superadmin_password)
                existing_superadmin.hashed_password = correct_hash
                updated = True
                if updated:
                    db.commit()
                    print(f"[SUPERADMIN] ✓ Reset superadmin password: {superadmin_email}")
                else:
                    print(f"[SUPERADMIN] ✓ Superadmin account verified: {superadmin_email}")
            except Exception as hash_error:
                print(f"[ERROR] Failed to hash password: {hash_error}")
                # Don't raise, just log - account exists, might work with old hash
    except Exception as e:
        import traceback
        print(f"[ERROR] Failed to initialize superadmin: {e}")
        traceback.print_exc()
    finally:
        db.close()


def migrate_database():
    """Add new columns to existing database if they don't exist"""
    from sqlalchemy import inspect, text
    
    try:
        inspector = inspect(engine)
        
        # Check if users table exists
        if "users" in inspector.get_table_names():
            # Get existing columns
            existing_columns = [col["name"] for col in inspector.get_columns("users")]
            
            # Add new location columns if they don't exist
            with engine.connect() as conn:
                columns_to_add = [
                    ("location_city", "VARCHAR"),
                    ("location_country", "VARCHAR"),
                    ("location_latitude", "FLOAT"),
                    ("location_longitude", "FLOAT"),
                    ("location_ip", "VARCHAR"),
                    ("last_login_at", "DATETIME"),
                    ("last_activity_at", "DATETIME"),
                    ("password_changed_at", "DATETIME"),
                    ("last_notification_read_at", "DATETIME"),
                    ("two_factor_enabled", "BOOLEAN"),
                    ("availability_status", "VARCHAR"),
                    ("status_updated_at", "DATETIME"),
                ]
                
                for col_name, col_type in columns_to_add:
                    if col_name not in existing_columns:
                        try:
                            # Use appropriate SQL syntax based on database type
                            if "sqlite" in str(engine.url):
                                # SQLite uses INTEGER for boolean (0/1)
                                if col_type == "BOOLEAN":
                                    conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} INTEGER DEFAULT 0"))
                                else:
                                    conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}"))
                            else:
                                # PostgreSQL
                                conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}"))
                            conn.commit()
                            print(f"[MIGRATION] ✓ Added {col_name} column to users table")
                        except Exception as e:
                            print(f"[MIGRATION] Warning: Could not add {col_name} column: {e}")
                            conn.rollback()
        
        # Check if audit_logs table exists and add ip_address column
        if "audit_logs" in inspector.get_table_names():
            existing_audit_columns = [col["name"] for col in inspector.get_columns("audit_logs")]
            
            with engine.connect() as conn:
                if "ip_address" not in existing_audit_columns:
                    try:
                        if "sqlite" in str(engine.url):
                            conn.execute(text("ALTER TABLE audit_logs ADD COLUMN ip_address VARCHAR"))
                        else:
                            conn.execute(text("ALTER TABLE audit_logs ADD COLUMN ip_address VARCHAR"))
                        conn.commit()
                        print(f"[MIGRATION] ✓ Added ip_address column to audit_logs table")
                    except Exception as e:
                        print(f"[MIGRATION] Warning: Could not add ip_address column to audit_logs: {e}")
                        conn.rollback()
        
        # Check if complaints table exists and add location columns
        if "complaints" in inspector.get_table_names():
            existing_complaint_columns = [col["name"] for col in inspector.get_columns("complaints")]
            
            with engine.connect() as conn:
                complaint_columns_to_add = [
                    ("investigator_id", "INTEGER"),
                    ("investigator_location_city", "VARCHAR"),
                    ("investigator_location_country", "VARCHAR"),
                    ("investigator_location_latitude", "FLOAT"),
                    ("investigator_location_longitude", "FLOAT"),
                    ("investigator_location_ip", "VARCHAR"),
                ]
                
                for col_name, col_type in complaint_columns_to_add:
                    if col_name not in existing_complaint_columns:
                        try:
                            if "sqlite" in str(engine.url):
                                conn.execute(text(f"ALTER TABLE complaints ADD COLUMN {col_name} {col_type}"))
                            else:
                                # PostgreSQL
                                conn.execute(text(f"ALTER TABLE complaints ADD COLUMN {col_name} {col_type}"))
                            conn.commit()
                            print(f"[MIGRATION] ✓ Added {col_name} column to complaints table")
                        except Exception as e:
                            print(f"[MIGRATION] Warning: Could not add {col_name} column to complaints: {e}")
                            conn.rollback()
        
        # Check if evidence table exists and add file storage columns
        if "evidence" in inspector.get_table_names():
            existing_evidence_columns = [col["name"] for col in inspector.get_columns("evidence")]
            
            with engine.connect() as conn:
                evidence_columns_to_add = [
                    ("file_path", "VARCHAR"),
                    ("file_size", "INTEGER"),
                    ("file_type", "VARCHAR"),
                ]
                
                for col_name, col_type in evidence_columns_to_add:
                    if col_name not in existing_evidence_columns:
                        try:
                            if "sqlite" in str(engine.url):
                                conn.execute(text(f"ALTER TABLE evidence ADD COLUMN {col_name} {col_type}"))
                            else:
                                # PostgreSQL
                                conn.execute(text(f"ALTER TABLE evidence ADD COLUMN {col_name} {col_type}"))
                            conn.commit()
                            print(f"[MIGRATION] ✓ Added {col_name} column to evidence table")
                        except Exception as e:
                            print(f"[MIGRATION] Warning: Could not add {col_name} column to evidence: {e}")
                            conn.rollback()
        
        # Check if incident_reports table exists and add investigator_id column
        if "incident_reports" in inspector.get_table_names():
            existing_incident_columns = [col["name"] for col in inspector.get_columns("incident_reports")]
            
            with engine.connect() as conn:
                if "investigator_id" not in existing_incident_columns:
                    try:
                        if "sqlite" in str(engine.url):
                            conn.execute(text("ALTER TABLE incident_reports ADD COLUMN investigator_id INTEGER"))
                        else:
                            conn.execute(text("ALTER TABLE incident_reports ADD COLUMN investigator_id INTEGER"))
                        conn.commit()
                        print(f"[MIGRATION] ✓ Added investigator_id column to incident_reports table")
                    except Exception as e:
                        print(f"[MIGRATION] Warning: Could not add investigator_id column to incident_reports: {e}")
                        conn.rollback()
        
        # Create messages table if it doesn't exist
        if "messages" not in inspector.get_table_names():
            try:
                from app.db.models import Message
                Message.__table__.create(bind=engine, checkfirst=True)
                print("[MIGRATION] ✓ Created messages table")
            except Exception as e:
                print(f"[MIGRATION] Warning: Could not create messages table: {e}")
        
        # Create fraud_transactions table if it doesn't exist
        if "fraud_transactions" not in inspector.get_table_names():
            try:
                from app.db.models import FraudTransaction
                FraudTransaction.__table__.create(bind=engine, checkfirst=True)
                print("[MIGRATION] ✓ Created fraud_transactions table")
            except Exception as e:
                print(f"[MIGRATION] Warning: Could not create fraud_transactions table: {e}")
        
        # Create investigator_access_requests table if it doesn't exist
        if "investigator_access_requests" not in inspector.get_table_names():
            try:
                from app.db.models import InvestigatorAccessRequest
                InvestigatorAccessRequest.__table__.create(bind=engine, checkfirst=True)
                print("[MIGRATION] ✓ Created investigator_access_requests table")
            except Exception as e:
                print(f"[MIGRATION] Warning: Could not create investigator_access_requests table: {e}")
        
        # Check if wallets table exists and add freeze status columns
        if "wallets" in inspector.get_table_names():
            existing_wallet_columns = [col["name"] for col in inspector.get_columns("wallets")]
            
            with engine.connect() as conn:
                wallet_columns_to_add = [
                    ("is_frozen", "BOOLEAN"),
                    ("frozen_by", "VARCHAR"),
                    ("freeze_reason", "TEXT"),
                    ("frozen_at", "DATETIME"),
                    ("unfrozen_by", "VARCHAR"),
                    ("unfreeze_reason", "TEXT"),
                    ("unfrozen_at", "DATETIME"),
                ]
                
                for col_name, col_type in wallet_columns_to_add:
                    if col_name not in existing_wallet_columns:
                        try:
                            if "sqlite" in str(engine.url):
                                if col_type == "BOOLEAN":
                                    conn.execute(text(f"ALTER TABLE wallets ADD COLUMN {col_name} INTEGER DEFAULT 0"))
                                elif col_type == "DATETIME":
                                    conn.execute(text(f"ALTER TABLE wallets ADD COLUMN {col_name} TIMESTAMP"))
                                else:
                                    conn.execute(text(f"ALTER TABLE wallets ADD COLUMN {col_name} {col_type}"))
                            else:
                                # PostgreSQL
                                conn.execute(text(f"ALTER TABLE wallets ADD COLUMN {col_name} {col_type}"))
                            conn.commit()
                            print(f"[MIGRATION] ✓ Added {col_name} column to wallets table")
                        except Exception as e:
                            print(f"[MIGRATION] Warning: Could not add {col_name} column to wallets: {e}")
                            conn.rollback()
    except Exception as e:
        print(f"[MIGRATION] Error during migration: {e}")
        # Don't fail startup if migration fails - tables will be created on next startup


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan events for startup and shutdown"""
    # Create database tables
    Base.metadata.create_all(bind=engine)
    
    # Migrate database (add new columns if needed)
    migrate_database()
    
    # Initialize superadmin account
    init_superadmin()
    
    yield


app = FastAPI(
    title="Cybercrime Investigation API",
    description="Backend API for cybercrime investigation dashboard",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Cybercrime Investigation API",
        "version": "1.0.0",
        "docs": "/api/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "cybercrime-investigation-api"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
