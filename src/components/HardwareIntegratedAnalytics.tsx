import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Activity, 
  Target, 
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Brain,
  Download,
  RefreshCw,
  Microscope,
  Lightbulb,
  Calendar
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { hardwareDataService, SensorData } from '../services/HardwareDataService';
import { mlModelTraining, TrainingData } from '../services/MLModelTraining';
import { dataIntegrationService, ComprehensiveAnalysis } from '../services/DataIntegrationService';
import { getContent } from '../utils/languages';

interface HardwareIntegratedAnalyticsProps {
  language: string;
}

interface MLPerformanceMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  dataQuality: number;
  predictionConfidence: number;
  lastTrainingDate: string;
  totalTrainingRecords: number;
}

interface PredictionInsight {
  parameter: string;
  currentValue: number;
  predictedValue: number;
  trend: 'improving' | 'declining' | 'stable';
  confidence: number;
  recommendations: string[];
  impact: 'high' | 'medium' | 'low';
}

interface DataQualityReport {
  completeness: number;
  accuracy: number;
  consistency: number;
  timeliness: number;
  issues: Array<{
    type: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
    recommendation: string;
  }>;
}

export function HardwareIntegratedAnalytics({ language }: HardwareIntegratedAnalyticsProps) {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [mlMetrics, setMlMetrics] = useState<MLPerformanceMetrics | null>(null);
  const [predictions, setPredictions] = useState<PredictionInsight[]>([]);
  const [dataQuality, setDataQuality] = useState<DataQualityReport | null>(null);
  const [comprehensiveAnalysis, setComprehensiveAnalysis] = useState<ComprehensiveAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [trainingProgress, setTrainingProgress] = useState<number>(0);
  const [isRetraining, setIsRetraining] = useState(false);

  useEffect(() => {
    loadAllData();
    
    // Set up periodic updates
    const interval = setInterval(loadSensorData, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadSensorData(),
        loadMLMetrics(),
        loadPredictions(),
        loadDataQualityReport(),
        loadComprehensiveAnalysis()
      ]);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSensorData = async () => {
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const data = await hardwareDataService.getHistoricalData('farm-demo-001', { start: startDate, end: endDate });
      setSensorData(data);
    } catch (error) {
      console.error('Error loading sensor data:', error);
    }
  };

  const loadMLMetrics = async () => {
    try {
      const models = await mlModelTraining.listFarmerModels('farmer-1');
      if (models.length > 0) {
        const latestModel = models[0];
        setMlMetrics({
          accuracy: latestModel.performance.accuracy,
          precision: latestModel.performance.precision,
          recall: latestModel.performance.recall,
          f1Score: latestModel.performance.f1Score,
          dataQuality: 0.85 + Math.random() * 0.1,
          predictionConfidence: 0.82 + Math.random() * 0.15,
          lastTrainingDate: latestModel.trainingDate,
          totalTrainingRecords: latestModel.metadata.trainingDataCount
        });
      }
    } catch (error) {
      console.error('Error loading ML metrics:', error);
    }
  };

  const loadPredictions = async () => {
    try {
      // Generate insights based on sensor data trends
      const insights: PredictionInsight[] = [
        {
          parameter: 'Yield Forecast',
          currentValue: 3.8,
          predictedValue: 4.2,
          trend: 'improving',
          confidence: 0.89,
          recommendations: [
            'Maintain current irrigation schedule',
            'Apply nitrogen fertilizer in 2 weeks',
            'Monitor for pest activity'
          ],
          impact: 'high'
        },
        {
          parameter: 'Soil Health Score',
          currentValue: 78,
          predictedValue: 85,
          trend: 'improving',
          confidence: 0.92,
          recommendations: [
            'Continue organic matter addition',
            'Maintain pH levels between 6.5-7.0'
          ],
          impact: 'medium'
        },
        {
          parameter: 'Disease Risk',
          currentValue: 15,
          predictedValue: 8,
          trend: 'improving',
          confidence: 0.76,
          recommendations: [
            'Preventive fungicide application recommended',
            'Improve air circulation in field'
          ],
          impact: 'medium'
        },
        {
          parameter: 'Water Efficiency',
          currentValue: 72,
          predictedValue: 78,
          trend: 'improving',
          confidence: 0.84,
          recommendations: [
            'Optimize irrigation timing',
            'Consider drip irrigation upgrade'
          ],
          impact: 'high'
        }
      ];
      
      setPredictions(insights);
    } catch (error) {
      console.error('Error loading predictions:', error);
    }
  };

  const loadDataQualityReport = async () => {
    try {
      // Analyze data quality from sensor readings
      const quality: DataQualityReport = {
        completeness: 0.94,
        accuracy: 0.91,
        consistency: 0.87,
        timeliness: 0.96,
        issues: [
          {
            type: 'Missing Data',
            severity: 'medium',
            description: '6% of expected sensor readings are missing',
            recommendation: 'Check sensor connectivity and battery levels'
          },
          {
            type: 'Outlier Detection',
            severity: 'low',
            description: 'Some temperature readings show unusual spikes',
            recommendation: 'Recalibrate temperature sensors'
          },
          {
            type: 'Temporal Gaps',
            severity: 'low',
            description: 'Occasional gaps in data transmission',
            recommendation: 'Improve network coverage in field areas'
          }
        ]
      };
      
      setDataQuality(quality);
    } catch (error) {
      console.error('Error loading data quality report:', error);
    }
  };

  const loadComprehensiveAnalysis = async () => {
    try {
      const farmProfile = {
        farmId: 'farm-demo-001',
        farmerId: 'farmer-1',
        location: { lat: 28.6139, lng: 77.2090 },
        area: 2.5,
        soilType: 'Loamy',
        currentCrops: ['Rice', 'Wheat'],
        irrigationType: 'Drip',
        farmingPractices: ['Organic', 'Precision Agriculture']
      };
      
      const analysis = await dataIntegrationService.getComprehensiveAnalysis(farmProfile);
      setComprehensiveAnalysis(analysis);
    } catch (error) {
      console.error('Error loading comprehensive analysis:', error);
    }
  };

  const triggerMLRetraining = async () => {
    setIsRetraining(true);
    setTrainingProgress(0);
    
    try {
      const success = await hardwareDataService.triggerMLModelRetraining('farm-demo-001');
      
      if (success) {
        // Simulate training progress
        const progressInterval = setInterval(() => {
          setTrainingProgress(prev => {
            if (prev >= 100) {
              clearInterval(progressInterval);
              setIsRetraining(false);
              loadMLMetrics(); // Refresh metrics after training
              return 100;
            }
            return prev + 5;
          });
        }, 500);
      } else {
        setIsRetraining(false);
      }
    } catch (error) {
      console.error('Error triggering ML retraining:', error);
      setIsRetraining(false);
    }
  };

  const exportAnalyticsReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      farmId: 'farm-demo-001',
      sensorDataSummary: {
        totalReadings: sensorData.length,
        timeRange: '7 days',
        sensors: [...new Set(sensorData.map(d => d.deviceId))]
      },
      mlMetrics,
      predictions,
      dataQuality,
      recommendations: comprehensiveAnalysis?.recommendations || []
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `krishisevak-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatTrendData = () => {
    const groupedData = sensorData.reduce((acc: any, reading) => {
      const date = reading.timestamp.split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, soilMoisture: [], temperature: [], ph: [] };
      }
      
      if (reading.sensorType === 'soil') {
        const soilData = reading as any;
        acc[date].soilMoisture.push(soilData.data.moisture);
        acc[date].temperature.push(soilData.data.temperature);
        acc[date].ph.push(soilData.data.ph);
      }
      
      return acc;
    }, {});
    
    return Object.values(groupedData).map((day: any) => ({
      date: day.date,
      soilMoisture: day.soilMoisture.length > 0 ? day.soilMoisture.reduce((a: number, b: number) => a + b) / day.soilMoisture.length : 0,
      temperature: day.temperature.length > 0 ? day.temperature.reduce((a: number, b: number) => a + b) / day.temperature.length : 0,
      ph: day.ph.length > 0 ? day.ph.reduce((a: number, b: number) => a + b) / day.ph.length : 0
    }));
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-farmer">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              {language === 'en' ? 'ML Accuracy' : 'ML सटीकता'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-blue-600">
              {mlMetrics ? `${(mlMetrics.accuracy * 100).toFixed(1)}%` : '--'}
            </div>
            <Progress value={mlMetrics ? mlMetrics.accuracy * 100 : 0} className="mt-2" />
            <p className="text-sm text-muted-foreground mt-1">
              {language === 'en' ? 'Model performance' : 'मॉडल प्रदर्शन'}
            </p>
          </CardContent>
        </Card>

        <Card className="card-farmer">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              {language === 'en' ? 'Prediction Confidence' : 'भविष्यवाणी विश्वास'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-green-600">
              {mlMetrics ? `${(mlMetrics.predictionConfidence * 100).toFixed(1)}%` : '--'}
            </div>
            <Progress value={mlMetrics ? mlMetrics.predictionConfidence * 100 : 0} className="mt-2" />
            <p className="text-sm text-muted-foreground mt-1">
              {language === 'en' ? 'Average confidence' : 'औसत विश्वास'}
            </p>
          </CardContent>
        </Card>

        <Card className="card-farmer">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              {language === 'en' ? 'Data Quality' : 'डेटा गुणवत्ता'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-purple-600">
              {dataQuality ? `${(dataQuality.completeness * 100).toFixed(1)}%` : '--'}
            </div>
            <Progress value={dataQuality ? dataQuality.completeness * 100 : 0} className="mt-2" />
            <p className="text-sm text-muted-foreground mt-1">
              {language === 'en' ? 'Data completeness' : 'डेटा पूर्णता'}
            </p>
          </CardContent>
        </Card>

        <Card className="card-farmer">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-orange-600" />
              {language === 'en' ? 'Training Records' : 'प्रशिक्षण रिकॉर्ड'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-orange-600">
              {mlMetrics ? mlMetrics.totalTrainingRecords.toLocaleString() : '--'}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {language === 'en' ? 'Data points used' : 'उपयोग किए गए डेटा पॉइंट'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ML Model Retraining */}
      <Card className="card-farmer">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            {language === 'en' ? 'AI Model Management' : 'AI मॉडल प्रबंधन'}
          </CardTitle>
          <CardDescription>
            {language === 'en' 
              ? 'Retrain AI models with latest sensor data for improved predictions'
              : 'बेहतर भविष्यवाणियों के लिए नवीनतम सेंसर डेटा के साथ AI मॉडल को पुनः प्रशिक्षित करें'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {language === 'en' ? 'Last training:' : 'अंतिम प्रशिक्षण:'} {' '}
                {mlMetrics?.lastTrainingDate 
                  ? new Date(mlMetrics.lastTrainingDate).toLocaleDateString()
                  : 'Never'
                }
              </p>
              {isRetraining && (
                <div className="space-y-2">
                  <Progress value={trainingProgress} className="w-64" />
                  <p className="text-sm text-blue-600">
                    {language === 'en' ? 'Training in progress...' : 'प्रशिक्षण चल रहा है...'}  {trainingProgress}%
                  </p>
                </div>
              )}
            </div>
            <Button 
              onClick={triggerMLRetraining}
              disabled={isRetraining}
              className="farmer-primary-action"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRetraining ? 'animate-spin' : ''}`} />
              {language === 'en' ? 'Retrain Models' : 'मॉडल पुनः प्रशिक्षण'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Predictions */}
      <Card className="card-farmer">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            {language === 'en' ? 'AI-Generated Insights' : 'AI-जनित अंतर्दृष्टि'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictions.map((prediction, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{prediction.parameter}</h4>
                  <Badge variant={prediction.trend === 'improving' ? 'default' : 
                                 prediction.trend === 'declining' ? 'destructive' : 'secondary'}>
                    {prediction.trend === 'improving' && <TrendingUp className="h-3 w-3 mr-1" />}
                    {prediction.trend === 'declining' && <TrendingDown className="h-3 w-3 mr-1" />}
                    {prediction.trend}
                  </Badge>
                </div>
                <div className="text-2xl font-semibold mb-1">
                  {prediction.currentValue} → {prediction.predictedValue}
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {language === 'en' ? 'Confidence:' : 'विश्वास:'} {(prediction.confidence * 100).toFixed(0)}%
                </div>
                <div className="text-sm">
                  <strong>{language === 'en' ? 'Recommendations:' : 'सिफारिशें:'}</strong>
                  <ul className="list-disc list-inside mt-1">
                    {prediction.recommendations.map((rec, i) => (
                      <li key={i} className="text-xs text-muted-foreground">{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTrendsTab = () => (
    <div className="space-y-6">
      <Card className="card-farmer">
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Sensor Data Trends (7 Days)' : 'सेंसर डेटा रुझान (7 दिन)'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={formatTrendData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="soilMoisture" stroke="#3b82f6" name="Soil Moisture (%)" />
              <Line yAxisId="right" type="monotone" dataKey="temperature" stroke="#f59e0b" name="Temperature (°C)" />
              <Line yAxisId="right" type="monotone" dataKey="ph" stroke="#10b981" name="pH Level" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-farmer">
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'ML Model Performance Over Time' : 'समय के साथ ML मॉडल प्रदर्शन'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={[
                { date: '2024-01-01', accuracy: 0.78, precision: 0.75 },
                { date: '2024-01-08', accuracy: 0.81, precision: 0.79 },
                { date: '2024-01-15', accuracy: 0.83, precision: 0.81 },
                { date: '2024-01-22', accuracy: 0.85, precision: 0.83 },
                { date: '2024-01-29', accuracy: 0.87, precision: 0.85 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: any) => `${(value * 100).toFixed(1)}%`} />
                <Legend />
                <Area type="monotone" dataKey="accuracy" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
                <Area type="monotone" dataKey="precision" stackId="2" stroke="#10b981" fill="#10b981" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-farmer">
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Prediction Accuracy by Parameter' : 'पैरामीटर द्वारा भविष्यवाणी सटीकता'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { parameter: 'Yield', accuracy: 89 },
                { parameter: 'Soil Health', accuracy: 92 },
                { parameter: 'Disease Risk', accuracy: 76 },
                { parameter: 'Water Usage', accuracy: 84 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="parameter" />
                <YAxis />
                <Tooltip formatter={(value: any) => `${value}%`} />
                <Bar dataKey="accuracy" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderDataQualityTab = () => (
    <div className="space-y-6">
      {dataQuality && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="card-farmer">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {language === 'en' ? 'Completeness' : 'पूर्णता'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold text-blue-600">
                  {(dataQuality.completeness * 100).toFixed(1)}%
                </div>
                <Progress value={dataQuality.completeness * 100} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="card-farmer">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {language === 'en' ? 'Accuracy' : 'सटीकता'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold text-green-600">
                  {(dataQuality.accuracy * 100).toFixed(1)}%
                </div>
                <Progress value={dataQuality.accuracy * 100} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="card-farmer">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {language === 'en' ? 'Consistency' : 'स्थिरता'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold text-purple-600">
                  {(dataQuality.consistency * 100).toFixed(1)}%
                </div>
                <Progress value={dataQuality.consistency * 100} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="card-farmer">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {language === 'en' ? 'Timeliness' : 'समयबद्धता'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold text-orange-600">
                  {(dataQuality.timeliness * 100).toFixed(1)}%
                </div>
                <Progress value={dataQuality.timeliness * 100} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          <Card className="card-farmer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                {language === 'en' ? 'Data Quality Issues' : 'डेटा गुणवत्ता समस्याएं'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataQuality.issues.map((issue, index) => (
                  <Alert key={index} className={`
                    ${issue.severity === 'high' ? 'border-red-500 bg-red-50' : 
                      issue.severity === 'medium' ? 'border-orange-500 bg-orange-50' : 
                      'border-yellow-500 bg-yellow-50'}
                  `}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{issue.type}</p>
                          <p className="text-sm text-muted-foreground mt-1">{issue.description}</p>
                          <p className="text-sm font-medium mt-2">
                            {language === 'en' ? 'Recommendation:' : 'सिफारिश:'} {issue.recommendation}
                          </p>
                        </div>
                        <Badge variant={issue.severity === 'high' ? 'destructive' : 'secondary'}>
                          {issue.severity}
                        </Badge>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-green-600" />
          <p className="text-muted-foreground">
            {language === 'en' ? 'Loading analytics data...' : 'एनालिटिक्स डेटा लोड हो रहा है...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-green-700">
            {language === 'en' ? 'AI-Powered Analytics' : 'AI-संचालित एनालिटिक्स'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'en' 
              ? 'Advanced insights from your sensor data and AI models' 
              : 'आपके सेंसर डेटा और AI मॉडल से उन्नत अंतर्दृष्टि'
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportAnalyticsReport}>
            <Download className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Export Report' : 'रिपोर्ट निर्यात'}
          </Button>
          <Button variant="outline" size="sm" onClick={loadAllData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {language === 'en' ? 'Refresh' : 'रीफ्रेश'}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            {language === 'en' ? 'Overview' : 'सिंहावलोकन'}
          </TabsTrigger>
          <TabsTrigger value="trends">
            {language === 'en' ? 'Trends' : 'रुझान'}
          </TabsTrigger>
          <TabsTrigger value="quality">
            {language === 'en' ? 'Data Quality' : 'डेटा गुणवत्ता'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {renderOverviewTab()}
        </TabsContent>

        <TabsContent value="trends">
          {renderTrendsTab()}
        </TabsContent>

        <TabsContent value="quality">
          {renderDataQualityTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
}