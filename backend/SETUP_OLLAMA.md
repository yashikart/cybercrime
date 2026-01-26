# Setup Ollama for AI-Powered Conclusions

## What is Ollama?

Ollama is a free, local LLM (Large Language Model) that runs on your machine. No API keys, no costs, completely private.

## Installation Steps

### 1. Install Ollama

**Windows:**
1. Download from: https://ollama.com/download
2. Run the installer
3. Ollama will start automatically

**Or use winget:**
```powershell
winget install Ollama.Ollama
```

### 2. Download a Model

After installation, download a model (choose one):

```powershell
# Small, fast model (recommended for testing)
ollama pull llama3.2

# Or larger, more capable model
ollama pull llama3

# Or lightweight option
ollama pull mistral
```

### 3. Verify Installation

```powershell
ollama list
```

You should see your downloaded model(s).

### 4. Install Python Package

```powershell
cd C:\Users\Yashika\cybercrime\backend
venv\Scripts\activate
pip install ollama==0.1.7
```

### 5. Test Ollama

```powershell
ollama run llama3.2 "Hello, can you analyze this?"
```

If it responds, Ollama is working!

## How It Works

1. **User submits incident report** → Backend receives wallet + description
2. **Backend generates transaction data** → Using synthetic data generator
3. **Backend calls Ollama** → Sends transaction analysis to local LLM
4. **Ollama generates conclusion** → AI-powered, contextual analysis
5. **Response returned** → Professional conclusion in report

## Benefits

✅ **Completely Free** - No API costs  
✅ **Privacy** - Data never leaves your machine  
✅ **No Rate Limits** - Use as much as you want  
✅ **Offline** - Works without internet (after setup)  
✅ **Customizable** - Can fine-tune models  

## Troubleshooting

### Ollama not found?
- Make sure Ollama is installed and running
- Check if `ollama` command works in terminal
- Restart terminal after installation

### Model not found?
- Download a model: `ollama pull llama3.2`
- Check available models: `ollama list`

### Python can't connect to Ollama?
- Make sure Ollama service is running
- Check if Ollama is listening on default port (11434)
- Try: `ollama serve` in a separate terminal

### Fallback to Templates
If Ollama fails, the system automatically falls back to template-based conclusions (no errors).

## Models Comparison

| Model | Size | Speed | Quality | Recommended For |
|-------|------|-------|---------|----------------|
| llama3.2 | ~2GB | Fast | Good | Development, Testing |
| llama3 | ~4.7GB | Medium | Better | Production |
| mistral | ~4GB | Fast | Good | Balanced |

## Usage

Once set up, the AI conclusion generation is automatic. The endpoint will:
1. Try to use Ollama for AI-generated conclusions
2. Fall back to templates if Ollama isn't available
3. No configuration needed - it just works!

## Verify It's Working

After setup, test the endpoint:
```powershell
$body = @{
    wallet_address = "WALLET_XYZ"
    description = "They promised returns and asked many people to invest"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/v1/incidents/analyze" `
  -Method POST -Body $body -ContentType "application/json"
```

Check the `system_conclusion` field - if it's unique and contextual, AI is working!
