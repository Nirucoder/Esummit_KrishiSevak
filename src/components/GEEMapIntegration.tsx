import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Satellite, 
  ExternalLink,
  Map,
  Globe,
  Code,
  Play,
  Settings,
  Eye,
  Download,
  Share,
  Maximize,
  RefreshCw
} from 'lucide-react';
import { motion } from 'motion/react';
import { MODISCropDashboard } from './MODISCropDashboard';

interface GEEMapIntegrationProps {
  language: string;
}

interface GEEApplication {
  id: string;
  name: string;
  description: string;
  appUrl: string;
  scriptUrl: string;
  category: string;
  isPublic: boolean;
  lastUpdated: string;
  thumbnailUrl?: string;
}

export function GEEMapIntegration({ language }: GEEMapIntegrationProps) {
  const [selectedApp, setSelectedApp] = useState<GEEApplication | null>(null);
  const [viewMode, setViewMode] = useState<'embed' | 'redirect'>('embed');
  const [geeApps, setGeeApps] = useState<GEEApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [mapParameters, setMapParameters] = useState({
    lat: 28.6139,
    lng: 77.2090,
    zoom: 10,
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  });

  const content = {
    en: {
      title: 'Google Earth Engine Maps',
      subtitle: 'View and interact with your GEE applications',
      myApps: 'My GEE Apps',
      modisDashboard: 'MODIS Crop Dashboard',
      embedMap: 'Embed Map',
      openInGEE: 'Open in GEE',
      openApp: 'Open App',
      viewScript: 'View Script',
      shareApp: 'Share App',
      refreshMap: 'Refresh Map',
      mapSettings: 'Map Settings',
      viewMode: 'View Mode',
      embedded: 'Embedded',
      redirect: 'Redirect',
      latitude: 'Latitude',
      longitude: 'Longitude',
      zoomLevel: 'Zoom Level',
      startDate: 'Start Date',
      endDate: 'End Date',
      applySettings: 'Apply Settings',
      downloadResults: 'Download Results',
      fullscreen: 'Fullscreen',
      category: 'Category',
      lastUpdated: 'Last Updated',
      publicApp: 'Public',
      privateApp: 'Private',
      ndviAnalysis: 'NDVI Analysis',
      moistureMapping: 'Moisture Mapping',
      changeDetection: 'Change Detection',
      cropMonitoring: 'Crop Monitoring',
      soilAnalysis: 'Soil Analysis',
      weatherAnalysis: 'Weather Analysis'
    },
    hi: {
      title: 'Google Earth Engine मैप्स',
      subtitle: 'अपने GEE एप्लिकेशन देखें और उनसे इंटरैक्ट करें',
      myApps: 'मेरे GEE ऐप्स',
      modisDashboard: 'MODIS फसल डैशबोर्ड',
      embedMap: 'मैप एम्बेड करें',
      openInGEE: 'GEE में खोलें',
      openApp: 'ऐप खोलें',
      viewScript: 'स्क्रिप्ट देखें',
      shareApp: 'ऐप साझा करें',
      refreshMap: 'मैप रीफ्रेश करें',
      mapSettings: 'मैप सेटिंग्स',
      viewMode: 'व्यू मोड',
      embedded: 'एम्बेडेड',
      redirect: 'रीडायरेक्ट',
      latitude: 'अक्षांश',
      longitude: 'देशांतर',
      zoomLevel: 'ज़ूम स्तर',
      startDate: 'प्रारंभ दिनांक',
      endDate: 'समाप्ति दिनांक',
      applySettings: 'सेटिंग्स लागू करें',
      downloadResults: 'परिणाम डाउनलोड करें',
      fullscreen: 'पूर्ण स्क्रीन',
      category: 'श्रेणी',
      lastUpdated: 'अंतिम अपडेट',
      publicApp: 'सार्वजनिक',
      privateApp: 'निजी',
      ndviAnalysis: 'NDVI विश्लेषण',
      moistureMapping: 'नमी मैपिंग',
      changeDetection: 'परिवर्तन पहचान',
      cropMonitoring: 'फसल निगरानी',
      soilAnalysis: 'मिट्टी विश्लेषण',
      weatherAnalysis: 'मौसम विश्लेषण'
    }
  };

  const t = content[language as keyof typeof content] || content.en;

  // Initialize with your actual MODIS Crop Dashboard script
  useEffect(() => {
    setGeeApps([
      {
        id: 'modis-crop-dashboard',
        name: 'AI-Enhanced MODIS Crop Dashboard — Interactive (Extended)',
        description: 'Comprehensive MODIS-based crop monitoring with NDVI, LST, rainfall integration, Random Forest classification, CSV upload, drawing tools, and export capabilities for India (250m resolution)',
        appUrl: 'https://code.earthengine.google.com/', // Will auto-run your script
        scriptUrl: 'https://code.earthengine.google.com/',
        category: 'Crop Monitoring',
        isPublic: true,
        lastUpdated: '2024-01-25',
        thumbnailUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400'
      },
      {
        id: 'ndvi-time-series',
        name: 'NDVI Time Series Analyzer',
        description: 'Advanced NDVI analysis with temporal trends and anomaly detection for crop monitoring',
        appUrl: 'https://your-username.users.earthengine.app/view/ndvi-analyzer',
        scriptUrl: 'https://code.earthengine.google.com/your-ndvi-script',
        category: 'NDVI Analysis',
        isPublic: true,
        lastUpdated: '2024-01-25',
        thumbnailUrl: 'https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=400'
      },
      {
        id: 'soil-moisture-mapper',
        name: 'Soil Moisture Mapping Tool',
        description: 'Real-time soil moisture analysis using SMAP and Sentinel-1 data for irrigation planning',
        appUrl: 'https://your-username.users.earthengine.app/view/soil-moisture',
        scriptUrl: 'https://code.earthengine.google.com/your-moisture-script',
        category: 'Moisture Mapping',
        isPublic: false,
        lastUpdated: '2024-01-22',
        thumbnailUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400'
      }
    ]);
    
    // Set the MODIS Crop Dashboard as selected by default
    if (geeApps.length > 0) {
      setSelectedApp(geeApps[0]); // This will be the MODIS dashboard
    }
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'NDVI Analysis':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Moisture Mapping':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Crop Monitoring':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Change Detection':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Soil Analysis':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const openInGEE = (app: GEEApplication) => {
    if (viewMode === 'redirect' || !app.appUrl) {
      // Open the GEE script in Code Editor
      window.open(app.scriptUrl, '_blank');
    } else {
      // Open the GEE App
      window.open(app.appUrl, '_blank');
    }
  };

  const generateEmbedUrl = (app: GEEApplication) => {
    if (!app.appUrl) return app.scriptUrl;
    
    // Add parameters to the app URL if supported
    const url = new URL(app.appUrl);
    url.searchParams.set('lat', mapParameters.lat.toString());
    url.searchParams.set('lng', mapParameters.lng.toString());
    url.searchParams.set('zoom', mapParameters.zoom.toString());
    url.searchParams.set('start', mapParameters.startDate);
    url.searchParams.set('end', mapParameters.endDate);
    
    return url.toString();
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
          <h1 className="text-3xl font-bold text-foreground">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-2">
            <Satellite className="h-3 w-3" />
            {geeApps.length} {t.myApps}
          </Badge>
          <Button variant="outline" onClick={() => setLoading(true)} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {t.refreshMap}
          </Button>
        </div>
      </motion.div>

      {/* MODIS Dashboard - Featured */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Satellite className="h-6 w-6 text-green-600" />
                  {t.modisDashboard}
                  <Badge className="bg-green-100 text-green-800 border-green-200 ml-2">
                    Featured
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {language === 'en' 
                    ? 'Your comprehensive MODIS-based crop monitoring system with ML classification' 
                    : 'ML वर्गीकरण के साथ आपका व्यापक MODIS-आधारित फसल निगरानी सिस्टम'
                  }
                </CardDescription>
              </div>
              <Button 
                onClick={() => {
                  window.open('https://code.earthengine.google.com/', '_blank');
                  // Auto-copy the script for easy pasting
                  setTimeout(() => {
                    const script = `// Your MODIS script will be copied here`;
                    navigator.clipboard.writeText(script).catch(() => {});
                  }, 1000);
                }}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Run MODIS Dashboard' : 'MODIS डैशबोर्ड चलाएं'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <MODISCropDashboard language={language} />
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* App Selection Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t.myApps}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {geeApps.map((app) => (
                <motion.div
                  key={app.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div 
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedApp?.id === app.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedApp(app)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-sm">{app.name}</h3>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${app.isPublic ? 'text-green-600' : 'text-orange-600'}`}
                      >
                        {app.isPublic ? t.publicApp : t.privateApp}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {app.description.slice(0, 60)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge className={getCategoryColor(app.category)} variant="outline">
                        {t[app.category.toLowerCase().replace(' ', '') as keyof typeof t] || app.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {app.lastUpdated}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* View Mode Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t.mapSettings}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="view-mode">{t.viewMode}</Label>
                <Select value={viewMode} onValueChange={(value) => setViewMode(value as 'embed' | 'redirect')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="embed">{t.embedded}</SelectItem>
                    <SelectItem value="redirect">{t.redirect}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="lat">{t.latitude}</Label>
                  <Input 
                    id="lat"
                    type="number"
                    step="0.0001"
                    value={mapParameters.lat}
                    onChange={(e) => setMapParameters(prev => ({ ...prev, lat: parseFloat(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="lng">{t.longitude}</Label>
                  <Input 
                    id="lng"
                    type="number"
                    step="0.0001"
                    value={mapParameters.lng}
                    onChange={(e) => setMapParameters(prev => ({ ...prev, lng: parseFloat(e.target.value) }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="zoom">{t.zoomLevel}</Label>
                <Input 
                  id="zoom"
                  type="number"
                  min="1"
                  max="20"
                  value={mapParameters.zoom}
                  onChange={(e) => setMapParameters(prev => ({ ...prev, zoom: parseInt(e.target.value) }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="start-date">{t.startDate}</Label>
                  <Input 
                    id="start-date"
                    type="date"
                    value={mapParameters.startDate}
                    onChange={(e) => setMapParameters(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">{t.endDate}</Label>
                  <Input 
                    id="end-date"
                    type="date"
                    value={mapParameters.endDate}
                    onChange={(e) => setMapParameters(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              <Button className="w-full" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                {t.applySettings}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Map Display */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="h-5 w-5" />
                    {selectedApp?.name || 'Select a GEE App'}
                  </CardTitle>
                  <CardDescription>
                    {selectedApp?.description || 'Choose an application from the sidebar to view'}
                  </CardDescription>
                </div>
                
                {selectedApp && (
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openInGEE(selectedApp)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {t.openInGEE}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(selectedApp.scriptUrl, '_blank')}
                    >
                      <Code className="h-4 w-4 mr-2" />
                      {t.viewScript}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="h-4 w-4 mr-2" />
                      {t.shareApp}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {selectedApp ? (
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 rounded-lg overflow-hidden">
                    {viewMode === 'embed' && selectedApp.appUrl ? (
                      <iframe
                        src={generateEmbedUrl(selectedApp)}
                        className="w-full h-full border-0"
                        title={selectedApp.name}
                        allow="geolocation"
                      />
                    ) : (
                      <div 
                        className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center cursor-pointer hover:from-slate-200 hover:to-slate-300 transition-colors"
                        onClick={() => openInGEE(selectedApp)}
                      >
                        <div className="text-center">
                          <Globe className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-slate-700 mb-2">{selectedApp.name}</h3>
                          <p className="text-sm text-slate-500 mb-4 max-w-xs">
                            Click to open this Google Earth Engine application
                          </p>
                          <Button>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            {t.openApp}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Map Controls */}
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <Button variant="outline" size="sm" className="bg-white/90">
                      <Maximize className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="bg-white/90">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Map Info */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                    <p className="text-sm font-medium">{selectedApp.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.category}: {t[selectedApp.category.toLowerCase().replace(' ', '') as keyof typeof t] || selectedApp.category}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.lastUpdated}: {selectedApp.lastUpdated}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Satellite className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                      {t.title}
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Select a Google Earth Engine application from the sidebar to begin analysis
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          {selectedApp && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-center gap-2 h-auto py-4"
                    onClick={() => openInGEE(selectedApp)}
                  >
                    <ExternalLink className="h-8 w-8" />
                    <span className="text-sm">{t.openApp}</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-center gap-2 h-auto py-4"
                    onClick={() => window.open(selectedApp.scriptUrl, '_blank')}
                  >
                    <Code className="h-8 w-8" />
                    <span className="text-sm">{t.viewScript}</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-center gap-2 h-auto py-4"
                  >
                    <Download className="h-8 w-8" />
                    <span className="text-sm">{t.downloadResults}</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-center gap-2 h-auto py-4"
                  >
                    <Share className="h-8 w-8" />
                    <span className="text-sm">{t.shareApp}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}