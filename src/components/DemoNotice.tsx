import React, { useState } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Info, X } from 'lucide-react';

interface DemoNoticeProps {
  language: string;
}

export function DemoNotice({ language }: DemoNoticeProps) {
  const [isDismissed, setIsDismissed] = useState(
    localStorage.getItem('demo-notice-dismissed') === 'true'
  );

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('demo-notice-dismissed', 'true');
  };

  if (isDismissed) return null;

  const content = {
    en: {
      title: 'Demo Mode Active',
      description: 'You are currently using KrishiSevak in demo mode. All data is simulated and no real agricultural data is processed. This demo showcases the platform\'s capabilities for farmers to optimize crop yield through AI-powered insights.',
      dismiss: 'Got it'
    },
    hi: {
      title: 'डेमो मोड सक्रिय',
      description: 'आप वर्तमान में कृषिसेवक को डेमो मोड में उपयोग कर रहे हैं। सभी डेटा सिमुलेशन है और कोई वास्तविक कृषि डेटा प्रोसेस नहीं किया जा रहा। यह डेमो AI-संचालित अंतर्दृष्टि के माध्यम से फसल उत्पादन को अनुकूलित करने के लिए प्लेटफॉर्म की क्षमताओं को दर्शाता है।',
      dismiss: 'समझ गया'
    }
  };

  const t = content[language as keyof typeof content] || content.en;

  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50">
      <Info className="h-4 w-4 text-blue-600" />
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="font-medium text-blue-800 mb-1">{t.title}</div>
          <AlertDescription className="text-blue-700 text-sm">
            {t.description}
          </AlertDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="h-auto p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
}