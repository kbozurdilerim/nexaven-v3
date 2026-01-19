# 🚀 Nexaven.com.tr + AI ECU Tuning - Complete Deployment Guide

## 🤖 AI + LinOLS ECU Tuning System

### Quick Deploy with AI Support

```bash
# SSH to your VPS
ssh root@your-server

# Navigate to project
cd nexaven-v3

# Setup Ollama AI models
chmod +x setup-ollama.sh
./setup-ollama.sh

# Deploy complete system
chmod +x deploy.sh
./deploy.sh
```

## 🌐 Access URLs

### Main System
- **Website**: https://nexaven.com.tr
- **Health Check**: https://nexaven.com.tr/health

### Admin Panels
- **Nexaven Core Admin**: https://nexaven.com.tr/admin
- **Zorlu ECU Admin**: https://nexaven.com.tr/zorlu-ecu-admin

### AI & LinOLS Services
- **Ollama API**: http://localhost:11434 (internal)
- **LinOLS Interface**: http://localhost:8080 (internal)
- **AI Chat**: Admin Panel → AI + LinOLS tab

## 👤 Admin Login Credentials

### Nexaven Core Admin
```
Email: admin@nexaven.com
Password: admin123
```

### Zorlu ECU Admin (AI + LinOLS)
```
Email: admin@zorluecu.com
Password: zorlu123
```

## 🤖 AI ECU Tuning Features

### ✅ Ollama AI Integration
- **Multiple AI Models**: llama3.2, codellama, mistral, neural-chat
- **ECU-Specific Prompts**: Optimized for automotive tuning
- **Real-time Chat**: Direct communication with AI
- **LinOLS Commands**: AI can control LinOLS interface

### ✅ LinOLS Web Interface
- **ECU File Upload**: Drag & drop .bin, .hex, .s19 files
- **Parameter Editing**: Visual tuning parameter adjustment
- **Stage Presets**: Automatic Stage 1/2/3 configurations
- **Real-time Preview**: See changes before applying
- **Export Modified Files**: Download tuned ECU files

### ✅ Professional ECU Workflow
1. **Upload ECU File** → LinOLS analyzes file structure
2. **AI Consultation** → Ask AI for tuning recommendations
3. **Parameter Adjustment** → Use LinOLS interface or AI commands
4. **Stage Application** → Apply predefined or custom stages
5. **Export & Flash** → Download modified file for flashing

## 🔧 AI Commands

### LinOLS Control Commands
```
/linols open          # Open LinOLS interface
/linols load [file]   # Load ECU file
/linols stage1        # Apply Stage 1 tuning
/linols stage2        # Apply Stage 2 tuning
/linols export        # Export modified file
```

### AI Chat Examples
```
"Bu BMW 320d ECU dosyasını Stage 1 için nasıl ayarlamalıyım?"
"Turbo basıncını 0.3 bar artırmak güvenli mi?"
"DPF silme işlemi için hangi parametreleri değiştirmeliyim?"
"Bu hata kodları ne anlama geliyor: P0401, P2002"
```

## 🐳 Docker Services

### Core Services
- **nexaven-frontend**: React web application
- **nexaven-nginx**: Reverse proxy with SSL
- **nexaven-certbot**: SSL certificate management

### AI Services
- **nexaven-ollama**: AI language models
- **nexaven-linols**: ECU file processing interface

### Service Health Check
```bash
# Check all services
docker ps

# Check specific services
docker logs nexaven-ollama
docker logs nexaven-linols
docker logs nexaven-frontend

# Test AI API
curl http://localhost:11434/api/tags

# Test LinOLS API
curl http://localhost:8080/health
```

## 🧠 Ollama Model Management

### Download Recommended Models
```bash
# ECU tuning optimized models
docker exec nexaven-ollama ollama pull llama3.2:3b      # Fast general
docker exec nexaven-ollama ollama pull codellama:7b     # Code analysis
docker exec nexaven-ollama ollama pull mistral:7b       # Technical
docker exec nexaven-ollama ollama pull neural-chat:7b   # Conversational

# List installed models
docker exec nexaven-ollama ollama list

# Test model
docker exec nexaven-ollama ollama run llama3.2:3b "ECU tuning nedir?"
```

### Model Storage
- **Location**: `/var/lib/docker/volumes/nexaven-v3_ollama-data`
- **Size**: ~4-8GB per model
- **Backup**: Include in system backups

## 🔧 LinOLS Configuration

### ECU File Support
- **Formats**: .bin, .hex, .s19, .a2l
- **Max Size**: 50MB per file
- **Storage**: `/var/lib/docker/volumes/nexaven-v3_linols-data`

### Tuning Parameters
- **Boost Pressure**: Turbocharger control
- **Fuel Maps**: Injection timing and quantity
- **Ignition Timing**: Spark advance maps
- **Limiters**: Speed and torque limits
- **Emissions**: DPF, EGR, AdBlue systems

## 📊 Performance Monitoring

### System Resources
```bash
# Docker resource usage
docker stats

# Ollama memory usage
docker exec nexaven-ollama ps aux

# LinOLS process status
docker exec nexaven-linols ps aux
```

### Performance Metrics
- **AI Response Time**: 2-10 seconds (model dependent)
- **File Processing**: 5-30 seconds (file size dependent)
- **Memory Usage**: 2-8GB (models loaded)
- **Storage**: 10-50GB (models + files)

## 🚨 Troubleshooting

### AI Chat Not Working
```bash
# Check Ollama container
docker logs nexaven-ollama

# Test API directly
curl http://localhost:11434/api/tags

# Restart Ollama
docker restart nexaven-ollama

# Download missing model
docker exec nexaven-ollama ollama pull llama3.2:3b
```

### LinOLS Interface Issues
```bash
# Check LinOLS container
docker logs nexaven-linols

# Test web interface
curl http://localhost:8080/health

# Restart LinOLS
docker restart nexaven-linols

# Check file permissions
docker exec nexaven-linols ls -la /app/ecu-files
```

### File Upload Problems
```bash
# Check nginx file size limit
grep client_max_body_size /etc/nginx/nginx.conf

# Check disk space
df -h

# Check upload directory
docker exec nexaven-linols ls -la /app/ecu-files
```

## 🔒 Security Considerations

### AI Security
- **Model Access**: Local models only, no external API calls
- **Data Privacy**: ECU files processed locally
- **Network Isolation**: AI services in private Docker network

### File Security
- **Upload Validation**: File type and size checks
- **Virus Scanning**: Recommended for production
- **Access Control**: Admin-only file access
- **Backup Encryption**: Encrypt sensitive ECU files

## 📈 Advanced Usage

### Custom AI Prompts
```python
# Add custom ECU-specific prompts in OllamaChat.tsx
const ecuPrompts = {
  'boost_analysis': 'Analyze boost pressure parameters for...',
  'fuel_optimization': 'Optimize fuel maps for...',
  'emissions_delete': 'Guide for emissions system removal...'
}
```

### LinOLS Extensions
```python
# Add custom tuning algorithms in app.py
def custom_stage_tuning(ecu_type, target_power):
    # Custom tuning logic
    pass
```

### Integration APIs
```bash
# External tool integration
curl -X POST http://localhost:8080/api/apply-stage \
  -H "Content-Type: application/json" \
  -d '{"stage": "stage1", "custom_params": {...}}'
```

## 🎯 Success Indicators

After deployment, verify:
- ✅ Website loads at https://nexaven.com.tr
- ✅ Admin panels accessible with credentials
- ✅ AI chat responds to ECU questions
- ✅ LinOLS interface loads and processes files
- ✅ File upload/download working
- ✅ Stage tuning applies correctly
- ✅ All Docker services healthy

## 📞 Support & Maintenance

### Regular Maintenance
```bash
# Update models monthly
docker exec nexaven-ollama ollama pull llama3.2:latest

# Clean old ECU files
docker exec nexaven-linols find /app/ecu-files -mtime +30 -delete

# System cleanup
docker system prune -f

# Backup important data
tar -czf backup-$(date +%Y%m%d).tar.gz /var/lib/docker/volumes/nexaven-v3_*
```

### Monitoring
- **AI Response Quality**: Monitor chat effectiveness
- **File Processing Speed**: Track LinOLS performance
- **System Resources**: Monitor CPU/memory usage
- **Error Rates**: Check logs for issues

**Professional ECU Tuning with AI - Ready! 🚗🤖⚡**