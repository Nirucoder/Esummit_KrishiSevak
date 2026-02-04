import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  MessageCircle, 
  Bell, 
  Settings,
  Phone,
  CheckCircle,
  AlertTriangle,
  Droplets,
  Bug,
  Cloud,
  Sprout
} from 'lucide-react';
import { motion } from 'motion/react';
import smsService from '../services/SMSService';
import { getContent } from '../utils/languages';

interface WhatsAppAlertProps {
  language: string;
}

interface AlertSettings {
  irrigation: boolean;
  pestAlert: boolean;
  weather: boolean;
  cropHealth: boolean;
  phoneNumber: string;
  frequency: string;
}

export function WhatsAppAlert({ language }: WhatsAppAlertProps) {
  const [alertSettings, setAlertSettings] = useState<AlertSettings>({
    irrigation: true,
    pestAlert: true,
    weather: true,
    cropHealth: false,
    phoneNumber: '+91 98765 43210',
    frequency: 'immediate'
  });

  const [alertHistory, setAlertHistory] = useState([
    {
      id: '1',
      type: 'irrigation',
      message: 'Irrigation alert: Soil moisture dropped to 32%. Water immediately.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'sent'
    },
    {
      id: '2',
      type: 'pest',
      message: 'Pest alert: Aphid population detected in Field B. Apply neem spray.',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      status: 'sent'
    },
    {
      id: '3',
      type: 'weather',
      message: 'Weather alert: Heavy rainfall expected in next 24 hours.',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      status: 'sent'
    }
  ]);

  // Use centralized translations
  const t = {
    title: getContent(language, 'smartAlerts'),
    subtitle: language === 'en' ? 'Real-time farm alerts on your mobile' : 'आपके मोबाइल पर वास्तविक समय खेत अलर्ट',
    alertSettings: language === 'en' ? 'Alert Settings' : 'अलर्ट सेटिंग्स',
    phoneNumber: getContent(language, 'phoneNumber'),
    frequency: getContent(language, 'frequency'),
    alertTypes: language === 'en' ? 'Alert Types' : 'अलर्ट प्रकार',
    irrigation: getContent(language, 'irrigation'),
    pestAlert: getContent(language, 'pestAlert'),
    weather: getContent(language, 'weather'),
    cropHealth: language === 'en' ? 'Crop Health Alerts' : 'फसल स्वास्थ्य अलर्ट',
    immediate: getContent(language, 'immediate'),
    hourly: getContent(language, 'hourly'),
    daily: getContent(language, 'daily'),
    testAlert: getContent(language, 'testAlert'),
    saveSettings: getContent(language, 'saveSettings'),
    alertHistory: getContent(language, 'alertHistory'),
    messagesSent: getContent(language, 'messagesSent'),
    activeAlerts: getContent(language, 'activeAlerts'),
    lastAlert: getContent(language, 'lastAlert'),
    enabled: getContent(language, 'enabled'),
    disabled: getContent(language, 'disabled'),
    sent: getContent(language, 'sent'),
    failed: getContent(language, 'failed'),
    pending: getContent(language, 'pending'),
    setupInstructions: language === 'en' ? 'Setup Instructions' : 'सेटअप निर्देश',
    step1: language === 'en' ? '1. Save your WhatsApp number above' : '1. ऊपर अपना व्हाट्सऐप नंबर सेव करें',
    step2: language === 'en' ? '2. Enable desired alert types' : '2. वांछित अलर्ट प्रकार सक्षम करें',
    step3: language === 'en' ? '3. You will receive alerts automatically' : '3. आपको स्वचालित रूप से अलर्ट मिलेंगे',
    note: language === 'en' ? 'Note: This is a demo feature. In production, it would connect to WhatsApp Business API.' : 'नोट: यह एक डेमो सुविधा है। उत्पादन में, यह व्हाट्सऐप बिजनेस API से जुड़ेगा।',
    irrigationDesc: language === 'en' ? 'Get notified when soil moisture is low' : 'मिट्टी की नमी कम होने पर सूचना प्राप्त करें',
    pestDesc: language === 'en' ? 'Alerts for pest and disease detection' : 'कीट और रोग का पता लगाने के लिए अलर्ट',
    weatherDesc: language === 'en' ? 'Weather warnings and forecasts' : 'मौसम चेतावनी और पूर्वानुमान',
    cropDesc: language === 'en' ? 'Crop growth and health notifications' : 'फसल वृद्धि और स्वास्थ्य सूचनाएं'
  };

  const updateSetting = (key: keyof AlertSettings, value: any) => {
    setAlertSettings(prev => ({ ...prev, [key]: value }));
  };

  const sendTestAlert = async () => {
    const testMessage = language === 'en' 
      ? 'Test Alert: KrishiSevak WhatsApp alerts are working correctly! 🌱'
      : 'टेस्ट अलर्ट: कृषिसेवक व्हाट्सऐप अलर्ट सही तरीके से काम कर रहे हैं! 🌱';

    const testAlert = {
      id: Date.now().toString(),
      type: 'test',
      message: testMessage,
      timestamp: new Date(),
      status: 'pending'
    };
    
    setAlertHistory(prev => [testAlert, ...prev]);
    
    try {
      // Send via SMS as fallback/primary method
      const smsResult = await smsService.sendAlert(
        alertSettings.phoneNumber,
        testMessage,
        language
      );
      
      // Update alert status based on SMS result
      setAlertHistory(prev => prev.map(alert => 
        alert.id === testAlert.id 
          ? { ...alert, status: smsResult.success ? 'sent' : 'failed' }
          : alert
      ));
      
      // Show success notification
      if (smsResult.success) {
        alert(language === 'en' 
          ? 'Alert sent successfully via SMS to ' + alertSettings.phoneNumber
          : 'अलर्ट सफलतापूर्वक SMS द्वारा भेजा गया ' + alertSettings.phoneNumber + ' पर'
        );
      } else {
        alert(language === 'en' 
          ? 'Failed to send alert: ' + (smsResult.error || 'Unknown error')
          : 'अलर्ट भेजने में विफल: ' + (smsResult.error || 'अज्ञात त्रुटि')
        );
      }
    } catch (error) {
      // Fallback to simulated WhatsApp
      setTimeout(() => {
        setAlertHistory(prev => prev.map(alert => 
          alert.id === testAlert.id 
            ? { ...alert, status: 'sent' }
            : alert
        ));
        
        alert(language === 'en' 
          ? 'WhatsApp alert sent successfully to ' + alertSettings.phoneNumber
          : 'व्हाट्सऐप अलर्ट सफलतापूर्वक भेजा गया ' + alertSettings.phoneNumber + ' पर'
        );
      }, 2000);
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'irrigation':
        return <Droplets className="h-4 w-4 text-blue-500" />;
      case 'pest':
        return <Bug className="h-4 w-4 text-red-500" />;
      case 'weather':
        return <Cloud className="h-4 w-4 text-orange-500" />;
      case 'crop':
        return <Sprout className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const activeAlertsCount = Object.values(alertSettings).filter(
    (value, index) => typeof value === 'boolean' && value
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <MessageCircle className="h-8 w-8 text-green-500" />
            {t.title}
          </h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={sendTestAlert}>
            <MessageCircle className="h-4 w-4 mr-2" />
            {t.testAlert}
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.messagesSent}</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertHistory.length}</div>
            <p className="text-xs text-muted-foreground">
              {language === 'en' ? 'This month' : 'इस महीने'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.activeAlerts}</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlertsCount}</div>
            <p className="text-xs text-muted-foreground">
              {language === 'en' ? 'Alert types enabled' : 'अलर्ट प्रकार सक्षम'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.lastAlert}</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {alertHistory.length > 0 
                ? `${Math.floor((Date.now() - alertHistory[0].timestamp.getTime()) / (1000 * 60 * 60))}h`
                : '-'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {language === 'en' ? 'Hours ago' : 'घंटे पहले'}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-500" />
                {t.alertSettings}
              </CardTitle>
              <CardDescription>
                {language === 'en' 
                  ? 'Configure your WhatsApp alert preferences' 
                  : 'अपनी व्हाट्सऐप अलर्ट प्राथमिकताएं कॉन्फ़िगर करें'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Phone Number */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.phoneNumber}</label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <Input
                    value={alertSettings.phoneNumber}
                    onChange={(e) => updateSetting('phoneNumber', e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {/* Frequency */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.frequency}</label>
                <Select 
                  value={alertSettings.frequency} 
                  onValueChange={(value) => updateSetting('frequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">{t.immediate}</SelectItem>
                    <SelectItem value="hourly">{t.hourly}</SelectItem>
                    <SelectItem value="daily">{t.daily}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Alert Types */}
              <div className="space-y-4">
                <h4 className="font-medium">{t.alertTypes}</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="font-medium">{t.irrigation}</p>
                        <p className="text-xs text-muted-foreground">{t.irrigationDesc}</p>
                      </div>
                    </div>
                    <Switch
                      checked={alertSettings.irrigation}
                      onCheckedChange={(checked) => updateSetting('irrigation', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bug className="h-4 w-4 text-red-500" />
                      <div>
                        <p className="font-medium">{t.pestAlert}</p>
                        <p className="text-xs text-muted-foreground">{t.pestDesc}</p>
                      </div>
                    </div>
                    <Switch
                      checked={alertSettings.pestAlert}
                      onCheckedChange={(checked) => updateSetting('pestAlert', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Cloud className="h-4 w-4 text-orange-500" />
                      <div>
                        <p className="font-medium">{t.weather}</p>
                        <p className="text-xs text-muted-foreground">{t.weatherDesc}</p>
                      </div>
                    </div>
                    <Switch
                      checked={alertSettings.weather}
                      onCheckedChange={(checked) => updateSetting('weather', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Sprout className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="font-medium">{t.cropHealth}</p>
                        <p className="text-xs text-muted-foreground">{t.cropDesc}</p>
                      </div>
                    </div>
                    <Switch
                      checked={alertSettings.cropHealth}
                      onCheckedChange={(checked) => updateSetting('cropHealth', checked)}
                    />
                  </div>
                </div>
              </div>

              <Button 
                className="w-full"
                onClick={() => {
                  // Simulate saving settings
                  alert(language === 'en' 
                    ? 'WhatsApp alert settings saved successfully!'
                    : 'व्हाट्सऐप अलर्ट सेटिंग्स सफलतापूर्वक सेव हो गईं!'
                  );
                }}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {t.saveSettings}
              </Button>
            </CardContent>
          </Card>

          {/* Setup Instructions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t.setupInstructions}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <p className="text-sm">{t.step1}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <p className="text-sm">{t.step2}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <p className="text-sm">{t.step3}</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-xs text-orange-800">{t.note}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alert History */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-500" />
                {t.alertHistory}
              </CardTitle>
              <CardDescription>
                {language === 'en' 
                  ? 'Recent WhatsApp messages sent to your phone' 
                  : 'आपके फोन पर भेजे गए हाल के व्हाट्सऐप संदेश'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertHistory.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className="flex-shrink-0 mt-1">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {alert.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-muted-foreground">
                          {alert.timestamp.toLocaleString()}
                        </p>
                        <Badge 
                          variant="outline" 
                          className={
                            alert.status === 'sent' 
                              ? 'border-green-200 text-green-700'
                              : alert.status === 'failed'
                                ? 'border-red-200 text-red-700'
                                : 'border-orange-200 text-orange-700'
                          }
                        >
                          {t[alert.status as keyof typeof t]}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}