# MongoDB Setup Guide

## ✅ Implementation Complete!

Incident reports are now automatically saved to MongoDB when generated.

## 📋 What Was Added

1. **MongoDB Connection** (`app/db/mongodb.py`)
   - Async MongoDB connection using Motor
   - Connection management (connect on startup, close on shutdown)

2. **MongoDB Models** (`app/db/models_mongo.py`)
   - Pydantic models for incident reports
   - ObjectId handling

3. **Updated Endpoints** (`app/api/v1/endpoints/incidents.py`)
   - `POST /api/v1/incidents/analyze` - Now saves reports to MongoDB
   - `GET /api/v1/incidents/reports` - List all reports (with filtering)
   - `GET /api/v1/incidents/reports/{report_id}` - Get specific report
   - `PATCH /api/v1/incidents/reports/{report_id}/status` - Update report status
   - `POST /api/v1/incidents/reports/{report_id}/notes` - Add notes to report

4. **Configuration** (`app/core/config.py`)
   - Added `MONGODB_URL` and `MONGODB_DATABASE` settings

## 🚀 Setup Instructions

### 1. Install MongoDB

**Windows:**
```powershell
# Download from https://www.mongodb.com/try/download/community
# Or use Chocolatey:
choco install mongodb
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# Or use official MongoDB repository
```

### 2. Start MongoDB

**Windows:**
```powershell
# MongoDB should start automatically as a service
# Or manually:
mongod --dbpath C:\data\db
```

**macOS/Linux:**
```bash
brew services start mongodb-community  # macOS
# OR
sudo systemctl start mongod  # Linux
```

### 3. Install Python Dependencies

```powershell
cd backend
pip install -r requirements.txt
```

This will install:
- `motor==3.3.2` (Async MongoDB driver)
- `pymongo==4.6.1` (MongoDB driver)

### 4. Configure Environment

The `.env` file should have:
```env
MONGODB_URL=mongodb://localhost:27017
MONGODB_DATABASE=cybercrime_investigation
```

For MongoDB Atlas (cloud):
```env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DATABASE=cybercrime_investigation
```

### 5. Start the Backend

```powershell
cd backend
python main.py
```

You should see:
```
✅ Connected to MongoDB: cybercrime_investigation
```

## 📊 Database Structure

**Collection:** `incident_reports`

**Document Structure:**
```json
{
  "_id": "ObjectId",
  "wallet_address": "WALLET_XYZ",
  "user_description": "Suspicious activity...",
  "risk_score": 0.94,
  "risk_level": "VERY HIGH",
  "detected_patterns": ["Money Laundering", "Rapid Consolidation"],
  "summary": {
    "total_in": 120000,
    "total_out": 118500,
    "tx_count": 18,
    "unique_senders": 6,
    "unique_receivers": 4,
    "pattern_type": "Money Laundering"
  },
  "graph_data": [...],
  "timeline": [...],
  "system_conclusion": "AI-generated conclusion...",
  "status": "investigating",
  "notes": [],
  "investigator_id": null,
  "case_id": null,
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

## 🔌 API Endpoints

### List Reports
```http
GET /api/v1/incidents/reports?skip=0&limit=20&wallet_address=WALLET&risk_level=HIGH&status=investigating
```

### Get Specific Report
```http
GET /api/v1/incidents/reports/{report_id}
```

### Update Status
```http
PATCH /api/v1/incidents/reports/{report_id}/status?status=resolved
```

### Add Note
```http
POST /api/v1/incidents/reports/{report_id}/notes
Content-Type: application/json

{
  "note": "Investigator notes here",
  "author": "Investigator Name"
}
```

## ✅ Testing

1. **Generate a report:**
   ```powershell
   $body = @{
       wallet_address = "WALLET_XYZ"
       description = "Suspicious activity"
   } | ConvertTo-Json
   
   Invoke-WebRequest -Uri "http://localhost:3000/api/v1/incidents/analyze" `
     -Method POST -Body $body -ContentType "application/json"
   ```

2. **List reports:**
   ```powershell
   Invoke-WebRequest -Uri "http://localhost:3000/api/v1/incidents/reports"
   ```

3. **Get specific report:**
   ```powershell
   # Use the report_id from the analyze response
   Invoke-WebRequest -Uri "http://localhost:3000/api/v1/incidents/reports/{report_id}"
   ```

## 🐛 Troubleshooting

**MongoDB not connecting:**
- Check if MongoDB is running: `mongosh` or `mongo`
- Verify connection string in `.env`
- Check firewall settings

**Import errors:**
- Make sure `motor` and `pymongo` are installed
- Check Python version (3.11.9)

**Reports not saving:**
- Check MongoDB connection logs
- Verify database permissions
- Check backend logs for errors

## 📝 Next Steps

1. **Frontend Integration** - Update frontend to:
   - Show report history
   - Display saved reports
   - Add status management UI
   - Add notes UI

2. **Authentication** - Link reports to users:
   - Add `investigator_id` from JWT token
   - Filter reports by user

3. **Case Management** - Link reports to cases:
   - Add `case_id` when creating report
   - Group reports by case
