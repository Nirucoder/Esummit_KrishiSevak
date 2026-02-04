import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip,
  Area,
  AreaChart
} from 'recharts';
import { 
  Calculator,
  TrendingUp,
  TrendingDown,
  Droplets,
  Sprout,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { motion } from 'motion/react';

interface ScenarioSimulationProps {
  language: string;
}

interface SimulationParams {
  irrigationFrequency: number;
  fertilizerAmount: number;
  cropType: string;
  season: string;
  landSize: number;
  pesticides: number;
  laborCost: number;
  seedCost: number;
  machinery: number;
  transportation: number;
}

interface SimulationResult {
  expectedYield: number;
  totalCost: number;
  revenue: number;
  profit: number;
  profitMargin: number;
  riskLevel: string;
  waterUsage: number;
  waterCost: number;
  laborHours: number;
  laborCostTotal: number;
  environmentalImpact: number;
  suggestions: string[];
  costBreakdown: {
    seeds: number;
    fertilizer: number;
    pesticides: number;
    irrigation: number;
    labor: number;
    machinery: number;
    transportation: number;
  };
}

export function ScenarioSimulation({ language }: ScenarioSimulationProps) {
  const [params, setParams] = useState<SimulationParams>({
    irrigationFrequency: 3,
    fertilizerAmount: 50,
    cropType: 'wheat',
    season: 'rabi',
    landSize: 2,
    pesticides: 25,
    laborCost: 15000,
    seedCost: 5000,
    machinery: 8000,
    transportation: 3000
  });

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [comparisonData, setComparisonData] = useState<any[]>([]);

  const content = {
    en: {
      title: 'Scenario Simulation & Planning',
      subtitle: 'Plan and simulate different farming scenarios to optimize yields and profits',
      parameters: 'Simulation Parameters',
      results: 'Simulation Results',
      comparison: 'Scenario Comparison',
      irrigationFreq: 'Irrigation Frequency (per week)',
      fertilizerAmount: 'Fertilizer Amount (kg/hectare)',
      cropType: 'Crop Type',
      season: 'Growing Season',
      landSize: 'Land Size (hectares)',
      pesticides: 'Pesticide Usage (kg/hectare)',
      laborCost: 'Labor Cost (₹/hectare)',
      seedCost: 'Seed Cost (₹/hectare)',
      machinery: 'Machinery Cost (₹/hectare)',
      transportation: 'Transportation Cost (₹/hectare)',
      runSimulation: 'Run Simulation',
      expectedYield: 'Expected Yield',
      totalCost: 'Total Cost',
      revenue: 'Expected Revenue',
      profit: 'Net Profit',
      profitMargin: 'Profit Margin',
      riskLevel: 'Risk Level',
      waterUsage: 'Water Usage',
      waterCost: 'Water Cost',
      laborHours: 'Labor Hours',
      laborCostTotal: 'Total Labor Cost',
      envImpact: 'Environmental Impact',
      costBreakdown: 'Cost Breakdown',
      suggestions: 'Optimization Suggestions',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      wheat: 'Wheat',
      rice: 'Rice',
      corn: 'Corn',
      soybean: 'Soybean',
      cotton: 'Cotton',
      sugarcane: 'Sugarcane',
      rabi: 'Rabi (Winter)',
      kharif: 'Kharif (Monsoon)',
      zaid: 'Zaid (Summer)',
      tons: 'tons',
      liters: 'liters',
      hours: 'hours',
      rupees: '₹',
      percentage: '%',
      optimize: 'Optimize Parameters',
      reset: 'Reset to Default',
      saveScenario: 'Save Scenario',
      loadScenario: 'Load Scenario'
    },
    hi: {
      title: 'परिदृश्य सिमुलेशन और योजना',
      subtitle: 'उत्पादन और लाभ को अनुकूलित करने के लिए विभिन्न कृषि परिदृश्यों की योजना और सिमुलेशन करें',
      parameters: 'सिमुलेशन पैरामीटर',
      results: 'सिमुलेशन परिणाम',
      comparison: 'परिदृश्य तुलना',
      irrigationFreq: 'सिंचाई आवृत्ति (प्रति सप्ताह)',
      fertilizerAmount: 'उर्वरक मात्रा (किलो/हेक्टेयर)',
      cropType: 'फसल प्रकार',
      season: 'बढ़ता मौसम',
      landSize: 'भूमि का आकार (हेक्टेयर)',
      pesticides: 'कीटनाशक का उपयोग (किलो/हेक्टेयर)',
      laborCost: 'श्रम लागत (₹/हेक्टेयर)',
      runSimulation: 'सिमुलेशन चलाएं',
      expectedYield: 'अपेक्षित उत्पादन',
      totalCost: 'कुल लागत',
      revenue: 'अपेक्षित आय',
      profit: 'शुद्ध लाभ',
      riskLevel: 'जोखिम स्तर',
      waterUsage: 'पानी का उपयोग',
      envImpact: 'पर्यावरणीय प्रभाव',
      suggestions: 'अनुकूलन सुझाव',
      low: 'कम',
      medium: 'मध्यम',
      high: 'उच्च',
      wheat: 'गेहूं',
      rice: 'चावल',
      corn: 'मक्का',
      soybean: 'सोयाबीन',
      cotton: 'कपास',
      sugarcane: 'गन्ना',
      rabi: 'रबी (सर्दी)',
      kharif: 'खरीफ (मानसून)',
      zaid: 'जायद (गर्मी)',
      tons: 'टन',
      liters: 'लीटर',
      optimize: 'पैरामीटर अनुकूलित करें',
      reset: 'डिफ़ॉल्ट पर रीसेट करें',
      saveScenario: 'परिदृश्य सहेजें',
      loadScenario: 'परिदृश्य लोड करें'
    },
    or: {
      title: 'ପରିସ୍ଥିତି ସିମୁଲେସନ୍ ଏବଂ ଯୋଜନା',
      subtitle: 'ଉତ୍ପାଦନ ଏବଂ ଲାଭ ବୃଦ୍ଧି ପାଇଁ ବିଭିନ୍ନ କୃଷି ପରିସ୍ଥିତିର ଯୋଜନା ଏବଂ ସିମୁଲେସନ୍',
      parameters: 'ସିମୁଲେସନ୍ ପାରାମିଟର',
      results: 'ସିମୁଲେସନ୍ ଫଳାଫଳ',
      comparison: 'ପରିସ୍ଥିତି ତୁଳନା',
      irrigationFreq: 'ଜଳସେଚନ ଆବୃତ୍ତି (ସପ୍ତାହରେ)',
      fertilizerAmount: 'ସାର ପରିମାଣ (କି.ଗ୍ରା./ହେକ୍ଟର)',
      cropType: 'ଫସଲ ପ୍ରକାର',
      season: 'ବୃଦ୍ଧି ମୌସୁମ',
      landSize: 'ଜମି ଆକାର (ହେକ୍ଟର)',
      pesticides: 'କୀଟନାଶକ ବ୍ୟବହାର (କି.ଗ୍ରା./ହେକ୍ଟର)',
      laborCost: 'ଶ୍ରମ ଖର୍ଚ୍ଚ (₹/ହେକ୍ଟର)',
      seedCost: 'ମଞ୍ଜି ଖର୍ଚ୍ଚ (₹/ହେକ୍ଟର)',
      machinery: 'ଯନ୍ତ୍ର ଖର୍ଚ୍ଚ (₹/ହେକ୍ଟର)',
      transportation: 'ପରିବହନ ଖର୍ଚ୍ଚ (₹/ହେକ୍ଟର)',
      runSimulation: 'ସିମୁଲେସନ୍ ଚଲାନ୍ତୁ',
      expectedYield: 'ଆଶାକରାଯାଉଥିବା ଉତ୍ପାଦନ',
      totalCost: 'ମୋଟ ଖର୍ଚ୍ଚ',
      revenue: 'ଆଶାକରାଯାଉଥିବା ଆୟ',
      profit: 'ନିଟ୍ ଲାଭ',
      profitMargin: 'ଲାଭ ମାର୍ଜିନ୍',
      riskLevel: 'ବିପଦ ସ୍ତର',
      waterUsage: 'ପାଣି ବ୍ୟବହାର',
      waterCost: 'ପାଣି ଖର୍ଚ୍ଚ',
      laborHours: 'ଶ୍ରମ ଘଣ୍ଟା',
      laborCostTotal: 'ମୋଟ ଶ୍ରମ ଖର୍ଚ୍ଚ',
      envImpact: 'ପରିବେଶ ପ୍ରଭାବ',
      costBreakdown: 'ଖର୍ଚ୍ଚ ବିଭାଗ',
      suggestions: 'ଅପ୍ଟିମାଇଜେସନ୍ ପରାମର୍ଶ',
      low: 'କମ୍',
      medium: 'ମଧ୍ୟମ',
      high: 'ଉଚ୍ଚ',
      wheat: 'ଗହମ',
      rice: 'ଚାଉଳ',
      corn: 'ମକା',
      soybean: 'ସୋୟାବିନ୍',
      cotton: 'କପା',
      sugarcane: 'ଆଖୁ',
      rabi: 'ରବି (ଶୀତ)',
      kharif: 'ଖରିଫ୍ (ବର୍ଷା)',
      zaid: 'ଜାଇଦ୍ (ଗ୍ରୀଷ୍ମ)',
      tons: 'ଟନ୍',
      liters: 'ଲିଟର',
      hours: 'ଘଣ୍ଟା',
      rupees: '₹',
      percentage: '%',
      optimize: 'ପାରାମିଟର ଅପ୍ଟିମାଇଜ୍ କରନ୍ତୁ',
      reset: 'ଡିଫଲ୍ଟକୁ ରିସେଟ୍ କରନ୍ତୁ',
      saveScenario: 'ପରିସ୍ଥିତି ସେଭ୍ କରନ୍ତୁ',
      loadScenario: 'ପରିସ୍ଥିତି ଲୋଡ୍ କରନ୍ତୁ'
    }
  };

  const t = content[language as keyof typeof content] || content.en;

  const cropOptions = [
    { value: 'wheat', label: t.wheat },
    { value: 'rice', label: t.rice },
    { value: 'corn', label: t.corn },
    { value: 'soybean', label: t.soybean },
    { value: 'cotton', label: t.cotton },
    { value: 'sugarcane', label: t.sugarcane }
  ];

  const seasonOptions = [
    { value: 'rabi', label: t.rabi },
    { value: 'kharif', label: t.kharif },
    { value: 'zaid', label: t.zaid }
  ];

  const simulateScenario = async () => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock simulation logic
    const baseYield = getCropBaseYield(params.cropType);
    const irrigationMultiplier = 1 + (params.irrigationFrequency - 3) * 0.1;
    const fertilizerMultiplier = 1 + (params.fertilizerAmount - 50) * 0.005;
    
    const expectedYield = Math.max(0, baseYield * irrigationMultiplier * fertilizerMultiplier * params.landSize);
    
    const costData = calculateTotalCost();
    const totalCost = costData.total;
    const revenue = expectedYield * getCropPrice(params.cropType);
    const profit = revenue - totalCost;
    const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
    
    const riskLevel = calculateRiskLevel();
    const waterUsage = params.irrigationFrequency * params.landSize * 1000;
    const waterCost = waterUsage * 0.02; // ₹0.02 per liter
    const laborHours = params.landSize * 200; // 200 hours per hectare
    const laborCostTotal = costData.breakdown.labor;
    const environmentalImpact = calculateEnvironmentalImpact();
    
    const suggestions = generateSuggestions();

    const simulationResult: SimulationResult = {
      expectedYield,
      totalCost,
      revenue,
      profit,
      profitMargin,
      riskLevel,
      waterUsage,
      waterCost,
      laborHours,
      laborCostTotal,
      environmentalImpact,
      suggestions,
      costBreakdown: costData.breakdown
    };

    setResult(simulationResult);
    updateComparisonData(simulationResult);
    setLoading(false);
  };

  const getCropBaseYield = (crop: string) => {
    const yields = {
      wheat: 3.5,
      rice: 4.2,
      corn: 5.8,
      soybean: 2.1,
      cotton: 1.8,
      sugarcane: 75
    };
    return yields[crop as keyof typeof yields] || 3.0;
  };

  const getCropPrice = (crop: string) => {
    const prices = {
      wheat: 25000,
      rice: 28000,
      corn: 22000,
      soybean: 45000,
      cotton: 55000,
      sugarcane: 3200
    };
    return prices[crop as keyof typeof prices] || 25000;
  };

  const calculateTotalCost = () => {
    const seedCost = params.seedCost * params.landSize;
    const fertilizerCost = params.fertilizerAmount * params.landSize * 25;
    const pesticideCost = params.pesticides * params.landSize * 150;
    const irrigationCost = params.irrigationFrequency * params.landSize * 500;
    const laborCost = params.laborCost * params.landSize;
    const machineryCost = params.machinery * params.landSize;
    const transportationCost = params.transportation * params.landSize;
    
    return {
      total: seedCost + fertilizerCost + pesticideCost + irrigationCost + laborCost + machineryCost + transportationCost,
      breakdown: {
        seeds: seedCost,
        fertilizer: fertilizerCost,
        pesticides: pesticideCost,
        irrigation: irrigationCost,
        labor: laborCost,
        machinery: machineryCost,
        transportation: transportationCost
      }
    };
  };

  const calculateRiskLevel = () => {
    let riskScore = 0;
    
    if (params.irrigationFrequency < 2) riskScore += 2;
    if (params.irrigationFrequency > 5) riskScore += 1;
    if (params.fertilizerAmount > 80) riskScore += 1;
    if (params.pesticides > 40) riskScore += 1;
    
    if (riskScore >= 3) return 'high';
    if (riskScore >= 1) return 'medium';
    return 'low';
  };

  const calculateEnvironmentalImpact = () => {
    return Math.max(0, Math.min(100, 
      (params.fertilizerAmount * 0.8) + 
      (params.pesticides * 1.2) + 
      (params.irrigationFrequency * 5)
    ));
  };

  const generateSuggestions = () => {
    const suggestions = [];
    
    if (params.irrigationFrequency > 4) {
      suggestions.push(language === 'hi' 
        ? 'सिंचाई की आवृत्ति कम करें - अधिक पानी फसल को नुकसान पहुंचा सकता है'
        : 'Reduce irrigation frequency - overwatering may harm crops'
      );
    }
    
    if (params.fertilizerAmount > 70) {
      suggestions.push(language === 'hi'
        ? 'उर्वरक की मात्रा कम करें - अधिक उर्वरक मिट्टी को नुकसान पहुंचाता है'
        : 'Reduce fertilizer amount - excessive fertilizer damages soil'
      );
    }
    
    if (params.pesticides > 35) {
      suggestions.push(language === 'hi'
        ? 'कीटनाशक का कम उपयोग करें - जैविक विकल्पों पर विचार करें'
        : 'Use less pesticides - consider organic alternatives'
      );
    }

    if (suggestions.length === 0) {
      suggestions.push(language === 'hi'
        ? 'आपके पैरामीटर संतुलित लग रहे हैं!'
        : 'Your parameters look well balanced!'
      );
    }
    
    return suggestions;
  };

  const updateComparisonData = (newResult: SimulationResult) => {
    setComparisonData(prev => [
      ...prev.slice(-4),
      {
        scenario: `Scenario ${prev.length + 1}`,
        yield: newResult.expectedYield,
        profit: newResult.profit,
        cost: newResult.totalCost,
        risk: newResult.riskLevel,
        water: newResult.waterUsage,
        envImpact: newResult.environmentalImpact
      }
    ]);
  };

  const optimizeParameters = () => {
    // AI-driven optimization logic
    setParams({
      ...params,
      irrigationFrequency: 3,
      fertilizerAmount: 45,
      pesticides: 20
    });
  };

  const resetParameters = () => {
    setParams({
      irrigationFrequency: 3,
      fertilizerAmount: 50,
      cropType: 'wheat',
      season: 'rabi',
      landSize: 2,
      pesticides: 25,
      laborCost: 15000,
      seedCost: 5000,
      machinery: 8000,
      transportation: 3000
    });
    setResult(null);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
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
          <h1>{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={optimizeParameters}>
            <TrendingUp className="h-4 w-4 mr-2" />
            {t.optimize}
          </Button>
          <Button variant="outline" onClick={resetParameters}>
            <Calculator className="h-4 w-4 mr-2" />
            {t.reset}
          </Button>
        </div>
      </motion.div>

      <Tabs defaultValue="parameters" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="parameters">{t.parameters}</TabsTrigger>
          <TabsTrigger value="results">{t.results}</TabsTrigger>
          <TabsTrigger value="comparison">{t.comparison}</TabsTrigger>
        </TabsList>

        <TabsContent value="parameters" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Parameters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="h-5 w-5 text-green-500" />
                  {language === 'hi' ? 'मूलभूत पैरामीटर' : 'Basic Parameters'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t.cropType}</Label>
                    <Select value={params.cropType} onValueChange={(value) => setParams({...params, cropType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {cropOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t.season}</Label>
                    <Select value={params.season} onValueChange={(value) => setParams({...params, season: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {seasonOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t.landSize}: {params.landSize} hectares</Label>
                  <Slider
                    value={[params.landSize]}
                    onValueChange={(value) => setParams({...params, landSize: value[0]})}
                    min={0.5}
                    max={10}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t.laborCost}: ₹{params.laborCost.toLocaleString()}</Label>
                  <Slider
                    value={[params.laborCost]}
                    onValueChange={(value) => setParams({...params, laborCost: value[0]})}
                    min={5000}
                    max={30000}
                    step={1000}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Agricultural Inputs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  {language === 'hi' ? 'कृषि निविष्टियां' : 'Agricultural Inputs'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>{t.irrigationFreq}: {params.irrigationFrequency} times/week</Label>
                  <Slider
                    value={[params.irrigationFrequency]}
                    onValueChange={(value) => setParams({...params, irrigationFrequency: value[0]})}
                    min={1}
                    max={7}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t.fertilizerAmount}: {params.fertilizerAmount} kg/hectare</Label>
                  <Slider
                    value={[params.fertilizerAmount]}
                    onValueChange={(value) => setParams({...params, fertilizerAmount: value[0]})}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t.pesticides}: {params.pesticides} kg/hectare</Label>
                  <Slider
                    value={[params.pesticides]}
                    onValueChange={(value) => setParams({...params, pesticides: value[0]})}
                    min={0}
                    max={60}
                    step={5}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <Button 
              size="lg" 
              onClick={simulateScenario} 
              disabled={loading}
              className="px-8"
            >
              <Calculator className="h-5 w-5 mr-2" />
              {loading ? (language === 'hi' ? 'गणना हो रही है...' : 'Calculating...') : t.runSimulation}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {result ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">{t.expectedYield}</p>
                        <p className="font-semibold">{result.expectedYield.toFixed(1)} {t.tons}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">{t.profit}</p>
                        <p className={`font-semibold ${result.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ₹{result.profit.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-5 w-5 text-cyan-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">{t.waterUsage}</p>
                        <p className="font-semibold">{result.waterUsage.toLocaleString()} {t.liters}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">{t.riskLevel}</p>
                        <Badge className={getRiskColor(result.riskLevel)}>
                          {t[result.riskLevel as keyof typeof t]}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Results */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{language === 'hi' ? 'वित्तीय विश्लेषण' : 'Financial Analysis'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t.totalCost}:</span>
                        <span className="font-medium">₹{result.totalCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t.revenue}:</span>
                        <span className="font-medium">₹{result.revenue.toLocaleString()}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{t.profit}:</span>
                          <span className={`font-bold ${result.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ₹{result.profit.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t.suggestions}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {result.suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{language === 'hi' ? 'परिणाम देखने के लिए सिमुलेशन चलाएं' : 'Run simulation to see results'}</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          {comparisonData.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  {language === 'hi' ? 'परिदृश्य तुलना' : 'Scenario Comparison'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="scenario" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="profit" fill="#16a34a" name={t.profit} />
                      <Bar dataKey="yield" fill="#3b82f6" name={t.expectedYield} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{language === 'hi' ? 'तुलना डेटा देखने के लिए कुछ सिमुलेशन चलाएं' : 'Run some simulations to see comparison data'}</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}