import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square, 
  Send, 
  Star, 
  MessageSquare, 
  HeadphonesIcon,
  Download,
  Upload,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  VolumeX,
  FileAudio,
  Camera,
  Image as ImageIcon,
  CheckCircle,
  Clock,
  AlertTriangle,
  Smartphone,
  WifiOff
} from 'lucide-react';
import { getContent } from '../utils/languages';

interface FarmerFeedbackProps {
  language: string;
}

interface Feedback {
  id: string;
  farmer: string;
  location: string;
  category: string;
  rating: number;
  message: string;
  audioUrl?: string;
  imageUrl?: string;
  timestamp: Date;
  status: 'pending' | 'reviewed' | 'resolved';
  response?: string;
  isVoiceMessage: boolean;
}

interface VoiceRecording {
  isRecording: boolean;
  duration: number;
  audioBlob?: Blob;
  audioUrl?: string;
}

export function FarmerFeedback({ language }: FarmerFeedbackProps) {
  const [activeTab, setActiveTab] = useState('submit');
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState(0);
  const [farmerName, setFarmerName] = useState('');
  const [location, setLocation] = useState('');
  const [isOffline, setIsOffline] = useState(false);
  
  // Voice recording state
  const [voiceRecording, setVoiceRecording] = useState<VoiceRecording>({
    isRecording: false,
    duration: 0
  });
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Mock feedback data
  const [feedbackList] = useState<Feedback[]>([
    {
      id: '1',
      farmer: 'राजेश कुमार',
      location: 'हरियाणा',
      category: 'App Usage',
      rating: 5,
      message: 'यह ऐप बहुत अच्छा है। मुझे अपनी फसल की जानकारी आसानी से मिल जाती है।',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'reviewed',
      response: 'धन्यवाद! आपका फीडबैक हमारे लिए बहुत महत्वपूर्ण है।',
      isVoiceMessage: false
    },
    {
      id: '2',
      farmer: 'सुमित्रा देवी',
      location: 'उत्तर प्रदेश',
      category: 'Feature Request',
      rating: 4,
      message: 'कृपया हिंदी में अधिक सुविधाएं जोड़ें',
      audioUrl: '/demo-audio.mp3',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      status: 'pending',
      isVoiceMessage: true
    },
    {
      id: '3',
      farmer: 'विकास पटेल',
      location: 'गुजरात',
      category: 'Bug Report',
      rating: 3,
      message: 'मौसम की जानकारी कभी-कभी गलत दिखाई देती है',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      status: 'resolved',
      response: 'इस समस्या को ठीक कर दिया गया है। नया अपडेट डाउनलोड करें।',
      isVoiceMessage: false
    }
  ]);

  // Categories for feedback
  const categories = {
    en: [
      { value: 'app-usage', label: 'App Usage' },
      { value: 'feature-request', label: 'Feature Request' },
      { value: 'bug-report', label: 'Bug Report' },
      { value: 'content-feedback', label: 'Content Feedback' },
      { value: 'general', label: 'General Feedback' }
    ],
    hi: [
      { value: 'app-usage', label: 'ऐप का उपयोग' },
      { value: 'feature-request', label: 'नई सुविधा का अनुरोध' },
      { value: 'bug-report', label: 'तकनीकी समस्या' },
      { value: 'content-feedback', label: 'सामग्री पर फीडबैक' },
      { value: 'general', label: 'सामान्य फीडबैक' }
    ]
  };

  // Simulate offline mode
  useEffect(() => {
    const interval = setInterval(() => {
      setIsOffline(Math.random() < 0.1); // 10% chance of being offline
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Voice recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks(prev => [...prev, event.data]);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setVoiceRecording(prev => ({
          ...prev,
          audioBlob,
          audioUrl,
          isRecording: false
        }));
        setAudioChunks([]);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setVoiceRecording(prev => ({ ...prev, isRecording: true, duration: 0 }));

      // Start timer
      timerRef.current = setInterval(() => {
        setVoiceRecording(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Microphone access is required for voice feedback');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const playAudio = (audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
    }
  };

  const submitFeedback = () => {
    if (!farmerName || !location || (!feedback && !voiceRecording.audioUrl) || !category) {
      alert('Please fill all required fields');
      return;
    }

    const newFeedback = {
      id: Date.now().toString(),
      farmer: farmerName,
      location: location,
      category: category,
      rating: rating,
      message: feedback,
      audioUrl: voiceRecording.audioUrl,
      timestamp: new Date(),
      status: 'pending' as const,
      isVoiceMessage: !!voiceRecording.audioUrl
    };

    console.log('Submitting feedback:', newFeedback);
    
    // Reset form
    setFeedback('');
    setCategory('');
    setRating(0);
    setFarmerName('');
    setLocation('');
    setVoiceRecording({ isRecording: false, duration: 0 });
    
    alert(language === 'hi' ? 'फीडबैक सफलतापूर्वक भेजा गया!' : 'Feedback submitted successfully!');
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const content = {
    en: {
      title: 'Farmer Feedback',
      subtitle: 'Share your experience and help us improve KrishiSevak',
      submit: 'Submit Feedback',
      history: 'Feedback History',
      voice: 'Voice Feedback',
      name: 'Your Name',
      location: 'Location',
      category: 'Category',
      rating: 'Rating',
      message: 'Your Message',
      voiceMessage: 'Voice Message',
      record: 'Record',
      stop: 'Stop',
      play: 'Play',
      submit: 'Submit',
      recording: 'Recording...',
      offlineNotice: 'Feedback will be sent when online',
      required: 'Required fields',
      selectCategory: 'Select category',
      yourExperience: 'Tell us about your experience',
      voiceInstructions: 'Click record to leave a voice message',
      recentFeedback: 'Recent Feedback',
      status: 'Status',
      response: 'Response'
    },
    hi: {
      title: 'किसान फीडबैक',
      subtitle: 'अपना अनुभव साझा करें और KrishiSevak को बेहतर बनाने में मदद करें',
      submit: 'फीडबैक भेजें',
      history: 'फीडबैक इतिहास',
      voice: 'आवाज़ फीडबैक',
      name: 'आपका नाम',
      location: 'स्थान',
      category: 'श्रेणी',
      rating: 'रेटिंग',
      message: 'आपका संदेश',
      voiceMessage: 'आवाज़ संदेश',
      record: 'रिकॉर्ड करें',
      stop: 'रोकें',
      play: 'चलाएं',
      submit: 'भेजें',
      recording: 'रिकॉर्डिंग...',
      offlineNotice: 'ऑनलाइन होने पर फीडबैक भेजा जाएगा',
      required: 'आवश्यक फील्ड',
      selectCategory: 'श्रेणी चुनें',
      yourExperience: 'हमें अपने अनुभव के बारे में बताएं',
      voiceInstructions: 'आवाज़ संदेश छोड़ने के लिए रिकॉर्ड पर क्लिक करें',
      recentFeedback: 'हाल का फीडबैक',
      status: 'स्थिति',
      response: 'जवाब'
    }
  };

  const t = content[language as keyof typeof content] || content.en;
  const categoryList = categories[language as keyof typeof categories] || categories.en;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-primary">{t.title}</h1>
          <p className="text-muted-foreground mt-2">{t.subtitle}</p>
        </div>
        {isOffline && (
          <Badge variant="destructive" className="flex items-center gap-2">
            <WifiOff className="h-4 w-4" />
            Offline
          </Badge>
        )}
      </div>

      {/* Offline Notice */}
      {isOffline && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <WifiOff className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">{t.offlineNotice}</p>
                <p className="text-sm text-yellow-700">
                  Your feedback is being stored locally and will be submitted when connection is restored.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="submit" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            {t.submit}
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            {t.voice}
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            {t.history}
          </TabsTrigger>
        </TabsList>

        {/* Submit Feedback */}
        <TabsContent value="submit" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t.submit}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">{t.name} *</label>
                      <Input
                        placeholder={language === 'hi' ? 'आपका नाम' : 'Your name'}
                        value={farmerName}
                        onChange={(e) => setFarmerName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">{t.location} *</label>
                      <Input
                        placeholder={language === 'hi' ? 'गांव, जिला, राज्य' : 'Village, District, State'}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">{t.category} *</label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder={t.selectCategory} />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryList.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">{t.rating}</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Button
                          key={star}
                          variant="ghost"
                          size="sm"
                          onClick={() => setRating(star)}
                          className="p-1 h-auto"
                        >
                          <Star 
                            className={`h-6 w-6 ${
                              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`} 
                          />
                        </Button>
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">
                        {rating > 0 && `${rating}/5`}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">{t.message}</label>
                    <Textarea
                      placeholder={t.yourExperience}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <Button 
                    onClick={submitFeedback} 
                    disabled={isOffline}
                    className="w-full"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {t.submit}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Instructions */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      📝 Be specific about your experience
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      🎤 Use voice feedback for detailed explanations
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      📱 Works offline - feedback syncs when online
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Voice Feedback */}
        <TabsContent value="voice" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                {t.voiceMessage}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">{t.voiceInstructions}</p>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder={t.name}
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                />
                <Input
                  placeholder={t.location}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectCategory} />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryList.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Voice Recording Interface */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {!voiceRecording.isRecording && !voiceRecording.audioUrl && (
                  <div className="space-y-4">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <Mic className="h-10 w-10 text-green-600" />
                    </div>
                    <p className="text-lg font-medium">Ready to Record</p>
                    <p className="text-sm text-muted-foreground">
                      Click the button below to start recording your voice feedback
                    </p>
                    <Button onClick={startRecording} size="lg" className="bg-red-500 hover:bg-red-600">
                      <Mic className="h-5 w-5 mr-2" />
                      {t.record}
                    </Button>
                  </div>
                )}

                {voiceRecording.isRecording && (
                  <div className="space-y-4">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                      <Mic className="h-10 w-10 text-red-600" />
                    </div>
                    <p className="text-lg font-medium text-red-600">{t.recording}</p>
                    <p className="text-2xl font-mono">{formatDuration(voiceRecording.duration)}</p>
                    <Button onClick={stopRecording} size="lg" variant="outline">
                      <Square className="h-5 w-5 mr-2" />
                      {t.stop}
                    </Button>
                  </div>
                )}

                {voiceRecording.audioUrl && (
                  <div className="space-y-4">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <FileAudio className="h-10 w-10 text-blue-600" />
                    </div>
                    <p className="text-lg font-medium">Recording Complete</p>
                    <p className="text-sm text-muted-foreground">
                      Duration: {formatDuration(voiceRecording.duration)}
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button 
                        onClick={() => playAudio(voiceRecording.audioUrl!)} 
                        variant="outline"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {t.play}
                      </Button>
                      <Button onClick={startRecording} variant="outline">
                        <Mic className="h-4 w-4 mr-2" />
                        Re-record
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Rating */}
              <div>
                <label className="text-sm font-medium mb-2 block">{t.rating}</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      variant="ghost"
                      size="sm"
                      onClick={() => setRating(star)}
                      className="p-1 h-auto"
                    >
                      <Star 
                        className={`h-6 w-6 ${
                          star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`} 
                      />
                    </Button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={submitFeedback} 
                disabled={!voiceRecording.audioUrl || isOffline}
                className="w-full"
                size="lg"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Voice Feedback
              </Button>
            </CardContent>
          </Card>

          <audio ref={audioRef} className="hidden" />
        </TabsContent>

        {/* Feedback History */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.recentFeedback}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {feedbackList.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{item.farmer}</p>
                          <p className="text-sm text-muted-foreground">{item.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{item.category}</Badge>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        {item.isVoiceMessage && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Mic className="h-3 w-3" />
                            Voice
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            className={`h-4 w-4 ${
                              star <= item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`} 
                          />
                        ))}
                        <span className="text-sm text-muted-foreground ml-2">
                          {item.rating}/5
                        </span>
                      </div>

                      {item.isVoiceMessage && item.audioUrl ? (
                        <div className="bg-gray-50 rounded-lg p-3 mb-2">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => playAudio(item.audioUrl!)}
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Play Voice Message
                            </Button>
                            <FileAudio className="h-4 w-4 text-gray-500" />
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-700 mb-2">{item.message}</p>
                      )}

                      {item.response && (
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mt-2">
                          <p className="text-sm font-medium text-blue-800 mb-1">{t.response}:</p>
                          <p className="text-sm text-blue-700">{item.response}</p>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {item.timestamp.toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}