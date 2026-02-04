import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  TrendingUp, 
  BarChart3, 
  Calendar,
  Target,
  Download,
  Filter,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, ComposedChart, Area, AreaChart } from 'recharts';
import { motion } from 'motion/react';
import * as XLSX from 'xlsx';

interface YieldAnalyticsScreenProps {
  language: string;
}

// Mock historical yield data
const yieldData = [
  { year: '2019', wheat: 45, rice: 52, corn: 38, soybean: 28, ndvi: 0.72 },
  { year: '2020', wheat: 42, rice: 49, corn: 35, soybean: 25, ndvi: 0.68 },
  { year: '2021', wheat: 48, rice: 55, corn: 41, soybean: 32, ndvi: 0.76 },
  { year: '2022', wheat: 51, rice: 58, corn: 44, soybean: 35, ndvi: 0.78 },
  { year: '2023', wheat: 47, rice: 53, corn: 39, soybean: 30, ndvi: 0.74 },
  { year: '2024', wheat: 54, rice: 61, corn: 47, soybean: 38, ndvi: 0.82 }
];

const seasonalYield = [
  { season: 'Kharif 2022', wheat: 0, rice: 58, corn: 44, soybean: 35 },
  { season: 'Rabi 2022-23', wheat: 51, rice: 0, corn: 0, soybean: 0 },
  { season: 'Kharif 2023', wheat: 0, rice: 53, corn: 39, soybean: 30 },
  { season: 'Rabi 2023-24', wheat: 54, rice: 0, corn: 0, soybean: 0 }
];

const fieldComparison = [
  { field: 'Field A', area: 2.5, wheat: 54, rice: 61, efficiency: 92 },
  { field: 'Field B', area: 3.2, wheat: 49, rice: 58, efficiency: 87 },
  { field: 'Field C', area: 1.8, wheat: 52, rice: 59, efficiency: 89 },
  { field: 'Field D', area: 4.1, wheat: 47, rice: 55, efficiency: 84 }
];

const yieldVsInputs = [
  { month: 'Jan', yield: 45, fertilizer: 120, irrigation: 85, ndvi: 0.68 },
  { month: 'Feb', yield: 48, fertilizer: 130, irrigation: 90, ndvi: 0.72 },
  { month: 'Mar', yield: 52, fertilizer: 125, irrigation: 88, ndvi: 0.76 },
  { month: 'Apr', yield: 54, fertilizer: 135, irrigation: 92, ndvi: 0.78 },
  { month: 'May', yield: 51, fertilizer: 128, irrigation: 87, ndvi: 0.74 },
  { month: 'Jun', yield: 56, fertilizer: 140, irrigation: 95, ndvi: 0.82 }
];

export function YieldAnalyticsScreen({ language }: YieldAnalyticsScreenProps) {
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [selectedPeriod, setSelectedPeriod] = useState('yearly');

  const content = {
    en: {
      title: 'Yield Analytics',
      subtitle: 'Historical yield trends and performance analysis',
      historicalTrends: 'Historical Trends',
      seasonalAnalysis: 'Seasonal Analysis',
      fieldComparison: 'Field Comparison',
      inputAnalysis: 'Input vs Yield Analysis',
      yieldTrends: 'Yield Trends',
      performanceMetrics: 'Performance Metrics',
      cropYield: 'Crop Yield',
      selectCrop: 'Select Crop',
      selectPeriod: 'Select Period',
      yearly: 'Yearly',
      seasonal: 'Seasonal',
      monthly: 'Monthly',
      wheat: 'Wheat',
      rice: 'Rice',
      corn: 'Corn',
      soybean: 'Soybean',
      quintals: 'Quintals/Hectare',
      year: 'Year',
      season: 'Season',
      field: 'Field',
      area: 'Area (Hectares)',
      efficiency: 'Efficiency %',
      averageYield: 'Average Yield',
      bestYear: 'Best Year',
      growthRate: 'Growth Rate',
      totalProduction: 'Total Production',
      exportData: 'Export to Excel',
      filterData: 'Filter Data',
      ndviCorrelation: 'NDVI Correlation',
      inputEfficiency: 'Input Efficiency',
      fertilizer: 'Fertilizer (kg/ha)',
      irrigation: 'Irrigation (mm)',
      yieldPrediction: 'Yield Prediction',
      currentSeason: 'Current Season',
      projectedYield: 'Projected Yield',
      confidenceLevel: 'Confidence Level',
      recommendations: 'Recommendations',
      insights: 'Key Insights'
    },
    hi: {
      title: 'उत्पादन विश्लेषण',
      subtitle: 'ऐतिहासिक उत्पादन रुझान और प्रदर्शन विश्लेषण',
      historicalTrends: 'ऐतिहासिक रुझान',
      seasonalAnalysis: 'मौसमी विश्लेषण',
      fieldComparison: 'खेत तुलना',
      inputAnalysis: 'इनपुट बनाम उत्पादन विश्लेषण',
      yieldTrends: 'उत्पादन रुझान',
      performanceMetrics: 'प्रदर्शन मैट्रिक्स',
      cropYield: 'फसल उत्पादन',
      selectCrop: 'फसल चुनें',
      selectPeriod: 'अवधि चुनें',
      yearly: 'वार्षिक',
      seasonal: 'मौसमी',
      monthly: 'मासिक',
      wheat: 'गेहूं',
      rice: 'चावल',
      corn: 'मक्का',
      soybean: 'सोयाबीन',
      quintals: 'क्विंटल/हेक्टेयर',
      year: 'वर्ष',
      season: 'मौसम',
      field: 'खेत',
      area: 'क्षेत्रफल (हेक्टेयर)',
      efficiency: 'दक्षता %',
      averageYield: 'औसत उत्पादन',
      bestYear: 'सर्वोत्तम वर्ष',
      growthRate: 'वृद्धि दर',
      totalProduction: 'कुल उत्पादन',
      exportData: 'Excel में निर्यात',
      filterData: 'डेटा फ़िल्टर',
      ndviCorrelation: 'NDVI सहसंबंध',
      inputEfficiency: 'इनपुट दक्षता',
      fertilizer: 'उर्वरक (किग्रा/हेक्टेयर)',
      irrigation: 'सिंचाई (मिमी)',
      yieldPrediction: 'उत्पादन पूर्वानुमान',
      currentSeason: 'वर्तमान सीजन',
      projectedYield: 'अनुमानित उत्पादन',
      confidenceLevel: 'विश्वास स्तर',
      recommendations: 'सिफारिशें',
      insights: 'मुख्य अंतर्दृष्टि'
    }
  };

  const t = content[language as keyof typeof content] || content.en;

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    
    // Historical data sheet
    const wsHistorical = XLSX.utils.json_to_sheet(yieldData);
    XLSX.utils.book_append_sheet(wb, wsHistorical, 'Historical Yields');
    
    // Field comparison sheet
    const wsFields = XLSX.utils.json_to_sheet(fieldComparison);
    XLSX.utils.book_append_sheet(wb, wsFields, 'Field Comparison');
    
    // Save file
    XLSX.writeFile(wb, `yield-analytics-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const getCurrentYearGrowth = () => {
    const currentYear = yieldData[yieldData.length - 1];
    const previousYear = yieldData[yieldData.length - 2];
    const currentValue = (currentYear as any)[selectedCrop] as number;
    const previousValue = (previousYear as any)[selectedCrop] as number;
    const growth = ((currentValue - previousValue) / previousValue) * 100;
    return growth;
  };

  const getAverageYield = () => {
    const total = yieldData.reduce((sum, item) => sum + ((item as any)[selectedCrop] as number), 0);
    return (total / yieldData.length).toFixed(1);
  };

  const getBestYear = () => {
    return yieldData.reduce((best, current) => 
      ((current as any)[selectedCrop] as number) > ((best as any)[selectedCrop] as number) ? current : best
    );
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
          <Button variant="outline" onClick={exportToExcel}>
            <Download className="h-4 w-4 mr-2" />
            {t.exportData}
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">{t.selectCrop}</label>
          <Select value={selectedCrop} onValueChange={setSelectedCrop}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wheat">{t.wheat}</SelectItem>
              <SelectItem value="rice">{t.rice}</SelectItem>
              <SelectItem value="corn">{t.corn}</SelectItem>
              <SelectItem value="soybean">{t.soybean}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">{t.selectPeriod}</label>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yearly">{t.yearly}</SelectItem>
              <SelectItem value="seasonal">{t.seasonal}</SelectItem>
              <SelectItem value="monthly">{t.monthly}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.averageYield}</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getAverageYield()}</div>
            <p className="text-xs text-muted-foreground">{t.quintals}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.bestYear}</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getBestYear().year}</div>
            <p className="text-xs text-muted-foreground">
              {(getBestYear() as any)[selectedCrop]} {t.quintals}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.growthRate}</CardTitle>
            {getCurrentYearGrowth() > 0 ? (
              <ArrowUp className="h-4 w-4 text-green-500" />
            ) : getCurrentYearGrowth() < 0 ? (
              <ArrowDown className="h-4 w-4 text-red-500" />
            ) : (
              <Minus className="h-4 w-4 text-gray-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getCurrentYearGrowth() > 0 ? 'text-green-600' : getCurrentYearGrowth() < 0 ? 'text-red-600' : 'text-gray-600'}`}>
              {getCurrentYearGrowth() > 0 ? '+' : ''}{getCurrentYearGrowth().toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">vs previous year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.projectedYield}</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">58</div>
            <p className="text-xs text-muted-foreground">
              {t.quintals} (95% {t.confidenceLevel})
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Analytics Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trends">{t.historicalTrends}</TabsTrigger>
            <TabsTrigger value="seasonal">{t.seasonalAnalysis}</TabsTrigger>
            <TabsTrigger value="fields">{t.fieldComparison}</TabsTrigger>
            <TabsTrigger value="inputs">{t.inputAnalysis}</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Yield Trends Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>{t.yieldTrends}</CardTitle>
                  <CardDescription>
                    {language === 'en' 
                      ? 'Historical yield performance over years' 
                      : 'वर्षों में ऐतिहासिक उत्पादन प्रदर्शन'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={yieldData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Line 
                          type="monotone" 
                          dataKey={selectedCrop} 
                          stroke="#16a34a" 
                          strokeWidth={3}
                          dot={{ fill: '#16a34a', strokeWidth: 2, r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* NDVI Correlation */}
              <Card>
                <CardHeader>
                  <CardTitle>{t.ndviCorrelation}</CardTitle>
                  <CardDescription>
                    {language === 'en' 
                      ? 'Yield correlation with vegetation health (NDVI)' 
                      : 'वनस्पति स्वास्थ्य (NDVI) के साथ उत्पादन सहसंबंध'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={yieldData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Bar dataKey={selectedCrop} fill="#16a34a" opacity={0.7} />
                        <Line 
                          type="monotone" 
                          dataKey="ndvi" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="seasonal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.seasonalAnalysis}</CardTitle>
                <CardDescription>
                  {language === 'en' 
                    ? 'Season-wise yield comparison across crops' 
                    : 'फसलों में सीजन-वार उत्पादन तुलना'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={seasonalYield}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="season" />
                      <YAxis />
                      <Bar dataKey="wheat" fill="#daa520" name="Wheat" />
                      <Bar dataKey="rice" fill="#16a34a" name="Rice" />
                      <Bar dataKey="corn" fill="#f59e0b" name="Corn" />
                      <Bar dataKey="soybean" fill="#8b5cf6" name="Soybean" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fields" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.fieldComparison}</CardTitle>
                <CardDescription>
                  {language === 'en' 
                    ? 'Performance comparison across different fields' 
                    : 'विभिन्न खेतों में प्रदर्शन तुलना'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fieldComparison.map((field, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex-1">
                        <h4 className="font-medium">{field.field}</h4>
                        <p className="text-sm text-muted-foreground">
                          {field.area} {t.area.split(' ')[1]}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">
                          {(field as any)[selectedCrop]}
                        </div>
                        <p className="text-xs text-muted-foreground">{t.quintals}</p>
                      </div>
                      <div className="text-center">
                        <Badge variant="outline" className={
                          field.efficiency > 90 ? 'border-green-200 text-green-700' :
                          field.efficiency > 85 ? 'border-yellow-200 text-yellow-700' :
                          'border-red-200 text-red-700'
                        }>
                          {field.efficiency}%
                        </Badge>
                        <p className="text-xs text-muted-foreground">{t.efficiency}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inputs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.inputAnalysis}</CardTitle>
                <CardDescription>
                  {language === 'en' 
                    ? 'Relationship between inputs and yield performance' 
                    : 'इनपुट और उत्पादन प्रदर्शन के बीच संबंध'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={yieldVsInputs}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Area 
                        type="monotone" 
                        dataKey="yield" 
                        fill="#16a34a" 
                        fillOpacity={0.2}
                        stroke="#16a34a"
                        strokeWidth={2}
                      />
                      <Bar dataKey="fertilizer" fill="#f59e0b" opacity={0.7} />
                      <Line 
                        type="monotone" 
                        dataKey="irrigation" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Insights and Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              {t.insights}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                {language === 'en' 
                  ? `${selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)} yield has improved by ${getCurrentYearGrowth().toFixed(1)}% this year.` 
                  : `इस वर्ष ${selectedCrop} उत्पादन में ${getCurrentYearGrowth().toFixed(1)}% सुधार हुआ है।`
                }
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                {language === 'en' 
                  ? 'Strong correlation observed between NDVI values and final yield.' 
                  : 'NDVI मानों और अंतिम उत्पादन के बीच मजबूत सहसंबंध देखा गया।'
                }
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-800">
                {language === 'en' 
                  ? 'Field A consistently outperforms other fields by 8-12%.' 
                  : 'फील्ड A लगातार अन्य खेतों से 8-12% बेहतर प्रदर्शन करता है।'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              {t.recommendations}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                {language === 'en' 
                  ? 'Replicate Field A management practices in other fields for better yields.' 
                  : 'बेहतर उत्पादन के लिए अन्य खेतों में फील्ड A की प्रबंधन प्रथाओं को दोहराएं।'
                }
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                {language === 'en' 
                  ? 'Optimize fertilizer application timing based on NDVI monitoring.' 
                  : 'NDVI निगरानी के आधार पर उर्वरक अनुप्रयोग समय को अनुकूलित करें।'
                }
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-800">
                {language === 'en' 
                  ? 'Consider crop rotation to maintain soil health and yield sustainability.' 
                  : 'मिट्टी के स्वास्थ्य और उत्पादन स्थिरता बनाए रखने के लिए फसल चक्र पर विचार करें।'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}