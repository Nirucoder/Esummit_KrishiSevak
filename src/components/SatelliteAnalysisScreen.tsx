import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ExcelExport, createSatelliteData } from './ExcelExport';
import { 
  Satellite, 
  Eye, 
  Layers, 
  Download, 
  RefreshCw,
  TrendingUp,
  Droplets,
  Thermometer,
  Wind,
  Cloud,
  Brain,
  AlertTriangle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { geeService, NDVIAnalysis, SatelliteImagery } from '../services/GoogleEarthEngineService';
import { mlModelService } from '../services/MLModelService';
import { dataIntegrationService } from '../services/DataIntegrationService';

interface SatelliteAnalysisScreenProps {
  language: string;
}

interface FieldData {
  id: string;
  name: string;
  area: string;
  ndvi: number;
  status: string;
  crop: string;
  location: { lat: number; lng: number };
}

// Enhanced field data with real coordinates for ML/GEE integration
const fieldData: FieldData[] = [
  { id: 'field-a', name: 'Field A', area: '2.5 acres', ndvi: 0.82, status: 'Excellent', crop: 'Wheat / गेहूं', location: { lat: 28.6139, lng: 77.2090 } },
  { id: 'field-b', name: 'Field B', area: '3.2 acres', ndvi: 0.78, status: 'Good', crop: 'Rice / चावल', location: { lat: 28.6145, lng: 77.2095 } },
  { id: 'field-c', name: 'Field C', area: '1.8 acres', ndvi: 0.65, status: 'Moderate', crop: 'Cotton / कपास', location: { lat: 28.6135, lng: 77.2085 } },
  { id: 'field-d', name: 'Field D', area: '4.1 acres', ndvi: 0.73, status: 'Good', crop: 'Sugarcane / गन्ना', location: { lat: 28.6150, lng: 77.2100 } },
  { id: 'field-e', name: 'Field E', area: '1.9 acres', ndvi: 0.69, status: 'Good', crop: 'Pulses / दालें', location: { lat: 28.6130, lng: 77.2080 } },
  { id: 'field-f', name: 'Field F', area: '3.8 acres', ndvi: 0.75, status: 'Good', crop: 'Oilseeds / तिलहन', location: { lat: 28.6155, lng: 77.2105 } },
  { id: 'field-g', name: 'Field G', area: '2.8 acres', ndvi: 0.71, status: 'Good', crop: 'Maize / मकई', location: { lat: 28.6140, lng: 77.2075 } },
  { id: 'field-h', name: 'Field H', area: '3.5 acres', ndvi: 0.68, status: 'Moderate', crop: 'Soybean / सोयाबीन', location: { lat: 28.6160, lng: 77.2110 } },
  { id: 'field-i', name: 'Field I', area: '1.5 acres', ndvi: 0.77, status: 'Good', crop: 'Barley / जौ', location: { lat: 28.6125, lng: 77.2070 } },
  { id: 'field-j', name: 'Field J', area: '4.2 acres', ndvi: 0.80, status: 'Excellent', crop: 'Sunflower / सूरजमुखी', location: { lat: 28.6165, lng: 77.2115 } },
];

export function SatelliteAnalysisScreen({ language }: SatelliteAnalysisScreenProps) {
  const [selectedField, setSelectedField] = useState('field-a');
  const [selectedLayer, setSelectedLayer] = useState('ndvi');
  const [isLoading, setIsLoading] = useState(false);
  const [ndviAnalysis, setNdviAnalysis] = useState<NDVIAnalysis | null>(null);
  const [satelliteImages, setSatelliteImages] = useState<SatelliteImagery[]>([]);
  const [mlInsights, setMlInsights] = useState<any>(null);
  const [realtimeAlerts, setRealtimeAlerts] = useState<any[]>([]);
  const [ndviData, setNdviData] = useState<any[]>([]);
  const [moistureData, setMoistureData] = useState<any[]>([]);

  const content = {
    en: {
      title: 'Satellite Analysis',
      subtitle: 'Real-time insights from Google Earth Engine',
      ndviAnalysis: 'NDVI Analysis',
      soilMoisture: 'Soil Moisture',
      weatherOverlay: 'Weather Overlay',
      fieldView: 'Field View',
      selectField: 'Select Field',
      selectLayer: 'Select Layer',
      ndviLayer: 'NDVI (Vegetation)',
      moistureLayer: 'Soil Moisture',
      temperatureLayer: 'Temperature',
      downloadReport: 'Download Report',
      refreshData: 'Refresh Data',
      lastUpdated: 'Last updated',
      excellent: 'Excellent',
      good: 'Good',
      moderate: 'Moderate',
      poor: 'Poor',
      currentNDVI: 'Current NDVI',
      avgMoisture: 'Avg Moisture',
      temperature: 'Temperature',
      humidity: 'Humidity',
      windSpeed: 'Wind Speed',
      cloudCover: 'Cloud Cover',
      insights: 'AI Insights',
      recommendations: 'Recommendations',
      trends: 'Trends',
      alerts: 'Alerts',
      mlAnalysis: 'ML Analysis',
      geeData: 'GEE Data',
      realTimeAlerts: 'Real-time Alerts',
      cropHealth: 'Crop Health',
      diseaseDetection: 'Disease Detection',
      pestAlert: 'Pest Alert',
      nutritionalDeficiency: 'Nutritional Deficiency'
    },
    hi: {
      title: 'उपग्रह विश्लेषण',
      subtitle: 'Google Earth Engine से वास्तविक समय की जानकारी',
      ndviAnalysis: 'NDVI विश्लेषण',
      soilMoisture: 'मिट्टी की नमी',
      weatherOverlay: 'मौसम ओवरले',
      fieldView: 'खेत दृश्य',
      selectField: 'खेत चुनें',
      selectLayer: 'लेयर चुनें',
      ndviLayer: 'NDVI (वनस्पति)',
      moistureLayer: 'मिट्टी की नमी',
      temperatureLayer: 'तापमान',
      downloadReport: 'रिपोर्ट डाउनलोड',
      refreshData: 'डेटा रीफ्रेश',
      lastUpdated: 'अंतिम अपडेट',
      excellent: 'उत्कृष्ट',
      good: 'अच्छा',
      moderate: 'मध्यम',
      poor: 'खराब',
      currentNDVI: 'वर्तमान NDVI',
      avgMoisture: 'औसत नमी',
      temperature: 'तापमान',
      humidity: 'आर्द्रता',
      windSpeed: 'हवा की गति',
      cloudCover: 'बादल कवरेज',
      insights: 'AI अंतर्दृष्टि',
      recommendations: 'सिफारिशें',
      trends: 'रुझान',
      alerts: 'अलर्ट',
      mlAnalysis: 'ML विश्लेषण',
      geeData: 'GEE डेटा',
      realTimeAlerts: 'वास्तविक समय अलर्ट',
      cropHealth: 'फसल स्वास्थ्य',
      diseaseDetection: 'रोग पहचान',
      pestAlert: 'कीट चेतावनी',
      nutritionalDeficiency: 'पोषक तत्वों की कमी'
    }
  };

  const t = content[language as keyof typeof content];

  // Load real data from ML models and GEE
  useEffect(() => {
    loadFieldData();
    loadRealtimeAlerts();
  }, [selectedField]);

  const loadFieldData = async () => {
    setIsLoading(true);
    try {
      const field = fieldData.find(f => f.id === selectedField);
      if (!field) return;

      // Get NDVI analysis from Google Earth Engine
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const [ndviResult, satelliteResult, soilMoisture] = await Promise.all([
        geeService.calculateNDVI(field.location, 1000, startDate, endDate),
        geeService.getSatelliteImagery(field.location, startDate, endDate),
        geeService.analyzeSoilMoisture(field.location, 1000, endDate)
      ]);

      setNdviAnalysis(ndviResult);
      setSatelliteImages(satelliteResult);

      // Generate historical NDVI data
      const historicalNdvi = [];
      const baseNDVI = ndviResult?.averageNDVI || field.ndvi || 0.7;
      for (let i = 30; i >= 0; i -= 5) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        historicalNdvi.push({
          date: date.toISOString().split('T')[0],
          value: baseNDVI + (Math.random() - 0.5) * 0.2,
          field: field.name
        });
      }
      setNdviData(historicalNdvi);

      // Generate moisture data
      const moistureHistory = [];
      const baseMoisture = soilMoisture?.averageMoisture || 40;
      for (let i = 14; i >= 0; i -= 2) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        moistureHistory.push({
          date: date.toISOString().split('T')[0],
          moisture: baseMoisture + (Math.random() - 0.5) * 10,
          temperature: 25 + Math.random() * 10
        });
      }
      setMoistureData(moistureHistory);

      // Get ML insights for crop health
      const cropHealthPrediction = await mlModelService.predictCropHealth(
        [], // No images for now - would be actual crop images
        field.crop.split(' / ')[0],
        field.location
      );
      setMlInsights(cropHealthPrediction);

    } catch (error) {
      console.error('Error loading field data:', error);
      const field = fieldData.find(f => f.id === selectedField);
      
      // Fallback to mock data
      setNdviAnalysis({
        averageNDVI: field?.ndvi || 0.75,
        maxNDVI: (field?.ndvi || 0.75) + 0.1,
        minNDVI: (field?.ndvi || 0.75) - 0.1,
        vegetationHealth: field?.status || 'Good',
        healthPercentage: Math.round((field?.ndvi || 0.75) * 100),
        trendAnalysis: {
          trend: 'Stable',
          changeRate: 0.02
        },
        hotspots: []
      });
      
      setNdviData([
        { date: '2024-01-15', value: 0.45, field: field?.name || 'Field A' },
        { date: '2024-02-01', value: 0.52, field: field?.name || 'Field A' },
        { date: '2024-02-15', value: 0.61, field: field?.name || 'Field A' },
        { date: '2024-03-01', value: 0.68, field: field?.name || 'Field A' },
        { date: '2024-03-15', value: 0.75, field: field?.name || 'Field A' },
        { date: '2024-04-01', value: 0.82, field: field?.name || 'Field A' },
        { date: '2024-04-15', value: 0.79, field: field?.name || 'Field A' },
      ]);
      setMoistureData([
        { date: '2024-04-01', moisture: 45, temperature: 28 },
        { date: '2024-04-03', moisture: 42, temperature: 30 },
        { date: '2024-04-05', moisture: 38, temperature: 32 },
        { date: '2024-04-07', moisture: 51, temperature: 26 },
        { date: '2024-04-09', moisture: 48, temperature: 28 },
        { date: '2024-04-11', moisture: 44, temperature: 31 },
        { date: '2024-04-13', moisture: 41, temperature: 29 },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRealtimeAlerts = async () => {
    try {
      const field = fieldData.find(f => f.id === selectedField);
      if (!field) return;

      const farmProfile = {
        farmId: 'farm-1',
        farmerId: 'farmer-1',
        location: field.location,
        area: parseFloat(field.area.split(' ')[0]),
        soilType: 'loam',
        currentCrops: [field.crop.split(' / ')[0]],
        irrigationType: 'drip',
        farmingPractices: ['organic', 'precision']
      };

      const alerts = await dataIntegrationService.getRealtimeAlerts(farmProfile);
      setRealtimeAlerts(alerts);
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  };

  const refreshData = () => {
    loadFieldData();
    loadRealtimeAlerts();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'excellent':
      case 'उत्कृष्ट':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'good':
      case 'अच्छा':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'moderate':
      case 'मध्यम':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-red-100 text-red-800 border-red-200';
    }
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
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="gap-2">
            <Satellite className="h-3 w-3" />
            {language === 'en' ? 'Live Satellite' : 'लाइव उपग्रह'}
          </Badge>
          <Button variant="outline" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {t.refreshData}
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              // Export comprehensive satellite and ML data to Excel
              import('xlsx').then(XLSX => {
                // Field data
                const fieldExportData = fieldData.map(field => ({
                  Field: field.name,
                  Area: field.area,
                  NDVI: field.ndvi,
                  Status: field.status,
                  Crop: field.crop,
                  Latitude: field.location.lat,
                  Longitude: field.location.lng
                }));

                // NDVI historical data
                const ndviExportData = ndviData.map(point => ({
                  Date: point.date,
                  Field: point.field,
                  NDVI_Value: point.value
                }));

                // Moisture data
                const moistureExportData = moistureData.map(point => ({
                  Date: point.date,
                  Moisture_Percentage: point.moisture,
                  Temperature_Celsius: point.temperature
                }));

                // ML Insights
                const mlExportData = mlInsights ? [{
                  Health_Score: mlInsights.healthScore,
                  Diseases_Detected: mlInsights.diseases?.map(d => d.name).join(', ') || 'None',
                  Pests_Detected: mlInsights.pests?.map(p => p.name).join(', ') || 'None',
                  Nutritional_Deficiency: mlInsights.nutritionalDeficiency?.map(n => n.nutrient).join(', ') || 'None'
                }] : [];

                // GEE Analysis
                const geeExportData = ndviAnalysis ? [{
                  Average_NDVI: ndviAnalysis.averageNDVI,
                  Max_NDVI: ndviAnalysis.maxNDVI,
                  Min_NDVI: ndviAnalysis.minNDVI,
                  Vegetation_Health: ndviAnalysis.vegetationHealth,
                  Health_Percentage: ndviAnalysis.healthPercentage,
                  Trend: ndviAnalysis.trendAnalysis.trend,
                  Change_Rate: ndviAnalysis.trendAnalysis.changeRate
                }] : [];

                // Create workbook with multiple sheets
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(fieldExportData), 'Field Data');
                XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ndviExportData), 'NDVI History');
                XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(moistureExportData), 'Moisture Data');
                if (mlExportData.length > 0) {
                  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(mlExportData), 'ML Analysis');
                }
                if (geeExportData.length > 0) {
                  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(geeExportData), 'GEE Analysis');
                }
                
                XLSX.writeFile(wb, `krishisevak-satellite-analysis-${new Date().toISOString().split('T')[0]}.xlsx`);
              });
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            {t.downloadReport}
          </Button>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">{t.selectField}</label>
          <Select value={selectedField} onValueChange={setSelectedField}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fieldData.map((field) => (
                <SelectItem key={field.id} value={field.id}>
                  {field.name} - {field.area} ({field.crop})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">{t.selectLayer}</label>
          <Select value={selectedLayer} onValueChange={setSelectedLayer}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ndvi">{t.ndviLayer}</SelectItem>
              <SelectItem value="moisture">{t.moistureLayer}</SelectItem>
              <SelectItem value="temperature">{t.temperatureLayer}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Satellite Map View */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    {t.fieldView}
                  </CardTitle>
                  <CardDescription>
                    {selectedLayer === 'ndvi' ? t.ndviLayer : 
                     selectedLayer === 'moisture' ? t.moistureLayer : t.temperatureLayer}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    {t.downloadReport}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-green-100 to-green-200 rounded-lg overflow-hidden relative">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1514922531676-fd289a3062c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXRlbGxpdGUlMjBlYXJ0aCUyMHZpZXclMjBhZ3JpY3VsdHVyZXxlbnwxfHx8fDE3NTc2OTYwNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Satellite view"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                    <p className="text-sm font-medium">
                      {fieldData.find(f => f.id === selectedField)?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.lastUpdated}: 2 mins ago
                    </p>
                  </div>
                  {selectedLayer === 'ndvi' && (
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded" />
                        <span className="text-xs">NDVI Scale</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Field Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          {/* Current Field Stats */}
          <Card>
            <CardHeader>
              <CardTitle>
                {fieldData.find(f => f.id === selectedField)?.name}
              </CardTitle>
              <CardDescription>
                {fieldData.find(f => f.id === selectedField)?.area}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">{t.currentNDVI}</span>
                <Badge className={getStatusColor(fieldData.find(f => f.id === selectedField)?.status || '')}>
                  {fieldData.find(f => f.id === selectedField)?.ndvi}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{t.avgMoisture}</span>
                <span className="font-medium">44%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{t.temperature}</span>
                <span className="font-medium">29°C</span>
              </div>
            </CardContent>
          </Card>

          {/* Weather Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                {language === 'en' ? 'Weather Conditions' : 'मौसम स्थिति'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">{t.temperature}</span>
                </div>
                <span className="font-medium">29°C</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{t.humidity}</span>
                </div>
                <span className="font-medium">65%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{t.windSpeed}</span>
                </div>
                <span className="font-medium">12 km/h</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{t.cloudCover}</span>
                </div>
                <span className="font-medium">25%</span>
              </div>
            </CardContent>
          </Card>

          {/* ML Crop Health Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                {t.mlAnalysis}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mlInsights ? (
                <>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{t.cropHealth}</span>
                      <Badge variant="outline" className="text-purple-700">
                        {mlInsights.healthScore}%
                      </Badge>
                    </div>
                    <p className="text-xs text-purple-700">
                      {language === 'en' 
                        ? `ML analysis shows ${mlInsights.healthScore}% crop health score` 
                        : `ML विश्लेषण ${mlInsights.healthScore}% फसल स्वास्थ्य स्कोर दिखाता है`
                      }
                    </p>
                  </div>
                  
                  {mlInsights.diseases && mlInsights.diseases.length > 0 && (
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium text-red-800">{t.diseaseDetection}</span>
                      </div>
                      <p className="text-xs text-red-700">
                        {mlInsights.diseases[0].name}: {Math.round(mlInsights.diseases[0].probability * 100)}% probability
                      </p>
                      <p className="text-xs text-red-600 mt-1">
                        Treatment: {mlInsights.diseases[0].treatment}
                      </p>
                    </div>
                  )}

                  {mlInsights.pests && mlInsights.pests.length > 0 && (
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-800">{t.pestAlert}</span>
                      </div>
                      <p className="text-xs text-orange-700">
                        {mlInsights.pests[0].name}: {Math.round(mlInsights.pests[0].probability * 100)}% probability
                      </p>
                      <p className="text-xs text-orange-600 mt-1">
                        Treatment: {mlInsights.pests[0].treatment}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">
                    {language === 'en' ? 'Loading ML analysis...' : 'ML विश्लेषण लोड हो रहा है...'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* GEE NDVI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Satellite className="h-5 w-5 text-blue-500" />
                {t.geeData}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ndviAnalysis ? (
                <>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">NDVI Health</span>
                      <Badge variant="outline" className="text-blue-700">
                        {ndviAnalysis.vegetationHealth}
                      </Badge>
                    </div>
                    <p className="text-xs text-blue-700">
                      {language === 'en' 
                        ? `Average NDVI: ${(ndviAnalysis.averageNDVI || 0).toFixed(2)} (${ndviAnalysis.healthPercentage || 0}%)` 
                        : `औसत NDVI: ${(ndviAnalysis.averageNDVI || 0).toFixed(2)} (${ndviAnalysis.healthPercentage || 0}%)`
                      }
                    </p>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      {language === 'en' 
                        ? `Trend: ${ndviAnalysis.trendAnalysis?.trend || 'Unknown'} (${(ndviAnalysis.trendAnalysis?.changeRate || 0) > 0 ? '+' : ''}${((ndviAnalysis.trendAnalysis?.changeRate || 0) * 100).toFixed(1)}%)` 
                        : `रुझान: ${ndviAnalysis.trendAnalysis?.trend || 'अज्ञात'} (${(ndviAnalysis.trendAnalysis?.changeRate || 0) > 0 ? '+' : ''}${((ndviAnalysis.trendAnalysis?.changeRate || 0) * 100).toFixed(1)}%)`
                      }
                    </p>
                  </div>

                  {ndviAnalysis.hotspots && ndviAnalysis.hotspots.length > 0 && (
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-sm text-yellow-800">
                        {language === 'en' 
                          ? `Alert: ${ndviAnalysis.hotspots[0].concern}` 
                          : `चेतावनी: ${ndviAnalysis.hotspots[0].concern}`
                        }
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">
                    {language === 'en' ? 'Loading GEE analysis...' : 'GEE विश्लेषण लोड हो रहा है...'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Real-time Alerts */}
          {realtimeAlerts && realtimeAlerts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  {t.realTimeAlerts}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {realtimeAlerts.map((alert, index) => (
                  <div key={alert.id} className={`p-3 rounded-lg border ${
                    alert.severity === 'High' ? 'bg-red-50 border-red-200' :
                    alert.severity === 'Medium' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className={
                        alert.severity === 'High' ? 'text-red-700' :
                        alert.severity === 'Medium' ? 'text-yellow-700' :
                        'text-blue-700'
                      }>
                        {alert.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className={`text-sm ${
                      alert.severity === 'High' ? 'text-red-800' :
                      alert.severity === 'Medium' ? 'text-yellow-800' :
                      'text-blue-800'
                    }`}>
                      {alert.message}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Analysis Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Tabs defaultValue="ndvi" className="space-y-4">
          <TabsList>
            <TabsTrigger value="ndvi">{t.ndviAnalysis}</TabsTrigger>
            <TabsTrigger value="moisture">{t.soilMoisture}</TabsTrigger>
            <TabsTrigger value="weather">{t.weatherOverlay}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ndvi">
            <Card>
              <CardHeader>
                <CardTitle>{t.ndviAnalysis}</CardTitle>
                <CardDescription>
                  {language === 'en' 
                    ? 'Vegetation health trends over time' 
                    : 'समय के साथ वनस्पति स्वास्थ्य के रुझान'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ndviData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <YAxis domain={[0, 1]} />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#16a34a" 
                        fill="#16a34a" 
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="moisture">
            <Card>
              <CardHeader>
                <CardTitle>{t.soilMoisture}</CardTitle>
                <CardDescription>
                  {language === 'en' 
                    ? 'Soil moisture and temperature correlation' 
                    : 'मिट्टी की नमी और तापमान सहसंबंध'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={moistureData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <YAxis />
                      <Line 
                        type="monotone" 
                        dataKey="moisture" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="Moisture %"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="temperature" 
                        stroke="#f97316" 
                        strokeWidth={2}
                        name="Temperature °C"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="weather">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'en' ? 'Weather Trends' : 'मौसम रुझान'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span>{language === 'en' ? 'Today' : 'आज'}</span>
                      <span className="font-medium">29°C, 65% humidity</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span>{language === 'en' ? 'Tomorrow' : 'कल'}</span>
                      <span className="font-medium">31°C, 58% humidity</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <span>{language === 'en' ? 'Day After' : 'परसों'}</span>
                      <span className="font-medium">27°C, 72% humidity</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'en' ? 'Precipitation Forecast' : 'वर्षा पूर्वानुमान'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>{language === 'en' ? 'Today' : 'आज'}</span>
                      <span className="font-medium">0 mm</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span>{language === 'en' ? 'Tomorrow' : 'कल'}</span>
                      <span className="font-medium">15 mm</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-100 rounded-lg">
                      <span>{language === 'en' ? 'Day After' : 'परसों'}</span>
                      <span className="font-medium">25 mm</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}