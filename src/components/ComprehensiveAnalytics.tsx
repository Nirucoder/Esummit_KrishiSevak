import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { YieldAnalyticsScreen } from './YieldAnalyticsScreen';
import { ScenarioSimulation } from './ScenarioSimulation';
import { TrendingUp, Calculator, BarChart3, Target } from 'lucide-react';
import { motion } from 'motion/react';
import { getContent } from '../utils/languages';

interface ComprehensiveAnalyticsProps {
  language: string;
}

export function ComprehensiveAnalytics({ language }: ComprehensiveAnalyticsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Use centralized translations
  const t = {
    title: getContent(language, 'analyticsReports'),
    subtitle: getContent(language, 'analyticsSubtitle'),
    overview: getContent(language, 'overview'),
    yieldAnalytics: getContent(language, 'yieldAnalytics'),
    scenarios: getContent(language, 'scenarios'),
    totalYield: getContent(language, 'totalYield'),
    avgYieldPerAcre: getContent(language, 'avgYieldPerAcre'),
    productivityGain: getContent(language, 'productivityGain'),
    optimalScenarios: getContent(language, 'optimalScenarios'),
    viewDetails: getContent(language, 'viewDetails')
  };

  // Mock analytics data
  const analyticsData = {
    totalYield: 24.5,
    avgYieldPerAcre: 4.9,
    productivityGain: 12.3,
    optimalScenarios: 3
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
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-purple-500" />
            {t.title}
          </h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
      </motion.div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">{t.overview}</TabsTrigger>
          <TabsTrigger value="analytics">{t.yieldAnalytics}</TabsTrigger>
          <TabsTrigger value="scenarios">{t.scenarios}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* Total Yield Card */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('analytics')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.totalYield}</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.totalYield} tons</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {t.viewDetails} →
                </p>
              </CardContent>
            </Card>

            {/* Avg Yield Per Acre Card */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('analytics')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.avgYieldPerAcre}</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.avgYieldPerAcre} tons</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {t.viewDetails} →
                </p>
              </CardContent>
            </Card>

            {/* Productivity Gain Card */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('analytics')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.productivityGain}</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{analyticsData.productivityGain}%</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {t.viewDetails} →
                </p>
              </CardContent>
            </Card>

            {/* Optimal Scenarios Card */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('scenarios')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.optimalScenarios}</CardTitle>
                <Calculator className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.optimalScenarios}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {t.viewDetails} →
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Yield Analytics Tab */}
        <TabsContent value="analytics">
          <YieldAnalyticsScreen language={language} />
        </TabsContent>

        {/* Scenario Planning Tab */}
        <TabsContent value="scenarios">
          <ScenarioSimulation language={language} />
        </TabsContent>
      </Tabs>
    </div>
  );
}