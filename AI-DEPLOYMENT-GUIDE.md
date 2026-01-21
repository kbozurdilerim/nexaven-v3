# 🤖 AI ECU Tuning System - External Ollama Integration

## 🚀 Production Deployment (External Ollama)

The system now uses an external Ollama server for AI functionality, eliminating the need for local AI installation.

### External Ollama Server
- **URL**: `http://72.62.178.51:32768`
- **Integration**: Direct API connection from React frontend
- **Benefits**: No local resources needed, faster deployment

### 1. Deploy ECU System

```bash
# Make scripts executable
chmod +x fix-deployment.sh setup-ollama.sh

# Deploy the system (frontend only)
./fix-deployment.sh
```

### 2. Test External Ollama Connection

```bash
# Test external Ollama connection
./setup-ollama.sh
```

## 🔧 What Was Updated

### External Ollama Integration
- ✅ Removed local Ollama Docker container
- ✅ Integrated external Ollama server (`http://72.62.178.51:32768`)
- ✅ Updated React components to use external API
- ✅ Simplified deployment (no local AI installation needed)

### LinOLS Removal
- ✅ Removed LinOLS Docker service and components
- ✅ Simplified to AI-only ECU tuning interface
- ✅ Focused on Ollama AI for all ECU operations
- ✅ Streamlined user interface

### System Optimization
- ✅ Reduced Docker services (frontend + nginx only)
- ✅ Faster deployment and startup
- ✅ Lower resource requirements
- ✅ External AI server handles all processing

## 🎯 System Architecture

```
┌─────────────────┐    ┌─────────────────────────────┐
│   React Frontend │    │   External Ollama AI        │
│   (Port 3000)   │◄──►│   (72.62.178.51:32768)     │
└─────────────────┘    └─────────────────────────────┘
         │                              
         └─────────────────┐            
                           │            
                ┌─────────────────┐     
                │   Nginx Proxy   │     
                │   (Port 80/443) │     
                └─────────────────┘     
```

## 🔗 Access Points

### Admin Panel
- **URL**: `https://nexaven.com.tr/zorlu-ecu-admin`
- **Login**: `admin@zorluecu.com` / `zorlu123`
- **AI Tab**: Click "AI ECU Tuning" tab

### Direct Access
- **Frontend**: `http://localhost:3000`
- **External Ollama**: `http://72.62.178.51:32768`

## 🤖 AI Features

### Chat Commands
```bash
# ECU Commands (in AI chat)
/ecu analyze        # Analyze ECU file
/ecu stage1         # Calculate Stage 1 parameters
/ecu stage2         # Calculate Stage 2 parameters
/ecu stage3         # Calculate Stage 3 parameters
/ecu optimize       # Suggest optimizations

# Natural Language
"ECU dosya analizi yap"
"Stage 1 yazılım parametreleri neler?"
"Turbo basıncını nasıl artırabilirim?"
```

### ECU Processing
- **File Upload**: Drag & drop .bin, .hex, .s19, .a2l files
- **AI Analysis**: Real-time parameter calculation
- **Stage Presets**: Pre-configured Stage 1/2/3 settings
- **Optimization**: AI-powered tuning suggestions

## 🛠️ Troubleshooting

### Container Issues
```bash
# Check container status
docker ps

# Check logs
docker logs nexaven-frontend
docker logs nexaven-ollama
docker logs nexaven-linols

# Restart specific service
docker compose restart ollama
```

### AI Model Issues
```bash
# List available models
docker exec nexaven-ollama ollama list

# Download specific model
docker exec nexaven-ollama ollama pull llama3.2:1b

# Test AI chat
docker exec nexaven-ollama ollama run llama3.2:1b "ECU nedir?"
```

### LinOLS Issues
```bash
# Test LinOLS API
curl http://localhost:8080/health
curl http://localhost:8080/api/status

# Check LinOLS logs
docker logs nexaven-linols
```

## 📊 Performance Optimization

### CPU-Only Deployment
- Uses lightweight AI models (1B-1.5B parameters)
- Optimized memory usage (2GB limit)
- Reduced context length (2048 tokens)
- Single model loading to save RAM

### VPS Compatibility
- No GPU requirements
- Works on standard VPS instances
- Automatic fallback to CPU mode
- Resource-aware model selection

## 🔄 Development Workflow

### Production Deployment
```bash
# Full deployment
./deploy.sh

# Quick deployment fix
./fix-deployment.sh

# AI model setup
./setup-ollama.sh
```

## 🎉 Production Ready

When the system is deployed correctly, you will have:

1. ✅ Professional ECU tuning interface
2. ✅ AI-powered chat assistance
3. ✅ Real-time parameter adjustment
4. ✅ Stage tuning presets (Stage 1/2/3)
5. ✅ ECU file upload and processing
6. ✅ Modified file export functionality
7. ✅ Admin panel integration

## 🚗 Ready for Professional ECU Tuning!

The system is now configured for professional ECU tuning with:
- AI-powered chat assistance
- Real-time parameter adjustment
- Stage tuning presets
- ECU file processing
- Professional workflow integration

Access the admin panel and start tuning! 🔧🤖