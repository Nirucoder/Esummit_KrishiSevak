import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  WifiOff, 
  Wifi, 
  Download, 
  Upload, 
  RefreshCw, 
  Database, 
  Cloud, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Smartphone,
  HardDrive,
  Signal,
  Battery,
  Globe
} from 'lucide-react';
import { getContent } from '../utils/languages';

interface OfflineSyncProps {
  language: string;
}

interface SyncData {
  type: 'feedback' | 'community' | 'analytics' | 'settings';
  id: string;
  timestamp: Date;
  size: number;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  data: any;
}

interface SyncStats {
  totalData: number;
  syncedData: number;
  pendingData: number;
  failedData: number;
  lastSync: Date | null;
  storageUsed: number;
  storageLimit: number;
}

export function OfflineSync({ language }: OfflineSyncProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [networkStrength, setNetworkStrength] = useState<'low' | 'medium' | 'high'>('medium');

  // Mock sync data
  const [syncData] = useState<SyncData[]>([
    {
      type: 'feedback',
      id: '1',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      size: 245,
      status: 'pending',
      data: { message: 'Voice feedback from farmer', audio: true }
    },
    {
      type: 'community',
      id: '2',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      size: 156,
      status: 'synced',
      data: { message: 'Community post about irrigation' }
    },
    {
      type: 'analytics',
      id: '3',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      size: 342,
      status: 'failed',
      data: { cropData: 'Yield predictions' }
    }
  ]);

  const [syncStats] = useState<SyncStats>({
    totalData: 15,
    syncedData: 12,
    pendingData: 2,
    failedData: 1,
    lastSync: new Date(Date.now() - 15 * 60 * 1000),
    storageUsed: 2.4,
    storageLimit: 50
  });

  // Monitor network connectivity
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Simulate battery and network monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate battery level changes
      setBatteryLevel(Math.max(20, Math.min(100, batteryLevel + (Math.random() - 0.5) * 2)));
      
      // Simulate network strength changes
      const strengths: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
      setNetworkStrength(strengths[Math.floor(Math.random() * strengths.length)]);
    }, 10000);

    return () => clearInterval(interval);
  }, [batteryLevel]);

  // Auto-sync when online
  useEffect(() => {
    if (isOnline && syncStats.pendingData > 0) {
      // Auto-sync after a delay
      const timer = setTimeout(() => {
        handleSync();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  const handleSync = async () => {
    if (!isOnline) {
      alert('Cannot sync while offline. Please check your internet connection.');
      return;
    }

    setIsSyncing(true);
    setSyncProgress(0);

    // Simulate sync progress
    const progressInterval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsSyncing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const getStorageColor = () => {
    const percentage = (syncStats.storageUsed / syncStats.storageLimit) * 100;
    if (percentage > 80) return 'text-red-600';
    if (percentage > 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getNetworkIcon = () => {
    if (!isOnline) return <WifiOff className="h-4 w-4 text-red-500" />;
    
    switch (networkStrength) {
      case 'low': return <Signal className="h-4 w-4 text-yellow-500" />;
      case 'medium': return <Signal className="h-4 w-4 text-orange-500" />;
      case 'high': return <Signal className="h-4 w-4 text-green-500" />;
    }
  };

  const getBatteryColor = () => {
    if (batteryLevel > 50) return 'text-green-600';
    if (batteryLevel > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'syncing': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'synced': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const content = {
    en: {
      title: 'Offline Sync',
      subtitle: 'Manage offline data and synchronization',
      networkStatus: 'Network Status',
      syncStatus: 'Sync Status',
      localStorage: 'Local Storage',
      syncNow: 'Sync Now',
      autoSync: 'Auto Sync',
      dataQueue: 'Data Queue',
      systemStatus: 'System Status',
      online: 'Online',
      offline: 'Offline',
      syncing: 'Syncing...',
      lastSync: 'Last Sync',
      totalData: 'Total Items',
      syncedData: 'Synced',
      pendingData: 'Pending',
      failedData: 'Failed',
      storageUsed: 'Storage Used',
      battery: 'Battery',
      signal: 'Signal Strength',
      networkSpeed: 'Network Speed',
      offlineCapabilities: 'Offline Capabilities',
      dataWillSync: 'Data will sync automatically when online',
      manualSync: 'You can manually sync when needed'
    },
    hi: {
      title: 'ऑफलाइन सिंक',
      subtitle: 'ऑफलाइन डेटा और सिंक्रोनाइज़ेशन प्रबंधित करें',
      networkStatus: 'नेटवर्क स्थिति',
      syncStatus: 'सिंक स्थिति',
      localStorage: 'स्थानीय स्टोरेज',
      syncNow: 'अभी सिंक करें',
      autoSync: 'ऑटो सिंक',
      dataQueue: 'डेटा कतार',
      systemStatus: 'सिस्टम स्थिति',
      online: 'ऑनलाइन',
      offline: 'ऑफलाइन',
      syncing: 'सिंक हो रहा है...',
      lastSync: 'अंतिम सिंक',
      totalData: 'कुल आइटम',
      syncedData: 'सिंक हो गया',
      pendingData: 'लंबित',
      failedData: 'असफल',
      storageUsed: 'स्टोरेज का उपयोग',
      battery: 'बैटरी',
      signal: 'सिग्नल स्ट्रेंथ',
      networkSpeed: 'नेटवर्क स्पीड',
      offlineCapabilities: 'ऑफलाइन क्षमताएं',
      dataWillSync: 'ऑनलाइन होने पर डेटा अपने आप सिंक हो जाएगा',
      manualSync: 'आप जरूरत के अनुसार मैन्युअल सिंक कर सकते हैं'
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
        <div className="flex items-center gap-2">
          <Badge variant={isOnline ? 'default' : 'destructive'} className="flex items-center gap-2">
            {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            {isOnline ? t.online : t.offline}
          </Badge>
          {isSyncing && (
            <Badge variant="secondary" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              {t.syncing}
            </Badge>
          )}
        </div>
      </div>

      {/* Sync Progress */}
      {isSyncing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Syncing data...</span>
                <span className="text-sm text-muted-foreground">{syncProgress}%</span>
              </div>
              <Progress value={syncProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Network Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {t.networkStatus}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Connection</span>
              <div className="flex items-center gap-2">
                {getNetworkIcon()}
                <span className={isOnline ? 'text-green-600' : 'text-red-600'}>
                  {isOnline ? t.online : t.offline}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span>{t.signal}</span>
              <span className="capitalize">{networkStrength}</span>
            </div>

            <div className="flex items-center justify-between">
              <span>{t.battery}</span>
              <div className="flex items-center gap-2">
                <Battery className={`h-4 w-4 ${getBatteryColor()}`} />
                <span className={getBatteryColor()}>{Math.round(batteryLevel)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sync Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              {t.syncStatus}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{syncStats.syncedData}</p>
                <p className="text-sm text-muted-foreground">{t.syncedData}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{syncStats.pendingData}</p>
                <p className="text-sm text-muted-foreground">{t.pendingData}</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">{t.lastSync}</p>
              <p className="text-sm font-medium">
                {syncStats.lastSync?.toLocaleString() || 'Never'}
              </p>
            </div>

            <Button 
              onClick={handleSync} 
              disabled={!isOnline || isSyncing} 
              className="w-full"
            >
              {isSyncing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              {t.syncNow}
            </Button>
          </CardContent>
        </Card>

        {/* Storage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              {t.localStorage}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">{t.storageUsed}</span>
                <span className={`text-sm font-medium ${getStorageColor()}`}>
                  {syncStats.storageUsed} MB / {syncStats.storageLimit} MB
                </span>
              </div>
              <Progress 
                value={(syncStats.storageUsed / syncStats.storageLimit) * 100} 
                className="h-2" 
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Items:</span>
                <span>{syncStats.totalData}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Failed Items:</span>
                <span className="text-red-600">{syncStats.failedData}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            {t.dataQueue}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {syncData.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(item.status)}
                  <div>
                    <p className="font-medium capitalize">{item.type} Data</p>
                    <p className="text-sm text-muted-foreground">
                      {item.timestamp.toLocaleString()} • {item.size} KB
                    </p>
                  </div>
                </div>
                <Badge variant={
                  item.status === 'synced' ? 'default' :
                  item.status === 'failed' ? 'destructive' :
                  item.status === 'syncing' ? 'secondary' : 'outline'
                }>
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Offline Capabilities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            {t.offlineCapabilities}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Submit feedback offline</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Record voice messages</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>View cached data</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Cloud className="h-5 w-5 text-blue-600" />
                <span>Auto-sync when online</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Upload className="h-5 w-5 text-blue-600" />
                <span>Resume interrupted uploads</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Download className="h-5 w-5 text-blue-600" />
                <span>Download critical updates</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              💡 <strong>Tip:</strong> {t.dataWillSync} {t.manualSync}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}