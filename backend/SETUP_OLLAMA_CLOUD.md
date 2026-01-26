# Setup Ollama Cloud with API Key

## Your API Key is Configured! ✅

Your Ollama Cloud API key has been added to the configuration.

## Quick Setup

### 1. Create .env File

Create `backend/.env` file with your API key:

```env
OLLAMA_API_KEY=f5f3594b15be4fb6b67a0c3cf9c06aa2.G91TtODeM6Vwj-ou6Ue-EL8S
OLLAMA_BASE_URL=https://api.ollama.com
OLLAMA_MODEL=llama3.2
```

Or copy from `.env.example`:
```powershell
cd C:\Users\Yashika\cybercrime\backend
Copy-Item .env.example .env
# Edit .env and add your API key if not already there
```

### 2. Install Python Package

```powershell
cd C:\Users\Yashika\cybercrime\backend
venv\Scripts\activate
pip install ollama==0.1.7
```

### 3. Test the Endpoint

```powershell
$body = @{
    wallet_address = "WALLET_XYZ"
    description = "They promised returns and asked many people to invest"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/v1/incidents/analyze" `
  -Method POST -Body $body -ContentType "application/json"
```

## How It Works

1. **Ollama Cloud** - Uses your API key to access hosted Ollama models
2. **No Local Installation** - No need to install Ollama locally
3. **Automatic** - The system automatically uses your API key from `.env`
4. **Fallback** - If API fails, falls back to template-based conclusions

## Benefits of Ollama Cloud

✅ **No Local Setup** - Works immediately  
✅ **Always Available** - No need to keep Ollama running  
✅ **Fast** - Cloud infrastructure  
✅ **Free Tier Available** - Check Ollama Cloud pricing  

## Configuration Options

In `.env` file:

```env
# Ollama Cloud (with API key)
OLLAMA_API_KEY=your-api-key-here
OLLAMA_BASE_URL=https://api.ollama.com
OLLAMA_MODEL=llama3.2

# Or use local Ollama (no API key)
# OLLAMA_BASE_URL=http://localhost:11434
# OLLAMA_MODEL=llama3.2
```

## Available Models

- `llama3.2` - Fast, good quality (recommended)
- `llama3` - Better quality, slightly slower
- `llama2` - Older but stable
- `mistral` - Alternative option

## Verify It's Working

After setup, test the endpoint. The `system_conclusion` field should contain:
- Unique, contextual analysis
- References to specific transaction data
- Professional language
- Different conclusions for different inputs

If you see template-based conclusions, check:
1. API key is in `.env` file
2. Server was restarted after adding API key
3. Check server logs for Ollama errors
