import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { 
  Brain, 
  ExternalLink,
  Download,
  BarChart3,
  TrendingUp,
  Target,
  Cpu,
  Database,
  FileText,
  Play,
  Eye,
  Code,
  Settings
} from 'lucide-react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface ColabModelViewerProps {
  language: string;
}

interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  loss: number;
  auc: number;
}

interface TrainingHistory {
  epoch: number;
  loss: number;
  accuracy: number;
  val_loss: number;
  val_accuracy: number;
}

interface FeatureImportance {
  feature: string;
  importance: number;
  description: string;
}

interface ModelInfo {
  name: string;
  type: string;
  version: string;
  trainedDate: string;
  datasetSize: number;
  trainingTime: string;
  colabUrl: string;
  modelUrl: string;
  description: string;
  metrics: ModelMetrics;
  trainingHistory: TrainingHistory[];
  featureImportance: FeatureImportance[];
  confusionMatrix: number[][];
  classes: string[];
}

export function ColabModelViewer({ language }: ColabModelViewerProps) {
  const [selectedModel, setSelectedModel] = useState<ModelInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [predictionInput, setPredictionInput] = useState('');
  const [predictionResult, setPredictionResult] = useState<any>(null);

  const content = {
    en: {
      title: 'Trained ML Model Showcase',
      subtitle: 'View and interact with your Google Colab trained models',
      modelInfo: 'Model Information',
      performance: 'Performance Metrics',
      trainingHistory: 'Training History',
      featureImportance: 'Feature Importance',
      confusionMatrix: 'Confusion Matrix',
      makePrediction: 'Make Prediction',
      openColab: 'Open in Colab',
      downloadModel: 'Download Model',
      viewCode: 'View Code',
      runPrediction: 'Run Prediction',
      accuracy: 'Accuracy',
      precision: 'Precision',
      recall: 'Recall',
      f1Score: 'F1 Score',
      loss: 'Loss',
      auc: 'AUC',
      modelName: 'Model Name',
      modelType: 'Model Type',
      version: 'Version',
      trainedDate: 'Trained Date',
      datasetSize: 'Dataset Size',
      trainingTime: 'Training Time',
      description: 'Description',
      epoch: 'Epoch',
      validationLoss: 'Validation Loss',
      validationAccuracy: 'Validation Accuracy',
      inputData: 'Input Data',
      predictionResult: 'Prediction Result',
      confidence: 'Confidence',
      predictedClass: 'Predicted Class',
      probability: 'Probability'
    },
    hi: {
      title: 'प्रशिक्षित ML मॉडल प्रदर्शनी',
      subtitle: 'अपने Google Colab प्रशिक्षित मॉडल देखें और उनसे इंटरैक्ट करें',
      modelInfo: 'मॉडल जानकारी',
      performance: 'प्रदर्शन मेट्रिक्स',
      trainingHistory: 'प्रशिक्षण इतिहास',
      featureImportance: 'फीचर महत्व',
      confusionMatrix: 'कन्फ्यूजन मैट्रिक्स',
      makePrediction: 'भविष्यवाणी करें',
      openColab: 'Colab में खोलें',
      downloadModel: 'मॉडल डाउनलोड करें',
      viewCode: 'कोड देखें',
      runPrediction: 'भविष्यवाणी चलाएं',
      accuracy: 'सटीकता',
      precision: 'परिशुद्धता',
      recall: 'रिकॉल',
      f1Score: 'F1 स्कोर',
      loss: 'हानि',
      auc: 'AUC',
      modelName: 'मॉडल नाम',
      modelType: 'मॉडल प्रकार',
      version: 'संस्करण',
      trainedDate: 'प्रशिक्षण दिनांक',
      datasetSize: 'डेटासेट आकार',
      trainingTime: 'प्रशिक्षण समय',
      description: 'विवरण',
      epoch: 'एपोक',
      validationLoss: 'सत्यापन हानि',
      validationAccuracy: 'सत्यापन सटीकता',
      inputData: 'इनपुट डेटा',
      predictionResult: 'भविष्यवाणी परिणाम',
      confidence: 'आत्मविश्वास',
      predictedClass: 'भविष्यवाणी श्रेणी',
      probability: 'संभावना'
    }
  };

  const t = content[language as keyof typeof content] || content.en;

  // Component disabled - AI models removed
  useEffect(() => {
    // Do nothing - models disabled
  }, []);

  const runPrediction = async () => {
    if (!predictionInput.trim()) return;
    
    setLoading(true);
    
    // Simulate prediction (replace with actual model API call)
    setTimeout(() => {
      const mockPrediction = {
        predictedClass: 'Bacterial Blight',
        confidence: 0.89,
        probabilities: [
          { class: 'Healthy', probability: 0.03 },
          { class: 'Bacterial Blight', probability: 0.89 },
          { class: 'Leaf Spot', probability: 0.05 },
          { class: 'Rust', probability: 0.02 },
          { class: 'Mosaic Virus', probability: 0.01 }
        ]
      };
      
      setPredictionResult(mockPrediction);
      setLoading(false);
    }, 2000);
  };

  // Always show disabled state
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          {language === 'en' ? 'AI Models Disabled' : 'AI मॉडल अक्षम'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {language === 'en' 
            ? 'AI model features are currently disabled. Use the yield prediction and recommendations features instead.' 
            : 'AI मॉडल सुविधाएं वर्तमान में अक्षम हैं। इसके बजाय उत्पादन भविष्यवाणी और सिफारिश सुविधाओं का उपयोग करें।'
          }
        </p>
      </div>
    </div>
  );

  const COLORS = ['#22C55E', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

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
          <Button 
            variant="outline"
            onClick={() => window.open(selectedModel.colabUrl, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            {t.openColab}
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.open(selectedModel.modelUrl, '_blank')}
          >
            <Download className="h-4 w-4 mr-2" />
            {t.downloadModel}
          </Button>
        </div>
      </motion.div>

      {/* Model Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-purple-500" />
                  {selectedModel.name}
                </CardTitle>
                <CardDescription>
                  {selectedModel.type} • v{selectedModel.version} • {selectedModel.trainedDate}
                </CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                {t.accuracy}: {(selectedModel.metrics.accuracy * 100).toFixed(1)}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{selectedModel.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Database className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="font-medium">{selectedModel.datasetSize.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">{t.datasetSize}</div>
              </div>
              <div className="text-center">
                <Cpu className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="font-medium">{selectedModel.trainingTime}</div>
                <div className="text-sm text-muted-foreground">{t.trainingTime}</div>
              </div>
              <div className="text-center">
                <Target className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="font-medium">{(selectedModel.metrics.f1Score * 100).toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">{t.f1Score}</div>
              </div>
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <div className="font-medium">{selectedModel.metrics.loss.toFixed(3)}</div>
                <div className="text-sm text-muted-foreground">{t.loss}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Analysis */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">
            <BarChart3 className="h-4 w-4 mr-2" />
            {t.performance}
          </TabsTrigger>
          <TabsTrigger value="training">
            <TrendingUp className="h-4 w-4 mr-2" />
            {t.trainingHistory}
          </TabsTrigger>
          <TabsTrigger value="features">
            <FileText className="h-4 w-4 mr-2" />
            {t.featureImportance}
          </TabsTrigger>
          <TabsTrigger value="prediction">
            <Play className="h-4 w-4 mr-2" />
            {t.makePrediction}
          </TabsTrigger>
        </TabsList>

        {/* Performance Metrics Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Metrics Cards */}
            <Card>
              <CardHeader>
                <CardTitle>{t.performance}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>{t.accuracy}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={selectedModel.metrics.accuracy * 100} className="w-20" />
                      <span className="font-medium">{(selectedModel.metrics.accuracy * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{t.precision}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={selectedModel.metrics.precision * 100} className="w-20" />
                      <span className="font-medium">{(selectedModel.metrics.precision * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{t.recall}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={selectedModel.metrics.recall * 100} className="w-20" />
                      <span className="font-medium">{(selectedModel.metrics.recall * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{t.f1Score}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={selectedModel.metrics.f1Score * 100} className="w-20" />
                      <span className="font-medium">{(selectedModel.metrics.f1Score * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{t.auc}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={selectedModel.metrics.auc * 100} className="w-20" />
                      <span className="font-medium">{(selectedModel.metrics.auc * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Confusion Matrix Visualization */}
            <Card>
              <CardHeader>
                <CardTitle>{t.confusionMatrix}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedModel.confusionMatrix.map((row, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-20 text-xs font-medium truncate">
                        {selectedModel.classes[i]}
                      </div>
                      <div className="flex-1 flex gap-1">
                        {row.map((value, j) => (
                          <div
                            key={j}
                            className="flex-1 h-8 flex items-center justify-center text-xs font-medium rounded"
                            style={{
                              backgroundColor: i === j 
                                ? `rgba(34, 197, 94, ${value / Math.max(...row)})` 
                                : `rgba(239, 68, 68, ${value / Math.max(...row) * 0.5})`
                            }}
                          >
                            {value}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Training History Tab */}
        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.trainingHistory}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedModel.trainingHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="epoch" />
                    <YAxis />
                    <Line 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="#22C55E" 
                      name="Training Accuracy"
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="val_accuracy" 
                      stroke="#3B82F6" 
                      name="Validation Accuracy"
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="loss" 
                      stroke="#EF4444" 
                      name="Training Loss"
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="val_loss" 
                      stroke="#F59E0B" 
                      name="Validation Loss"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feature Importance Tab */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.featureImportance}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedModel.featureImportance.map((feature, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{feature.feature}</h4>
                    <Badge variant="outline">
                      {(feature.importance * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="mb-2">
                    <Progress value={feature.importance * 100} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prediction Tab */}
        <TabsContent value="prediction" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.makePrediction}</CardTitle>
                <CardDescription>
                  Upload an image or provide data to get model predictions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="prediction-input">{t.inputData}</Label>
                  <Input
                    id="prediction-input"
                    value={predictionInput}
                    onChange={(e) => setPredictionInput(e.target.value)}
                    placeholder="Paste image URL or upload image file"
                  />
                </div>
                <Button 
                  onClick={runPrediction} 
                  disabled={loading || !predictionInput.trim()}
                  className="w-full"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      {t.runPrediction}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {predictionResult && (
              <Card>
                <CardHeader>
                  <CardTitle>{t.predictionResult}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{t.predictedClass}</span>
                      <Badge className="bg-primary text-primary-foreground">
                        {predictionResult.predictedClass}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{t.confidence}</span>
                      <span className="font-medium">
                        {(predictionResult.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={predictionResult.confidence * 100} className="mt-2" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">All Class Probabilities:</h4>
                    {predictionResult.probabilities.map((prob: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{prob.class}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={prob.probability * 100} className="w-20" />
                          <span className="text-sm font-medium">
                            {(prob.probability * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}