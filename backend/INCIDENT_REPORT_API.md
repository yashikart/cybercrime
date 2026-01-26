# Incident Report API

## Endpoint

`POST /api/v1/incidents/analyze`

## Request

```json
{
  "wallet_address": "WALLET_XYZ",
  "description": "They promised returns and asked many people to invest"
}
```

## Response Structure

```json
{
  "wallet": "WALLET_XYZ",
  "risk_score": 0.94,
  "risk_level": "VERY HIGH",
  "detected_patterns": [
    "Money Laundering (Layering)",
    "Rapid Consolidation",
    "Multiple Hop Transfers"
  ],
  "summary": {
    "total_in": 120000,
    "total_out": 118500,
    "tx_count": 18,
    "unique_senders": 6,
    "unique_receivers": 4,
    "pattern_type": "Money Laundering"
  },
  "graph_data": [
    {"from": "VICTIM_1234", "to": "WALLET_XYZ", "amount": 10000},
    {"from": "WALLET_XYZ", "to": "MULE_5678", "amount": 90000}
  ],
  "timeline": [
    {"time": "10:01", "amount": 10000, "timestamp": "2024-01-26T10:01:00"},
    {"time": "10:03", "amount": 15000, "timestamp": "2024-01-26T10:03:00"}
  ],
  "system_conclusion": "This wallet exhibits behavior consistent with money laundering via layering, involving rapid fund aggregation followed by multi-hop transfers through intermediate wallets to obscure the origin of funds. The risk score of 94% indicates a very high likelihood of financial crime."
}
```

## Features

1. **AI-Powered Analysis**: Analyzes user description to boost pattern detection
2. **Risk Scoring**: Calculates risk score (0.0 - 1.0) with human-readable levels
3. **Pattern Detection**: Identifies suspicious patterns automatically
4. **Graph Data**: Returns transaction flow for visualization
5. **Timeline**: Provides timeline data for burst charts
6. **System Conclusion**: AI-generated summary text

## Usage Example

```python
import requests

response = requests.post(
    "http://localhost:3000/api/v1/incidents/analyze",
    json={
        "wallet_address": "0x1234...",
        "description": "Multiple victims reported being scammed"
    }
)

data = response.json()
print(f"Risk Score: {data['risk_score']:.0%}")
print(f"Risk Level: {data['risk_level']}")
print(f"Patterns: {', '.join(data['detected_patterns'])}")
```

## Frontend Integration

The response is designed to be directly consumed by the frontend UI:

- **Risk Result**: `risk_score` and `risk_level`
- **Transaction Summary**: `summary` object
- **Money Flow Graph**: `graph_data` array
- **Timeline Burst**: `timeline` array
- **Detected Patterns**: `detected_patterns` array
- **System Conclusion**: `system_conclusion` string
