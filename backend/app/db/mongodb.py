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
    """Create database connection"""
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    database_name = os.getenv("MONGODB_DATABASE", "cybercrime_investigation")
    
    mongodb.client = AsyncIOMotorClient(mongodb_url)
    mongodb.database = mongodb.client[database_name]
    
    # Test connection
    try:
        await mongodb.client.admin.command('ping')
        print(f"✅ Connected to MongoDB: {database_name}")
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")

async def close_mongo_connection():
    """Close database connection"""
    if mongodb.client:
        mongodb.client.close()
        print("✅ MongoDB connection closed")

def get_database():
    """Get database instance"""
    return mongodb.database
