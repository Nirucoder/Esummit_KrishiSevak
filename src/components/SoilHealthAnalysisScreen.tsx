import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  TestTube, 
  TrendingUp, 
  Target, 
  Activity,
  MapPin,
  Calendar,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar } from 'recharts';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SoilHealthAnalysisScreenProps {
  language: string;
}

// Mock data
const npkData = [
  { nutrient: 'Nitrogen', current: 65, optimal: 80, unit: 'kg/ha' },
  { nutrient: 'Phosphorus', current: 45, optimal: 60, unit: 'kg/ha' },
  { nutrient: 'Potassium', current: 72, optimal: 70, unit: 'kg/ha' },
];

const soilParametersData = [
  { parameter: 'pH Level', value: 7.2, status: 'optimal' },
  { parameter: 'Organic Matter', value: 3.8, status: 'good' },
  { parameter: 'Nitrogen', value: 65, status: 'low' },
  { parameter: 'Phosphorus', value: 45, status: 'low' },
  { parameter: 'Potassium', value: 72, status: 'optimal' },
  { parameter: 'Moisture', value: 42, status: 'good' }
];

const soilTrendData = [
  { month: 'Jan', ph: 6.8, organic: 3.2, nitrogen: 58 },
  { month: 'Feb', ph: 6.9, organic: 3.4, nitrogen: 61 },
  { month: 'Mar', ph: 7.0, organic: 3.6, nitrogen: 63 },
  { month: 'Apr', ph: 7.1, organic: 3.7, nitrogen: 64 },
  { month: 'May', ph: 7.2, organic: 3.8, nitrogen: 65 }
];

const managementZones = [
  { zone: 'Zone A', area: '2.1 acres', fertility: 'High', recommendation: 'Maintain current practices' },
  { zone: 'Zone B', area: '1.8 acres', fertility: 'Medium', recommendation: 'Add organic matter' },
  { zone: 'Zone C', area: '2.5 acres', fertility: 'Low', recommendation: 'Apply NPK fertilizer' },
  { zone: 'Zone D', area: '1.6 acres', fertility: 'High', recommendation: 'Reduce nitrogen input' }
];

const radarData = [
  { subject: 'pH', A: 85, B: 65, fullMark: 100 },
  { subject: 'Organic Matter', A: 76, B: 85, fullMark: 100 },
  { subject: 'Nitrogen', A: 65, B: 80, fullMark: 100 },
  { subject: 'Phosphorus', A: 45, B: 60, fullMark: 100 },
  { subject: 'Potassium', A: 72, B: 70, fullMark: 100 },
  { subject: 'Moisture', A: 84, B: 75, fullMark: 100 }
];

export function SoilHealthAnalysisScreen({ language }: SoilHealthAnalysisScreenProps) {
  const [selectedField, setSelectedField] = useState('field-a');
  const [isLoading, setIsLoading] = useState(false);

  const content = {
    en: {
      title: 'Soil Health Analysis',
      subtitle: 'Multi-spectral soil composition and nutrient analysis',
      soilComposition: 'Soil Composition',
      nutrientLevels: 'Nutrient Levels',
      deficiencyDetection: 'Deficiency Detection',
      managementZones: 'Management Zones',
      trendAnalysis: 'Trend Analysis',
      recommendations: 'Recommendations',
      npkAnalysis: 'NPK Analysis',
      soilParameters: 'Soil Parameters',
      organicMatter: 'Organic Matter',
      phLevel: 'pH Level',
      moisture: 'Soil Moisture',
      nitrogen: 'Nitrogen (N)',
      phosphorus: 'Phosphorus (P)',
      potassium: 'Potassium (K)',
      optimal: 'Optimal',
      good: 'Good',
      low: 'Low',
      high: 'High',
      current: 'Current',
      target: 'Target',
      downloadReport: 'Download Report',
      refreshData: 'Refresh Data',
      lastUpdated: 'Last updated',
      fertility: 'Fertility',
      recommendation: 'Recommendation',
      zone: 'Zone',
      area: 'Area',
      overallHealth: 'Overall Soil Health',
      excellent: 'Excellent',
      moderate: 'Moderate',
      poor: 'Poor',
      trends: 'Historical Trends',
      comparison: 'Field Comparison'
    },
    hi: {
      title: 'मिट्टी स्वास्थ्य विश्लेषण',
      subtitle: 'बहु-स्पेक्ट्रल मिट्टी संरचना और पोषक तत्व विश्लेषण',
      soilComposition: 'मिट्टी संरचना',
      nutrientLevels: 'पोषक स्तर',
      deficiencyDetection: 'कमी का पता लगाना',
      managementZones: 'प्रबंधन क्षेत्र',
      trendAnalysis: 'रुझान विश्लेषण',
      recommendations: 'सिफारिशें',
      npkAnalysis: 'NPK विश्लेषण',
      soilParameters: 'मिट्टी मापदंड',
      organicMatter: 'जैविक पदार्थ',
      phLevel: 'pH स्तर',
      moisture: 'मिट्टी की नमी',
      nitrogen: 'नाइट्रोजन (N)',
      phosphorus: 'फास्फोरस (P)',
      potassium: 'पोटेशियम (K)',
      optimal: 'इष्टतम',
      good: 'अच्छा',
      low: 'कम',
      high: 'उच्च',
      current: 'वर्तमान',
      target: 'लक्ष्य',
      downloadReport: 'रिपोर्ट डाउनलोड',
      refreshData: 'डेटा रीफ्रेश',
      lastUpdated: 'अंतिम अपडेट',
      fertility: 'उर्वरता',
      recommendation: 'सिफारिश',
      zone: 'क्षेत्र',
      area: 'क्षेत्रफल',
      overallHealth: 'समग्र मिट्टी स्वास्थ्य',
      excellent: 'उत्कृष्ट',
      moderate: 'मध्यम',
      poor: 'खराब',
      trends: 'ऐतिहासिक रुझान',
      comparison: 'खेत तुलना'
    }
  };

  const t = content[language as keyof typeof content];

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'good':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'low':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'high':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getFertilityColor = (fertility: string) => {
    switch (fertility.toLowerCase()) {
      case 'high':
        return 'text-green-600 bg-green-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
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
            <TestTube className="h-3 w-3" />
            {language === 'en' ? 'Lab Analysis' : 'लैब विश्लेषण'}
          </Badge>
          <Button variant="outline" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {t.refreshData}
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            {t.downloadReport}
          </Button>
        </div>
      </motion.div>

      {/* Overall Health Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.overallHealth}</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{t.good}</div>
            <Progress value={75} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              75/100 Health Score
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.phLevel}</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.2</div>
            <Badge className="mt-2 bg-green-100 text-green-800 border-green-200">
              {t.optimal}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.organicMatter}</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.8%</div>
            <Badge className="mt-2 bg-blue-100 text-blue-800 border-blue-200">
              {t.good}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.moisture}</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42%</div>
            <Badge className="mt-2 bg-blue-100 text-blue-800 border-blue-200">
              {t.good}
            </Badge>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs defaultValue="nutrients" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="nutrients">{language === 'en' ? 'Nutrients' : 'पोषक तत्व'}</TabsTrigger>
            <TabsTrigger value="composition">{language === 'en' ? 'Composition' : 'संरचना'}</TabsTrigger>
            <TabsTrigger value="zones">{language === 'en' ? 'Zones' : 'क्षेत्र'}</TabsTrigger>
            <TabsTrigger value="trends">{language === 'en' ? 'Trends' : 'रुझान'}</TabsTrigger>
          </TabsList>

          <TabsContent value="nutrients" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* NPK Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TestTube className="h-5 w-5 text-purple-500" />
                    {t.npkAnalysis}
                  </CardTitle>
                  <CardDescription>
                    {language === 'en' 
                      ? 'Primary macronutrient levels and requirements' 
                      : 'प्राथमिक मैक्रोन्यूट्रिएंट स्तर और आवश्यकताएं'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {npkData.map((nutrient, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{nutrient.nutrient}</span>
                          <span className="text-sm text-muted-foreground">
                            {nutrient.current}/{nutrient.optimal} {nutrient.unit}
                          </span>
                        </div>
                        <Progress 
                          value={(nutrient.current / nutrient.optimal) * 100} 
                          className="h-3"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{t.current}: {nutrient.current} {nutrient.unit}</span>
                          <span>{t.target}: {nutrient.optimal} {nutrient.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Soil Parameters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-500" />
                    {t.soilParameters}
                  </CardTitle>
                  <CardDescription>
                    {language === 'en' 
                      ? 'Complete soil health parameter analysis' 
                      : 'पूर्ण मिट्टी स्वास्थ्य मापदंड विश्लेषण'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {soilParametersData.map((param, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                        <div>
                          <p className="font-medium">{param.parameter}</p>
                          <p className="text-sm text-muted-foreground">{param.value}</p>
                        </div>
                        <Badge className={getStatusColor(param.status)}>
                          {t[param.status as keyof typeof t]}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="composition" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>{t.comparison}</CardTitle>
                  <CardDescription>
                    {language === 'en' 
                      ? 'Current vs optimal soil parameters' 
                      : 'वर्तमान बनाम इष्टतम मिट्टी मापदंड'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis />
                        <Radar 
                          name="Current" 
                          dataKey="A" 
                          stroke="#3b82f6" 
                          fill="#3b82f6" 
                          fillOpacity={0.1} 
                        />
                        <Radar 
                          name="Optimal" 
                          dataKey="B" 
                          stroke="#16a34a" 
                          fill="#16a34a" 
                          fillOpacity={0.1} 
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Soil Map */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-red-500" />
                    {language === 'en' ? 'Soil Composition Map' : 'मिट्टी संरचना मानचित्र'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'en' 
                      ? 'Spatial distribution of soil properties' 
                      : 'मिट्टी गुणों का स्थानिक वितरण'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gradient-to-br from-brown-100 to-green-100 rounded-lg overflow-hidden relative">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1623211268529-69c56e303312?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmYXJtZXIlMjBmaWVsZCUyMGFncmljdWx0dXJlfGVufDF8fHx8MTc1NzY5NjA2OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Soil composition map"
                      className="w-full h-full object-cover opacity-70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-green-500/30" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                      <p className="text-sm font-medium">
                        {language === 'en' ? 'Soil Health Map' : 'मिट्टी स्वास्थ्य मानचित्र'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t.lastUpdated}: 3 days ago
                      </p>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full" />
                          <span className="text-xs">{t.high}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                          <span className="text-xs">Medium</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full" />
                          <span className="text-xs">{t.low}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="zones" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-500" />
                  {language === 'en' ? 'Nutrient Distribution' : 'पोषक तत्व वितरण'}
                </CardTitle>
                <CardDescription>
                  {language === 'en' 
                    ? 'Spatial distribution of key nutrients across fields' 
                    : 'खेतों में मुख्य पोषक तत्वों का स्थानिक वितरण'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-3">
                      <span className="text-xl font-bold text-blue-600">N</span>
                    </div>
                    <h4 className="font-medium mb-2">{t.nitrogen}</h4>
                    <div className="space-y-2">
                      <div className="bg-blue-100 h-2 rounded-full">
                        <div className="bg-blue-500 h-2 rounded-full w-[65%]"></div>
                      </div>
                      <p className="text-sm text-muted-foreground">65% of optimal</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mb-3">
                      <span className="text-xl font-bold text-orange-600">P</span>
                    </div>
                    <h4 className="font-medium mb-2">{t.phosphorus}</h4>
                    <div className="space-y-2">
                      <div className="bg-orange-100 h-2 rounded-full">
                        <div className="bg-orange-500 h-2 rounded-full w-[45%]"></div>
                      </div>
                      <p className="text-sm text-muted-foreground">45% of optimal</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mb-3">
                      <span className="text-xl font-bold text-purple-600">K</span>
                    </div>
                    <h4 className="font-medium mb-2">{t.potassium}</h4>
                    <div className="space-y-2">
                      <div className="bg-purple-100 h-2 rounded-full">
                        <div className="bg-purple-500 h-2 rounded-full w-[72%]"></div>
                      </div>
                      <p className="text-sm text-muted-foreground">72% of optimal</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  {t.trends}
                </CardTitle>
                <CardDescription>
                  {language === 'en' 
                    ? 'Soil parameter changes over time' 
                    : 'समय के साथ मिट्टी मापदंड परिवर्तन'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={soilTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Line 
                        type="monotone" 
                        dataKey="ph" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="pH Level"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="organic" 
                        stroke="#16a34a" 
                        strokeWidth={2}
                        name="Organic Matter %"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="nitrogen" 
                        stroke="#f97316" 
                        strokeWidth={2}
                        name="Nitrogen kg/ha"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              {t.recommendations}
            </CardTitle>
            <CardDescription>
              {language === 'en' 
                ? 'AI-powered soil management recommendations' 
                : 'AI-संचालित मिट्टी प्रबंधन सिफारिशें'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span className="font-medium text-orange-800">{t.nitrogen} {t.deficiencyDetection}</span>
                </div>
                <p className="text-sm text-orange-700">
                  {language === 'en' 
                    ? 'Apply 15 kg/ha of nitrogen fertilizer within 2 weeks.' 
                    : '2 सप्ताह के भीतर 15 किग्रा/हेक्टेयर नाइट्रोजन उर्वरक लगाएं।'
                  }
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-blue-800">{t.organicMatter}</span>
                </div>
                <p className="text-sm text-blue-700">
                  {language === 'en' 
                    ? 'Maintain current organic matter levels through compost.' 
                    : 'कम्पोस्ट के माध्यम से वर्तमान जैविक पदार्थ स्तर बनाए रखें।'
                  }
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-green-800">{t.phLevel}</span>
                </div>
                <p className="text-sm text-green-700">
                  {language === 'en' 
                    ? 'pH levels are optimal. Continue current practices.' 
                    : 'pH स्तर इष्टतम है। वर्तमान प्रथाओं को जारी रखें।'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}