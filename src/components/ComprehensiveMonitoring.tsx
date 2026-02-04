import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { SatelliteAnalysisScreen } from './SatelliteAnalysisScreen';
import { DroughtMonitoringScreen } from './DroughtMonitoringScreen';
import { 
  Satellite, 
  CloudRain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Eye
} from 'lucide-react';
import { motion } from 'motion/react';
import { getContent } from '../utils/languages';

interface ComprehensiveMonitoringProps {
  language: string;
}

export function ComprehensiveMonitoring({ language }: ComprehensiveMonitoringProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Use centralized translations
  const t = {
    title: getContent(language, 'farmMonitoring'),
    subtitle: getContent(language, 'farmMonitoringSubtitle'),
    overview: getContent(language, 'overview'),
    satellite: getContent(language, 'satellite'),
    drought: getContent(language, 'drought'),
    ndviTitle: getContent(language, 'ndviTitle'),
    droughtRiskTitle: getContent(language, 'droughtRiskTitle'),
    viewDetails: getContent(language, 'viewDetails'),
    lastUpdated: getContent(language, 'lastUpdated'),
    excellent: getContent(language, 'excellent'),
    good: getContent(language, 'good'),
    moderate: getContent(language, 'moderate'),
    poor: getContent(language, 'poor'),
    low: getContent(language, 'low'),
    high: getContent(language, 'high'),
    critical: getContent(language, 'critical'),
    quickInsights: getContent(language, 'quickInsights'),
    quickInsightsDesc: getContent(language, 'quickInsightsDesc'),
    healthyVegetation: getContent(language, 'healthyVegetation'),
    healthyVegetationDesc: getContent(language, 'healthyVegetationDesc'),
    monitorWeather: getContent(language, 'monitorWeather'),
    monitorWeatherDesc: getContent(language, 'monitorWeatherDesc')
  };

  // Mock data for overview
  const farmMetrics = {
    ndvi: 0.78,
    droughtRisk: 'low',
    lastUpdate: new Date()
  };

  const getHealthColor = (value: number) => {
    if (value >= 0.8) return 'text-green-600 bg-green-100';
    if (value >= 0.6) return 'text-blue-600 bg-blue-100';
    if (value >= 0.4) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Eye className="h-8 w-8 text-blue-500" />
            {t.title}
          </h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            {t.lastUpdated}: {farmMetrics.lastUpdate.toLocaleTimeString()}
          </Badge>
        </div>
      </motion.div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">{t.overview}</TabsTrigger>
          <TabsTrigger value="satellite">{t.satellite}</TabsTrigger>
          <TabsTrigger value="drought">{t.drought}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* NDVI Card */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('satellite')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.ndviTitle}</CardTitle>
                <Satellite className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{farmMetrics.ndvi.toFixed(2)}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getHealthColor(farmMetrics.ndvi)}>
                    {farmMetrics.ndvi >= 0.8 ? t.excellent : farmMetrics.ndvi >= 0.6 ? t.good : farmMetrics.ndvi >= 0.4 ? t.moderate : t.poor}
                  </Badge>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-xs">
                  {t.viewDetails} →
                </Button>
              </CardContent>
            </Card>



            {/* Drought Risk Card */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('drought')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.droughtRiskTitle}</CardTitle>
                <CloudRain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{t[farmMetrics.droughtRisk as keyof typeof t]}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getRiskColor(farmMetrics.droughtRisk)}>
                    {farmMetrics.droughtRisk === 'low' ? t.low : farmMetrics.droughtRisk === 'moderate' ? t.moderate : farmMetrics.droughtRisk === 'high' ? t.high : t.critical}
                  </Badge>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-xs">
                  {t.viewDetails} →
                </Button>
              </CardContent>
            </Card>


          </motion.div>

          {/* Quick Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  {t.quickInsights}
                </CardTitle>
                <CardDescription>
                  {t.quickInsightsDesc}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        {t.healthyVegetation}
                      </p>
                      <p className="text-xs text-green-700">
                        {t.healthyVegetationDesc}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-orange-800">
                        {t.monitorWeather}
                      </p>
                      <p className="text-xs text-orange-700">
                        {t.monitorWeatherDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Individual Component Tabs */}
        <TabsContent value="satellite">
          <SatelliteAnalysisScreen language={language} />
        </TabsContent>





        <TabsContent value="drought">
          <DroughtMonitoringScreen language={language} />
        </TabsContent>
      </Tabs>
    </div>
  );
}