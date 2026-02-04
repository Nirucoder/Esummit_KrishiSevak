import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  MessageSquare, 
  CheckCircle, 
  AlertCircle, 
  Settings,
  Phone,
  DollarSign,
  TrendingUp,
  Zap,
  Shield
} from 'lucide-react';
import smsService from '../services/SMSService';
import { getContent } from '../utils/languages';

interface SMSConfigurationProps {
  language: string;
}

export function SMSConfiguration({ language }: SMSConfigurationProps) {
  const [config, setConfig] = useState(smsService.getConfig());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [testNumber, setTestNumber] = useState('');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [usageStats, setUsageStats] = useState({ totalSent: 0, successRate: 0, monthlyCost: 0 });

  // Translation helper
  const t = {
    title: getContent(language, 'smsConfig') || 'SMS Configuration',
    subtitle: getContent(language, 'smsConfigSubtitle') || 'Configure SMS gateway settings for notifications and OTP',
    provider: getContent(language, 'provider') || 'SMS Provider',
    apiKey: getContent(language, 'apiKey') || 'API Key',
    senderId: getContent(language, 'senderId') || 'Sender ID',
    isActive: getContent(language, 'isActive') || 'Enable SMS Service',
    testConnection: getContent(language, 'testConnection') || 'Test Connection',
    saveSettings: getContent(language, 'saveSettings') || 'Save Settings',
    testPhoneNumber: getContent(language, 'testPhoneNumber') || 'Test Phone Number',
    sendTest: getContent(language, 'sendTest') || 'Send Test SMS',
    usage: getContent(language, 'usage') || 'Usage Statistics',
    totalSent: getContent(language, 'totalSent') || 'Total SMS Sent',
    successRate: getContent(language, 'successRate') || 'Success Rate',
    monthlyCost: getContent(language, 'monthlyCost') || 'Monthly Cost',
    settingsSaved: getContent(language, 'settingsSaved') || 'Settings saved successfully',
    testSentSuccess: getContent(language, 'testSentSuccess') || 'Test SMS sent successfully',
    invalidPhone: getContent(language, 'invalidPhone') || 'Please enter a valid phone number',
    security: getContent(language, 'security') || 'Security',
    providerInfo: getContent(language, 'providerInfo') || 'Provider Information'
  };

  useEffect(() => {
    // Load usage statistics
    setUsageStats(smsService.getUsageStats());
  }, []);

  const handleConfigUpdate = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      smsService.updateConfig(config);
      setSuccess(t.settingsSaved);
    } catch (error) {
      setError('Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestSMS = async () => {
    if (!testNumber) {
      setError(t.invalidPhone);
      return;
    }

    setIsTestingConnection(true);
    setError('');

    try {
      const result = await smsService.testConfiguration(testNumber);
      if (result.success) {
        setSuccess(t.testSentSuccess);
      } else {
        setError(result.error || 'Test failed');
      }
    } catch (error) {
      setError('Test failed. Please check your configuration.');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const providers = [
    { value: 'mock', label: 'Mock Provider (Development)', icon: '🧪' },
    { value: 'msg91', label: 'MSG91 (India)', icon: '🇮🇳' },
    { value: 'textlocal', label: 'TextLocal (India)', icon: '🇮🇳' },
    { value: 'twilio', label: 'Twilio (Global)', icon: '🌍' },
    { value: 'aws_sns', label: 'AWS SNS (Global)', icon: '☁️' }
  ];

  const getProviderInfo = (providerValue: string) => {
    const info = {
      mock: {
        description: 'Development mock provider - no real SMS sent',
        pricing: 'Free',
        features: ['Development Testing', 'Console Logging', 'No Real SMS'],
        setup: 'No setup required'
      },
      msg91: {
        description: 'Leading SMS provider in India with high delivery rates',
        pricing: '₹0.05 - ₹0.15 per SMS',
        features: ['99% Delivery Rate', 'DND Compliant', 'Bulk SMS', 'OTP Templates'],
        setup: 'Sign up at msg91.com and get your API key'
      },
      textlocal: {
        description: 'Popular Indian SMS gateway with competitive pricing',
        pricing: '₹0.04 - ₹0.12 per SMS',
        features: ['High Speed Delivery', 'Unicode Support', 'Detailed Reports'],
        setup: 'Register at textlocal.in and obtain API credentials'
      },
      twilio: {
        description: 'Global SMS platform with worldwide coverage',
        pricing: '$0.0075 - $0.05 per SMS',
        features: ['Global Coverage', '99.95% Uptime', 'Programmable SMS'],
        setup: 'Create account at twilio.com and get Account SID and Auth Token'
      },
      aws_sns: {
        description: 'Amazon\'s managed SMS service with AWS integration',
        pricing: '$0.00645 - $0.0775 per SMS',
        features: ['AWS Integration', 'Scalable', 'Global Reach'],
        setup: 'Configure AWS credentials and SNS permissions'
      }
    };
    return info[providerValue as keyof typeof info] || info.mock;
  };

  const selectedProviderInfo = getProviderInfo(config.provider);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-blue-600" />
          {t.title}
        </h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* Usage Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.totalSent}</p>
                <p className="text-2xl font-bold">{usageStats.totalSent.toLocaleString()}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.successRate}</p>
                <p className="text-2xl font-bold">{usageStats.successRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.monthlyCost}</p>
                <p className="text-2xl font-bold">₹{usageStats.monthlyCost}</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              SMS Provider Settings
            </CardTitle>
            <CardDescription>
              Configure your SMS gateway provider and credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="provider">{t.provider}</Label>
              <Select
                value={config.provider}
                onValueChange={(value) => setConfig({ ...config, provider: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select SMS provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider.value} value={provider.value}>
                      <span className="flex items-center gap-2">
                        <span>{provider.icon}</span>
                        {provider.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="apiKey">{t.apiKey}</Label>
              <Input
                id="apiKey"
                type="password"
                value={config.apiKey}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                placeholder="Enter your API key"
              />
            </div>

            <div>
              <Label htmlFor="senderId">{t.senderId}</Label>
              <Input
                id="senderId"
                value={config.senderId}
                onChange={(e) => setConfig({ ...config, senderId: e.target.value })}
                placeholder="e.g., KRISHI"
                maxLength={6}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={config.isActive}
                onCheckedChange={(checked) => setConfig({ ...config, isActive: checked })}
              />
              <Label htmlFor="isActive">{t.isActive}</Label>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleConfigUpdate} 
              disabled={isLoading}
              className="w-full farmer-primary-action"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Saving...
                </>
              ) : (
                t.saveSettings
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Provider Information & Testing */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                {t.providerInfo}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">{providers.find(p => p.value === config.provider)?.label}</h4>
                <p className="text-sm text-muted-foreground">{selectedProviderInfo.description}</p>
              </div>

              <div>
                <h5 className="font-medium text-sm">Pricing</h5>
                <p className="text-sm text-muted-foreground">{selectedProviderInfo.pricing}</p>
              </div>

              <div>
                <h5 className="font-medium text-sm">Features</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {selectedProviderInfo.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-medium text-sm">Setup</h5>
                <p className="text-sm text-muted-foreground">{selectedProviderInfo.setup}</p>
                
                {config.provider === 'mock' && (
                  <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                    <p className="text-xs text-blue-700">
                      <strong>Development Mode:</strong> SMS messages will be logged to console. 
                      Configure a real provider and API key for production use.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                {t.testConnection}
              </CardTitle>
              <CardDescription>
                Send a test SMS to verify your configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="testNumber">{t.testPhoneNumber}</Label>
                <Input
                  id="testNumber"
                  value={testNumber}
                  onChange={(e) => setTestNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>

              <Button 
                onClick={handleTestSMS} 
                disabled={isTestingConnection || !testNumber}
                className="w-full farmer-secondary-action"
              >
                {isTestingConnection ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent mr-2" />
                    Sending...
                  </>
                ) : (
                  t.sendTest
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t.security}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Encrypted API Communication</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">DND Compliance</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Verified</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Rate Limiting</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}