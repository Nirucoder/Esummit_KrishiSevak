import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { 
  CloudRain, 
  Thermometer, 
  Droplets, 
  AlertTriangle,
  Phone,
  TrendingDown,
  TrendingUp,
  Eye,
  Calendar,
  MapPin
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DroughtMonitoringScreenProps {
  language: string;
}

// Mock data
const rainfallData = [
  { month: 'Jan', rainfall: 15, normal: 20, temperature: 22 },
  { month: 'Feb', rainfall: 10, normal: 25, temperature: 25 },
  { month: 'Mar', rainfall: 5, normal: 30, temperature: 28 },
  { month: 'Apr', rainfall: 8, normal: 35, temperature: 32 },
  { month: 'May', rainfall: 12, normal: 40, temperature: 35 },
  { month: 'Jun', rainfall: 85, normal: 120, temperature: 33 },
  { month: 'Jul', rainfall: 95, normal: 150, temperature: 30 }
];

const groundwaterData = [
  { date: '2024-01-01', level: 45, trend: 'stable' },
  { date: '2024-02-01', level: 42, trend: 'declining' },
  { date: '2024-03-01', level: 38, trend: 'declining' },
  { date: '2024-04-01', level: 35, trend: 'declining' },
  { date: '2024-05-01', level: 32, trend: 'declining' },
  { date: '2024-06-01', level: 38, trend: 'improving' },
  { date: '2024-07-01', level: 41, trend: 'improving' }
];

const forecastData = [
  { day: 'Today', temp: 34, humidity: 45, rainfall: 0 },
  { day: 'Tomorrow', temp: 36, humidity: 42, rainfall: 2 },
  { day: 'Day 3', temp: 33, humidity: 55, rainfall: 15 },
  { day: 'Day 4', temp: 31, humidity: 68, rainfall: 25 },
  { day: 'Day 5', temp: 29, humidity: 72, rainfall: 18 },
  { day: 'Day 6', temp: 32, humidity: 58, rainfall: 8 },
  { day: 'Day 7', temp: 35, humidity: 48, rainfall: 0 }
];

export function DroughtMonitoringScreen({ language }: DroughtMonitoringScreenProps) {
  const [selectedRegion, setSelectedRegion] = useState('current');
  const droughtRiskLevel = 'medium'; // low, medium, high

  const content = {
    en: {
      title: 'Drought Monitoring',
      subtitle: 'Real-time drought risk assessment and early warning system',
      droughtRisk: 'Drought Risk Level',
      rainfallAnalysis: 'Rainfall Analysis',
      groundwaterLevel: 'Groundwater Level',
      weatherForecast: 'Weather Forecast',
      currentConditions: 'Current Conditions',
      alerts: 'Active Alerts',
      recommendations: 'Recommendations',
      helplines: 'Emergency Helplines',
      riskMeter: 'Risk Meter',
      parameters: 'Parameters',
      forecast: 'Forecast',
      regionalView: 'Regional View',
      low: 'Low Risk',
      medium: 'Medium Risk',
      high: 'High Risk',
      rainfall: 'Rainfall',
      temperature: 'Temperature',
      humidity: 'Humidity',
      soilMoisture: 'Soil Moisture',
      normal: 'Normal',
      belowNormal: 'Below Normal',
      aboveNormal: 'Above Normal',
      declining: 'Declining',
      stable: 'Stable',
      improving: 'Improving',
      lastWeek: 'Last 7 Days',
      nextWeek: 'Next 7 Days',
      days: 'days',
      helplineNumber: 'Drought Helpline: 1800-123-4567',
      agriculturalOfficer: 'Agricultural Officer: 9876543210',
      viewMap: 'View Regional Map',
      downloadReport: 'Download Report'
    },
    hi: {
      title: 'सूखा निगरानी',
      subtitle: 'वास्तविक समय सूखा जोखिम मूल्यांकन और पूर्व चेतावनी प्रणाली',
      droughtRisk: 'सूखा जोखिम स्तर',
      rainfallAnalysis: 'वर्षा विश्लेषण',
      groundwaterLevel: 'भूजल स्तर',
      weatherForecast: 'मौसम पूर्वानुमान',
      currentConditions: 'वर्तमान स्थितियां',
      alerts: 'सक्रिय अलर्ट',
      recommendations: 'सिफारिशें',
      helplines: 'आपातकालीन हेल्पलाइन',
      riskMeter: 'जोखिम मीटर',
      parameters: 'मापदंड',
      forecast: 'पूर्वानुमान',
      regionalView: 'क्षेत्रीय दृश्य',
      low: 'कम जोखिम',
      medium: 'मध्यम जोखिम',
      high: 'उच्च जोखिम',
      rainfall: 'वर्षा',
      temperature: 'तापमान',
      humidity: 'आर्द्रता',
      soilMoisture: 'मिट्टी की नमी',
      normal: 'सामान्य',
      belowNormal: 'सामान्य से कम',
      aboveNormal: 'सामान्य से अधिक',
      declining: 'घटता हुआ',
      stable: 'स्थिर',
      improving: 'सुधर रहा',
      lastWeek: 'पिछले 7 दिन',
      nextWeek: 'अगले 7 दिन',
      days: 'दिन',
      helplineNumber: 'सूखा हेल्पलाइन: 1800-123-4567',
      agriculturalOfficer: 'कृषि अधिकारी: 9876543210',
      viewMap: 'क्षेत्रीय मानचित्र देखें',
      downloadReport: 'रिपोर्ट डाउनलोड करें'
    }
  };

  const t = content[language as keyof typeof content];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'medium':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'high':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getRiskValue = (risk: string) => {
    switch (risk) {
      case 'low': return 25;
      case 'medium': return 60;
      case 'high': return 85;
      default: return 0;
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
            <CloudRain className="h-3 w-3" />
            {language === 'en' ? 'Live Weather' : 'लाइव मौसम'}
          </Badge>
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            {t.viewMap}
          </Button>
        </div>
      </motion.div>

      {/* Risk Meter and Current Conditions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Risk Meter */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              {t.riskMeter}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={droughtRiskLevel === 'high' ? '#ef4444' : droughtRiskLevel === 'medium' ? '#f97316' : '#16a34a'}
                  strokeWidth="8"
                  strokeDasharray={`${getRiskValue(droughtRiskLevel) * 2.83} 283`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold">{getRiskValue(droughtRiskLevel)}%</div>
                  <div className="text-xs text-muted-foreground">Risk</div>
                </div>
              </div>
            </div>
            <Badge className={getRiskColor(droughtRiskLevel)}>
              {t[droughtRiskLevel as keyof typeof t]}
            </Badge>
          </CardContent>
        </Card>

        {/* Current Conditions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t.currentConditions}</CardTitle>
            <CardDescription>
              {language === 'en' ? 'Real-time environmental parameters' : 'वास्तविक समय पर्यावरणीय मापदंड'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Thermometer className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">34°C</div>
                <p className="text-sm text-muted-foreground">{t.temperature}</p>
                <Badge variant="outline" className="text-xs mt-1">
                  {t.aboveNormal}
                </Badge>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <CloudRain className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">0mm</div>
                <p className="text-sm text-muted-foreground">{t.rainfall}</p>
                <Badge variant="outline" className="text-xs mt-1">
                  {t.belowNormal}
                </Badge>
              </div>
              <div className="text-center p-4 bg-cyan-50 rounded-lg">
                <Droplets className="h-8 w-8 text-cyan-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">45%</div>
                <p className="text-sm text-muted-foreground">{t.humidity}</p>
                <Badge variant="outline" className="text-xs mt-1">
                  {t.belowNormal}
                </Badge>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Droplets className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">38%</div>
                <p className="text-sm text-muted-foreground">{t.soilMoisture}</p>
                <Badge variant="outline" className="text-xs mt-1">
                  {t.normal}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Analysis Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Rainfall Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CloudRain className="h-5 w-5 text-blue-500" />
              {t.rainfallAnalysis}
            </CardTitle>
            <CardDescription>
              {language === 'en' ? 'Monthly rainfall vs normal patterns' : 'मासिक वर्षा बनाम सामान्य पैटर्न'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rainfallData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Bar dataKey="rainfall" fill="#3b82f6" name="Actual Rainfall" />
                  <Bar dataKey="normal" fill="#93c5fd" name="Normal Rainfall" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Groundwater Level */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-cyan-500" />
              {t.groundwaterLevel}
            </CardTitle>
            <CardDescription>
              {language === 'en' ? 'Groundwater depth and trends' : 'भूजल गहराई और रुझान'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={groundwaterData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis />
                  <Area 
                    type="monotone" 
                    dataKey="level" 
                    stroke="#06b6d4" 
                    fill="#06b6d4" 
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current Level</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">41 meters</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  {t.improving}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Weather Forecast */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              {t.weatherForecast}
            </CardTitle>
            <CardDescription>
              {language === 'en' ? '7-day weather outlook with rainfall predictions' : '7-दिन मौसम दृष्टिकोण वर्षा पूर्वानुमान के साथ'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {forecastData.map((day, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium mb-2">{day.day}</p>
                  <div className="mb-2">
                    <Thermometer className="h-6 w-6 text-orange-500 mx-auto mb-1" />
                    <p className="text-lg font-bold">{day.temp}°C</p>
                  </div>
                  <div className="mb-2">
                    <Droplets className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                    <p className="text-sm">{day.humidity}%</p>
                  </div>
                  <div>
                    <CloudRain className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-sm font-medium">{day.rainfall}mm</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Alerts and Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Active Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              {t.alerts}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {language === 'en' 
                  ? 'Groundwater levels are declining. Monitor usage closely.' 
                  : 'भूजल स्तर घट रहा है। उपयोग की बारीकी से निगरानी करें।'
                }
              </AlertDescription>
            </Alert>
            <Alert>
              <CloudRain className="h-4 w-4" />
              <AlertDescription>
                {language === 'en' 
                  ? 'Rainfall deficit of 35% compared to normal for this period.' 
                  : 'इस अवधि के लिए सामान्य की तुलना में 35% वर्षा की कमी।'
                }
              </AlertDescription>
            </Alert>
            <Alert>
              <Thermometer className="h-4 w-4" />
              <AlertDescription>
                {language === 'en' 
                  ? 'High temperature alert: Heat stress conditions expected.' 
                  : 'उच्च तापमान अलर्ट: गर्मी तनाव की स्थिति अपेक्षित।'
                }
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Recommendations and Helplines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-green-500" />
              {t.recommendations} & {t.helplines}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800 mb-2">
                {language === 'en' 
                  ? 'Water Conservation: Implement drip irrigation to reduce water usage by 40%.' 
                  : 'जल संरक्षण: पानी के उपयोग को 40% तक कम करने के लिए ड्रिप सिंचाई लागू करें।'
                }
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 mb-2">
                {language === 'en' 
                  ? 'Crop Selection: Consider drought-resistant varieties for next season.' 
                  : 'फसल चयन: अगले सीजन के लिए सूखा प्रतिरोधी किस्मों पर विचार करें।'
                }
              </p>
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">{t.helplines}</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <Phone className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{t.helplineNumber}</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <Phone className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{t.agriculturalOfficer}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>


    </div>
  );
}