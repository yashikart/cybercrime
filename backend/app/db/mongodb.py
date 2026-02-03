"""
MongoDB connection and database setup
"""

from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
import os
from app.core.config import settings

class MongoDB:
    """MongoDB connection manager"""
    
    client: Optional[AsyncIOMotorClient] = None
    database = None

mongodb = MongoDB()

async def connect_to_mongo():
    """Create database connection.

    Uses settings from app.core.config.Settings:
      - MONGODB_URL
      - MONGODB_DATABASE
    """
    try:
        # NOTE: field names must match those defined in Settings
        mongodb_url = settings.MONGODB_URL
        database_name = settings.MONGODB_DATABASE

        client = AsyncIOMotorClient(mongodb_url)
        db = client[database_name]

        # Test connection before storing globally
        await client.admin.command("ping")

        mongodb.client = client
        mongodb.database = db
        print(f"[OK] Connected to MongoDB: {database_name}")
    except Exception as e:
        # Don't crash the API if Mongo isn't available
        mongodb.client = None
        mongodb.database = None
        print(f"[WARN] MongoDB connection failed: {e}")
        print("[WARN] Server will continue but MongoDB features will be unavailable")

async def close_mongo_connection():
    """Close database connection"""
    if mongodb.client:
        mongodb.client.close()
        print("[OK] MongoDB connection closed")

def get_database():
    """Get database instance"""
    return mongodb.database
