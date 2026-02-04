import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { 
  Brain, 
  Satellite, 
  Play, 
  ExternalLink,
  Upload,
  Download,
  Code,
  BarChart3,
  TrendingUp,
  Eye,
  Map,
  Globe,
  Database,
  Cpu
} from 'lucide-react';
import { motion } from 'motion/react';
import { ColabModelViewer } from './ColabModelViewer';

interface CustomModelIntegrationProps {
  language: string;
}

// Interface for custom ML model from Google Colab
interface ColabModel {
  id: string;
  name: string;
  type: string;
  accuracy: number;
  created: string;
  colabUrl: string;
  modelUrl: string;
  status: 'trained' | 'deployed' | 'testing';
  description: string;
  features: string[];
  performance: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  };
}

// Interface for Google Earth Engine script
interface GEEScript {
  id: string;
  name: string;
  description: string;
  scriptUrl: string;
  geeAppUrl?: string;
  category: string;
  parameters: {
    name: string;
    type: string;
    description: string;
    defaultValue: any;
  }[];
  lastUpdated: string;
}

export function CustomModelIntegration({ language }: CustomModelIntegrationProps) {
  const [activeTab, setActiveTab] = useState('model-showcase');
  const [colabModels, setColabModels] = useState<ColabModel[]>([]);
  const [geeScripts, setGeeScripts] = useState<GEEScript[]>([]);
  const [newModelUrl, setNewModelUrl] = useState('');
  const [newGeeUrl, setNewGeeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ColabModel | null>(null);
  const [selectedScript, setSelectedScript] = useState<GEEScript | null>(null);

  const content = {
    en: {
      title: 'Custom Model Integration',
      subtitle: 'Integrate your trained ML models and GEE scripts',
      colabModels: 'Google Colab Models',
      geeScripts: 'Google Earth Engine Scripts',
      addModel: 'Add Colab Model',
      addScript: 'Add GEE Script',
      modelUrl: 'Colab Notebook URL',
      scriptUrl: 'GEE Script URL',
      geeAppUrl: 'GEE App URL (Optional)',
      openColab: 'Open in Colab',
      openGEE: 'Open GEE Script',
      viewGEEApp: 'View GEE App',
      embedMap: 'Embed Map',
      modelPerformance: 'Model Performance',
      deployModel: 'Deploy Model',
      testModel: 'Test Model',
      downloadModel: 'Download Model',
      accuracy: 'Accuracy',
      precision: 'Precision',
      recall: 'Recall',
      f1Score: 'F1 Score',
      features: 'Features',
      description: 'Description',
      status: 'Status',
      lastUpdated: 'Last Updated',
      category: 'Category',
      parameters: 'Parameters',
      trained: 'Trained',
      deployed: 'Deployed',
      testing: 'Testing',
      cropClassification: 'Crop Classification',
      yieldPrediction: 'Yield Prediction',
      diseaseDetection: 'Disease Detection',
      soilAnalysis: 'Soil Analysis',
      ndviAnalysis: 'NDVI Analysis',
      moistureMapping: 'Moisture Mapping',
      changeDetection: 'Change Detection',
      addNew: 'Add New',
      modelName: 'Model Name',
      modelType: 'Model Type',
      scriptName: 'Script Name',
      scriptCategory: 'Script Category'
    },
    hi: {
      title: 'कस्टम मॉडल एकीकरण',
      subtitle: 'अपने प्रशिक्षित ML मॉडल और GEE स्क्रिप्ट को एकीकृत करें',
      colabModels: 'Google Colab मॉडल',
      geeScripts: 'Google Earth Engine स्क्रिप्ट',
      addModel: 'Colab मॉडल जोड़ें',
      addScript: 'GEE स्क्रिप्ट जोड़ें',
      modelUrl: 'Colab नोटबुक URL',
      scriptUrl: 'GEE स्क्रिप्ट URL',
      geeAppUrl: 'GEE ऐप URL (वैकल्पिक)',
      openColab: 'Colab में खोलें',
      openGEE: 'GEE स्क्रिप्ट खोलें',
      viewGEEApp: 'GEE ऐप देखें',
      embedMap: 'मैप एम्बेड करें',
      modelPerformance: 'मॉडल प्रदर्शन',
      deployModel: 'मॉडल तैनात करें',
      testModel: 'मॉडल टेस्ट करें',
      downloadModel: 'मॉडल डाउनलोड करें',
      accuracy: 'सटीकता',
      precision: 'परिशुद्धता',
      recall: 'रिकॉल',
      f1Score: 'F1 स्कोर',
      features: 'फीचर्स',
      description: 'विवरण',
      status: 'स्थिति',
      lastUpdated: 'अंतिम अपडेट',
      category: 'श्रेणी',
      parameters: 'पैरामीटर',
      trained: 'प्रशिक्षित',
      deployed: 'तैनात',
      testing: 'परीक्षण',
      cropClassification: 'फसल वर्गीकरण',
      yieldPrediction: 'उत्पादन भविष्यवाणी',
      diseaseDetection: 'रोग पहचान',
      soilAnalysis: 'मिट्टी विश्लेषण',
      ndviAnalysis: 'NDVI विश्लेषण',
      moistureMapping: 'नमी मैपिंग',
      changeDetection: 'परिवर्तन पहचान',
      addNew: 'नया जोड़ें',
      modelName: 'मॉडल नाम',
      modelType: 'मॉडल प्रकार',
      scriptName: 'स्क्रिप्ट नाम',
      scriptCategory: 'स्क्रिप्ट श्रेणी'
    }
  };

  const t = content[language as keyof typeof content] || content.en;

  // Initialize with no models (disabled)
  useEffect(() => {
    setColabModels([]);

    setGeeScripts([
      {
        id: 'modis-crop-dashboard-main',
        name: 'AI-Enhanced MODIS Crop Dashboard — Interactive (Extended)',
        description: 'Comprehensive MODIS-based crop monitoring with NDVI, LST, rainfall integration, Random Forest classification, CSV upload, drawing tools, and export capabilities for India (250m resolution)',
        scriptUrl: 'https://code.earthengine.google.com/',
        geeAppUrl: '',
        category: 'Crop Monitoring',
        parameters: [
          { name: 'seasonMode', type: 'select', description: 'Season selection mode', defaultValue: 'Auto (dynamic seasons)' },
          { name: 'seasonPreset', type: 'select', description: 'Season preset', defaultValue: 'kharif' },
          { name: 'numberOfTrees', type: 'number', description: 'Random Forest trees', defaultValue: 150 },
          { name: 'processingScale', type: 'number', description: 'Processing scale (meters)', defaultValue: 250 },
          { name: 'includeSoil', type: 'boolean', description: 'Include soil layer', defaultValue: false },
          { name: 'weatherSource', type: 'select', description: 'Weather data source', defaultValue: 'CHIRPS' }
        ],
        lastUpdated: '2024-01-25'
      },
      {
        id: 'custom-ndvi-analysis',
        name: 'Custom NDVI Analysis Script',
        description: 'Advanced NDVI calculation with temporal analysis and anomaly detection',
        scriptUrl: 'https://code.earthengine.google.com/your-script-id',
        geeAppUrl: 'https://your-username.users.earthengine.app/view/your-app',
        category: 'NDVI Analysis',
        parameters: [
          { name: 'startDate', type: 'date', description: 'Analysis start date', defaultValue: '2024-01-01' },
          { name: 'endDate', type: 'date', description: 'Analysis end date', defaultValue: '2024-12-31' },
          { name: 'geometry', type: 'geometry', description: 'Area of interest', defaultValue: null },
          { name: 'cloudCover', type: 'number', description: 'Maximum cloud cover %', defaultValue: 10 }
        ],
        lastUpdated: '2024-01-25'
      },
      {
        id: 'soil-moisture-mapping',
        name: 'Soil Moisture Mapping Script',
        description: 'Comprehensive soil moisture analysis using multiple satellite sources',
        scriptUrl: 'https://code.earthengine.google.com/your-moisture-script-id',
        geeAppUrl: 'https://your-username.users.earthengine.app/view/soil-moisture',
        category: 'Moisture Mapping',
        parameters: [
          { name: 'date', type: 'date', description: 'Analysis date', defaultValue: '2024-01-15' },
          { name: 'region', type: 'geometry', description: 'Analysis region', defaultValue: null },
          { name: 'resolution', type: 'number', description: 'Spatial resolution (m)', defaultValue: 30 }
        ],
        lastUpdated: '2024-01-22'
      }
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'trained':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'testing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const addCustomModel = () => {
    if (!newModelUrl) return;
    
    // Extract notebook ID from Colab URL or use the full URL
    const newModel: ColabModel = {
      id: `custom-model-${Date.now()}`,
      name: 'Custom Model',
      type: 'Custom',
      accuracy: 0,
      created: new Date().toISOString().split('T')[0],
      colabUrl: newModelUrl,
      modelUrl: '',
      status: 'trained',
      description: 'Custom model imported from Google Colab',
      features: [],
      performance: {
        accuracy: 0,
        precision: 0,
        recall: 0,
        f1Score: 0
      }
    };
    
    setColabModels([...colabModels, newModel]);
    setNewModelUrl('');
  };

  const addGeeScript = () => {
    if (!newGeeUrl) return;
    
    const newScript: GEEScript = {
      id: `custom-script-${Date.now()}`,
      name: 'Custom GEE Script',
      description: 'Custom Google Earth Engine analysis script',
      scriptUrl: newGeeUrl,
      category: 'Custom Analysis',
      parameters: [],
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    setGeeScripts([...geeScripts, newScript]);
    setNewGeeUrl('');
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
          <Button variant="outline" disabled>
            <Upload className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Models Disabled' : 'मॉडल अक्षम'}
          </Button>
          <Button>
            <Satellite className="h-4 w-4 mr-2" />
            {t.addScript}
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="model-showcase">
            <Eye className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Model Showcase' : 'मॉडल प्रदर्शनी'}
          </TabsTrigger>
          <TabsTrigger value="colab-models">
            <Brain className="h-4 w-4 mr-2" />
            {t.colabModels}
          </TabsTrigger>
          <TabsTrigger value="gee-scripts">
            <Satellite className="h-4 w-4 mr-2" />
            {t.geeScripts}
          </TabsTrigger>
        </TabsList>

        {/* Model Showcase Tab */}
        <TabsContent value="model-showcase">
          <ColabModelViewer language={language} />
        </TabsContent>

        {/* Google Colab Models Tab - Disabled */}
        <TabsContent value="colab-models" className="space-y-6">
          <Card>
            <CardContent className="text-center py-12">
              <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                {language === 'en' ? 'Model Integration Disabled' : 'मॉडल एकीकरण अक्षम'}
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {language === 'en' 
                  ? 'Custom model integration features are currently disabled. Use the GEE Scripts tab for satellite analysis.' 
                  : 'कस्टम मॉडल एकीकरण सुविधाएं वर्तमान में अक्षम हैं। सैटेलाइट विश्लेषण के लिए GEE स्क्रिप्ट टैब का उपयोग करें।'
                }
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Google Earth Engine Scripts Tab */}
        <TabsContent value="gee-scripts" className="space-y-6">
          {/* Add New GEE Script */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Satellite className="h-5 w-5 text-blue-500" />
                {t.addScript}
              </CardTitle>
              <CardDescription>
                Add your Google Earth Engine analysis scripts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="script-name">{t.scriptName}</Label>
                  <Input id="script-name" placeholder="e.g., NDVI Time Series Analysis" />
                </div>
                <div>
                  <Label htmlFor="script-category">{t.scriptCategory}</Label>
                  <Input id="script-category" placeholder="e.g., NDVI Analysis, Moisture Mapping" />
                </div>
              </div>
              <div>
                <Label htmlFor="gee-script-url">{t.scriptUrl}</Label>
                <Input 
                  id="gee-script-url"
                  value={newGeeUrl}
                  onChange={(e) => setNewGeeUrl(e.target.value)}
                  placeholder="https://code.earthengine.google.com/your-script-id" 
                />
              </div>
              <div>
                <Label htmlFor="gee-app-url">{t.geeAppUrl}</Label>
                <Input 
                  id="gee-app-url"
                  placeholder="https://your-username.users.earthengine.app/view/your-app" 
                />
              </div>
              <div>
                <Label htmlFor="script-description">{t.description}</Label>
                <Textarea 
                  id="script-description"
                  placeholder="Describe what your GEE script analyzes and its outputs..."
                />
              </div>
              <Button onClick={addGeeScript} disabled={!newGeeUrl}>
                <Satellite className="h-4 w-4 mr-2" />
                {t.addNew}
              </Button>
            </CardContent>
          </Card>

          {/* GEE Script Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {geeScripts.map((script) => (
              <motion.div
                key={script.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Satellite className="h-5 w-5 text-blue-500" />
                      {script.name}
                    </CardTitle>
                    <CardDescription>
                      {script.category} • {t.lastUpdated}: {script.lastUpdated}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {script.description}
                    </p>

                    {/* Parameters */}
                    {script.parameters.length > 0 && (
                      <div>
                        <span className="text-sm font-medium mb-2 block">{t.parameters}:</span>
                        <div className="space-y-1">
                          {script.parameters.slice(0, 3).map((param, idx) => (
                            <div key={idx} className="text-xs flex items-center justify-between">
                              <span>{param.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {param.type}
                              </Badge>
                            </div>
                          ))}
                          {script.parameters.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              +{script.parameters.length - 3} more parameters
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(script.scriptUrl, '_blank')}
                      >
                        <Code className="h-3 w-3 mr-1" />
                        {t.openGEE}
                      </Button>
                      
                      {script.geeAppUrl && (
                        <Button 
                          size="sm"
                          onClick={() => window.open(script.geeAppUrl, '_blank')}
                        >
                          <Globe className="h-3 w-3 mr-1" />
                          {t.viewGEEApp}
                        </Button>
                      )}
                      
                      <Button size="sm" variant="outline">
                        <Map className="h-3 w-3 mr-1" />
                        {t.embedMap}
                      </Button>
                      
                      <Button size="sm" variant="outline">
                        <Play className="h-3 w-3 mr-1" />
                        Run Analysis
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Embedded GEE Map Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5 text-green-500" />
                GEE Map Preview
              </CardTitle>
              <CardDescription>
                Preview your Google Earth Engine analysis results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 rounded-lg overflow-hidden relative">
                <iframe
                  src="https://code.earthengine.google.com/"
                  className="w-full h-full border-0"
                  title="Google Earth Engine"
                  style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                />
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center">
                    <Globe className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm font-medium">Google Earth Engine</p>
                    <p className="text-xs text-muted-foreground">
                      Click "Open GEE Script" to view your analysis
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}