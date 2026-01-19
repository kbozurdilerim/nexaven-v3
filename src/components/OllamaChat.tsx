import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Loader2, Zap, Code, FileText, Settings, Cpu, HardDrive } from 'lucide-react'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  type?: 'text' | 'code' | 'file' | 'system'
}

interface OllamaChatProps {
  onLinOLSCommand?: (command: string) => void
  ecuFile?: File | null
}

export default function OllamaChat({ onLinOLSCommand, ecuFile }: OllamaChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [selectedModel, setSelectedModel] = useState('llama3.2')
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
      // Try direct connection first
      let response = await fetch('http://localhost:11434/api/tags')
      
      // If direct connection fails, try through nginx proxy
      if (!response.ok) {
        response = await fetch('/api/ollama/tags')
      }
      
      if (response.ok) {
        const data = await response.json()
        setAvailableModels(data.models?.map((m: any) => m.name) || [])
        setIsConnected(true)
        console.log('✅ Ollama bağlantısı başarılı:', data.models?.length || 0, 'model mevcut')
      }
    } catch (error) {
      console.log('❌ Ollama bağlantısı kurulamadı:', error)
      setIsConnected(false)
      
      // Show connection status in chat
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `🔌 **Ollama Bağlantı Durumu**

❌ Ollama servisine bağlanılamadı.

**Kontrol Edilecekler:**
• Docker container çalışıyor mu: \`docker ps | grep ollama\`
• Ollama servisi aktif mi: \`curl http://localhost:11434/api/tags\`
• Port 11434 açık mı

**Manuel Test:**
\`docker exec -it nexaven-ollama ollama list\`

Bağlantı kurulana kadar LinOLS komutları kullanılabilir.`,
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
• 🔧 LinOLS komutları ve ayarları
• 📊 Performance optimizasyonu tavsiyeleri
• 🛠️ Tuning parametreleri hesaplama
• 📋 Hata kodu analizi

**LinOLS Komutları:**
\`/linols open\` - LinOLS arayüzünü aç
\`/linols load [dosya]\` - ECU dosyasını yükle
\`/linols stage1\` - Stage 1 ayarları uygula
\`/linols stage2\` - Stage 2 ayarları uygula
\`/linols export\` - Düzenlenmiş dosyayı dışa aktar

Hangi konuda yardım istiyorsunuz?`,
      timestamp: new Date().toISOString(),
      type: 'system'
    }
    setMessages([welcomeMessage])
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Check for LinOLS commands
    if (input.startsWith('/linols')) {
      handleLinOLSCommand(input)
      setIsLoading(false)
      return
    }

    try {
      // Try direct connection first, then proxy
      let apiUrl = 'http://localhost:11434/api/generate'
      let response = await fetch(apiUrl, {
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

      // If direct connection fails, try through nginx proxy
      if (!response.ok) {
        apiUrl = '/api/ollama/generate'
        response = await fetch(apiUrl, {
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
      }

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
      console.error('Ollama API Hatası:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ **AI Yanıt Hatası**

Ollama API'den yanıt alınamadı: ${error}

**Çözüm Önerileri:**
1. Model indirilmiş mi kontrol edin: \`docker exec nexaven-ollama ollama list\`
2. Model indirin: \`docker exec nexaven-ollama ollama pull ${selectedModel}\`
3. Ollama loglarını kontrol edin: \`docker logs nexaven-ollama\`

**Mevcut Modeller:**
${availableModels.length > 0 ? availableModels.map(m => `• ${m}`).join('\n') : 'Henüz model indirilmemiş'}

**LinOLS Komutları** hala kullanılabilir!`,
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
- LinOLS yazılımı kullanımı
- Performance optimizasyonu
- Turbo basınç ayarları
- Yakıt haritası optimizasyonu
- DPF/EGR silme işlemleri
- Hata kodu analizi

${ecuFile ? `Şu anda yüklü ECU dosyası: ${ecuFile.name}` : 'Henüz ECU dosyası yüklenmemiş.'}

Kullanıcı sorusu: ${userInput}

Lütfen profesyonel, teknik ve yardımcı bir şekilde yanıtla. Gerekirse LinOLS komutları öner.`

    return context
  }

  const handleLinOLSCommand = (command: string) => {
    const cmd = command.toLowerCase().trim()
    
    let responseMessage = ''
    
    if (cmd === '/linols open') {
      responseMessage = '🔧 **LinOLS Arayüzü Açılıyor...**\n\nLinOLS web arayüzüne yönlendiriliyorsunuz.'
      onLinOLSCommand?.('open')
    } else if (cmd.startsWith('/linols load')) {
      responseMessage = '📁 **ECU Dosyası Yükleniyor...**\n\nDosya yükleme işlemi başlatılıyor.'
      onLinOLSCommand?.('load')
    } else if (cmd === '/linols stage1') {
      responseMessage = '⚡ **Stage 1 Ayarları Uygulanıyor...**\n\n• Turbo basıncı: +0.2 bar\n• Yakıt haritası: %15 artış\n• Ateşleme avansı: +2°\n• Hız limiti: Kaldırıldı'
      onLinOLSCommand?.('stage1')
    } else if (cmd === '/linols stage2') {
      responseMessage = '🚀 **Stage 2 Ayarları Uygulanıyor...**\n\n• Turbo basıncı: +0.4 bar\n• Yakıt haritası: %25 artış\n• Ateşleme avansı: +4°\n• Intercooler optimizasyonu\n• Egzoz backpressure düşürme'
      onLinOLSCommand?.('stage2')
    } else if (cmd === '/linols export') {
      responseMessage = '💾 **Dosya Dışa Aktarılıyor...**\n\nDüzenlenmiş ECU dosyası hazırlanıyor.'
      onLinOLSCommand?.('export')
    } else {
      responseMessage = `❌ **Bilinmeyen Komut**\n\nGeçerli LinOLS komutları:\n• \`/linols open\` - Arayüzü aç\n• \`/linols load\` - Dosya yükle\n• \`/linols stage1\` - Stage 1 uygula\n• \`/linols stage2\` - Stage 2 uygula\n• \`/linols export\` - Dosya dışa aktar`
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
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="ECU tuning hakkında soru sorun veya /linols komutları kullanın..."
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-red-500"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Commands */}
        <div className="flex flex-wrap gap-2 mt-3">
          {[
            { cmd: '/linols open', label: '🔧 LinOLS Aç' },
            { cmd: '/linols stage1', label: '⚡ Stage 1' },
            { cmd: '/linols stage2', label: '🚀 Stage 2' },
            { cmd: 'ECU dosya analizi yap', label: '📊 Analiz' }
          ].map((quick) => (
            <button
              key={quick.cmd}
              onClick={() => setInput(quick.cmd)}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white/70 text-sm transition-all"
            >
              {quick.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}