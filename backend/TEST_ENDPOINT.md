# Test Incident Report Endpoint

## Server is Running! ✅

Your server is running on `http://localhost:3000`

## Access API Documentation

**Swagger UI:** http://localhost:3000/api/docs  
**ReDoc:** http://localhost:3000/api/redoc

## Test the Incident Endpoint

### Using cURL:
```bash
curl -X POST "http://localhost:3000/api/v1/incidents/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "wallet_address": "WALLET_XYZ",
    "description": "They promised returns and asked many people to invest"
  }'
```

### Using PowerShell:
```powershell
$body = @{
    wallet_address = "WALLET_XYZ"
    description = "They promised returns and asked many people to invest"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/v1/incidents/analyze" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

### Using Python:
```python
import requests

response = requests.post(
    "http://localhost:3000/api/v1/incidents/analyze",
    json={
        "wallet_address": "WALLET_XYZ",
        "description": "They promised returns and asked many people to invest"
    }
)

print(response.json())
```

### Using Browser/Postman:
- **URL:** `POST http://localhost:3000/api/v1/incidents/analyze`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "wallet_address": "WALLET_XYZ",
  "description": "They promised returns and asked many people to invest"
}
```

## Expected Response

```json
{
  "wallet": "WALLET_XYZ",
  "risk_score": 0.94,
  "risk_level": "VERY HIGH",
  "detected_patterns": [
    "Rapid Consolidation",
    "Money Laundering (Layering)",
    "Multiple Hop Transfers"
  ],
  "summary": {
    "total_in": 120000,
    "total_out": 118500,
    "tx_count": 18,
    "unique_senders": 6,
    "unique_receivers": 4,
    "pattern_type": "Ponzi"
  },
  "graph_data": [
    {"from": "INVESTOR_1234", "to": "WALLET_XYZ", "amount": 5000}
  ],
  "timeline": [
    {"time": "10:01", "amount": 10000, "timestamp": "..."}
  ],
  "system_conclusion": "..."
}
```

## Verify Endpoint is Registered

Check the API docs at http://localhost:3000/api/docs - you should see:
- **POST** `/api/v1/incidents/analyze` under the "incidents" tag
