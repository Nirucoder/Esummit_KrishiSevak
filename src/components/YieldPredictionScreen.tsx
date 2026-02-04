import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  CloudRain, 
  Thermometer,
  Target,
  Calendar,
  MapPin,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Activity,
  Download
} from 'lucide-react';
import { motion } from 'motion/react';

interface YieldPredictionScreenProps {
  language: string;
}

export function YieldPredictionScreen({ language }: YieldPredictionScreenProps) {
  const [selectedCrop, setSelectedCrop] = useState('rice');
  const [selectedSeason, setSelectedSeason] = useState('kharif');
  const [prediction, setPrediction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confidence, setConfidence] = useState(85);

  const content = {
    en: {
      title: 'AI Yield Prediction',
      subtitle: 'Machine Learning-powered crop yield forecasting for maximum productivity',
      selectCrop: 'Select Crop',
      selectSeason: 'Select Season',
      fieldSize: 'Field Size (acres)',
      currentLocation: 'Current Location',
      predictYield: 'Predict Yield',
      predicting: 'Predicting...',
      results: 'Prediction Results',
      expectedYield: 'Expected Yield',
      confidence: 'Confidence',
      factors: 'Key Factors',
      recommendations: 'AI Recommendations',
      weatherImpact: 'Weather Impact',
      soilHealth: 'Soil Health Score',
      riskAssessment: 'Risk Assessment',
      productivity: 'Productivity Gain',
      downloadReport: 'Download Report',
      historicalData: 'Historical Comparison',
      seasonalTrends: 'Seasonal Trends',
      optimizationTips: 'Optimization Tips',
      kharif: 'Kharif (Jun-Oct)',
      rabi: 'Rabi (Nov-Mar)',
      zaid: 'Zaid (Apr-May)',
      tons: 'tons',
      kg: 'kg',
      percentage: '%',
      favorable: 'Favorable',
      moderate: 'Moderate',
      risk: 'Risk',
      excellent: 'Excellent',
      good: 'Good',
      average: 'Average',
      poor: 'Poor'
    },
    hi: {
      title: 'AI उत्पादन भविष्यवाणी',
      subtitle: 'अधिकतम उत्पादकता के लिए मशीन लर्निंग द्वारा फसल उत्पादन पूर्वानुमान',
      selectCrop: 'फसल चुनें',
      selectSeason: 'सीजन चुनें',
      fieldSize: 'खेत का आकार (एकड़)',
      currentLocation: 'वर्तमान स्थान',
      predictYield: 'उत्पादन की भविष्यवाणी करें',
      predicting: 'भविष्यवाणी कर रहे हैं...',
      results: 'भविष्यवाणी परिणाम',
      expectedYield: 'अपेक्षित उत्पादन',
      confidence: 'विश्वास स्तर',
      factors: 'मुख्य कारक',
      recommendations: 'AI सिफारिशें',
      weatherImpact: 'मौसम प्रभाव',
      soilHealth: 'मिट्टी स्वास्थ्य स्कोर',
      riskAssessment: 'जोखिम मूल्यांकन',
      productivity: 'उत्पादकता वृद्धि',
      downloadReport: 'रिपोर्ट डाउनलोड करें',
      historicalData: 'ऐतिहासिक तुलना',
      seasonalTrends: 'मौसमी रुझान',
      optimizationTips: 'अनुकूलन सुझाव',
      kharif: 'खरीफ (जून-अक्टूबर)',
      rabi: 'रबी (नवंबर-मार्च)',
      zaid: 'जायद (अप्रैल-मई)',
      tons: 'टन',
      kg: 'किलो',
      percentage: '%',
      favorable: 'अनुकूल',
      moderate: 'मध्यम',
      risk: 'जोखिम',
      excellent: 'उत्कृष्ट',
      good: 'अच्छा',
      average: 'औसत',
      poor: 'खराब'
    }
  };

  const t = content[language as keyof typeof content] || content.en;

  const crops = [
    { value: 'rice', label: language === 'en' ? 'Rice' : 'चावल', emoji: '🌾' },
    { value: 'wheat', label: language === 'en' ? 'Wheat' : 'गेहूं', emoji: '🌾' },
    { value: 'maize', label: language === 'en' ? 'Maize' : 'मक्का', emoji: '🌽' },
    { value: 'sugarcane', label: language === 'en' ? 'Sugarcane' : 'गन्ना', emoji: '🎋' },
    { value: 'cotton', label: language === 'en' ? 'Cotton' : 'कपास', emoji: '🌱' },
    { value: 'soybean', label: language === 'en' ? 'Soybean' : 'सोयाबीन', emoji: '🫘' }
  ];

  const seasons = [
    { value: 'kharif', label: t.kharif },
    { value: 'rabi', label: t.rabi },
    { value: 'zaid', label: t.zaid }
  ];

  const runPrediction = async () => {
    setIsLoading(true);
    
    // Simulate ML prediction
    setTimeout(() => {
      const mockPrediction = {
        yield: Math.round((Math.random() * 5 + 2) * 100) / 100,
        yieldPerAcre: Math.round((Math.random() * 2 + 1) * 100) / 100,
        confidence: Math.round(Math.random() * 20 + 75),
        weatherImpact: Math.round(Math.random() * 30 + 70),
        soilHealth: Math.round(Math.random() * 20 + 75),
        riskLevel: ['low', 'moderate', 'high'][Math.floor(Math.random() * 3)],
        productivityGain: Math.round(Math.random() * 15 + 5),
        factors: [
          { name: language === 'en' ? 'Rainfall Pattern' : 'वर्षा पैटर्न', impact: 85, positive: true },
          { name: language === 'en' ? 'Soil Nutrients' : 'मिट्टी पोषक तत्व', impact: 78, positive: true },
          { name: language === 'en' ? 'Temperature' : 'तापमान', impact: 65, positive: false },
          { name: language === 'en' ? 'Irrigation' : 'सिंचाई', impact: 92, positive: true }
        ],
        recommendations: [
          language === 'en' ? 'Apply nitrogen fertilizer 20% early for better yield' : 'बेहतर उत्पादन के लिए नाइट्रोजन उर्वरक 20% जल्दी डालें',
          language === 'en' ? 'Increase irrigation frequency by 15% during flowering' : 'फूल आने के दौरान सिंचाई की आवृत्ति 15% बढ़ाएं',
          language === 'en' ? 'Monitor for pest activity in next 2 weeks' : 'अगले 2 सप्ताह में कीट गतिविधि की निगरानी करें'
        ]
      };
      
      setPrediction(mockPrediction);
      setConfidence(mockPrediction.confidence);
      setIsLoading(false);
    }, 3000);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
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
          <h1 className="text-3xl font-bold text-foreground">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800">
            <Activity className="h-3 w-3 mr-1" />
            {language === 'en' ? 'AI Powered' : 'AI संचालित'}
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            <Target className="h-3 w-3 mr-1" />
            {language === 'en' ? 'High Accuracy' : 'उच्च सटीकता'}
          </Badge>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-500" />
                {language === 'en' ? 'Prediction Setup' : 'भविष्यवाणी सेटअप'}
              </CardTitle>
              <CardDescription>
                {language === 'en' ? 'Configure parameters for accurate yield prediction' : 'सटीक उत्पादन भविष्यवाणी के लिए पैरामीटर कॉन्फ़िगर करें'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t.selectCrop}</Label>
                <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {crops.map((crop) => (
                      <SelectItem key={crop.value} value={crop.value}>
                        <span className="flex items-center gap-2">
                          <span>{crop.emoji}</span>
                          {crop.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t.selectSeason}</Label>
                <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {seasons.map((season) => (
                      <SelectItem key={season.value} value={season.value}>
                        {season.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t.fieldSize}</Label>
                <Input 
                  type="number" 
                  placeholder="5.0" 
                  defaultValue="5.0"
                />
              </div>

              <div className="space-y-2">
                <Label>{t.currentLocation}</Label>
                <Input 
                  placeholder={language === 'en' ? 'Pune, Maharashtra' : 'पुणे, महाराष्ट्र'} 
                  defaultValue={language === 'en' ? 'Pune, Maharashtra' : 'पुणे, महाराष्ट्र'}
                />
              </div>

              <Button 
                onClick={runPrediction} 
                disabled={isLoading}
                className="w-full gap-2"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    {t.predicting}
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4" />
                    {t.predictYield}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          {prediction ? (
            <Tabs defaultValue="results" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="results">{t.results}</TabsTrigger>
                <TabsTrigger value="factors">{t.factors}</TabsTrigger>
                <TabsTrigger value="recommendations">{t.recommendations}</TabsTrigger>
              </TabsList>

              <TabsContent value="results" className="space-y-6">
                {/* Main Results */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{t.expectedYield}</p>
                          <p className="text-2xl font-bold text-green-600">
                            {prediction.yield} {t.tons}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {prediction.yieldPerAcre} {t.tons}/acre
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{t.confidence}</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {prediction.confidence}{t.percentage}
                          </p>
                          <Progress value={prediction.confidence} className="mt-2" />
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Target className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{t.soilHealth}</p>
                          <p className="text-2xl font-bold text-orange-600">
                            {prediction.soilHealth}{t.percentage}
                          </p>
                          <Badge className={getHealthColor(prediction.soilHealth)}>
                            {prediction.soilHealth >= 85 ? t.excellent : 
                             prediction.soilHealth >= 70 ? t.good : 
                             prediction.soilHealth >= 50 ? t.average : t.poor}
                          </Badge>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          <Thermometer className="h-6 w-6 text-orange-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{t.productivity}</p>
                          <p className="text-2xl font-bold text-purple-600">
                            +{prediction.productivityGain}{t.percentage}
                          </p>
                          <p className="text-sm text-green-600">
                            {language === 'en' ? 'Above baseline' : 'आधार रेखा से ऊपर'}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <BarChart3 className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Risk Assessment */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      {t.riskAssessment}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {language === 'en' ? 'Current Risk Level' : 'वर्तमान जोखिम स्तर'}
                        </p>
                        <Badge className={getRiskColor(prediction.riskLevel)}>
                          {prediction.riskLevel === 'low' ? (language === 'en' ? 'Low Risk' : 'कम जोखिम') :
                           prediction.riskLevel === 'moderate' ? (language === 'en' ? 'Moderate Risk' : 'मध्यम जोखिम') :
                           (language === 'en' ? 'High Risk' : 'उच्च जोखिम')}
                        </Badge>
                      </div>
                      <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        {t.downloadReport}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="factors" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t.factors}</CardTitle>
                    <CardDescription>
                      {language === 'en' ? 'Factors influencing yield prediction' : 'उत्पादन भविष्यवाणी को प्रभावित करने वाले कारक'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {prediction.factors.map((factor: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${factor.positive ? 'bg-green-500' : 'bg-orange-500'}`} />
                          <span className="font-medium">{factor.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={factor.impact} className="w-20" />
                          <span className="text-sm font-medium">{factor.impact}%</span>
                          {factor.positive ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-orange-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      {t.recommendations}
                    </CardTitle>
                    <CardDescription>
                      {language === 'en' ? 'AI-generated optimization recommendations' : 'AI द्वारा उत्पन्न अनुकूलन सिफारिशें'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {prediction.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-800">{rec}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  {language === 'en' ? 'Ready for Prediction' : 'भविष्यवाणी के लिए तैयार'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'en' ? 'Configure your parameters and click predict to get AI-powered yield forecasts' : 'अपने पैरामीटर कॉन्फ़िगर करें और AI-संचालित उत्पादन पूर्वानुमान प्राप्त करने के लिए भविष्यवाणी पर क्लिक करें'}
                </p>
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}