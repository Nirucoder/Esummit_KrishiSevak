import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Lightbulb, 
  Zap, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  MapPin,
  Target,
  Activity,
  Sprout,
  Droplets,
  Thermometer,
  CloudRain,
  Leaf,
  Download,
  Smartphone
} from 'lucide-react';
import { motion } from 'motion/react';

interface RecommendationsEngineProps {
  language: string;
}

export function RecommendationsEngine({ language }: RecommendationsEngineProps) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const content = {
    en: {
      title: 'AI-Powered Recommendations',
      subtitle: 'Personalized actionable insights to maximize your crop productivity by 10%+',
      generateRecommendations: 'Generate New Recommendations',
      generating: 'Analyzing Farm Data...',
      allRecommendations: 'All Recommendations',
      irrigation: 'Irrigation',
      fertilization: 'Fertilization',
      pestControl: 'Pest Control',
      soilManagement: 'Soil Management',
      planting: 'Planting & Harvesting',
      priority: 'Priority',
      impact: 'Expected Impact',
      timeframe: 'Timeframe',
      cost: 'Estimated Cost',
      difficulty: 'Difficulty',
      implement: 'Implement Now',
      viewDetails: 'View Details',
      implemented: 'Implemented',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      immediate: 'Immediate',
      thisWeek: 'This Week',
      thisMonth: 'This Month',
      nextSeason: 'Next Season',
      easy: 'Easy',
      moderate: 'Moderate',
      advanced: 'Advanced',
      free: 'Free',
      lowCost: 'Low Cost',
      mediumCost: 'Medium Cost',
      highCost: 'High Cost',
      downloadReport: 'Download Full Report',
      sendToWhatsApp: 'Send to WhatsApp',
      scheduleReminder: 'Schedule Reminder',
      productivity: 'Productivity Boost',
      basedOn: 'Based on your farm data, weather patterns, and soil analysis',
      implementationGuide: 'Implementation Guide',
      successRate: 'Success Rate',
      farmers: 'farmers'
    },
    hi: {
      title: 'AI-संचालित सिफारिशें',
      subtitle: 'आपकी फसल उत्पादकता को 10%+ बढ़ाने के लिए व्यक्तिगत क्रियाशील अंतर्दृष्टि',
      generateRecommendations: 'नई सिफारिशें उत्पन्न करें',
      generating: 'खेत डेटा का विश्लेषण कर रहे हैं...',
      allRecommendations: 'सभी सिफारिशें',
      irrigation: 'सिंचाई',
      fertilization: 'उर्वरीकरण',
      pestControl: 'कीट नियंत्रण',
      soilManagement: 'मिट्टी प्रबंधन',
      planting: 'रोपण और कटाई',
      priority: 'प्राथमिकता',
      impact: 'अपेक्षित प्रभाव',
      timeframe: 'समयसीमा',
      cost: 'अनुमानित लागत',
      difficulty: 'कठिनाई',
      implement: 'अभी लागू करें',
      viewDetails: 'विवरण देखें',
      implemented: 'लागू किया गया',
      high: 'उच्च',
      medium: 'मध्यम',
      low: 'कम',
      immediate: 'तत्काल',
      thisWeek: 'इस सप्ताह',
      thisMonth: 'इस महीने',
      nextSeason: 'अगले सीजन',
      easy: 'आसान',
      moderate: 'मध्यम',
      advanced: 'उन्नत',
      free: 'मुफ्त',
      lowCost: 'कम लागत',
      mediumCost: 'मध्यम लागत',
      highCost: 'उच्च लागत',
      downloadReport: 'पूरी रिपोर्ट डाउनलोड करें',
      sendToWhatsApp: 'व्हाट्सऐप पर भेजें',
      scheduleReminder: 'रिमाइंडर शेड्यूल करें',
      productivity: 'उत्पादकता वृद्धि',
      basedOn: 'आपके खेत के डेटा, मौसम पैटर्न और मिट्टी विश्लेषण के आधार पर',
      implementationGuide: 'कार्यान्वयन गाइड',
      successRate: 'सफलता दर',
      farmers: 'किसान'
    }
  };

  const t = content[language as keyof typeof content] || content.en;

  const categories = [
    { id: 'all', label: t.allRecommendations, icon: Lightbulb },
    { id: 'irrigation', label: t.irrigation, icon: Droplets },
    { id: 'fertilization', label: t.fertilization, icon: Leaf },
    { id: 'pest', label: t.pestControl, icon: AlertTriangle },
    { id: 'soil', label: t.soilManagement, icon: Thermometer },
    { id: 'planting', label: t.planting, icon: Sprout }
  ];

  const generateRecommendations = async () => {
    setIsLoading(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockRecommendations = [
        {
          id: 1,
          category: 'irrigation',
          title: language === 'en' ? 'Optimize Irrigation Schedule' : 'सिंचाई समय सारणी का अनुकूलन',
          description: language === 'en' 
            ? 'Based on soil moisture data, increase irrigation frequency by 15% during flowering stage'
            : 'मिट्टी की नमी के डेटा के आधार पर, फूल आने के दौरान सिंचाई की आवृत्ति 15% बढ़ाएं',
          priority: 'high',
          impact: 12,
          timeframe: 'thisWeek',
          cost: 'lowCost',
          difficulty: 'easy',
          successRate: 89,
          implementedBy: 1240,
          icon: Droplets,
          color: 'blue'
        },
        {
          id: 2,
          category: 'fertilization',
          title: language === 'en' ? 'Apply Nitrogen Fertilizer Early' : 'नाइट्रोजन उर्वरक जल्दी डालें',
          description: language === 'en'
            ? 'Soil analysis shows nitrogen deficiency. Apply 20kg/acre nitrogen fertilizer 2 weeks earlier than usual'
            : 'मिट्टी विश्लेषण में नाइट्रोजन की कमी दिखती है। सामान्य से 2 सप्ताह पहले 20 किलो/एकड़ नाइट्रोजन उर्वरक डालें',
          priority: 'high',
          impact: 18,
          timeframe: 'immediate',
          cost: 'mediumCost',
          difficulty: 'easy',
          successRate: 94,
          implementedBy: 2150,
          icon: Leaf,
          color: 'green'
        },
        {
          id: 3,
          category: 'pest',
          title: language === 'en' ? 'Preventive Pest Control' : 'निवारक कीट नियंत्रण',
          description: language === 'en'
            ? 'Weather conditions favor pest activity. Apply organic neem spray as preventive measure'
            : 'मौसमी स्थितियां कीट गतिविधि के अनुकूल हैं। निवारक उपाय के रूप में जैविक नीम स्प्रे का उपयोग करें',
          priority: 'medium',
          impact: 8,
          timeframe: 'thisWeek',
          cost: 'lowCost',
          difficulty: 'easy',
          successRate: 76,
          implementedBy: 890,
          icon: AlertTriangle,
          color: 'yellow'
        },
        {
          id: 4,
          category: 'soil',
          title: language === 'en' ? 'Soil pH Adjustment' : 'मिट्टी pH समायोजन',
          description: language === 'en'
            ? 'Soil pH is 6.2, slightly acidic. Add lime at 500kg/acre to optimize nutrient uptake'
            : 'मिट्टी का pH 6.2 है, थोड़ा अम्लीय। पोषक तत्वों के अवशोषण को अनुकूलित करने के लिए 500 किलो/एकड़ चूना मिलाएं',
          priority: 'medium',
          impact: 15,
          timeframe: 'thisMonth',
          cost: 'mediumCost',
          difficulty: 'moderate',
          successRate: 82,
          implementedBy: 670,
          icon: Thermometer,
          color: 'orange'
        },
        {
          id: 5,
          category: 'planting',
          title: language === 'en' ? 'Optimal Planting Density' : 'इष्टतम रोपण घनत्व',
          description: language === 'en'
            ? 'Increase plant density by 10% for your soil type to maximize yield per acre'
            : 'प्रति एकड़ उत्पादन को अधिकतम करने के लिए अपनी मिट्टी के प्रकार के लिए पौधे की घनत्व 10% बढ़ाएं',
          priority: 'low',
          impact: 6,
          timeframe: 'nextSeason',
          cost: 'lowCost',
          difficulty: 'easy',
          successRate: 71,
          implementedBy: 456,
          icon: Sprout,
          color: 'green'
        }
      ];
      
      setRecommendations(mockRecommendations);
      setIsLoading(false);
    }, 2000);
  };

  useEffect(() => {
    // Auto-generate recommendations on component mount
    generateRecommendations();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeframeText = (timeframe: string) => {
    switch (timeframe) {
      case 'immediate': return t.immediate;
      case 'thisWeek': return t.thisWeek;
      case 'thisMonth': return t.thisMonth;
      case 'nextSeason': return t.nextSeason;
      default: return timeframe;
    }
  };

  const getCostText = (cost: string) => {
    switch (cost) {
      case 'free': return t.free;
      case 'lowCost': return t.lowCost;
      case 'mediumCost': return t.mediumCost;
      case 'highCost': return t.highCost;
      default: return cost;
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return t.easy;
      case 'moderate': return t.moderate;
      case 'advanced': return t.advanced;
      default: return difficulty;
    }
  };

  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.category === selectedCategory);

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
          <p className="text-sm text-muted-foreground mt-1">{t.basedOn}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800">
            <Activity className="h-3 w-3 mr-1" />
            {language === 'en' ? 'AI Powered' : 'AI संचालित'}
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            <Target className="h-3 w-3 mr-1" />
            {language === 'en' ? '10%+ Productivity' : '10%+ उत्पादकता'}
          </Badge>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="gap-2"
                size="sm"
              >
                <Icon className="h-4 w-4" />
                {category.label}
              </Button>
            );
          })}
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => {
              if (!isLoading) {
                generateRecommendations();
              }
            }}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                {t.generating}
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                {t.generateRecommendations}
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => {
              // Generate comprehensive recommendations report
              import('xlsx').then(XLSX => {
                // Main recommendations data
                const recommendationsData = filteredRecommendations.map(rec => ({
                  Title: rec.title,
                  Category: rec.category,
                  Description: rec.description,
                  Priority: rec.priority === 'high' ? t.high : rec.priority === 'medium' ? t.medium : t.low,
                  Expected_Impact_Percent: `${rec.impact}%`,
                  Timeframe: getTimeframeText(rec.timeframe),
                  Cost: getCostText(rec.cost),
                  Difficulty: getDifficultyText(rec.difficulty),
                  Success_Rate_Percent: `${rec.successRate}%`,
                  Implemented_By_Farmers: rec.implementedBy,
                  Productivity_Boost: `+${rec.impact}%`
                }));

                // Summary statistics
                const summaryData = [{
                  Total_Recommendations: filteredRecommendations.length,
                  High_Priority: filteredRecommendations.filter(r => r.priority === 'high').length,
                  Medium_Priority: filteredRecommendations.filter(r => r.priority === 'medium').length,
                  Low_Priority: filteredRecommendations.filter(r => r.priority === 'low').length,
                  Average_Impact: `${Math.round(filteredRecommendations.reduce((acc, r) => acc + r.impact, 0) / filteredRecommendations.length)}%`,
                  Average_Success_Rate: `${Math.round(filteredRecommendations.reduce((acc, r) => acc + r.successRate, 0) / filteredRecommendations.length)}%`,
                  Total_Farmers_Benefited: filteredRecommendations.reduce((acc, r) => acc + r.implementedBy, 0),
                  Generated_Date: new Date().toISOString().split('T')[0],
                  Report_Language: language === 'en' ? 'English' : 'Hindi'
                }];

                // Category breakdown
                const categoryData = Object.entries(
                  filteredRecommendations.reduce((acc, rec) => {
                    acc[rec.category] = (acc[rec.category] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([category, count]) => ({
                  Category: category,
                  Count: count,
                  Percentage: `${Math.round((count / filteredRecommendations.length) * 100)}%`
                }));

                // Implementation timeline
                const timelineData = Object.entries(
                  filteredRecommendations.reduce((acc, rec) => {
                    acc[rec.timeframe] = (acc[rec.timeframe] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([timeframe, count]) => ({
                  Timeframe: getTimeframeText(timeframe),
                  Recommendations_Count: count,
                  Percentage: `${Math.round((count / filteredRecommendations.length) * 100)}%`
                }));

                // Cost analysis
                const costData = Object.entries(
                  filteredRecommendations.reduce((acc, rec) => {
                    acc[rec.cost] = (acc[rec.cost] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([cost, count]) => ({
                  Cost_Category: getCostText(cost),
                  Recommendations_Count: count,
                  Percentage: `${Math.round((count / filteredRecommendations.length) * 100)}%`
                }));

                // Create comprehensive workbook
                const wb = XLSX.utils.book_new();
                
                // Add summary sheet first
                XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summaryData), 'Summary');
                
                // Add main recommendations
                XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(recommendationsData), 'Recommendations');
                
                // Add analysis sheets
                XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(categoryData), 'Category Analysis');
                XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(timelineData), 'Implementation Timeline');
                XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(costData), 'Cost Analysis');
                
                // Generate filename with timestamp
                const timestamp = new Date().toISOString().split('T')[0];
                const filename = `krishisevak-recommendations-report-${timestamp}.xlsx`;
                
                XLSX.writeFile(wb, filename);
                
                // Show success message
                alert(language === 'en' 
                  ? `Comprehensive recommendations report downloaded: ${filename}` 
                  : `व्यापक सिफारिशें रिपोर्ट डाउनलोड हुई: ${filename}`
                );
              });
            }}
          >
            <Download className="h-4 w-4" />
            {t.downloadReport}
          </Button>
        </div>
      </motion.div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {filteredRecommendations.map((rec, index) => {
          const Icon = rec.icon;
          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-${rec.color}-100`}>
                        <Icon className={`h-5 w-5 text-${rec.color}-600`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{rec.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getPriorityColor(rec.priority)}>
                            {rec.priority === 'high' ? t.high : 
                             rec.priority === 'medium' ? t.medium : t.low} {t.priority}
                          </Badge>
                          <Badge variant="outline">
                            +{rec.impact}% {t.productivity}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">{t.timeframe}:</span>
                      <p>{getTimeframeText(rec.timeframe)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">{t.cost}:</span>
                      <p>{getCostText(rec.cost)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">{t.difficulty}:</span>
                      <p>{getDifficultyText(rec.difficulty)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">{t.successRate}:</span>
                      <p>{rec.successRate}%</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t.successRate}</span>
                      <span>{rec.successRate}%</span>
                    </div>
                    <Progress value={rec.successRate} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {language === 'en' ? 'Implemented by' : 'लागू किया गया'} {rec.implementedBy} {t.farmers}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      className="flex-1 gap-2"
                      onClick={() => {
                        // Simulate implementation tracking
                        alert(language === 'en' 
                          ? `Marked as implemented: ${rec.title}. You'll receive follow-up notifications on WhatsApp.`
                          : `लागू के रूप में चिह्नित: ${rec.title}। आपको व्हाट्सऐप पर फॉलो-अप सूचनाएं मिलेंगी।`
                        );
                      }}
                    >
                      <CheckCircle className="h-4 w-4" />
                      {t.implement}
                    </Button>
                    <Button variant="outline" size="sm">
                      {t.viewDetails}
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 gap-2"
                      onClick={() => {
                        // Simulate WhatsApp integration
                        alert(language === 'en' 
                          ? `Recommendation sent to WhatsApp: ${rec.title}`
                          : `सिफारिश व्हाट्सऐप पर भेजी गई: ${rec.title}`
                        );
                      }}
                    >
                      <Smartphone className="h-4 w-4" />
                      {t.sendToWhatsApp}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 gap-2"
                      onClick={() => {
                        // Simulate reminder scheduling
                        alert(language === 'en' 
                          ? `Reminder scheduled for: ${rec.title}`
                          : `रिमाइंडर निर्धारित किया गया: ${rec.title}`
                        );
                      }}
                    >
                      <Calendar className="h-4 w-4" />
                      {t.scheduleReminder}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredRecommendations.length === 0 && !isLoading && (
        <Card className="py-12">
          <CardContent className="text-center">
            <Lightbulb className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              {language === 'en' ? 'No recommendations available' : 'कोई सिफारिशें उपलब्ध नहीं'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === 'en' 
                ? 'Generate new recommendations to get personalized farming insights' 
                : 'व्यक्तिगत खेती अंतर्दृष्टि प्राप्त करने के लिए नई सिफारिशें उत्पन्न करें'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}