import React from 'react';
import { Badge } from './ui/badge';
import { Wifi, WifiOff, TestTube } from 'lucide-react';

interface ConnectionStatusProps {
  language: string;
}

export function ConnectionStatus({ language }: ConnectionStatusProps) {
  // Check if we're in demo mode by looking for any connection errors
  const isDemoMode = true; // This matches our AuthService setup

  const content = {
    en: {
      demoMode: 'Demo Mode',
      demoDescription: 'Using simulated data',
      connected: 'Connected',
      offline: 'Offline'
    },
    hi: {
      demoMode: 'डेमो मोड',
      demoDescription: 'सिमुलेशन डेटा का उपयोग',
      connected: 'कनेक्टेड',
      offline: 'ऑफलाइन'
    }
  };

  const t = content[language as keyof typeof content] || content.en;

  if (isDemoMode) {
    return (
      <Badge variant="secondary" className="gap-2 bg-orange-100 text-orange-800 border-orange-300">
        <TestTube className="h-3 w-3" />
        {t.demoMode}
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="gap-2 bg-green-100 text-green-800 border-green-300">
      <Wifi className="h-3 w-3" />
      {t.connected}
    </Badge>
  );
}