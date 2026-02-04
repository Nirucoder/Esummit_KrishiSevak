// Data Integration Service for KrishiSevak Platform
// Combines ML models, GEE data, and external APIs for comprehensive agricultural insights

import { mlModelService, CropPrediction, YieldForecast } from './MLModelService';
import { geeService, NDVIAnalysis, SatelliteImagery } from './GoogleEarthEngineService';

export interface FarmProfile {
  farmId: string;
  farmerId: string;
  location: { lat: number; lng: number };
  area: number;
  soilType: string;
  currentCrops: string[];
  irrigationType: string;
  farmingPractices: string[];
}

export interface IntegratedRecommendation {
  id: string;
  type: 'Crop' | 'Irrigation' | 'Fertilizer' | 'Pest' | 'Disease' | 'Weather';
  priority: 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  actionRequired: string;
  timeframe: string;
  expectedBenefit: string;
  confidence: number;
  sources: string[];
  relatedData: {
    mlPrediction?: any;
    satelliteData?: any;
    weatherData?: any;
  };
}

export interface ComprehensiveAnalysis {
  farmProfile: FarmProfile;
  cropSuitability: CropPrediction[];
  yieldForecast: YieldForecast[];
  vegetationHealth: NDVIAnalysis;
  satelliteImagery: SatelliteImagery[];
  recommendations: IntegratedRecommendation[];
  riskAssessment: {
    overall: number;
    factors: Array<{
      factor: string;
      risk: number;
      mitigation: string;
    }>;
  };
  marketInsights: {
    currentPrices: Array<{
      crop: string;
      price: number;
      trend: 'Rising' | 'Falling' | 'Stable';
    }>;
    demandForecast: Array<{
      crop: string;
      demand: number;
      confidence: number;
    }>;
  };
}

class DataIntegrationService {
  async getComprehensiveAnalysis(farmProfile: FarmProfile): Promise<ComprehensiveAnalysis> {
    try {
      // Run parallel requests to ML models and GEE
      const [
        cropSuitability,
        yieldForecasts,
        vegetationHealth,
        satelliteImagery
      ] = await Promise.all([
        this.getCropSuitabilityAnalysis(farmProfile),
        this.getYieldForecastAnalysis(farmProfile),
        this.getVegetationHealthAnalysis(farmProfile),
        this.getSatelliteImageryAnalysis(farmProfile)
      ]);

      // Generate integrated recommendations
      const recommendations = await this.generateIntegratedRecommendations(
        farmProfile,
        cropSuitability,
        yieldForecasts,
        vegetationHealth
      );

      // Assess overall risk
      const riskAssessment = this.assessFarmRisk(
        farmProfile,
        cropSuitability,
        vegetationHealth
      );

      // Get market insights
      const marketInsights = await this.getMarketInsights(farmProfile.currentCrops);

      return {
        farmProfile,
        cropSuitability,
        yieldForecast: yieldForecasts,
        vegetationHealth,
        satelliteImagery,
        recommendations,
        riskAssessment,
        marketInsights
      };
    } catch (error) {
      console.error('Error in comprehensive analysis:', error);
      throw error;
    }
  }

  private async getCropSuitabilityAnalysis(farmProfile: FarmProfile): Promise<CropPrediction[]> {
    // Get soil and weather data from GEE
    const weatherData = await geeService.getWeatherData(farmProfile.location);
    const soilData = await geeService.analyzeSoilMoisture(
      farmProfile.location,
      1000, // 1km radius
      new Date().toISOString().split('T')[0]
    );

    // Use ML model to predict crop suitability
    return await mlModelService.predictCropSuitability(
      farmProfile.location,
      soilData,
      weatherData,
      farmProfile.area
    );
  }

  private async getYieldForecastAnalysis(farmProfile: FarmProfile): Promise<YieldForecast[]> {
    const forecasts: YieldForecast[] = [];
    
    for (const crop of farmProfile.currentCrops) {
      const forecast = await mlModelService.forecastYield(
        crop,
        farmProfile.location,
        '2024-06-15', // Current planting date
        {
          soilType: farmProfile.soilType,
          irrigationType: farmProfile.irrigationType,
          farmingPractices: farmProfile.farmingPractices
        }
      );
      forecasts.push(forecast);
    }

    return forecasts;
  }

  private async getVegetationHealthAnalysis(farmProfile: FarmProfile): Promise<NDVIAnalysis> {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return await geeService.calculateNDVI(
      farmProfile.location,
      1000, // 1km radius
      startDate,
      endDate
    );
  }

  private async getSatelliteImageryAnalysis(farmProfile: FarmProfile): Promise<SatelliteImagery[]> {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return await geeService.getSatelliteImagery(
      farmProfile.location,
      startDate,
      endDate,
      'Sentinel'
    );
  }

  private async generateIntegratedRecommendations(
    farmProfile: FarmProfile,
    cropSuitability: CropPrediction[],
    yieldForecasts: YieldForecast[],
    vegetationHealth: NDVIAnalysis
  ): Promise<IntegratedRecommendation[]> {
    const recommendations: IntegratedRecommendation[] = [];

    // Crop recommendations based on suitability
    if (cropSuitability.length > 0) {
      const bestCrop = cropSuitability[0];
      if (bestCrop.confidence > 0.8) {
        recommendations.push({
          id: 'crop-rec-1',
          type: 'Crop',
          priority: 'High',
          title: `Plant ${bestCrop.crop} for optimal yield`,
          description: `Based on ML analysis, ${bestCrop.crop} shows ${Math.round(bestCrop.confidence * 100)}% suitability for your location.`,
          actionRequired: `Plant ${bestCrop.recommendedVariety} variety by ${bestCrop.plantingDate}`,
          timeframe: '2-4 weeks',
          expectedBenefit: `Expected yield: ${bestCrop.expectedYield} tons/hectare`,
          confidence: bestCrop.confidence,
          sources: ['ML Crop Prediction Model', 'Satellite Data'],
          relatedData: { mlPrediction: bestCrop }
        });
      }
    }

    // Vegetation health recommendations
    if (vegetationHealth.healthPercentage < 70) {
      recommendations.push({
        id: 'health-rec-1',
        type: 'Irrigation',
        priority: 'High',
        title: 'Vegetation health needs attention',
        description: `NDVI analysis shows vegetation health at ${vegetationHealth.healthPercentage}%, below optimal range.`,
        actionRequired: 'Increase irrigation and check for nutrient deficiency',
        timeframe: '1-2 weeks',
        expectedBenefit: 'Improve vegetation health by 15-20%',
        confidence: 0.85,
        sources: ['Satellite NDVI Analysis'],
        relatedData: { satelliteData: vegetationHealth }
      });
    }

    // Yield forecast recommendations
    for (const forecast of yieldForecasts) {
      if (forecast.predictedYield < forecast.currentYield * 0.9) {
        recommendations.push({
          id: `yield-rec-${forecast.crop}`,
          type: 'Fertilizer',
          priority: 'Medium',
          title: `Improve ${forecast.crop} yield forecast`,
          description: `Predicted yield (${forecast.predictedYield} tons/ha) is below current average.`,
          actionRequired: forecast.recommendations.join(', '),
          timeframe: '2-6 weeks',
          expectedBenefit: `Potential yield increase of ${((forecast.currentYield - forecast.predictedYield) * 100 / forecast.predictedYield).toFixed(1)}%`,
          confidence: 0.78,
          sources: ['ML Yield Prediction Model'],
          relatedData: { mlPrediction: forecast }
        });
      }
    }

    return recommendations;
  }

  private assessFarmRisk(
    farmProfile: FarmProfile,
    cropSuitability: CropPrediction[],
    vegetationHealth: NDVIAnalysis
  ): { overall: number; factors: Array<{ factor: string; risk: number; mitigation: string }> } {
    const factors = [];

    // Weather risk assessment
    factors.push({
      factor: 'Weather variability',
      risk: 0.3,
      mitigation: 'Install weather monitoring and follow irrigation schedule'
    });

    // Crop diversity risk
    const diversityRisk = farmProfile.currentCrops.length < 2 ? 0.6 : 0.2;
    factors.push({
      factor: 'Crop diversity',
      risk: diversityRisk,
      mitigation: 'Consider intercropping with compatible crops'
    });

    // Vegetation health risk
    const healthRisk = vegetationHealth.healthPercentage < 70 ? 0.5 : 0.2;
    factors.push({
      factor: 'Vegetation health',
      risk: healthRisk,
      mitigation: 'Monitor NDVI regularly and maintain optimal nutrition'
    });

    // Market risk
    factors.push({
      factor: 'Market volatility',
      risk: 0.4,
      mitigation: 'Diversify crops and establish direct market connections'
    });

    const overall = factors.reduce((sum, factor) => sum + factor.risk, 0) / factors.length;

    return { overall, factors };
  }

  private async getMarketInsights(crops: string[]): Promise<{
    currentPrices: Array<{ crop: string; price: number; trend: 'Rising' | 'Falling' | 'Stable' }>;
    demandForecast: Array<{ crop: string; demand: number; confidence: number }>;
  }> {
    // Mock market data - replace with actual market API
    const currentPrices = crops.map(crop => ({
      crop,
      price: Math.round(1500 + Math.random() * 1000), // INR per quintal
      trend: (['Rising', 'Falling', 'Stable'] as const)[Math.floor(Math.random() * 3)]
    }));

    const demandForecast = crops.map(crop => ({
      crop,
      demand: Math.round(80 + Math.random() * 40), // Demand percentage
      confidence: 0.7 + Math.random() * 0.25
    }));

    return { currentPrices, demandForecast };
  }

  async getRealtimeAlerts(farmProfile: FarmProfile): Promise<Array<{
    id: string;
    type: 'Weather' | 'Pest' | 'Disease' | 'Market' | 'Government';
    severity: 'High' | 'Medium' | 'Low';
    message: string;
    timestamp: string;
    actionRequired: boolean;
  }>> {
    // Mock alerts - replace with actual real-time monitoring
    return [
      {
        id: 'alert-1',
        type: 'Weather',
        severity: 'High',
        message: 'Heavy rainfall expected in next 48 hours - prepare drainage',
        timestamp: new Date().toISOString(),
        actionRequired: true
      },
      {
        id: 'alert-2',
        type: 'Market',
        severity: 'Medium',
        message: 'Rice prices increased by 8% in local mandis',
        timestamp: new Date().toISOString(),
        actionRequired: false
      }
    ];
  }
}

export const dataIntegrationService = new DataIntegrationService();