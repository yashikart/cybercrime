# Synthetic Data Generator

Generates realistic transaction data for testing and development of the cybercrime investigation dashboard.

## Features

- **Normal Activity**: Generates realistic daily transaction patterns
- **8 Suspicious Patterns**: Multiple fraud detection scenarios
  - Classic Fraud (multiple victims, fast consolidation)
  - Money Laundering (layering technique)
  - Ponzi Scheme (early investors paid with new money)
  - Ransomware Payments (multiple victims, round amounts)
  - Circular Transactions (obfuscation pattern)
  - Mixing Service (tumbler pattern)
  - Pump & Dump (coordinated manipulation)
- **Risk Scoring**: Automatic risk score calculation
- **Configurable**: Adjustable parameters for days, amounts, and patterns

## Usage

### Basic Usage

```python
from synthetic_data_generator import generate_wallet_transactions

wallet = "WALLET_XYZ"

# Generate normal activity
normal_txns = generate_wallet_transactions(wallet, mode="normal")

# Generate different suspicious patterns
fraud_txns = generate_wallet_transactions(wallet, mode="fraud")
ml_txns = generate_wallet_transactions(wallet, mode="money_laundering")
ponzi_txns = generate_wallet_transactions(wallet, mode="ponzi")
ransomware_txns = generate_wallet_transactions(wallet, mode="ransomware")
circular_txns = generate_wallet_transactions(wallet, mode="circular")
mixing_txns = generate_wallet_transactions(wallet, mode="mixing")
pump_dump_txns = generate_wallet_transactions(wallet, mode="pump_dump")
```

### Advanced Usage

```python
from synthetic_data_generator import (
    generate_normal_activity,
    generate_fraud_activity,
    random_wallet
)

# Generate 10 days of normal activity
txns = generate_normal_activity("WALLET_123", days=10)

# Generate fraud pattern
fraud_txns = generate_fraud_activity("WALLET_456")

# Generate random wallet
wallet = random_wallet("USER")
```

### Risk Scoring

```python
from synthetic_data_generator import generate_wallet_transactions
from synthetic_data_generator.suspicious_patterns import calculate_risk_score

txns = generate_wallet_transactions("WALLET_123", mode="fraud")
risk = calculate_risk_score(txns)
print(f"Risk Score: {risk:.2%}")  # e.g., "Risk Score: 85.00%"
```

### Run as Script

```bash
cd backend/synthetic_data_generator
python example.py  # Shows all patterns
python generator.py  # Basic example
```

## Transaction Patterns

### Normal Activity
- 1-3 transactions per day
- Amounts: $200-$4,000
- Mix of incoming and outgoing transactions
- Spread over multiple days

### Suspicious Patterns

#### 1. Classic Fraud
- Multiple rapid incoming transactions from "VICTIM" wallets
- Large amounts: $5,000-$20,000
- Fast consolidation to "MULE" wallet
- All transactions within minutes

#### 2. Money Laundering (Layering)
- Large initial deposit
- Split into multiple smaller transactions
- Multiple hops through intermediate wallets
- Final destination to "clean" wallet

#### 3. Ponzi Scheme
- Multiple investors over time
- Early investors receive "returns" (paid by new investors)
- Scheme collapse with funds moved to exit wallet
- Increasing investment amounts (greed pattern)

#### 4. Ransomware Payments
- Multiple victims paying to same wallet
- Round number amounts ($500, $1K, $2K, $5K, $10K)
- Periodic consolidation
- All payments within days/weeks

#### 5. Circular Transactions
- Money moves in circular pattern
- Multiple wallets in ring structure
- Small fees deducted each hop
- Creates fake transaction history

#### 6. Mixing Service (Tumbler)
- Large deposit to mixer
- Split into multiple smaller transactions
- Sent through intermediate wallets
- Final destination to "clean" wallets

#### 7. Pump & Dump
- Accumulation phase (buying over time)
- Pump phase (coordinated rapid buying)
- Dump phase (rapid selling)
- Price manipulation pattern

## Integration with Backend

You can use this generator to populate the database:

```python
from synthetic_data_generator import generate_wallet_transactions
from app.db.database import SessionLocal
from app.db.models import Transaction

# Generate data
txns = generate_wallet_transactions("WALLET_123", mode="fraud")

# Insert into database
db = SessionLocal()
for txn in txns:
    db_txn = Transaction(
        from_address=txn["from"],
        to_address=txn["to"],
        amount=txn["amount"],
        timestamp=txn["timestamp"]
    )
    db.add(db_txn)
db.commit()
```
