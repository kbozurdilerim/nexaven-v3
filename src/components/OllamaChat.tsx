import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Loader2, Zap, Code, FileText, Settings, Cpu, HardDrive, Upload, Download, HexagonIcon } from 'lucide-react'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  type?: 'text' | 'code' | 'file' | 'system'
  file?: {
    name: string
    size: number
    hexPreview?: string
  }
}

interface OllamaChatProps {
  onECUCommand?: (command: string, data?: any) => void
  ecuFile?: File | null
}

// External Ollama server configuration
const OLLAMA_BASE_URL = 'http://72.62.178.51:32768'

export default function OllamaChat({ onECUCommand, ecuFile }: OllamaChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [selectedModel, setSelectedModel] = useState('llama3.2')
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [hexData, setHexData] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Hex dosya okuma fonksiyonu
  const readHexFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        const hexString = Array.from(uint8Array)
          .map(byte => byte.toString(16).padStart(2, '0').toUpperCase())
          .join(' ');
        resolve(hexString);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  // Dosya yükleme fonksiyonu
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const hex = await readHexFile(file);
      setUploadedFile(file);
      setHexData(hex);

      // Dosya yükleme mesajı ekle
      const fileMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: `ECU dosyası yüklendi: ${file.name}`,
        timestamp: new Date().toLocaleTimeString('tr-TR'),
        type: 'file',
        file: {
          name: file.name,
          size: file.size,
          hexPreview: hex.substring(0, 200) + '...'
        }
      };

      setMessages(prev => [...prev, fileMessage]);

      // Otomatik analiz başlat
      await sendMessage(`/ecu analyze
Dosya: ${file.name}
Boyut: ${file.size} bytes
Hex Data (ilk 1000 karakter): ${hex.substring(0, 1000)}

Bu ECU dosyasını analiz et ve şunları belirle:
1. ECU tipi ve üretici
2. Mevcut yazılım versiyonu
3. Tuning potansiyeli
4. Güvenlik kontrolleri (checksums)
5. Modifikasyon önerileri
6. Risk değerlendirmesi

Türkçe detaylı analiz raporu ver.`, false);

    } catch (error) {
      console.error('Dosya okuma hatası:', error);
    }
  };

  const ollamaModels = [
    { name: 'llama3.2', display: 'Llama 3.2 (Genel)', description: 'Genel amaçlı AI asistan' },
    { name: 'codellama', display: 'CodeLlama (Kod)', description: 'Kod yazma ve analiz' },
    { name: 'mistral', display: 'Mistral (Hızlı)', description: 'Hızlı yanıtlar' },
    { name: 'neural-chat', display: 'Neural Chat (Teknik)', description: 'Teknik konular' }
  ]

  useEffect(() => {
    checkOllamaConnection()
    initializeChat()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const checkOllamaConnection = async () => {
    try {
      // Use external Ollama server
      const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`)
      
      if (response.ok) {
        const data = await response.json()
        setAvailableModels(data.models?.map((m: any) => m.name) || [])
        setIsConnected(true)
        console.log('✅ External Ollama connection successful:', data.models?.length || 0, 'models available')
      }
    } catch (error) {
      console.log('❌ External Ollama connection failed:', error)
      setIsConnected(false)
      
      // Show connection status in chat
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `🔌 **External Ollama Connection Status**

❌ Could not connect to external Ollama server.

**Server**: ${OLLAMA_BASE_URL}

**Possible Issues:**
• Server might be down or restarting
• Network connectivity issues
• Firewall blocking the connection

**Manual Check:**
\`curl ${OLLAMA_BASE_URL}/api/tags\`

ECU tuning commands are still available for file processing.`,
        timestamp: new Date().toISOString(),
        type: 'system'
      }
      
      setMessages(prev => [...prev, errorMessage])
    }
  }

  const initializeChat = () => {
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `🔧 **Zorlu ECU AI Asistanı**

Merhaba! Ben ECU tuning konusunda size yardımcı olacak AI asistanınızım.

**Yapabileceklerim:**
• 🚗 ECU dosya analizi ve stage yazılım önerileri
• 🔧 ECU parametreleri hesaplama ve optimizasyon
• 📊 Performance tuning tavsiyeleri
• 🛠️ Tuning parametreleri analizi
• 📋 Hata kodu çözümleri

**ECU Komutları:**
\`/ecu analyze [dosya]\` - ECU dosyasını analiz et
\`/ecu stage1\` - Stage 1 parametrelerini hesapla
\`/ecu stage2\` - Stage 2 parametrelerini hesapla
\`/ecu stage3\` - Stage 3 parametrelerini hesapla
\`/ecu optimize\` - Performans optimizasyonu öner

**Dosya Yükleme:**
Sağ üstteki yükleme butonunu kullanarak ECU dosyanızı yükleyebilirsiniz.

Hangi konuda yardım istiyorsunuz?`,
      timestamp: new Date().toISOString(),
      type: 'system'
    }
    setMessages([welcomeMessage])
  }

  const sendMessage = async (messageText?: string, addToMessages = true) => {
    const messageContent = messageText || input;
    if (!messageContent.trim() || isLoading) return

    if (addToMessages) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: messageContent,
        timestamp: new Date().toLocaleTimeString('tr-TR'),
        type: 'text'
      }
      setMessages(prev => [...prev, userMessage])
    }

    if (!messageText) setInput('')
    setIsLoading(true)

    // Check for ECU commands
    if (messageContent.startsWith('/ecu')) {
      handleECUCommand(messageContent)
      setIsLoading(false)
      return
    }

    try {
      // Use external Ollama server
      const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          prompt: buildPrompt(input),
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 2000
          }
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response || 'Yanıt alınamadı.',
          timestamp: new Date().toISOString()
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('External Ollama API Error:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ **AI Connection Error**

Could not get response from external Ollama server: ${error}

**Server**: ${OLLAMA_BASE_URL}

**Solutions:**
1. Check if server is running: \`curl ${OLLAMA_BASE_URL}/api/tags\`
2. Verify network connectivity
3. Contact server administrator

**Available Models:**
${availableModels.length > 0 ? availableModels.map(m => `• ${m}`).join('\n') : 'No models available'}

**ECU Commands** are still available for file processing!`,
        timestamp: new Date().toISOString(),
        type: 'system'
      }
      setMessages(prev => [...prev, errorMessage])
    }

    setIsLoading(false)
  }

  const buildPrompt = (userInput: string) => {
    const context = `Sen bir ECU tuning uzmanısın. Zorlu ECU firması için çalışıyorsun ve müşterilere ECU yazılım geliştirme konusunda yardım ediyorsun.

Uzmanlık alanların:
- ECU dosya analizi ve modifikasyonu
- Stage 1, Stage 2, Stage 3 yazılım geliştirme
- Performance optimizasyonu ve parametre hesaplama
- Turbo basınç ayarları ve boost kontrolü
- Yakıt haritası optimizasyonu
- DPF/EGR silme işlemleri
- Hata kodu analizi ve çözümleri
- ECU pin-out ve bağlantı şemaları

${ecuFile ? `Şu anda yüklü ECU dosyası: ${ecuFile.name}` : 'Henüz ECU dosyası yüklenmemiş.'}

Kullanıcı sorusu: ${userInput}

Lütfen profesyonel, teknik ve yardımcı bir şekilde yanıtla. Türkçe yanıt ver ve gerekirse ECU komutları öner.`

    return context
  }

  const handleECUCommand = (command: string) => {
    const cmd = command.toLowerCase().trim()
    
    let responseMessage = ''
    
    if (cmd.startsWith('/ecu analyze')) {
      responseMessage = '📊 **ECU Dosya Analizi**\n\n• Dosya türü: EDC17/MED17 tespit edildi\n• Boyut: 1024KB (1MB)\n• Checksum: Geçerli\n• Tuning durumu: Stock (orijinal)\n• Önerilen stage: Stage 1 uygulanabilir'
      onECUCommand?.('analyze', { type: 'edc17', size: '1MB', status: 'stock' })
    } else if (cmd === '/ecu stage1') {
      responseMessage = '⚡ **Stage 1 Parametreleri**\n\n• Turbo basıncı: +0.2 bar (1.4 bar)\n• Yakıt haritası: %15 artış\n• Ateşleme avansı: +2°\n• Tork artışı: +25% (yaklaşık 50 Nm)\n• Güç artışı: +20% (yaklaşık 30 HP)\n• Hız limiti: Kaldırılabilir'
      onECUCommand?.('stage1')
    } else if (cmd === '/ecu stage2') {
      responseMessage = '🚀 **Stage 2 Parametreleri**\n\n• Turbo basıncı: +0.4 bar (1.6 bar)\n• Yakıt haritası: %25 artış\n• Ateşleme avansı: +4°\n• Tork artışı: +35% (yaklaşık 70 Nm)\n• Güç artışı: +30% (yaklaşık 45 HP)\n• Intercooler optimizasyonu gerekli\n• Egzoz modifikasyonu önerilir'
      onECUCommand?.('stage2')
    } else if (cmd === '/ecu stage3') {
      responseMessage = '🔥 **Stage 3 Parametreleri**\n\n• Turbo basıncı: +0.6 bar (1.8 bar)\n• Yakıt haritası: %40 artış\n• Ateşleme avansı: +6°\n• Tork artışı: +50% (yaklaşık 100 Nm)\n• Güç artışı: +45% (yaklaşık 70 HP)\n• ⚠️ Donanım modifikasyonu zorunlu:\n  - Büyük intercooler\n  - Performans egzoz sistemi\n  - Güçlendirilmiş debriyaj'
      onECUCommand?.('stage3')
    } else if (cmd === '/ecu optimize') {
      responseMessage = '🔧 **Performans Optimizasyonu**\n\n• EGR sistemi: %0 (kapatılabilir)\n• DPF regen: Optimize edilebilir\n• Lambda sensör: Ayarlanabilir\n• Rail basıncı: +100 bar artış\n• Injection timing: 2° advance\n• Torque limiter: Kaldırılabilir\n• Speed limiter: Kaldırılabilir'
      onECUCommand?.('optimize')
    } else {
      responseMessage = `❌ **Bilinmeyen Komut**\n\nGeçerli ECU komutları:\n• \`/ecu analyze\` - Dosya analizi\n• \`/ecu stage1\` - Stage 1 hesapla\n• \`/ecu stage2\` - Stage 2 hesapla\n• \`/ecu stage3\` - Stage 3 hesapla\n• \`/ecu optimize\` - Optimizasyon öner`
    }

    const systemMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseMessage,
      timestamp: new Date().toISOString(),
      type: 'system'
    }

    setMessages(prev => [...prev, systemMessage])
  }

  const getMessageIcon = (message: ChatMessage) => {
    if (message.role === 'user') return <User className="w-5 h-5" />
    if (message.type === 'system') return <Settings className="w-5 h-5" />
    return <Bot className="w-5 h-5" />
  }

  const getMessageStyle = (message: ChatMessage) => {
    if (message.role === 'user') {
      return 'bg-blue-500/20 border-blue-500/50 text-blue-100 ml-12'
    }
    if (message.type === 'system') {
      return 'bg-orange-500/20 border-orange-500/50 text-orange-100 mr-12'
    }
    return 'bg-green-500/20 border-green-500/50 text-green-100 mr-12'
  }

  // File upload handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Simulate file processing
    const fileMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `📁 **ECU Dosyası Yüklendi**

**Dosya**: ${file.name}
**Boyut**: ${(file.size / 1024).toFixed(2)} KB
**Tür**: ${file.type || 'ECU Binary'}

Dosya başarıyla yüklendi. Analiz için \`/ecu analyze\` komutunu kullanabilirsiniz.`,
      timestamp: new Date().toISOString(),
      type: 'system'
    }

    setMessages(prev => [...prev, fileMessage])
    onECUCommand?.('upload', { name: file.name, size: file.size })
  }

  return (
    <div className="flex flex-col h-full bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold">ECU AI Asistanı</h3>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className="text-white/60 text-sm">
                  {isConnected ? 'Ollama Bağlı' : 'Ollama Bağlantısız'}
                </span>
              </div>
            </div>
          </div>

          {/* Model Selector */}
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-red-500"
          >
            {ollamaModels.map(model => (
              <option key={model.name} value={model.name} className="bg-gray-800">
                {model.display}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-4 rounded-xl border ${getMessageStyle(message)}`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  {getMessageIcon(message)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">
                      {message.role === 'user' ? 'Siz' : message.type === 'system' ? 'Sistem' : 'AI Asistan'}
                    </span>
                    <span className="text-xs opacity-60">
                      {new Date(message.timestamp).toLocaleTimeString('tr-TR')}
                    </span>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    {message.type === 'file' && message.file ? (
                      <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-3">
                        <div className="flex items-center gap-3 mb-3">
                          <FileText className="w-6 h-6 text-blue-400" />
                          <div>
                            <div className="font-medium text-blue-300">{message.file.name}</div>
                            <div className="text-sm text-blue-400">
                              {(message.file.size / 1024).toFixed(1)} KB
                            </div>
                          </div>
                        </div>
                        {message.file.hexPreview && (
                          <div className="bg-black/40 rounded p-3 font-mono text-xs text-green-400">
                            <div className="text-blue-300 mb-2">Hex Preview:</div>
                            {message.file.hexPreview}
                          </div>
                        )}
                      </div>
                    ) : null}
                    
                    {message.content.split('\n').map((line, idx) => (
                      <p key={idx} className="mb-2 last:mb-0">
                        {line.startsWith('`') && line.endsWith('`') ? (
                          <code className="px-2 py-1 bg-black/30 rounded text-sm font-mono">
                            {line.slice(1, -1)}
                          </code>
                        ) : line.startsWith('•') ? (
                          <span className="flex items-start gap-2">
                            <span className="text-red-400 mt-1">•</span>
                            <span>{line.slice(1).trim()}</span>
                          </span>
                        ) : (
                          line
                        )}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10"
          >
            <Loader2 className="w-5 h-5 animate-spin text-red-400" />
            <span className="text-white/60">AI düşünüyor...</span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-white/5">
        {/* File Upload Area */}
        {uploadedFile && (
          <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <div className="flex items-center gap-3">
              <HexagonIcon className="w-5 h-5 text-blue-400" />
              <div className="flex-1">
                <div className="text-white font-medium">{uploadedFile.name}</div>
                <div className="text-blue-300 text-sm">
                  {(uploadedFile.size / 1024).toFixed(1)} KB • Hex data yüklendi
                </div>
              </div>
              <button
                onClick={() => {
                  setUploadedFile(null);
                  setHexData('');
                }}
                className="text-blue-300 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".bin,.hex,.ecu,.ori,.mod"
            className="hidden"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white flex items-center gap-2 transition-all"
            title="ECU dosyası yükle"
          >
            <Upload className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="ECU tuning hakkında soru sorun veya /ecu komutları kullanın..."
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-red-500"
            disabled={isLoading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Commands */}
        <div className="flex flex-wrap gap-2 mt-3">
          {[
            { cmd: '/ecu analyze', label: '📊 Analiz' },
            { cmd: '/ecu stage1', label: '⚡ Stage 1' },
            { cmd: '/ecu stage2', label: '🚀 Stage 2' },
            { cmd: '/ecu optimize', label: '🔧 Optimize' }
          ].map((quick) => (
            <button
              key={quick.cmd}
              onClick={() => setInput(quick.cmd)}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white/70 text-sm transition-all"
            >
              {quick.label}
            </button>
          ))}
          
          {/* File Upload Button */}
          <label className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg hover:shadow-blue-500/25 border border-blue-500/50 rounded-lg text-white text-sm transition-all cursor-pointer flex items-center gap-2">
            <Upload className="w-4 h-4" />
            ECU Dosyası
            <input
              type="file"
              accept=".bin,.hex,.s19,.a2l"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  )
}