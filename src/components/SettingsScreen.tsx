import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { LocationManager } from './LocationManager';
import { LanguageSelector } from './LanguageSelector';
import { ConfigurationStatus } from './ConfigurationStatus';
import { SMSConfiguration } from './SMSConfiguration';
import { 
  Settings, 
  User, 
  MapPin, 
  Bell, 
  Globe,
  Shield,
  Smartphone,
  Save,
  Camera,
  Edit,
  Database,
  MessageSquare
} from 'lucide-react';
import { motion } from 'motion/react';

interface SettingsScreenProps {
  language: string;
  onLanguageChange: (language: string) => void;
}

export function SettingsScreen({ language, onLanguageChange }: SettingsScreenProps) {
  const [userProfile, setUserProfile] = useState({
    name: 'Rajesh Kumar',
    email: 'rajesh.farmer@example.com',
    phone: '+91 98765 43210',
    farmName: 'Kumar Farm',
    farmSize: '5.2',
    experience: '8'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    weatherAlerts: true,
    irrigationReminders: true,
    pestAlerts: true,
    priceUpdates: false,
    governmentSchemes: true,
    whatsappAlerts: true,
    emailNotifications: false
  });

  const content = {
    en: {
      title: 'Settings',
      subtitle: 'Manage your account and preferences',
      profile: 'Profile',
      location: 'Location',
      notifications: 'Notifications',
      language: 'Language & Region',
      security: 'Security',
      personalInfo: 'Personal Information',
      farmInfo: 'Farm Information',
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      farmName: 'Farm Name',
      farmSize: 'Farm Size (Hectares)',
      experience: 'Years of Experience',
      save: 'Save Changes',
      edit: 'Edit Profile',
      changePhoto: 'Change Photo',
      notificationPreferences: 'Notification Preferences',
      weatherAlerts: 'Weather Alerts',
      irrigationReminders: 'Irrigation Reminders',
      pestAlerts: 'Pest & Disease Alerts',
      priceUpdates: 'Market Price Updates',
      governmentSchemes: 'Government Scheme Updates',
      whatsappAlerts: 'WhatsApp Notifications',
      emailNotifications: 'Email Notifications',
      languageRegion: 'Language & Region Settings',
      currentLanguage: 'Current Language',
      region: 'Region',
      securitySettings: 'Security Settings',
      changePassword: 'Change Password',
      enableTwoFactor: 'Enable Two-Factor Authentication',
      loginHistory: 'Login History',
      dataPrivacy: 'Data Privacy',
      exportData: 'Export My Data',
      deleteAccount: 'Delete Account',
      saved: 'Settings saved successfully'
    },
    hi: {
      title: 'सेटिंग्स',
      subtitle: 'अपना खाता और प्राथमिकताएं प्रबंधित करें',
      profile: 'प्रोफ़ाइल',
      location: 'स्थान',
      notifications: 'सूचनाएं',
      language: 'भाषा और क्षेत्र',
      security: 'सुरक्षा',
      personalInfo: 'व्यक्तिगत जानकारी',
      farmInfo: 'खेत की जानकारी',
      name: 'पूरा नाम',
      email: 'ईमेल पता',
      phone: 'फोन नंबर',
      farmName: 'खेत का नाम',
      farmSize: 'खेत का आकार (हेक्टेयर)',
      experience: 'अनुभव के वर्ष',
      save: 'बदलाव सेव करें',
      edit: 'प्रोफ़ाइल संपादित करें',
      changePhoto: 'फोटो बदलें',
      notificationPreferences: 'सूचना प्राथमिकताएं',
      weatherAlerts: 'मौसम अलर्ट',
      irrigationReminders: 'सिंचाई रिमाइंडर',
      pestAlerts: 'कीट और रोग अलर्ट',
      priceUpdates: 'बाजार मूल्य अपडेट',
      governmentSchemes: 'सरकारी योजना अपडेट',
      whatsappAlerts: 'व्हाट्सऐप सूचनाएं',
      emailNotifications: 'ईमेल सूचनाएं',
      languageRegion: 'भाषा और क्षेत्र सेटिंग्स',
      currentLanguage: 'वर्तमान भाषा',
      region: 'क्षेत्र',
      securitySettings: 'सुरक्षा सेटिंग्स',
      changePassword: 'पासवर्ड बदलें',
      enableTwoFactor: 'द्विकारक प्रमाणीकरण सक्षम करें',
      loginHistory: 'लॉगिन इतिहास',
      dataPrivacy: 'डेटा गोपनीयता',
      exportData: 'मेरा डेटा निर्यात करें',
      deleteAccount: 'खाता हटाएं',
      saved: 'सेटिंग्स सफलतापूर्वक सेव की गईं'
    }
  };

  const t = content[language as keyof typeof content] || content.en;

  const updateProfile = (field: string, value: string) => {
    setUserProfile(prev => ({ ...prev, [field]: value }));
  };

  const updateNotification = (setting: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [setting]: value }));
  };

  const saveSettings = () => {
    // Mock save functionality
    console.log('Saving settings...', { userProfile, notificationSettings });
    // Show success message (in real app, would show toast)
    alert(t.saved);
  };

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
            <Settings className="h-8 w-8 text-blue-500" />
            {t.title}
          </h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
        <Button onClick={saveSettings}>
          <Save className="h-4 w-4 mr-2" />
          {t.save}
        </Button>
      </motion.div>

      {/* Settings Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="profile">{t.profile}</TabsTrigger>
            <TabsTrigger value="location">{t.location}</TabsTrigger>
            <TabsTrigger value="notifications">{t.notifications}</TabsTrigger>
            <TabsTrigger value="sms">
              <MessageSquare className="h-4 w-4 mr-1" />
              SMS
            </TabsTrigger>
            <TabsTrigger value="language">{t.language}</TabsTrigger>
            <TabsTrigger value="security">{t.security}</TabsTrigger>
            <TabsTrigger value="api">
              <Database className="h-4 w-4 mr-1" />
              API
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-500" />
                    {t.personalInfo}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      {t.changePhoto}
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="name">{t.name}</Label>
                      <Input
                        id="name"
                        value={userProfile.name}
                        onChange={(e) => updateProfile('name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">{t.email}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userProfile.email}
                        onChange={(e) => updateProfile('email', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">{t.phone}</Label>
                      <Input
                        id="phone"
                        value={userProfile.phone}
                        onChange={(e) => updateProfile('phone', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-500" />
                    {t.farmInfo}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="farmName">{t.farmName}</Label>
                    <Input
                      id="farmName"
                      value={userProfile.farmName}
                      onChange={(e) => updateProfile('farmName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="farmSize">{t.farmSize}</Label>
                    <Input
                      id="farmSize"
                      type="number"
                      value={userProfile.farmSize}
                      onChange={(e) => updateProfile('farmSize', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">{t.experience}</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={userProfile.experience}
                      onChange={(e) => updateProfile('experience', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Location Tab */}
          <TabsContent value="location">
            <LocationManager language={language} />
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-orange-500" />
                  {t.notificationPreferences}
                </CardTitle>
                <CardDescription>
                  {language === 'en' 
                    ? 'Choose which notifications you want to receive' 
                    : 'चुनें कि आप कौन सी सूचनाएं प्राप्त करना चाहते हैं'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {Object.entries(notificationSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">
                          {t[key as keyof typeof t]}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {language === 'en' 
                            ? `Receive ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} notifications`
                            : `${key} सूचनाएं प्राप्त करें`
                          }
                        </p>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => updateNotification(key, checked)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SMS Configuration Tab */}
          <TabsContent value="sms">
            <SMSConfiguration language={language} />
          </TabsContent>

          {/* Language Tab */}
          <TabsContent value="language">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-purple-500" />
                  {t.languageRegion}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="font-medium">{t.currentLanguage}</Label>
                    <div className="mt-2">
                      <LanguageSelector 
                        language={language} 
                        setLanguage={onLanguageChange} 
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="font-medium">{t.region}</Label>
                    <div className="mt-2">
                      <Badge variant="outline">India</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-500" />
                    {t.securitySettings}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="h-4 w-4 mr-2" />
                    {t.changePassword}
                  </Button>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">{t.enableTwoFactor}</Label>
                      <p className="text-sm text-muted-foreground">
                        {language === 'en' 
                          ? 'Add extra security to your account'
                          : 'अपने खाते में अतिरिक्त सुरक्षा जोड़ें'
                        }
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <Button variant="outline" className="w-full justify-start">
                    <Smartphone className="h-4 w-4 mr-2" />
                    {t.loginHistory}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t.dataPrivacy}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    {t.exportData}
                  </Button>
                  <Button variant="destructive" className="w-full justify-start">
                    {t.deleteAccount}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {language === 'en' 
                      ? 'Deleting your account will permanently remove all your data'
                      : 'आपका खाता हटाने से आपका सारा डेटा स्थायी रूप से हट जाएगा'
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* API Configuration Tab */}
          <TabsContent value="api" className="space-y-6">
            <ConfigurationStatus language={language} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}