import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { 
  CheckCircle, 
  AlertTriangle, 
  Settings, 
  Brain, 
  Satellite,
  Database,
  Info
} from 'lucide-react';
import { getConfigurationStatus } from '../services/config';

interface ConfigurationStatusProps {
  language: string;
}

export function ConfigurationStatus({ language }: ConfigurationStatusProps) {
  const status = getConfigurationStatus();

  const content = {
    en: {
      title: 'API Configuration Status',
      subtitle: 'Current status of ML models and GEE integration',
      developmentMode: 'Development Mode',
      productionMode: 'Production Mode',
      mockDataEnabled: 'Mock Data Enabled',
      configurationIssues: 'Configuration Issues',
      allConfigured: 'All Services Configured',
      mlModels: 'ML Models',
      geeIntegration: 'Google Earth Engine',
      mlTraining: 'ML Training',
      configured: 'Configured',
      notConfigured: 'Not Configured',
      issues: 'Issues',
      noIssues: 'No configuration issues detected',
      instructions: 'To connect your real ML models and GEE scripts:',
      step1: '1. Update the API endpoints in /services/config.ts',
      step2: '2. Add your API keys to environment variables',
      step3: '3. Set development.useMockData to false',
      step4: '4. Test your API connections',
      currentlyUsing: 'Currently using mock data for demonstration purposes',
      status: 'Status'
    },
    hi: {
      title: 'API कॉन्फ़िगरेशन स्थिति',
      subtitle: 'ML मॉडल और GEE एकीकरण की वर्तमान स्थिति',
      developmentMode: 'विकास मोड',
      productionMode: 'उत्पादन मोड',
      mockDataEnabled: 'मॉक डेटा सक्षम',
      configurationIssues: 'कॉन्फ़िगरेशन समस्याएं',
      allConfigured: 'सभी सेवाएं कॉन्फ़िगर की गईं',
      mlModels: 'ML मॉडल',
      geeIntegration: 'Google Earth Engine',
      mlTraining: 'ML प्रशिक्षण',
      configured: 'कॉन्फ़िगर की गई',
      notConfigured: 'कॉन्फ़िगर नहीं की गई',
      issues: 'समस्याएं',
      noIssues: 'कोई कॉन्फ़िगरेशन समस्या नहीं मिली',
      instructions: 'अपने वास्तविक ML मॉडल और GEE स्क्रिप्ट को कनेक्ट करने के लिए:',
      step1: '1. /services/config.ts में API endpoints अपडेट करें',
      step2: '2. Environment variables में अपनी API keys जोड़ें',
      step3: '3. development.useMockData को false करें',
      step4: '4. अपने API कनेक्शन टेस्ट करें',
      currentlyUsing: 'वर्तमान में प्रदर्शन उद्देश्यों के लिए मॉक डेटा का उपयोग कर रहे हैं',
      status: 'स्थिति'
    }
  };

  const t = content[language as keyof typeof content] || content.en;

  const getStatusBadge = (isConfigured: boolean) => {
    if (isConfigured) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          {t.configured}
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {t.notConfigured}
        </Badge>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">{t.title}</h2>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* Main Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-500" />
              {t.status}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">{language === 'en' ? 'Mode' : 'मोड'}:</span>
              <Badge variant="outline" className={status.developmentMode ? 'border-yellow-200 text-yellow-700' : 'border-green-200 text-green-700'}>
                {status.developmentMode ? t.developmentMode : t.productionMode}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{language === 'en' ? 'Mock Data' : 'मॉक डेटा'}:</span>
              <Badge variant="outline" className={status.mockDataEnabled ? 'border-blue-200 text-blue-700' : 'border-gray-200 text-gray-700'}>
                {status.mockDataEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{language === 'en' ? 'Configuration' : 'कॉन्फ़िगरेशन'}:</span>
              {status.isValid ? (
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {t.allConfigured}
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800 border-red-200">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {t.issues}: {status.issues.length}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-purple-500" />
              {language === 'en' ? 'Services Status' : 'सेवाओं की स्थिति'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-500" />
                <span className="text-sm">{t.mlModels}</span>
              </div>
              {getStatusBadge(!status.issues.some(issue => issue.includes('ML Model')))}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Satellite className="h-4 w-4 text-blue-500" />
                <span className="text-sm">{t.geeIntegration}</span>
              </div>
              {getStatusBadge(!status.issues.some(issue => issue.includes('Google Earth Engine')))}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-green-500" />
                <span className="text-sm">{t.mlTraining}</span>
              </div>
              {getStatusBadge(!status.issues.some(issue => issue.includes('ML Training')))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Status Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          {t.currentlyUsing}
        </AlertDescription>
      </Alert>

      {/* Configuration Issues */}
      {status.issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              {t.configurationIssues}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {status.issues.map((issue, index) => (
                <div key={index} className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{issue}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-500" />
            {language === 'en' ? 'Setup Instructions' : 'सेटअप निर्देश'}
          </CardTitle>
          <CardDescription>
            {t.instructions}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 font-medium">•</span>
              <span>{t.step1}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 font-medium">•</span>
              <span>{t.step2}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 font-medium">•</span>
              <span>{t.step3}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 font-medium">•</span>
              <span>{t.step4}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}