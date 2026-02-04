import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Users, 
  MessageSquare, 
  Phone, 
  Send, 
  Signal, 
  SignalLow, 
  SignalMedium,
  SignalHigh,
  Smartphone,
  MessageCircle,
  Globe,
  Wifi,
  WifiOff,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { getContent } from '../utils/languages';

interface CommunityConnectProps {
  language: string;
}

interface CommunityMessage {
  id: string;
  farmer: string;
  location: string;
  message: string;
  type: 'question' | 'tip' | 'alert' | 'help';
  timestamp: Date;
  responses: number;
  status: 'pending' | 'answered' | 'resolved';
}

interface SMSMessage {
  id: string;
  phoneNumber: string;
  message: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'failed';
  type: 'outgoing' | 'incoming';
}

export function CommunityConnect({ language }: CommunityConnectProps) {
  const [activeTab, setActiveTab] = useState('community');
  const [newMessage, setNewMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [smsMessage, setSmsMessage] = useState('');
  const [isOffline, setIsOffline] = useState(false);
  const [networkStrength, setNetworkStrength] = useState<'low' | 'medium' | 'high'>('medium');

  // Mock data for community messages
  const [communityMessages] = useState<CommunityMessage[]>([
    {
      id: '1',
      farmer: 'राम सिंह',
      location: 'पंजाब',
      message: 'मेरी गेहूं की फसल में पीले धब्बे दिख रहे हैं। क्या करूं?',
      type: 'question',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      responses: 3,
      status: 'answered'
    },
    {
      id: '2',
      farmer: 'सुनीता देवी',
      location: 'उत्तर प्रदेश',
      message: 'कम पानी में भी अच्छी फसल के लिए ड्रिप सिंचाई का उपयोग करें',
      type: 'tip',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      responses: 8,
      status: 'resolved'
    },
    {
      id: '3',
      farmer: 'मोहन पटेल',
      location: 'गुजरात',
      message: 'आज रात बारिश होने की संभावना है। फसल की सुरक्षा करें',
      type: 'alert',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      responses: 1,
      status: 'pending'
    }
  ]);

  const [smsMessages] = useState<SMSMessage[]>([
    {
      id: '1',
      phoneNumber: '+91-98765-43210',
      message: 'मौसम अपडेट: आज शाम बारिश की संभावना। फसल को ढकें।',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: 'delivered',
      type: 'outgoing'
    },
    {
      id: '2',
      phoneNumber: '+91-87654-32109',
      message: 'मदद चाहिए - धान की फसल सूख रही है',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      status: 'sent',
      type: 'incoming'
    }
  ]);

  // Simulate network connectivity
  useEffect(() => {
    const interval = setInterval(() => {
      setIsOffline(Math.random() < 0.1); // 10% chance of being offline
      const strengths: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
      setNetworkStrength(strengths[Math.floor(Math.random() * strengths.length)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getNetworkIcon = () => {
    if (isOffline) return <WifiOff className="h-4 w-4 text-red-500" />;
    
    switch (networkStrength) {
      case 'low': return <SignalLow className="h-4 w-4 text-yellow-500" />;
      case 'medium': return <SignalMedium className="h-4 w-4 text-orange-500" />;
      case 'high': return <SignalHigh className="h-4 w-4 text-green-500" />;
      default: return <Signal className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'answered': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'question': return 'bg-blue-100 text-blue-800';
      case 'tip': return 'bg-green-100 text-green-800';
      case 'alert': return 'bg-red-100 text-red-800';
      case 'help': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSendSMS = () => {
    if (!phoneNumber || !smsMessage) return;
    
    // Simulate SMS sending
    console.log('Sending SMS to:', phoneNumber, 'Message:', smsMessage);
    setSmsMessage('');
    setPhoneNumber('');
  };

  const handleCommunityPost = () => {
    if (!newMessage) return;
    
    // Simulate posting to community
    console.log('Posting to community:', newMessage);
    setNewMessage('');
  };

  const content = {
    en: {
      title: 'Community Connect',
      subtitle: 'Connect with farmers via SMS and community messages',
      community: 'Community Board',
      sms: 'SMS Service',
      offline: 'Offline Mode',
      networkStatus: 'Network Status',
      postMessage: 'Post Message',
      sendSMS: 'Send SMS',
      phoneNumber: 'Phone Number',
      message: 'Message',
      recentMessages: 'Recent Messages',
      communityTips: 'Community Tips',
      responses: 'responses',
      offlineSync: 'Messages will sync when online',
      smsInstructions: 'Send direct SMS to farmers in areas with poor internet connectivity',
      communityInstructions: 'Share knowledge and get help from fellow farmers'
    },
    hi: {
      title: 'समुदायिक संपर्क',
      subtitle: 'SMS और समुदायिक संदेशों के माध्यम से किसानों से जुड़ें',
      community: 'समुदायिक बोर्ड',
      sms: 'SMS सेवा',
      offline: 'ऑफलाइन मोड',
      networkStatus: 'नेटवर्क स्थिति',
      postMessage: 'संदेश पोस्ट करें',
      sendSMS: 'SMS भेजें',
      phoneNumber: 'फोन नंबर',
      message: 'संदेश',
      recentMessages: 'हाल के संदेश',
      communityTips: 'समुदायिक सुझाव',
      responses: 'जवाब',
      offlineSync: 'ऑनलाइन होने पर संदेश सिंक होंगे',
      smsInstructions: 'खराब इंटरनेट कनेक्टिविटी वाले क्षेत्रों में किसानों को सीधा SMS भेजें',
      communityInstructions: 'साथी किसानों से ज्ञान साझा करें और मदद लें'
    }
  };

  const t = content[language as keyof typeof content] || content.en;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-primary">{t.title}</h1>
          <p className="text-muted-foreground mt-2">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border">
            {getNetworkIcon()}
            <span className="text-sm">
              {isOffline ? 'Offline' : `${networkStrength} signal`}
            </span>
          </div>
          <Badge variant={isOffline ? 'destructive' : 'secondary'}>
            {isOffline ? t.offline : 'Online'}
          </Badge>
        </div>
      </div>

      {/* Offline Sync Notice */}
      {isOffline && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <WifiOff className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">{t.offlineSync}</p>
                <p className="text-sm text-yellow-700">
                  Messages are being stored locally and will be sent when connection is restored.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="community" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t.community}
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            {t.sms}
          </TabsTrigger>
          <TabsTrigger value="offline" className="flex items-center gap-2">
            <WifiOff className="h-4 w-4" />
            {t.offline}
          </TabsTrigger>
        </TabsList>

        {/* Community Board */}
        <TabsContent value="community" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    {t.postMessage}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{t.communityInstructions}</p>
                  <Textarea
                    placeholder={language === 'hi' ? 'अपना संदेश यहां लिखें...' : 'Write your message here...'}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={3}
                  />
                  <Button onClick={handleCommunityPost} disabled={!newMessage || isOffline}>
                    <Send className="h-4 w-4 mr-2" />
                    {t.postMessage}
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Messages */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t.recentMessages}</h3>
                {communityMessages.map((msg) => (
                  <Card key={msg.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">{msg.farmer}</p>
                            <p className="text-sm text-muted-foreground">{msg.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getTypeColor(msg.type)}>
                            {msg.type}
                          </Badge>
                          {getStatusIcon(msg.status)}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{msg.message}</p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{msg.responses} {t.responses}</span>
                        <span>{msg.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t.networkStatus}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Internet</span>
                    <div className="flex items-center gap-2">
                      {isOffline ? <WifiOff className="h-4 w-4 text-red-500" /> : <Wifi className="h-4 w-4 text-green-500" />}
                      <span className={isOffline ? 'text-red-500' : 'text-green-500'}>
                        {isOffline ? 'Offline' : 'Online'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SMS Service</span>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-green-500" />
                      <span className="text-green-500">Active</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Signal Strength</span>
                    <div className="flex items-center gap-2">
                      {getNetworkIcon()}
                      <span className="capitalize">{networkStrength}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t.communityTips}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      💡 Share your successful farming techniques with others
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      🤝 Help fellow farmers by answering their questions
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      📱 Use SMS for emergency alerts and updates
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* SMS Service */}
        <TabsContent value="sms" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  {t.sendSMS}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{t.smsInstructions}</p>
                <div className="space-y-3">
                  <Input
                    placeholder={language === 'hi' ? 'फोन नंबर (+91-XXXXX-XXXXX)' : 'Phone Number (+91-XXXXX-XXXXX)'}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <Textarea
                    placeholder={language === 'hi' ? 'SMS संदेश...' : 'SMS Message...'}
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    rows={4}
                  />
                  <Button onClick={handleSendSMS} disabled={!phoneNumber || !smsMessage}>
                    <Send className="h-4 w-4 mr-2" />
                    {t.sendSMS}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent SMS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {smsMessages.map((sms) => (
                  <div key={sms.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{sms.phoneNumber}</span>
                      <Badge variant={sms.type === 'outgoing' ? 'default' : 'secondary'}>
                        {sms.type === 'outgoing' ? '↗️ Sent' : '↙️ Received'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{sms.message}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{sms.timestamp.toLocaleTimeString()}</span>
                      <span className={`capitalize ${
                        sms.status === 'delivered' ? 'text-green-600' : 
                        sms.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {sms.status}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Offline Mode */}
        <TabsContent value="offline" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <WifiOff className="h-5 w-5" />
                  Offline Capabilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>SMS service works without internet</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Messages stored locally</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Auto-sync when online</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <span>Emergency contact numbers</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span>Agricultural Helpline</span>
                    <a href="tel:1551" className="text-blue-600">1551</a>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span>Weather Updates</span>
                    <a href="tel:+91-11-24629898" className="text-blue-600">+91-11-24629898</a>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span>Crop Insurance</span>
                    <a href="tel:+91-11-23389911" className="text-blue-600">+91-11-23389911</a>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span>Emergency Services</span>
                    <a href="tel:112" className="text-red-600">112</a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}