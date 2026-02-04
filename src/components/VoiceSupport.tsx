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
  Languages,
  X,
  AlertCircle
} from 'lucide-react';

// Browser Speech Recognition Types
interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
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
  const [startError, setStartError] = useState('');
  const [transcript, setTranscript] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [inputText, setInputText] = useState('');
  const [isSupported, setIsSupported] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis>(window.speechSynthesis);

  // Initialize Speech Recognition on mount
  useEffect(() => {
    if (isEnabled) {
      const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;
      const SpeechRecognitionConstructor = SpeechRecognition || webkitSpeechRecognition;

      if (SpeechRecognitionConstructor) {
        console.log('VoiceSupport: Initializing for', language);
        const recognition = new SpeechRecognitionConstructor();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = language.startsWith('hi') ? 'hi-IN' : 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setStartError('');
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onresult = (event: any) => {
          const last = event.results.length - 1;
          const text = event.results[last][0].transcript;
          console.log('Voice recognized:', text);
          setTranscript(text);
          if (onVoiceCommand) {
            onVoiceCommand(text);
          }
          processVoiceCommand(text);
        };

        recognition.onerror = (event: any) => {
          console.error("Speech Recognition Error", event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            setStartError('Microphone permission denied');
          } else if (event.error === 'no-speech') {
            setStartError('No speech detected');
          } else if (event.error === 'network') {
            setStartError(language.startsWith('hi') ? 'इंटरनेट कनेक्शन जांचें' : 'Internet required for voice');
          } else {
            setStartError('Error: ' + event.error);
          }
        };

        recognitionRef.current = recognition;
        setIsSupported(true);
      } else {
        setIsSupported(false);
        setStartError('Browser not supported');
      }
    }
  }, [isEnabled, language, onVoiceCommand]);

  // Handle language changes dynamically
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language.startsWith('hi') ? 'hi-IN' : 'en-US';
    }
  }, [language]);

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
      title: 'Voice Assistant',
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
      notSupported: 'Browser not supported',
      lastCommand: 'Last Command',
      retry: 'Retry',
      error: 'Error'
    },
    hi: {
      title: 'आवाज सहायक',
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
      notSupported: 'ब्राउज़र समर्थित नहीं',
      lastCommand: 'अंतिम कमांड',
      retry: 'पुनः प्रयास',
      error: 'त्रुटि'
    }
  };

  const t = content[language.startsWith('hi') ? 'hi' : 'en'];

  const processVoiceCommand = (command: string) => {
    console.log('Processing Command:', command);
    const lowerCommand = command.toLowerCase();
    const isHindi = language.startsWith('hi');

    if (lowerCommand.includes('dashboard') || lowerCommand.includes('home')) {
      speak(isHindi ? 'डैशबोर्ड पर जा रहे हैं' : 'Navigating to dashboard');
    } else if (lowerCommand.includes('crop') || lowerCommand.includes('फसल')) {
      speak(isHindi ? 'फसल निगरानी पर जा रहे हैं' : 'Opening crop monitoring');
    } else if (lowerCommand.includes('soil') || lowerCommand.includes('मिट्टी')) {
      speak(isHindi ? 'मिट्टी स्वास्थ्य विश्लेषण पर जा रहे हैं' : 'Opening soil health analysis');
    } else if (lowerCommand.includes('weather') || lowerCommand.includes('मौसम')) {
      speak(isHindi ? 'मौसम की जानकारी प्रदान कर रहे हैं' : 'Providing weather information');
    } else if (lowerCommand.includes('recommendation') || lowerCommand.includes('सुझाव')) {
      speak(isHindi ? 'सिफारिशें दिखा रहे हैं' : 'Showing recommendations');
    } else {
      speak(isHindi ? 'समझ नहीं आया, कृपया फिर से कोशिश करें' : 'Command not understood, please try again');
    }
  };

  const speak = (text: string) => {
    if (!voiceEnabled || !synthesisRef.current) return;

    synthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language.startsWith('hi') ? 'hi-IN' : 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    const voices = synthesisRef.current.getVoices();
    const preferredVoice = voices.find(v =>
      v.lang.includes(utterance.lang) && (v.name.includes('Google') || v.name.includes('Neural'))
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    synthesisRef.current.speak(utterance);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setStartError('');
      } catch (e) {
        console.error("Start error", e);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const toggleVoice = () => {
    if (voiceEnabled) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
    setVoiceEnabled(!voiceEnabled);
  };

  if (!isEnabled) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 shadow-xl border-t-4 border-t-green-600">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className={`h-5 w-5 ${isListening ? 'text-green-500 animate-pulse' : 'text-gray-400'}`} />
              {t.title}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isListening ? "default" : "outline"}>
                {isListening ? t.listening : (startError ? t.error : t.notListening)}
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

          {!isSupported && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span>{t.notSupported}. Try Chrome/Edge.</span>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button
              variant={isListening ? "destructive" : "default"}
              onClick={isListening ? stopListening : startListening}
              className="flex-1 min-w-[120px]"
              disabled={!isSupported}
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

          {startError && (
            <div className="text-xs text-red-500 bg-red-50 p-2 rounded border border-red-200">
              {startError}
            </div>
          )}

          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
              placeholder={language.startsWith('hi') ? "कमांड टाइप करें..." : "Type a command..."}
              className="flex-1 text-sm border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Button size="sm" onClick={handleManualSubmit} disabled={!inputText.trim()}>
              <PlayCircle className="h-4 w-4" />
            </Button>
          </div>

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