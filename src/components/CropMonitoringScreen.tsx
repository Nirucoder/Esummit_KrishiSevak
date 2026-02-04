import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Sprout, 
  Bug, 
  Shield, 
  Droplets, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity,
  Calendar,
  Target
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CropMonitoringScreenProps {
  language: string;
}

// Mock data
const diseaseData = [
  { name: 'Healthy', value: 75, color: '#16a34a' },
  { name: 'Rust', value: 15, color: '#f97316' },
  { name: 'Blight', value: 8, color: '#ef4444' },
  { name: 'Unknown', value: 2, color: '#6b7280' }
];

const growthStageData = [
  { stage: 'Germination', duration: 7, completed: 100 },
  { stage: 'Seedling', duration: 14, completed: 100 },
  { stage: 'Vegetative', duration: 30, completed: 100 },
  { stage: 'Flowering', duration: 21, completed: 65 },
  { stage: 'Fruiting', duration: 28, completed: 0 },
  { stage: 'Harvest', duration: 7, completed: 0 }
];

const irrigationData = [
  { date: '2024-04-01', amount: 25, efficiency: 85 },
  { date: '2024-04-08', amount: 30, efficiency: 82 },
  { date: '2024-04-15', amount: 20, efficiency: 88 },
  { date: '2024-04-22', amount: 35, efficiency: 79 },
  { date: '2024-04-29', amount: 28, efficiency: 86 }
];

const yieldPrediction = [
  { month: 'May', predicted: 15, actual: null },
  { month: 'Jun', predicted: 45, actual: null },
  { month: 'Jul', predicted: 85, actual: null },
  { month: 'Aug', predicted: 120, actual: null },
  { month: 'Sep', predicted: 95, actual: null }
];

export function CropMonitoringScreen({ language }: CropMonitoringScreenProps) {
  const [selectedCrop, setSelectedCrop] = useState('wheat');

  const content = {
    en: {
      title: 'Crop Monitoring',
      subtitle: 'AI-powered crop health and disease detection',
      diseaseDetection: 'Disease Detection',
      pestMonitoring: 'Pest Monitoring',
      growthTracking: 'Growth Tracking',
      yieldPrediction: 'Yield Prediction',
      irrigationNeeds: 'Irrigation Needs',
      overallHealth: 'Overall Crop Health',
      diseaseStatus: 'Disease Status',
      pestStatus: 'Pest Activity',
      growthStage: 'Growth Stage',
      nextAction: 'Next Action',
      recommendations: 'AI Recommendations',
      alerts: 'Active Alerts',
      healthy: 'Healthy',
      moderate: 'Moderate Risk',
      high: 'High Risk',
      low: 'Low',
      medium: 'Medium',
      excellent: 'Excellent',
      good: 'Good',
      flowering: 'Flowering',
      harvestIn: 'Harvest in',
      days: 'days',
      scanField: 'Scan Field',
      viewReport: 'View Report',
      schedule: 'Schedule Treatment',
      stressMapping: 'Stress Mapping',
      soilFertility: 'Soil Fertility',
      npkLevels: 'NPK Levels',
      phLevel: 'pH Level',
      organicMatter: 'Organic Matter',
      nitrogen: 'Nitrogen',
      phosphorus: 'Phosphorus',
      potassium: 'Potassium'
    },
    hi: {
      title: 'फसल निगरानी',
      subtitle: 'AI-संचालित फसल स्वास्थ्य और रोग का पता लगाना',
      diseaseDetection: 'रोग का पता लगाना',
      pestMonitoring: 'कीट निगरानी',
      growthTracking: 'वृद्धि ट्रैकिंग',
      yieldPrediction: 'उत्पादन पूर्वानुमान',
      irrigationNeeds: 'सिंचाई आवश्यकताएं',
      overallHealth: 'समग्र फसल स्वास्थ्य',
      diseaseStatus: 'रोग स्थिति',
      pestStatus: 'कीट गतिविधि',
      growthStage: 'वृद्धि चरण',
      nextAction: 'अगली कार्रवाई',
      recommendations: 'AI सिफारिशें',
      alerts: 'सक्रिय अलर्ट',
      healthy: 'स्वस्थ',
      moderate: 'मध्यम जोखिम',
      high: 'उच्च जोखिम',
      low: 'कम',
      medium: 'मध्यम',
      excellent: 'उत्कृष्ट',
      good: 'अच्छा',
      flowering: 'फूल',
      harvestIn: 'कटाई',
      days: 'दिन',
      scanField: 'खेत स्कैन करें',
      viewReport: 'रिपोर्ट देखें',
      schedule: 'उपचार निर्धारित करें',
      stressMapping: 'तनाव मैपिंग',
      soilFertility: 'मिट्टी उर्वरता',
      npkLevels: 'NPK स्तर',
      phLevel: 'pH स्तर',
      organicMatter: 'जैविक पदार्थ',
      nitrogen: 'नाइट्रोजन',
      phosphorus: 'फास्फोरस',
      potassium: 'पोटेशियम'
    }
  };

  const t = content[language as keyof typeof content];

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
            <Activity className="h-3 w-3" />
            {language === 'en' ? 'AI Analysis' : 'AI विश्लेषण'}
          </Badge>
          <Button className="bg-green-600 hover:bg-green-700">
            <Sprout className="h-4 w-4 mr-2" />
            {t.scanField}
          </Button>
        </div>
      </motion.div>

      {/* Status Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.overallHealth}</CardTitle>
            <Sprout className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{t.excellent}</div>
            <Progress value={85} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              85% {t.healthy}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.diseaseStatus}</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{t.low}</div>
            <Progress value={25} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {language === 'en' ? 'No major threats detected' : 'कोई बड़ा खतरा नहीं मिला'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.pestStatus}</CardTitle>
            <Bug className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{t.medium}</div>
            <Progress value={45} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {language === 'en' ? 'Monitor closely' : 'बारीकी से निगरानी करें'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.growthStage}</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{t.flowering}</div>
            <Progress value={65} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {t.harvestIn} 45 {t.days}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs defaultValue="health" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="health">{language === 'en' ? 'Health' : 'स्वास्थ्य'}</TabsTrigger>
            <TabsTrigger value="growth">{language === 'en' ? 'Growth' : 'वृद्धि'}</TabsTrigger>
            <TabsTrigger value="irrigation">{language === 'en' ? 'Irrigation' : 'सिंचाई'}</TabsTrigger>
            <TabsTrigger value="yield">{language === 'en' ? 'Yield' : 'उत्पादन'}</TabsTrigger>
          </TabsList>

          <TabsContent value="health" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Disease Detection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-500" />
                    {t.diseaseDetection}
                  </CardTitle>
                  <CardDescription>
                    {language === 'en' 
                      ? 'AI-powered disease identification with confidence scores' 
                      : 'विश्वास स्कोर के साथ AI-संचालित रोग पहचान'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={diseaseData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {diseaseData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    {diseaseData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pest Hotspot Map */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bug className="h-5 w-5 text-orange-500" />
                    {language === 'en' ? 'Pest Hotspot Map' : 'कीट हॉटस्पॉट मैप'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'en' 
                      ? 'Real-time pest activity detection across fields' 
                      : 'खेतों में वास्तविक समय कीट गतिविधि का पता लगाना'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gradient-to-br from-green-100 to-orange-100 rounded-lg overflow-hidden relative">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1717885738221-e98064d1ee61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9wJTIwZmllbGQlMjBncmVlbiUyMHBsYW50c3xlbnwxfHx8fDE3NTc1OTIzMzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Pest hotspot mapping"
                      className="w-full h-full object-cover opacity-70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-orange-500/30" />
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full" />
                          <span className="text-xs">{language === 'en' ? 'Low Risk' : 'कम जोखिम'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full" />
                          <span className="text-xs">{language === 'en' ? 'Medium Risk' : 'मध्यम जोखिम'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full" />
                          <span className="text-xs">{language === 'en' ? 'High Risk' : 'उच्च जोखिम'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Soil Fertility */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-brown-500" />
                  {t.soilFertility}
                </CardTitle>
                <CardDescription>{t.npkLevels}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">7.2</div>
                    <p className="text-sm text-muted-foreground">{t.phLevel}</p>
                    <Progress value={85} className="mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">65%</div>
                    <p className="text-sm text-muted-foreground">{t.nitrogen}</p>
                    <Progress value={65} className="mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">45%</div>
                    <p className="text-sm text-muted-foreground">{t.phosphorus}</p>
                    <Progress value={45} className="mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">72%</div>
                    <p className="text-sm text-muted-foreground">{t.potassium}</p>
                    <Progress value={72} className="mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="growth" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.growthTracking}</CardTitle>
                <CardDescription>
                  {language === 'en' 
                    ? 'Growth stage timeline with progress tracking' 
                    : 'प्रगति ट्रैकिंग के साथ वृद्धि चरण समयरेखा'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {growthStageData.map((stage, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 rounded-lg border">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        stage.completed === 100 
                          ? 'bg-green-100 text-green-600' 
                          : stage.completed > 0 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-gray-100 text-gray-400'
                      }`}>
                        {stage.completed === 100 ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : stage.completed > 0 ? (
                          <Activity className="h-5 w-5" />
                        ) : (
                          <Calendar className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{stage.stage}</h4>
                          <span className="text-sm text-muted-foreground">
                            {stage.duration} {t.days}
                          </span>
                        </div>
                        <Progress value={stage.completed} className="h-2" />
                      </div>
                      <div className="text-sm font-medium">
                        {stage.completed}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="irrigation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  {t.irrigationNeeds}
                </CardTitle>
                <CardDescription>
                  {language === 'en' 
                    ? 'Water usage efficiency and irrigation scheduling' 
                    : 'पानी उपयोग दक्षता और सिंचाई निर्धारण'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={irrigationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <YAxis />
                      <Bar dataKey="amount" fill="#3b82f6" name="Water (mm)" />
                      <Bar dataKey="efficiency" fill="#16a34a" name="Efficiency %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="yield" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  {t.yieldPrediction}
                </CardTitle>
                <CardDescription>
                  {language === 'en' 
                    ? 'AI-based harvest forecasting and yield optimization' 
                    : 'AI-आधारित फसल पूर्वानुमान और उत्पादन अनुकूलन'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={yieldPrediction}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Line 
                        type="monotone" 
                        dataKey="predicted" 
                        stroke="#16a34a" 
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        name="Predicted (quintals)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">120</div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' ? 'Peak Yield (quintals)' : 'चरम उत्पादन (क्विंटल)'}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">85%</div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' ? 'Forecast Accuracy' : 'पूर्वानुमान सटीकता'}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">+12%</div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' ? 'Above Average' : 'औसत से अधिक'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* AI Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              {t.recommendations}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                {language === 'en' 
                  ? 'Apply nitrogen fertilizer in the next 5 days for optimal flowering.' 
                  : 'इष्टतम फूल के लिए अगले 5 दिनों में नाइट्रोजन उर्वरक लगाएं।'
                }
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                {language === 'en' 
                  ? 'Monitor for aphid activity. Consider preventive treatment if needed.' 
                  : 'एफिड गतिविधि के लिए निगरानी करें। यदि आवश्यक हो तो निवारक उपचार पर विचार करें।'
                }
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-800">
                {language === 'en' 
                  ? 'Reduce irrigation frequency as soil moisture is optimal.' 
                  : 'सिंचाई की आवृत्ति कम करें क्योंकि मिट्टी की नमी इष्टतम है।'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              {t.alerts}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {language === 'en' 
                    ? 'Weather Alert: Heavy rainfall expected' 
                    : 'मौसम अलर्ट: भारी बारिश की उम्मीद'
                  }
                </p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
              <Bug className="h-4 w-4 text-orange-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {language === 'en' 
                    ? 'Pest Activity: Moderate risk detected in Field B' 
                    : 'कीट गतिविधि: फील्ड B में मध्यम जोखिम का पता चला'
                  }
                </p>
                <p className="text-xs text-muted-foreground">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {language === 'en' 
                    ? 'Growth Update: Flowering stage progressing well' 
                    : 'वृद्धि अपडेट: फूल चरण अच्छी तरह से प्रगति कर रहा है'
                  }
                </p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}