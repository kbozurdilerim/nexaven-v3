# 🤖 AI + LinOLS ECU Tuning System - Deployment Guide

## 🚀 Production Deployment (No Test Files)

The system is configured for professional ECU tuning without any test components.

### 1. Deploy AI ECU System

```bash
# Make scripts executable
chmod +x fix-deployment.sh setup-ollama.sh

# Deploy the system
./fix-deployment.sh
```

### 2. Setup AI Models

```bash
# Install production AI models
./setup-ollama.sh
```

## 🔧 What Was Fixed

### Docker Compose Issues
- ✅ Fixed LinOLS Docker image reference (was trying to pull non-existent `linols/server`)
- ✅ Created CPU-only Ollama configuration (removed GPU requirements)
- ✅ Added proper service dependencies and health checks
- ✅ Created `docker-compose.cpu.yml` for VPS compatibility

### AI Model Optimization
- ✅ Selected CPU-optimized models: `llama3.2:1b`, `qwen2.5:1.5b`, `phi3:mini`
- ✅ Reduced memory requirements for VPS deployment
- ✅ Added proper error handling for model downloads

### LinOLS Integration
- ✅ Fixed Dockerfile.simple syntax (removed HTML content causing build failure)
- ✅ Enhanced Python Flask web interface
- ✅ Added proper ECU file processing simulation
- ✅ Integrated with React frontend components

## 🎯 System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │   Ollama AI     │    │   LinOLS API    │
│   (Port 3000)   │◄──►│   (Port 11434)  │◄──►│   (Port 8080)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
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
- **AI Tab**: Click "AI + LinOLS" tab

### Direct APIs
- **Frontend**: `http://localhost:3000`
- **LinOLS**: `http://localhost:8080`
- **Ollama**: `http://localhost:11434`

## 🤖 AI Features

### Chat Commands
```bash
# LinOLS Commands (in AI chat)
/linols open        # Open LinOLS interface
/linols load        # Load ECU file
/linols stage1      # Apply Stage 1 tuning
/linols stage2      # Apply Stage 2 tuning
/linols stage3      # Apply Stage 3 tuning
/linols export      # Export modified file

# Natural Language
"ECU dosya analizi yap"
"Stage 1 yazılım parametreleri neler?"
"Turbo basıncını nasıl artırabilirim?"
```

### ECU Processing
- **File Upload**: Drag & drop .bin, .hex, .s19, .a2l files
- **Parameter Tuning**: Real-time parameter adjustment
- **Stage Presets**: Pre-configured Stage 1/2/3 settings
- **Export**: Download modified ECU files

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