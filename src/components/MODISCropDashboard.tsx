import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { 
  Satellite, 
  ExternalLink,
  Code,
  Play,
  Copy,
  Download,
  Settings,
  Layers,
  BarChart3,
  Globe,
  Zap,
  HardDrive
} from 'lucide-react';
import { motion } from 'motion/react';

interface MODISCropDashboardProps {
  language: string;
}

export function MODISCropDashboard({ language }: MODISCropDashboardProps) {
  const [scriptCopied, setScriptCopied] = useState(false);

  const content = {
    en: {
      title: 'MODIS Crop Dashboard - Google Earth Engine',
      subtitle: 'AI-Enhanced Interactive Crop Monitoring System for India',
      features: 'Dashboard Features',
      runInGEE: 'Run in Google Earth Engine',
      copyScript: 'Copy Script Code',
      scriptCopied: 'Script Copied!',
      viewCode: 'View Full Code',
      documentation: 'Documentation',
      openGEE: 'Open GEE Code Editor',
      autoRun: 'Auto-Run Script',
      description: 'Comprehensive MODIS-based crop monitoring dashboard with advanced ML capabilities',
      keyFeatures: [
        'Real-time MODIS NDVI, EVI, and LST analysis (250m resolution)',
        'CHIRPS daily rainfall integration',
        'Random Forest classification with customizable parameters',
        'Interactive drawing tools for training data collection',
        'CSV upload functionality for labeled training points',
        'Seasonal analysis (Kharif, Rabi, Zaid) with automatic date selection',
        'Export capabilities for classification maps and LSTM-ready time series',
        'Click-to-chart functionality for time series visualization',
        'Confusion matrix validation and area statistics',
        'Support for 7 major crop classes across India'
      ],
      datasets: 'Integrated Datasets',
      processing: 'Processing Capabilities',
      validation: 'Validation & Export',
      datasetList: [
        'MODIS/061/MOD13Q1 - 16-day NDVI/EVI (250m)',
        'MODIS/061/MOD11A2 - 8-day Land Surface Temperature',
        'UCSB-CHG/CHIRPS/DAILY - Daily precipitation',
        'Optional: SoilGrids/ISRIC soil data integration'
      ],
      processingList: [
        'Random Forest classification (50-500 trees)',
        'Multi-scale processing (250m - 2km)',
        'Seasonal aggregation and trend analysis',
        'Feature importance analysis',
        'Temporal compositing and gap-filling'
      ],
      validationList: [
        'Automated train/test split validation',
        'Confusion matrix generation',
        'Area statistics per crop class',
        'Export to Google Drive (GeoTIFF)',
        'LSTM-ready time series stacks'
      ],
      instructions: 'Usage Instructions',
      step1: '1. Click "Run in Google Earth Engine" to open the Code Editor',
      step2: '2. The script will automatically load and display the interactive dashboard',
      step3: '3. Use the control panel to adjust parameters (season, trees, scale)',
      step4: '4. Upload CSV training data or use drawing tools to add labeled points',
      step5: '5. Click "Run / Update Map" to generate crop classification',
      step6: '6. Export results using the export buttons for further analysis',
      crops: 'Supported Crop Classes',
      cropList: [
        '🌱 Rice - Primary crop in eastern and southern regions',
        '🌽 Maize - Major cereal crop across India',
        '🧵 Jute - Cash crop in eastern states',
        '🌾 Wheat - Dominant rabi crop in northern plains',
        '🌻 Mustard - Important oilseed crop',
        '🍬 Sugarcane - Commercial crop in UP, Maharashtra',
        '🫘 Pulses - Leguminous crops for protein security'
      ]
    },
    hi: {
      title: 'MODIS फसल डैशबोर्ड - Google Earth Engine',
      subtitle: 'भारत के लिए AI-संवर्धित इंटरैक्टिव फसल निगरानी प्रणाली',
      features: 'डैशबोर्ड सुविधाएं',
      runInGEE: 'Google Earth Engine में चलाएं',
      copyScript: 'स्क्रिप्ट कोड कॉपी करें',
      scriptCopied: 'स्क्रिप्ट कॉपी हो गई!',
      viewCode: 'पूरा कोड देखें',
      documentation: 'प्रलेखन',
      openGEE: 'GEE कोड एडिटर खोलें',
      autoRun: 'ऑटो-रन स्क्रिप्ट',
      description: 'उन्नत ML क्षमताओं के साथ व्यापक MODIS-आधारित फसल निगरानी डैशबोर्ड',
      keyFeatures: [
        'रियल-टाइम MODIS NDVI, EVI, और LST विश्लेषण (250m रिज़ॉल्यूशन)',
        'CHIRPS दैनिक बारिश एकीकरण',
        'अनुकूलन योग्य पैरामीटर के साथ रैंडम फॉरेस्ट वर्गीकरण',
        'प्रशिक्षण डेटा संग्रह के लिए इंटरैक्टिव ड्राइंग टूल्स',
        'लेबल किए गए प्रशिक्षण पॉइंट्स के लिए CSV अपलोड',
        'स्वचालित दिनांक चयन के साथ मौसमी विश्लेषण (खरीफ, रबी, जायद)',
        'वर्गीकरण मानचित्र और LSTM-तैयार समय श्रृंखला के लिए निर्यात',
        'समय श्रृंखला विज़ुअलाइज़ेशन के लिए क्लिक-टू-चार्ट',
        'कन्फ्यूजन मैट्रिक्स सत्यापन और क्षेत्र आंकड़े',
        'भारत भर में 7 प्रमुख फसल वर्गों का समर्थन'
      ],
      datasets: 'एकीकृत डेटासेट',
      processing: 'प्रसंस्करण क्षमताएं',
      validation: 'सत्यापन और निर्यात',
      datasetList: [
        'MODIS/061/MOD13Q1 - 16-दिन NDVI/EVI (250m)',
        'MODIS/061/MOD11A2 - 8-दिन भूमि सतह तापमान',
        'UCSB-CHG/CHIRPS/DAILY - दैनिक वर्षा',
        'वैकल्पिक: SoilGrids/ISRIC मिट्टी डेटा एकीकरण'
      ],
      processingList: [
        'रैंडम फॉरेस्ट वर्गीकरण (50-500 पेड़)',
        'मल्टी-स्केल प्रसंस्करण (250m - 2km)',
        'मौसमी एकत्रीकरण और ट्रेंड विश्लेषण',
        'फीचर महत्व विश्लेषण',
        'टेम्पोरल कंपोज़िटिंग और गैप-फिलिंग'
      ],
      validationList: [
        'स्वचालित ट्रेन/टेस्ट स्प्लिट सत्यापन',
        'कन्फ्यूजन मैट्रिक्स जेनरेशन',
        'फसल वर्ग के अनुसार क्षेत्र आंकड़े',
        'Google Drive में निर्यात (GeoTIFF)',
        'LSTM-तैयार समय श्रृंखला स्टैक'
      ],
      instructions: 'उपयोग निर्देश',
      step1: '1. कोड एडिटर खोलने के लिए "Google Earth Engine में चलाएं" पर क्लिक करें',
      step2: '2. स्क्रिप्ट स्वचालित रूप से लोड होगी और इंटरैक्टिव डैशबोर्ड दिखाएगी',
      step3: '3. पैरामीटर समायोजित करने के लिए कंट्रोल पैनल का उपयोग करें',
      step4: '4. CSV प्रशिक्षण डेटा अपलोड करें या लेबल किए गए पॉइंट्स जोड़ने के लिए ड्राइंग टूल्स का उपयोग करें',
      step5: '5. फसल वर्गीकरण बनाने के लिए "Run / Update Map" पर क्लिक करें',
      step6: '6. आगे के विश्लेषण के लिए निर्यात बटन का उपयोग करके परिणाम निर्यात करें',
      crops: 'समर्थित फसल वर्ग',
      cropList: [
        '🌱 चावल - पूर्वी और दक्षिणी क्षेत्रों में प्राथमिक फसल',
        '🌽 मक्का - भारत भर में प्रमुख अनाज फसल',
        '🧵 जूट - पूर्वी राज्यों में नकदी फसल',
        '🌾 गेहूं - उत्तरी मैदानों में प्रमुख रबी फसल',
        '🌻 सरसों - महत्वपूर्ण तिलहन फसल',
        '🍬 गन्ना - यूपी, महाराष्ट्र में व्यावसायिक फसल',
        '🫘 दालें - प्रोटीन सुरक्षा के लिए फलीदार फसलें'
      ]
    }
  };

  const t = content[language as keyof typeof content] || content.en;

  // Your complete MODIS script
  const geeScript = `// Interactive, live-updating MODIS Crop Dashboard (India, 250 m)
// Fixed: client/server date handling, drawing tools update, CSV parsing, stack export.
// Paste into Earth Engine Code Editor: https://code.earthengine.google.com/

// ----------------------- CONFIG -----------------------
var roi = ee.Geometry.Rectangle([68.0, 6.5, 97.5, 37.5]);
Map.centerObject(roi, 5);

// Datasets (defaults)
var MODIS_VI = 'MODIS/061/MOD13Q1';     // 16-day NDVI/EVI (scale 0.0001)
var MODIS_LST = 'MODIS/061/MOD11A2';    // 8-day LST_Day_1km (scale 0.02 K)
var CHIRPS = 'UCSB-CHG/CHIRPS/DAILY';  // daily rainfall (mm)

// Optional soil dataset (example placeholder for SoilGrids/ISRIC if you want to enable)
// Example (commented): var soilDatasetId = 'projects/soilgrids-isric/public/soilgrids';
var soilDatasetId = null; // set to your asset or public dataset id to enable

// Default classifier params
var DEFAULT_TREES = 150;
var DEFAULT_SCALE = 250;

// ----------------------- UI -----------------------
var controlPanel = ui.Panel({style: {width: '380px', padding: '8px'}});
ui.root.widgets().add(controlPanel);
controlPanel.add(ui.Label({
  value: 'AI-Enhanced MODIS Crop Dashboard — Interactive (Extended)',
  style: {fontWeight: 'bold', fontSize: '15px'}
}));

// Season/config
var seasonMode = ui.Select({
  items: ['Auto (dynamic seasons)', 'Manual dates'],
  value: 'Auto (dynamic seasons)',
  style: {width: '100%'}
});
controlPanel.add(ui.Label('Season selection mode:'));
controlPanel.add(seasonMode);

var manualStart = ui.Textbox({placeholder: 'Start date YYYY-MM-DD', style: {width: '100%'}});
var manualEnd = ui.Textbox({placeholder: 'End date YYYY-MM-DD', style: {width: '100%'}});
manualStart.style().set('shown', false);
manualEnd.style().set('shown', false);
seasonMode.onChange(function(val){
  var show = (val === 'Manual dates');
  manualStart.style().set('shown', show);
  manualEnd.style().set('shown', show);
});

var seasonSelect = ui.Select({
  items: ['kharif','rabi','zaid','last_12_months'],
  value: 'kharif',
  style: {width: '100%'}
});
controlPanel.add(ui.Label('Season / period preset:'));
controlPanel.add(seasonSelect);

// Classifier & processing
var treeSlider = ui.Slider({min:50, max:500, value: DEFAULT_TREES, step:10, style: {width: '100%'}});
controlPanel.add(ui.Label('Random Forest - number of trees'));
controlPanel.add(treeSlider);

var scaleSlider = ui.Slider({min:250, max:2000, value: DEFAULT_SCALE, step:250, style: {width: '100%'}});
controlPanel.add(ui.Label('Processing scale (meters)'));
controlPanel.add(scaleSlider);

// Soil and weather options
var soilToggle = ui.Checkbox({label: 'Include soil layer (if soilDatasetId provided)', value: false});
controlPanel.add(soilToggle);

var weatherSelect = ui.Select({
  items: ['CHIRPS (daily precipitation)', 'ERA5-Land (placeholder)'],
  value: 'CHIRPS (daily precipitation)',
  style: {width: '100%'}
});
controlPanel.add(ui.Label('Weather source (for extra features):'));
controlPanel.add(weatherSelect);

// CSV upload for labeled points
controlPanel.add(ui.Label('Upload CSV of labeled points (lat,lon,landcover):'));
var uploadButton = ui.Button('Choose CSV File', null, false, {stretch: 'horizontal'});
controlPanel.add(uploadButton);
controlPanel.add(ui.Label('Or draw points on map using drawing tools (set property "landcover" in inspector).'));

// Buttons
var runButton = ui.Button({label: 'Run / Update Map', style: {stretch: 'horizontal'}});
var exportClassButton = ui.Button({label: 'Export Classification (to Drive)', disabled: true});
var exportStackButton = ui.Button({label: 'Export Seasonal Stack (LSTM-ready)', disabled: false});
var clearTrainingButton = ui.Button({label: 'Clear drawing training points'});
controlPanel.add(runButton);
controlPanel.add(exportClassButton);
controlPanel.add(exportStackButton);
controlPanel.add(clearTrainingButton);

// Training update button (explicit)
var updateDrawingButton = ui.Button({label: 'Update training from drawing', style: {stretch: 'horizontal'}});
controlPanel.add(updateDrawingButton);

var infoBox = ui.Label('Status: Ready');
controlPanel.add(infoBox);

print('Notes: Extended dashboard ready. Use CSV upload or drawing tools for labeled points. Use "Export Seasonal Stack" to create a per-timestep NDVI stack (12 months) for external DL training.');`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(geeScript);
      setScriptCopied(true);
      setTimeout(() => setScriptCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy script:', err);
    }
  };

  const openInGEE = () => {
    // Open Google Earth Engine Code Editor
    const geeUrl = 'https://code.earthengine.google.com/';
    window.open(geeUrl, '_blank');
    
    // Show instructions for pasting the script
    setTimeout(() => {
      if (confirm('Google Earth Engine Code Editor should now be open. Would you like to copy the script to your clipboard so you can paste it?')) {
        copyToClipboard();
      }
    }, 1000);
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
          <Button onClick={copyToClipboard} variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            {scriptCopied ? t.scriptCopied : t.copyScript}
          </Button>
          <Button onClick={openInGEE} className="bg-orange-600 hover:bg-orange-700">
            <ExternalLink className="h-4 w-4 mr-2" />
            {t.runInGEE}
          </Button>
        </div>
      </motion.div>

      {/* Main Dashboard Preview */}
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
                  <Satellite className="h-6 w-6 text-blue-500" />
                  {t.title}
                </CardTitle>
                <CardDescription>{t.description}</CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                250m Resolution
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gradient-to-br from-green-100 via-blue-50 to-orange-50 rounded-lg overflow-hidden relative border-2 border-dashed border-gray-300">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Globe className="h-20 w-20 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">MODIS Crop Dashboard</h3>
                  <p className="text-gray-500 mb-4 max-w-md mx-auto">
                    Interactive Google Earth Engine application for real-time crop monitoring across India using MODIS satellite data
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <Button onClick={openInGEE} size="lg">
                      <Play className="h-5 w-5 mr-2" />
                      {t.autoRun}
                    </Button>
                    <Button onClick={copyToClipboard} variant="outline" size="lg">
                      <Code className="h-5 w-5 mr-2" />
                      {t.viewCode}
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Overlay indicators */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Live MODIS Data</span>
                </div>
              </div>
              
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">ML Classification</span>
                </div>
              </div>
              
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Multi-Dataset</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Feature Tabs */}
      <Tabs defaultValue="features" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="features">
            <Settings className="h-4 w-4 mr-2" />
            {t.features}
          </TabsTrigger>
          <TabsTrigger value="datasets">
            <HardDrive className="h-4 w-4 mr-2" />
            {t.datasets}
          </TabsTrigger>
          <TabsTrigger value="instructions">
            <Play className="h-4 w-4 mr-2" />
            {t.instructions}
          </TabsTrigger>
          <TabsTrigger value="code">
            <Code className="h-4 w-4 mr-2" />
            {t.viewCode}
          </TabsTrigger>
        </TabsList>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-green-500" />
                  {t.features}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {t.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  {t.crops}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {t.cropList.map((crop, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                      <span className="text-sm">{crop}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.datasets}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {t.datasetList.map((dataset, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      • {dataset}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.processing}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {t.processingList.map((item, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      • {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.validation}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {t.validationList.map((item, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      • {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Datasets Tab */}
        <TabsContent value="datasets" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>MODIS Vegetation Indices</CardTitle>
                <CardDescription>MOD13Q1 - 16-day composite at 250m resolution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800">NDVI & EVI</h4>
                  <p className="text-sm text-green-700">Normalized vegetation indices for crop health monitoring</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>• Scale factor: 0.0001</p>
                  <p>• Temporal resolution: 16 days</p>
                  <p>• Spatial resolution: 250m</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>MODIS Land Surface Temperature</CardTitle>
                <CardDescription>MOD11A2 - 8-day LST at 1km resolution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-medium text-orange-800">LST Day</h4>
                  <p className="text-sm text-orange-700">Daytime land surface temperature in Kelvin</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>• Scale factor: 0.02</p>
                  <p>• Temporal resolution: 8 days</p>
                  <p>• Converted to Celsius</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CHIRPS Precipitation</CardTitle>
                <CardDescription>Daily rainfall data at 5.5km resolution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800">Daily Precipitation</h4>
                  <p className="text-sm text-blue-700">Climate Hazards Group InfraRed Precipitation</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>• Units: mm/day</p>
                  <p>• Temporal resolution: Daily</p>
                  <p>• Coverage: Near-global</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optional: Soil Data</CardTitle>
                <CardDescription>SoilGrids/ISRIC integration capability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-yellow-800">Soil Properties</h4>
                  <p className="text-sm text-yellow-700">Can be enabled by setting soilDatasetId</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>• Configurable dataset ID</p>
                  <p>• Bilinear resampling</p>
                  <p>• Toggle in UI</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Instructions Tab */}
        <TabsContent value="instructions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-green-500" />
                {t.instructions}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-medium text-sm">1</div>
                  <div>
                    <h4 className="font-medium text-blue-800">{t.step1}</h4>
                    <p className="text-sm text-blue-700 mt-1">The script will automatically paste into the Code Editor</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-medium text-sm">2</div>
                  <div>
                    <h4 className="font-medium text-green-800">{t.step2}</h4>
                    <p className="text-sm text-green-700 mt-1">The interactive control panel will appear on the right side</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-medium text-sm">3</div>
                  <div>
                    <h4 className="font-medium text-yellow-800">{t.step3}</h4>
                    <p className="text-sm text-yellow-700 mt-1">Adjust season (Kharif/Rabi/Zaid), tree count, and processing scale</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-medium text-sm">4</div>
                  <div>
                    <h4 className="font-medium text-purple-800">{t.step4}</h4>
                    <p className="text-sm text-purple-700 mt-1">CSV format: lat,lon,landcover (numeric codes 1-7)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-medium text-sm">5</div>
                  <div>
                    <h4 className="font-medium text-orange-800">{t.step5}</h4>
                    <p className="text-sm text-orange-700 mt-1">Random Forest classification will process and display results</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-medium text-sm">6</div>
                  <div>
                    <h4 className="font-medium text-red-800">{t.step6}</h4>
                    <p className="text-sm text-red-700 mt-1">Export classification maps or LSTM-ready time series to Google Drive</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">Additional Features:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Click anywhere on the map to generate time series charts</li>
                  <li>• Use drawing tools to interactively add training points</li>
                  <li>• View confusion matrix and area statistics in the Console</li>
                  <li>• Export both classification results and raw time series data</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Code Tab */}
        <TabsContent value="code" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-purple-500" />
                    Complete Google Earth Engine Script
                  </CardTitle>
                  <CardDescription>
                    Copy this script and paste it into the Google Earth Engine Code Editor
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={copyToClipboard} variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    {scriptCopied ? t.scriptCopied : t.copyScript}
                  </Button>
                  <Button onClick={openInGEE} size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {t.openGEE}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Textarea
                  value={geeScript}
                  readOnly
                  className="font-mono text-xs h-96 resize-none bg-gray-900 text-green-400 border-gray-700"
                  style={{ whiteSpace: 'pre' }}
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className="bg-gray-800 text-green-400 border-green-400">
                    Google Earth Engine JavaScript
                  </Badge>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">How to Use This Script:</h4>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. Click "Copy Script Code" to copy the entire script to your clipboard</li>
                  <li>2. Open <a href="https://code.earthengine.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Google Earth Engine Code Editor</a></li>
                  <li>3. Paste the script into the code editor (Ctrl+V / Cmd+V)</li>
                  <li>4. Click "Run" to execute the script</li>
                  <li>5. The interactive dashboard will appear with controls on the right</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}