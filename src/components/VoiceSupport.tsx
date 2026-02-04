import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PlayCircle,
  Settings,
  Languages,
  X,
  RefreshCw,
  Server
} from 'lucide-react';
import { motion } from 'motion/react';

interface VoiceSupportProps {
  language: string;
  isEnabled: boolean;
  onToggle: () => void;
  onVoiceCommand?: (command: string) => void;
}

export function VoiceSupport({ language, isEnabled, onToggle, onVoiceCommand }: VoiceSupportProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isServerConnected, setIsServerConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [inputText, setInputText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const SERVER_URL = import.meta.env.VITE_VOICE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    checkServerConnection();
  }, []);

  const checkServerConnection = async () => {
    setIsConnecting(true);
    try {
      const response = await fetch(`${SERVER_URL}/status`);
      const data = await response.json();
      if (data.status === 'online') {
        setIsServerConnected(true);
        setErrorMessage('');
      } else {
        setIsServerConnected(false);
        setErrorMessage('Voice server returned invalid status');
      }
    } catch (error) {
      setIsServerConnected(false);
      setErrorMessage('Plugin disconnected. Run backend/voice_server.py');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleManualSubmit = () => {
    if (!inputText.trim()) return;
    setTranscript(inputText);
    if (onVoiceCommand) {
      onVoiceCommand(inputText);
    }
    processVoiceCommand(inputText);
    setInputText('');
  };

  const content = {
    en: {
      title: 'Voice Assistant (Python)',
      listening: 'Listening...',
      notListening: 'Ready',
      speaking: 'Speaking...',
      voiceCommands: 'Voice Commands',
      sampleCommands: [
        'Show crop monitoring',
        'Check soil health',
        'What is the weather today?',
        'Show recommendations',
        'Navigate to satellite analysis'
      ],
      startListening: 'Start Listening',
      stopListening: 'Stop Listening',
      enableVoice: 'Enable Voice Output',
      disableVoice: 'Disable Voice Output',
      notSupported: 'Backend disconnected',
      lastCommand: 'Last Command',
      retryConnection: 'Retry Connection'
    },
    hi: {
      title: 'आवाज सहायक (Python)',
      listening: 'सुन रहा है...',
      notListening: 'तैयार',
      speaking: 'बोल रहा है...',
      voiceCommands: 'आवाज कमांड',
      sampleCommands: [
        'फसल निगरानी दिखाएं',
        'मिट्टी का स्वास्थ्य जांचें',
        'आज मौसम कैसा है?',
        'सुझाव दिखाएं',
        'सैटेलाइट विश्लेषण पर जाएं'
      ],
      startListening: 'सुनना शुरू करें',
      stopListening: 'सुनना बंद करें',
      enableVoice: 'आवाज आउटपुट सक्षम करें',
      disableVoice: 'आवाज आउटपुट अक्षम करें',
      notSupported: 'बैकएंड डिस्कनेक्ट हो गया',
      lastCommand: 'अंतिम कमांड',
      retryConnection: 'कनेक्शन पुनः प्रयास करें'
    }
  };

  const t = content[language as keyof typeof content] || content.en;

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();

    // Navigation commands
    if (lowerCommand.includes('dashboard') || lowerCommand.includes('home')) {
      speak(language === 'hi' ? 'डैशबोर्ड पर जा रहे हैं' : 'Navigating to dashboard');
    } else if (lowerCommand.includes('crop') || lowerCommand.includes('फसल')) {
      speak(language === 'hi' ? 'फसल निगरानी पर जा रहे हैं' : 'Opening crop monitoring');
    } else if (lowerCommand.includes('soil') || lowerCommand.includes('मिट्टी')) {
      speak(language === 'hi' ? 'मिट्टी स्वास्थ्य विश्लेषण पर जा रहे हैं' : 'Opening soil health analysis');
    } else if (lowerCommand.includes('weather') || lowerCommand.includes('मौसम')) {
      speak(language === 'hi' ? 'मौसम की जानकारी प्रदान कर रहे हैं' : 'Providing weather information');
    } else if (lowerCommand.includes('recommendation') || lowerCommand.includes('सुझाव')) {
      speak(language === 'hi' ? 'सिफारिशें दिखा रहे हैं' : 'Showing recommendations');
    } else {
      speak(language === 'hi' ? 'समझ नहीं आया, कृपया फिर से कोशिश करें' : 'Command not understood, please try again');
    }
  };

  const speak = async (text: string) => {
    if (!voiceEnabled || !isServerConnected) return;

    setIsSpeaking(true);
    try {
      await fetch(`${SERVER_URL}/speak`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
    } catch (error) {
      console.error("Speech synthesis error", error);
    } finally {
      // Create a fake timeout to reset speaking state since status sync is complex
      setTimeout(() => setIsSpeaking(false), 3000);
    }
  };

  const startListening = async () => {
    if (!isServerConnected) {
      checkServerConnection();
      return;
    }

    setIsListening(true);
    setErrorMessage('');

    try {
      const response = await fetch(`${SERVER_URL}/listen`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success && data.text) {
        setTranscript(data.text);
        if (onVoiceCommand) {
          onVoiceCommand(data.text);
        }
        processVoiceCommand(data.text);
      } else if (!data.success) {
        if (data.error.includes('timeout')) {
          setErrorMessage('Listening timed out.');
        } else {
          setErrorMessage(data.error || 'Failed to understand');
        }
      }
    } catch (error) {
      console.error('Listening error:', error);
      setErrorMessage('Connection to voice server lost');
      setIsServerConnected(false);
    } finally {
      setIsListening(false);
    }
  };

  const stopListening = () => {
    // Current server implementation waits for timeout, 
    // real cancellation would require a separate endpoint
    setIsListening(false);
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
  };

  if (!isEnabled) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 shadow-xl border-t-4 border-t-green-600">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className={`h-5 w-5 ${isServerConnected ? 'text-green-500' : 'text-gray-400'}`} />
              {t.title}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isServerConnected ? (isListening ? "default" : "outline") : "destructive"}>
                {isServerConnected ? (isListening ? t.listening : t.notListening) : 'Offline'}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Connection Status */}
          {!isServerConnected && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm flex flex-col gap-2">
              <div className="flex items-center gap-2 text-red-700 font-medium">
                <Server className="h-4 w-4" />
                <span>Backend Disconnected</span>
              </div>
              <p className="text-xs text-red-600">
                Please run the Python voice server:
              </p>
              <code className="bg-black/10 p-1 rounded text-xs block mb-1">
                python backend/voice_server.py
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={checkServerConnection}
                disabled={isConnecting}
                className="w-full gap-2 border-red-300 text-red-700 hover:bg-red-100"
              >
                {isConnecting ? <RefreshCw className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                {t.retryConnection}
              </Button>
            </div>
          )}

          {/* Voice Controls */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant={isListening ? "destructive" : "default"}
              onClick={isListening ? stopListening : startListening}
              className="flex-1 min-w-[120px]"
              disabled={!isServerConnected || isListening}
            >
              {isListening ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  {t.startListening}
                </>
              )}
            </Button>

            <Button
              variant={voiceEnabled ? "default" : "outline"}
              onClick={toggleVoice}
              className="flex-1 min-w-[120px]"
            >
              {voiceEnabled ? (
                <>
                  <Volume2 className="h-4 w-4 mr-2" />
                  {t.disableVoice}
                </>
              ) : (
                <>
                  <VolumeX className="h-4 w-4 mr-2" />
                  {t.enableVoice}
                </>
              )}
            </Button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="text-xs text-red-500 bg-red-50 p-2 rounded border border-red-200">
              {errorMessage}
            </div>
          )}

          {/* Text Input Fallback */}
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
              placeholder={language === 'hi' ? "कमांड टाइप करें..." : "Type a command..."}
              className="flex-1 text-sm border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Button size="sm" onClick={handleManualSubmit} disabled={!inputText.trim()}>
              <PlayCircle className="h-4 w-4" />
            </Button>
          </div>

          {/* Last Command */}
          {transcript && (
            <div className="p-3 bg-accent rounded-lg">
              <div className="flex items-start gap-2">
                <Mic className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-accent-foreground">
                    {t.lastCommand}:
                  </p>
                  <p className="text-sm text-muted-foreground">
                    "{transcript}"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Sample Commands */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Languages className="h-4 w-4" />
              {t.voiceCommands}
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {t.sampleCommands.map((command, index) => (
                <div
                  key={index}
                  className="p-2 bg-muted/50 rounded text-sm cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => {
                    if (onVoiceCommand) onVoiceCommand(command);
                    processVoiceCommand(command);
                    setTranscript(command);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <PlayCircle className="h-3 w-3 text-muted-foreground" />
                    "{command}"
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}