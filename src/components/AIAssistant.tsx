import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  MessageCircle,
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  Loader,
  Volume2,
  VolumeX,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AIAssistantProps {
  language: string;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

export function AIAssistant({ language, isOpen, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognition = useRef<any>(null);

  const content = {
    en: {
      title: 'KrishiBot Assistant',
      subtitle: 'Your AI farming companion',
      placeholder: 'Ask me about farming, crops, weather, or government schemes...',
      listening: 'Listening...',
      send: 'Send',
      startVoice: 'Start Voice Input',
      stopVoice: 'Stop Voice Input',
      speak: 'Speak Response',
      stopSpeaking: 'Stop Speaking',
      welcomeMessage: 'Hello! I\'m your AI farming assistant. I can help you with crop advice, weather information, pest management, and government schemes. How can I assist you today?',
      exampleQueries: [
        'What fertilizer should I use for wheat?',
        'When is the best time to plant rice?',
        'How to control aphids naturally?',
        'What government schemes are available?'
      ],
      typing: 'KrishiBot is typing...',
      voiceNotSupported: 'Voice input not supported in this browser',
      speakNotSupported: 'Text-to-speech not supported in this browser'
    },
    hi: {
      title: 'कृषिबॉट सहायक',
      subtitle: 'आपका AI खेती साथी',
      placeholder: 'खेती, फसल, मौसम, या सरकारी योजनाओं के बारे में पूछें...',
      listening: 'सुन रहा है...',
      send: 'भेजें',
      startVoice: 'वॉयस इनपुट शुरू करें',
      stopVoice: 'वॉयस इनपुट बंद करें',
      speak: 'उत्तर बोलें',
      stopSpeaking: 'बोलना बंद करें',
      welcomeMessage: 'नमस्ते! मैं आपका AI खेती सहायक हूं। मैं फसल सलाह, मौसम जानकारी, कीट प्रबंधन, और सरकारी योजनाओं में आपकी मदद कर सकता हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?',
      exampleQueries: [
        'गेहूं के लिए कौन सा उर्वरक इस्तेमाल करूं?',
        'चावल बोने का सबसे अच्छा समय कब है?',
        'एफिड को प्राकृतिक रूप से कैसे नियंत्रित करें?',
        'कौन सी सरकारी योजनाएं उपलब्ध हैं?'
      ],
      typing: 'कृषिबॉट टाइप कर रहा है...',
      voiceNotSupported: 'इस ब्राउज़र में वॉयस इनपुट समर्थित नहीं है',
      speakNotSupported: 'इस ब्राउज़र में टेक्स्ट-टू-स्पीच समर्थित नहीं है'
    }
  };

  const t = content[language as keyof typeof content] || content.en;

  // User location state
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

  // Get user's current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Geolocation error:', error);
          // Default to a location in India
          setUserLocation({ lat: 28.6139, lon: 77.2090 });
        }
      );
    }
  }, []);

  // Get AI response - powered by OpenAI with Agromonitoring context
  const getAIResponse = async (userInput: string): Promise<string> => {
    // Try OpenAI first
    try {
      const { openAIService } = await import('../services/OpenAIService');

      if (openAIService.isConfigured()) {
        // Fetch weather context from Agromonitoring
        let weatherContext = undefined;
        if (userLocation) {
          try {
            const { agroService } = await import('../services/AgroMonitoringService');
            const weather = await agroService.getCurrentWeather(userLocation.lat, userLocation.lon);

            if (weather) {
              weatherContext = {
                temperature: weather.main?.temp ? Math.round(weather.main.temp - 273.15) : undefined,
                humidity: weather.main?.humidity,
                description: weather.weather?.[0]?.description,
                windSpeed: weather.wind?.speed ? Math.round(weather.wind.speed * 3.6) : undefined
              };
            }
          } catch (e) {
            console.warn('Could not fetch weather context:', e);
          }
        }

        // Call OpenAI with context
        const response = await openAIService.chat(
          userInput,
          language,
          weatherContext,
          userLocation ? { lat: userLocation.lat, lon: userLocation.lon } : undefined
        );

        return response;
      }
    } catch (error) {
      console.error('OpenAI error, falling back to mock responses:', error);
    }

    // Fallback to mock responses if OpenAI fails or is not configured
    const input = userInput.toLowerCase();

    if (input.includes('weather') || input.includes('मौसम')) {
      return language === 'en'
        ? 'I couldn\'t fetch current weather data. Please ensure OpenAI API key is configured. For general advice: check local conditions before field operations, avoid spraying before expected rainfall.'
        : 'मैं वर्तमान मौसम डेटा प्राप्त नहीं कर सका। कृपया सुनिश्चित करें कि OpenAI API key कॉन्फ़िगर है। सामान्य सलाह: खेत के कार्यों से पहले स्थानीय स्थितियों की जांच करें।';
    }

    if (input.includes('fertilizer') || input.includes('उर्वरक')) {
      return language === 'en'
        ? 'For wheat crops, I recommend using NPK fertilizer (20-10-10) at a rate of 120-150 kg per hectare. Apply nitrogen in 2-3 splits: 50% at sowing, 25% at tillering, and 25% at booting stage.'
        : 'गेहूं की फसल के लिए, मैं NPK उर्वरक (20-10-10) की सिफारिश करता हूं, 120-150 किग्रा प्रति हेक्टेयर की दर से। नाइट्रोजन को 2-3 भागों में दें।';
    }

    if (input.includes('scheme') || input.includes('योजना')) {
      return language === 'en'
        ? 'Key government schemes: PM-KISAN (₹6,000/year), PM Fasal Bima Yojana (crop insurance), Kisan Credit Card (up to ₹3 lakhs), PM-KUSUM (solar subsidies), Soil Health Card (free testing).'
        : 'मुख्य सरकारी योजनाएं: PM-KISAN (₹6,000/वर्ष), PM फसल बीमा योजना, किसान क्रेडिट कार्ड (₹3 लाख तक), PM-KUSUM (सोलर सब्सिडी), मिट्टी स्वास्थ्य कार्ड।';
    }

    return language === 'en'
      ? 'I understand your query. For AI-powered responses, please ensure OpenAI API is configured. I can help with crop management, pest control, fertilizer recommendations, weather advice, and government schemes.'
      : 'मैं आपकी जिज्ञासा समझता हूं। AI-संचालित प्रतिक्रियाओं के लिए, कृपया सुनिश्चित करें कि OpenAI API कॉन्फ़िगर है। मैं फसल प्रबंधन, कीट नियंत्रण, उर्वरक सिफारिशों में मदद कर सकता हूं।';
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message
      setMessages([{
        id: '1',
        type: 'bot',
        content: t.welcomeMessage,
        timestamp: new Date()
      }]);
    }
  }, [isOpen, language]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // Get AI response (may involve async API calls)
      const responseContent = await getAIResponse(userInput);

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: responseContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: language === 'en'
          ? 'Sorry, I encountered an error. Please try again.'
          : 'क्षमा करें, एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = language === 'hi' ? 'hi-IN' : 'en-US';

      recognition.current.onstart = () => {
        setIsListening(true);
      };

      recognition.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.current.onerror = () => {
        setIsListening(false);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };

      recognition.current.start();
    } else {
      alert(t.voiceNotSupported);
    }
  };

  const stopVoiceInput = () => {
    if (recognition.current) {
      recognition.current.stop();
      setIsListening(false);
    }
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.8;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);

      speechSynthesis.speak(utterance);
    } else {
      alert(t.speakNotSupported);
    }
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-2xl h-[600px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                {t.title}
                <Sparkles className="h-4 w-4 text-yellow-500" />
              </CardTitle>
              <p className="text-sm text-muted-foreground">{t.subtitle}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-4">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'user'
                      ? 'bg-blue-500'
                      : 'bg-gradient-to-br from-green-400 to-green-600'
                      }`}>
                      {message.type === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div className={`p-3 rounded-lg ${message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-muted'
                      }`}>
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        {message.type === 'bot' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => isSpeaking ? stopSpeaking() : speakResponse(message.content)}
                          >
                            {isSpeaking ? (
                              <VolumeX className="h-3 w-3" />
                            ) : (
                              <Volume2 className="h-3 w-3" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Loader className="h-4 w-4 animate-spin" />
                      <span className="text-sm">{t.typing}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Example Queries */}
          {messages.length <= 1 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {language === 'en' ? 'Try asking:' : 'इन्हें पूछकर देखें:'}
              </p>
              <div className="flex flex-wrap gap-2">
                {t.exampleQueries.map((query, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => setInput(query)}
                  >
                    {query}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t.placeholder}
                disabled={isLoading}
              />
              {isListening && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </div>
              )}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={isListening ? stopVoiceInput : startVoiceInput}
              disabled={isLoading}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button
              size="sm"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}