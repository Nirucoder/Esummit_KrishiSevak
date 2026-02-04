import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Bell, 
  AlertTriangle, 
  Droplets, 
  Bug, 
  Cloud, 
  Thermometer,
  CheckCircle,
  Clock,
  X,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AlertNotification {
  id: string;
  type: 'irrigation' | 'pest' | 'weather' | 'disease' | 'fertilizer' | 'harvest';
  priority: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  action?: string;
  timestamp: Date;
  read: boolean;
  dismissed: boolean;
}

interface AlertNotificationSystemProps {
  language: string;
  farmData?: any;
}

export function AlertNotificationSystem({ language, farmData }: AlertNotificationSystemProps) {
  const [notifications, setNotifications] = useState<AlertNotification[]>([]);
  const [showAll, setShowAll] = useState(false);

  const content = {
    en: {
      title: 'Active Alerts',
      noAlerts: 'No active alerts',
      markAllRead: 'Mark All Read',
      viewAll: 'View All',
      showLess: 'Show Less',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      dismiss: 'Dismiss',
      urgent: 'Urgent Action Required',
      hoursAgo: 'hours ago',
      minutesAgo: 'minutes ago',
      justNow: 'just now'
    },
    hi: {
      title: 'सक्रिय अलर्ट',
      noAlerts: 'कोई सक्रिय अलर्ट नहीं',
      markAllRead: 'सभी को पढ़ा हुआ चिह्नित करें',
      viewAll: 'सभी देखें',
      showLess: 'कम दिखाएं',
      high: 'उच्च',
      medium: 'मध्यम',
      low: 'कम',
      dismiss: 'खारिज करें',
      urgent: 'तत्काल कार्रवाई आवश्यक',
      hoursAgo: 'घंटे पहले',
      minutesAgo: 'मिनट पहले',
      justNow: 'अभी अभी'
    }
  };

  const t = content[language as keyof typeof content] || content.en;

  // Generate real-time alerts based on farm data
  useEffect(() => {
    const generateAlerts = () => {
      const newAlerts: AlertNotification[] = [];
      
      // Irrigation alert based on soil moisture
      if (farmData?.soilMoisture < 35) {
        newAlerts.push({
          id: 'irrigation-1',
          type: 'irrigation',
          priority: 'high',
          title: language === 'en' ? 'Low Soil Moisture' : 'मिट्टी की नमी कम',
          message: language === 'en' 
            ? `Soil moisture is at ${farmData.soilMoisture}%. Immediate irrigation needed.`
            : `मिट्टी की नमी ${farmData.soilMoisture}% है। तत्काल सिंचाई की आवश्यकता।`,
          action: language === 'en' 
            ? 'Apply 15-20 L/m² water today'
            : 'आज 15-20 लीटर/वर्गमीटर पानी दें',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          read: false,
          dismissed: false
        });
      }

      // Weather alert
      newAlerts.push({
        id: 'weather-1',
        type: 'weather',
        priority: 'medium',
        title: language === 'en' ? 'Heavy Rain Expected' : 'भारी बारिश की उम्मीद',
        message: language === 'en' 
          ? 'Forecast shows 40mm rainfall in next 24 hours. Prepare drainage.'
          : 'पूर्वानुमान अगले 24 घंटों में 40 मिमी बारिश दिखाता है। जल निकासी की तैयारी करें।',
        action: language === 'en' 
          ? 'Check field drainage systems'
          : 'खेत की जल निकासी प्रणाली जांचें',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
        dismissed: false
      });

      // Pest alert
      if (farmData?.pestRisk === 'high') {
        newAlerts.push({
          id: 'pest-1',
          type: 'pest',
          priority: 'high',
          title: language === 'en' ? 'Pest Detection Alert' : 'कीट का पता लगाने की चेतावनी',
          message: language === 'en' 
            ? 'High aphid population detected in Field B using AI analysis.'
            : 'AI विश्लेषण का उपयोग करके फील्ड B में एफिड की अधिक जनसंख्या का पता चला।',
          action: language === 'en' 
            ? 'Apply neem oil spray within 48 hours'
            : '48 घंटों के भीतर नीम का तेल स्प्रे करें',
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          read: false,
          dismissed: false
        });
      }

      // Fertilizer alert based on NDVI
      if (farmData?.ndvi < 0.7) {
        newAlerts.push({
          id: 'fertilizer-1',
          type: 'fertilizer',
          priority: 'medium',
          title: language === 'en' ? 'Nutrient Deficiency' : 'पोषक तत्वों की कमी',
          message: language === 'en' 
            ? `NDVI value is ${farmData.ndvi.toFixed(2)}, indicating possible nitrogen deficiency.`
            : `NDVI मान ${farmData.ndvi.toFixed(2)} है, जो संभावित नाइट्रोजन की कमी का संकेत देता है।`,
          action: language === 'en' 
            ? 'Apply 25 kg/hectare nitrogen fertilizer'
            : '25 किग्रा/हेक्टेयर नाइट्रोजन उर्वरक लगाएं',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          read: false,
          dismissed: false
        });
      }

      setNotifications(newAlerts);
    };

    generateAlerts();
  }, [farmData, language]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'irrigation':
        return <Droplets className="h-4 w-4 text-blue-500" />;
      case 'pest':
        return <Bug className="h-4 w-4 text-red-500" />;
      case 'weather':
        return <Cloud className="h-4 w-4 text-orange-500" />;
      case 'disease':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'fertilizer':
        return <Thermometer className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 text-red-700 bg-red-50';
      case 'medium':
        return 'border-orange-200 text-orange-700 bg-orange-50';
      case 'low':
        return 'border-green-200 text-green-700 bg-green-50';
      default:
        return 'border-gray-200 text-gray-700 bg-gray-50';
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return t.justNow;
    if (diffInMinutes < 60) return `${diffInMinutes} ${t.minutesAgo}`;
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} ${t.hoursAgo}`;
  };

  const dismissAlert = (id: string) => {
    setNotifications(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, dismissed: true } : alert
      )
    );
  };

  const markAllRead = () => {
    setNotifications(prev => 
      prev.map(alert => ({ ...alert, read: true }))
    );
  };

  const activeAlerts = notifications.filter(alert => !alert.dismissed);
  const urgentAlerts = activeAlerts.filter(alert => alert.priority === 'high');
  const displayedAlerts = showAll ? activeAlerts : activeAlerts.slice(0, 3);

  if (activeAlerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-muted-foreground">{t.noAlerts}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex-shrink-0">
              {urgentAlerts.length > 0 ? (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              ) : (
                <Bell className="h-5 w-5 text-blue-500" />
              )}
            </div>
            <CardTitle className="break-words">{t.title}</CardTitle>
            {urgentAlerts.length > 0 && (
              <Badge className="border-red-200 text-red-700 bg-red-50 flex-shrink-0 text-xs">
                {urgentAlerts.length}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={markAllRead}
              className="text-xs"
            >
              {t.markAllRead}
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <AnimatePresence>
            {displayedAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Alert className={`${alert.priority === 'high' ? 'border-red-200 bg-red-50/30' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="flex items-start gap-2 mb-1 flex-wrap">
                          <h4 className="font-medium text-sm break-words">{alert.title}</h4>
                          <Badge variant="outline" className={`${getPriorityColor(alert.priority)} flex-shrink-0`}>
                            {t[alert.priority as keyof typeof t]}
                          </Badge>
                          {!alert.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <AlertDescription className="text-sm mb-2 break-words leading-relaxed">
                          {alert.message}
                        </AlertDescription>
                        {alert.action && (
                          <div className="bg-blue-50 border border-blue-200 rounded-md p-2 mb-2">
                            <p className="text-xs font-medium text-blue-800 mb-1">
                              {language === 'en' ? 'Recommended Action:' : 'अनुशंसित कार्रवाई:'}
                            </p>
                            <p className="text-xs text-blue-700 break-words leading-relaxed">{alert.action}</p>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">
                            {getTimeAgo(alert.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissAlert(alert.id)}
                      className="h-8 w-8 p-0 flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </Alert>
              </motion.div>
            ))}
          </AnimatePresence>

          {activeAlerts.length > 3 && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setShowAll(!showAll)}
                className="text-sm"
              >
                {showAll ? t.showLess : `${t.viewAll} (${activeAlerts.length - 3} more)`}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}