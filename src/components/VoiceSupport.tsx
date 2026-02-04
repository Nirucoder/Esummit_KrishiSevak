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
  PauseCircle,
  Settings,
  Languages,
  X
} from 'lucide-react';
import { motion } from 'motion/react';

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface VoiceSupportProps {
  language: string;
  isEnabled: boolean;
  onToggle: () => void;
  onVoiceCommand?: (command: string) => void;
}

export function VoiceSupport({ language, isEnabled, onToggle, onVoiceCommand }: VoiceSupportProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speechRate, setSpeechRate] = useState(1);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const content = {
    en: {
      title: 'Voice Assistant',
      listening: 'Listening...',
      notListening: 'Click to start listening',
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
      notSupported: 'Voice features not supported in this browser',
      lastCommand: 'Last Command'
    },
    hi: {
      title: 'आवाज सहायक',
      listening: 'सुन रहा है...',
      notListening: 'सुनना शुरू करने के लिए क्लिक करें',
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
      notSupported: 'इस ब्राउज़र में आवाज सुविधाएं समर्थित नहीं हैं',
      lastCommand: 'अंतिम कमांड'
    }
  };

  const t = content[language as keyof typeof content] || content.en;

  useEffect(() => {
    // Check if Speech Recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const result = event.results[0][0].transcript;
          setTranscript(result);
          if (onVoiceCommand) {
            onVoiceCommand(result);
          }
          processVoiceCommand(result);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };
      }
    }
  }, [language]);

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

  const speak = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = speechRate;
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };

    speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (recognitionRef.current && isSupported) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="w-80">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MicOff className="h-5 w-5 text-gray-400" />
                {t.title}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <MicOff className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t.notSupported}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-green-500" />
              {t.title}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isListening ? "default" : "outline"}>
                {isListening ? t.listening : t.notListening}
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
          {/* Voice Controls */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant={isListening ? "destructive" : "default"}
              onClick={isListening ? stopListening : startListening}
              className="flex-1 min-w-[120px]"
            >
              {isListening ? (
                <>
                  <MicOff className="h-4 w-4 mr-2" />
                  {t.stopListening}
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

          {/* Voice Animation */}
          {isListening && (
            <motion.div 
              className="flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center space-x-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-green-500 rounded-full"
                    animate={{
                      height: [10, 30, 10],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

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
                  onClick={() => speak(command)}
                >
                  <div className="flex items-center gap-2">
                    <PlayCircle className="h-3 w-3 text-muted-foreground" />
                    "{command}"
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Speaking Status */}
          {isSpeaking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg"
            >
              <Volume2 className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-blue-700">{t.speaking}</span>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}