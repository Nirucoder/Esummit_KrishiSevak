import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

import { AlertNotificationSystem } from './AlertNotificationSystem';
import { ExcelExport, createSatelliteData, createWeatherData } from './ExcelExport';
import { VoiceSupport } from './VoiceSupport';
import { WeatherIntegration } from './WeatherIntegration';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Droplets, 
  Thermometer, 
  Eye,
  FileText,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mic,
  Download,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DashboardProps {
  language: string;
}

// Mock data for charts
const ndviData = [
  { date: '2024-01-01', value: 0.65 },
  { date: '2024-01-15', value: 0.68 },
  { date: '2024-02-01', value: 0.72 },
  { date: '2024-02-15', value: 0.75 },
  { date: '2024-03-01', value: 0.78 },
  { date: '2024-03-15', value: 0.82 },
  { date: '2024-04-01', value: 0.79 }
];

const soilMoistureData = [
  { date: '2024-03-01', moisture: 45 },
  { date: '2024-03-08', moisture: 42 },
  { date: '2024-03-15', moisture: 38 },
  { date: '2024-03-22', moisture: 51 },
  { date: '2024-03-29', moisture: 48 },
  { date: '2024-04-05', moisture: 44 },
  { date: '2024-04-12', moisture: 41 }
];

const weatherData = [
  { day: 'Mon', temp: 28, humidity: 65 },
  { day: 'Tue', temp: 32, humidity: 58 },
  { day: 'Wed', temp: 29, humidity: 72 },
  { day: 'Thu', temp: 31, humidity: 61 },
  { day: 'Fri', temp: 27, humidity: 68 },
  { day: 'Sat', temp: 30, humidity: 55 },
  { day: 'Sun', temp: 33, humidity: 50 }
];

export function Dashboard({ language }: DashboardProps) {
  const [showVoiceSupport, setShowVoiceSupport] = useState(false);
  const [showWeatherIntegration, setShowWeatherIntegration] = useState(false);
  const content = {
    en: {
      title: 'Farm Dashboard',
      subtitle: 'Real-time insights for your farm',
      ndviTitle: 'NDVI Health Index',
      ndviDesc: 'Vegetation health tracking',
      soilMoistureTitle: 'Soil Moisture',
      soilMoistureDesc: 'Current moisture levels',
      weatherTitle: '7-Day Weather',
      weatherDesc: 'Temperature & humidity forecast',
      quickActions: 'Quick Actions',
      checkCropHealth: 'Check Crop Health',
      viewSoilReport: 'View Soil Report',
      applyScheme: 'Apply for Scheme',
      recentAlerts: 'Recent Alerts',
      farmStats: 'Farm Statistics',
      totalArea: 'Total Area',
      activeFields: 'Active Fields',
      cropYield: 'Expected Yield',
      soilHealth: 'Soil Health',
      irrigationStatus: 'Irrigation Status',
      pestRisk: 'Pest Risk',
      acres: 'acres',
      quintals: 'quintals',
      excellent: 'Excellent',
      good: 'Good',
      moderate: 'Moderate',
      optimal: 'Optimal',
      scheduled: 'Scheduled',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      alerts: {
        irrigation: 'Irrigation recommended for Field A',
        weather: 'Heavy rainfall expected tomorrow',
        pest: 'Low pest activity detected'
      }
    },
    hi: {
      title: 'खेत डैशबोर्ड',
      subtitle: 'आपके खेत के लिए वास्तविक समय की जानकारी',
      ndviTitle: 'NDVI स्वास्थ्य सूचकांक',
      ndviDesc: 'वनस्पति स्वास्थ्य ट्रैकिंग',
      soilMoistureTitle: 'मिट्टी की नमी',
      soilMoistureDesc: 'वर्तमान नमी का स्तर',
      weatherTitle: '7-दिन का मौसम',
      weatherDesc: 'तापमान और आर्द्रता पूर्वानुमान',
      quickActions: 'त्वरित कार्य',
      checkCropHealth: 'फसल स्वास्थ्य जांचें',
      viewSoilReport: 'मिट्टी रिपोर्ट देखें',
      applyScheme: 'योजना के लिए आवेदन',
      recentAlerts: 'हाल की अलर्ट',
      farmStats: 'खेत आंकड़े',
      totalArea: 'कुल क्षेत्रफल',
      activeFields: 'सक्रिय खेत',
      cropYield: 'अपेक्षित उत्पादन',
      soilHealth: 'मिट्टी स्वास्थ्य',
      irrigationStatus: 'सिंचाई स्थिति',
      pestRisk: 'कीट जोखिम',
      acres: 'एकड़',
      quintals: 'क्विंटल',
      excellent: 'उत्कृष्ट',
      good: 'अच्छा',
      moderate: 'मध्यम',
      optimal: 'इष्टतम',
      scheduled: 'निर्धारित',
      low: 'कम',
      medium: 'मध्यम',
      high: 'उच्च',
      alerts: {
        irrigation: 'खेत A के लिए सिंचाई की सिफारिश',
        weather: 'कल भारी बारिश की उम्मीद',
        pest: 'कम कीट गतिविधि का पता चला'
      }
    }
  };

  const t = content[language as keyof typeof content] || content.en;

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
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            {language === 'en' ? 'Live Data' : 'लाइव डेटा'}
          </Badge>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowVoiceSupport(!showVoiceSupport)}
              className="gap-2"
            >
              <Mic className="h-4 w-4" />
              {language === 'en' ? 'Voice' : 'आवाज'}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowWeatherIntegration(!showWeatherIntegration)}
              className="gap-2"
            >
              <Thermometer className="h-4 w-4" />
              {language === 'en' ? 'Weather' : 'मौसम'}
            </Button>
            <ExcelExport
              data={createSatelliteData(ndviData.map(item => ({
                date: item.date,
                ndvi: item.value,
                cropHealth: 'Good',
                stressLevel: 'Low',
                irrigationNeed: 'Moderate',
                diseaseIndicators: 'None'
              })), language)}
              filename="dashboard_data"
              language={language}
              size="sm"
            />
          </div>
        </div>
      </motion.div>

      {/* Farm Statistics Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.totalArea}</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5 {t.acres}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +2.1% from last season
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.activeFields}</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              <CheckCircle className="inline h-3 w-3 mr-1 text-green-500" />
              All monitored
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.cropYield}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85 {t.quintals}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
              +12% above average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.soilHealth}</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{t.excellent}</div>
            <Progress value={85} className="mt-2" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* NDVI Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t.ndviTitle}</CardTitle>
                  <CardDescription>{t.ndviDesc}</CardDescription>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  0.82 {t.excellent}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ndviData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                    <YAxis />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#16a34a" 
                      fill="#16a34a" 
                      fillOpacity={0.1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Soil Moisture Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t.soilMoistureTitle}</CardTitle>
                  <CardDescription>{t.soilMoistureDesc}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span className="font-semibold">41%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={soilMoistureData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                    <YAxis />
                    <Line 
                      type="monotone" 
                      dataKey="moisture" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Weather and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Weather Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t.weatherTitle}</CardTitle>
                  <CardDescription>{t.weatherDesc}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-orange-500" />
                  <span className="font-semibold">30°C</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weatherData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Bar dataKey="temp" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions & Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="space-y-6"
        >
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{t.quickActions}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start gap-3 bg-green-600 hover:bg-green-700">
                <Activity className="h-4 w-4" />
                {t.checkCropHealth}
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <FileText className="h-4 w-4" />
                {t.viewSoilReport}
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <CreditCard className="h-4 w-4" />
                {t.applyScheme}
              </Button>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>{t.recentAlerts}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Droplets className="h-4 w-4 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{t.alerts.irrigation}</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{t.alerts.weather}</p>
                  <p className="text-xs text-muted-foreground">6 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{t.alerts.pest}</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Extended Status Monitoring Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-500" />
              {t.irrigationStatus}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{t.optimal}</div>
            <Progress value={75} className="mt-2" />
            <p className="text-sm text-muted-foreground mt-2">
              Next irrigation in 3 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-green-500" />
              {t.pestRisk}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{t.low}</div>
            <Progress value={25} className="mt-2" />
            <p className="text-sm text-muted-foreground mt-2">
              Last inspection: 2 days ago
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              {language === 'en' ? 'Growth Stage' : 'वृद्धि चरण'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {language === 'en' ? 'Flowering' : 'फूल'}
            </div>
            <Progress value={60} className="mt-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {language === 'en' ? 'Harvest in 45 days' : '45 दिन में कटाई'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-red-500" />
              {language === 'en' ? 'Field Temperature' : 'खेत तापमान'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">30°C</div>
            <Progress value={65} className="mt-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {language === 'en' ? 'Optimal for growth' : 'वृद्धि के लिए इष्टतम'}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Field-wise Monitoring Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.65 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-green-600" />
              {language === 'en' ? 'Field-wise Monitoring' : 'खेत-वार निगरानी'}
            </CardTitle>
            <CardDescription>
              {language === 'en' ? 'Overview of all field conditions' : 'सभी खेत की स्थितियों का अवलोकन'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { field: 'Field A', crop: 'Wheat', status: 'Excellent', color: 'green' },
                { field: 'Field B', crop: 'Rice', status: 'Good', color: 'blue' },
                { field: 'Field C', crop: 'Cotton', status: 'Moderate', color: 'yellow' },
                { field: 'Field D', crop: 'Sugarcane', status: 'Good', color: 'blue' }
              ].map((field, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{field.field}</h4>
                    <div className={`w-3 h-3 rounded-full bg-${field.color}-500`}></div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {language === 'en' ? 'Crop:' : 'फसल:'} {field.crop}
                  </p>
                  <p className="text-sm font-medium">
                    {language === 'en' ? 'Status:' : 'स्थिति:'} {field.status}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Alert System, Farm Management and Resource Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <AlertNotificationSystem 
            language={language}
            farmData={{
              soilMoisture: 32,
              ndvi: 0.68,
              weather: { temp: 30, humidity: 65 },
              cropStage: 'flowering',
              pestRisk: 'high',
              soilHealth: { ph: 7.2, organic: 3.8 }
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.75 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                {language === 'en' ? 'Farm Management' : 'खेत प्रबंधन'}
              </CardTitle>
              <CardDescription>
                {language === 'en' ? 'Manage your farm operations' : 'अपने खेत के संचालन का प्रबंधन करें'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">{language === 'en' ? 'Active Tasks' : 'सक्रिय कार्य'}</span>
                  </div>
                  <div className="text-2xl font-bold text-green-700">12</div>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">{language === 'en' ? 'Completed' : 'पूर्ण'}</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-700">45</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{language === 'en' ? 'Fertilizer Application' : 'उर्वरक प्रयोग'}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {language === 'en' ? 'Due Today' : 'आज देय'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">{language === 'en' ? 'Field Inspection' : 'क्षेत्र निरीक्षण'}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {language === 'en' ? 'Tomorrow' : 'कल'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">{language === 'en' ? 'Irrigation Schedule' : 'सिंचाई कार्यक्रम'}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {language === 'en' ? 'Weekly' : 'साप्ताहिक'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-600" />
                {language === 'en' ? 'Resource Monitor' : 'संसाधन निगरानी'}
              </CardTitle>
              <CardDescription>
                {language === 'en' ? 'Track resource utilization' : 'संसाधन उपयोग ट्रैक करें'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">{language === 'en' ? 'Water Usage' : 'पानी का उपयोग'}</span>
                  </div>
                  <span className="text-sm font-medium">2,450L</span>
                </div>
                <Progress value={72} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{language === 'en' ? 'Fertilizer Stock' : 'उर्वरक स्टॉक'}</span>
                  </div>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <Progress value={85} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">{language === 'en' ? 'Equipment Status' : 'उपकरण स्थिति'}</span>
                  </div>
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                    {language === 'en' ? 'Operational' : 'चालू'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">{language === 'en' ? 'Maintenance Due' : 'रखरखाव देय'}</span>
                  </div>
                  <span className="text-sm font-medium">3 items</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Productivity Insights and Equipment Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.85 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                {language === 'en' ? 'Productivity Insights' : 'उत्पादकता अंतर्दृष्टि'}
              </CardTitle>
              <CardDescription>
                {language === 'en' ? 'Performance metrics and trends' : 'प्रदर्शन मेट्रिक्स और रुझान'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-sm text-muted-foreground mb-1">
                    {language === 'en' ? 'This Season' : 'इस सीजन'}
                  </div>
                  <div className="text-xl font-bold text-green-700">+15%</div>
                  <div className="text-xs text-green-600">
                    {language === 'en' ? 'Yield Increase' : 'उत्पादन वृद्धि'}
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm text-muted-foreground mb-1">
                    {language === 'en' ? 'Water Savings' : 'पानी की बचत'}
                  </div>
                  <div className="text-xl font-bold text-blue-700">22%</div>
                  <div className="text-xs text-blue-600">
                    {language === 'en' ? 'vs Last Year' : 'पिछले साल से'}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{language === 'en' ? 'Cost Efficiency' : 'लागत दक्षता'}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={78} className="w-16 h-2" />
                    <span className="text-sm font-medium">78%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">{language === 'en' ? 'Automation Level' : 'स्वचालन स्तर'}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={65} className="w-16 h-2" />
                    <span className="text-sm font-medium">65%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">{language === 'en' ? 'Sustainability Score' : 'स्थिरता स्कोर'}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={82} className="w-16 h-2" />
                    <span className="text-sm font-medium">82%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-600" />
                {language === 'en' ? 'Equipment Management' : 'उपकरण प्रबंधन'}
              </CardTitle>
              <CardDescription>
                {language === 'en' ? 'Monitor and maintain farm equipment' : 'खेत उपकरण की निगरानी और रखरखाव'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="text-sm font-medium">
                        {language === 'en' ? 'Tractor - John Deere' : 'ट्रैक्टर - जॉन डियर'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {language === 'en' ? 'Last service: 15 days ago' : 'अंतिम सेवा: 15 दिन पहले'}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-700 text-xs">
                    {language === 'en' ? 'Active' : 'सक्रिय'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div>
                      <div className="text-sm font-medium">
                        {language === 'en' ? 'Irrigation Pump' : 'सिंचाई पंप'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {language === 'en' ? 'Service due in 5 days' : '5 दिन में सेवा देय'}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-700 text-xs">
                    {language === 'en' ? 'Maintenance' : 'रखरखाव'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <div className="text-sm font-medium">
                        {language === 'en' ? 'Fertilizer Spreader' : 'उर्वरक फैलाने वाला'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {language === 'en' ? 'Ready for use' : 'उपयोग के लिए तैयार'}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-700 text-xs">
                    {language === 'en' ? 'Ready' : 'तैयार'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Voice Support Modal */}
      {showVoiceSupport && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <VoiceSupport 
            language={language} 
            isEnabled={true}
            onToggle={() => setShowVoiceSupport(false)}
          />
        </motion.div>
      )}

      {/* Weather Integration Modal */}
      {showWeatherIntegration && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <WeatherIntegration 
            language={language} 
            location={{ lat: 28.6139, lon: 77.2090, name: language === 'hi' ? 'नई दिल्ली, भारत' : 'New Delhi, India' }}
          />
        </motion.div>
      )}
    </div>
  );
}