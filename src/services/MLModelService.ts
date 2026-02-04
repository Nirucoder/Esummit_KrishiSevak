// ML Model Service for KrishiSevak Platform
// Integrates with your ML models for crop predictions, yield forecasting, and recommendations

export interface CropPrediction {
  crop: string;
  confidence: number;
  suitability: number;
  recommendedVariety: string;
  plantingDate: string;
  harvestDate: string;
  expectedYield: number;
  riskFactors: string[];
}

export interface YieldForecast {
  crop: string;
  currentYield: number;
  predictedYield: number;
  yieldVariance: number;
  factors: {
    weather: number;
    soil: number;
    irrigation: number;
    fertilizer: number;
  };
  recommendations: string[];
}

export interface CropHealthPrediction {
  healthScore: number;
  diseases: Array<{
    name: string;
    probability: number;
    severity: string;
    treatment: string;
  }>;
  pests: Array<{
    name: string;
    probability: number;
    severity: string;
    treatment: string;
  }>;
  nutritionalDeficiency: Array<{
    nutrient: string;
    deficiencyLevel: string;
    recommendation: string;
  }>;
}

export interface SoilAnalysisPrediction {
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
  moisture: number;
  recommendations: string[];
  fertilizerRecommendation: {
    type: string;
    quantity: number;
    applicationMethod: string;
  };
}

export interface WeatherImpactPrediction {
  droughtRisk: number;
  floodRisk: number;
  frostRisk: number;
  optimalPlantingWindow: {
    start: string;
    end: string;
  };
  irrigationSchedule: Array<{
    date: string;
    amount: number;
    reason: string;
  }>;
}

import { getMLModelConfig, isDevelopment, logger } from './config';

class MLModelService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    const config = getMLModelConfig();
    this.baseUrl = config.baseUrl;
    this.apiKey = config.apiKey;
    
    logger.info('ML Model Service initialized', { 
      baseUrl: this.baseUrl,
      developmentMode: isDevelopment()
    });
  }

  async predictCropSuitability(
    location: { lat: number; lng: number },
    soilData: any,
    weatherData: any,
    farmSize: number
  ): Promise<CropPrediction[]> {
    // Check if API is properly configured
    if (this.baseUrl.includes('example.com') || this.baseUrl === 'YOUR_ML_MODEL_API_ENDPOINT' || isDevelopment()) {
      logger.info('Using mock data for crop suitability prediction');
      return this.getMockCropPredictions();
    }

    try {
      const response = await fetch(`${this.baseUrl}/predict/crop-suitability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          location,
          soilData,
          weatherData,
          farmSize,
        }),
      });

      if (!response.ok) {
        throw new Error(`ML Model API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('ML Model API Error:', error);
      return this.getMockCropPredictions();
    }
  }

  async forecastYield(
    crop: string,
    location: { lat: number; lng: number },
    plantingDate: string,
    farmingPractices: any
  ): Promise<YieldForecast> {
    if (this.baseUrl.includes('example.com') || this.baseUrl === 'YOUR_ML_MODEL_API_ENDPOINT' || isDevelopment()) {
      logger.info('Using mock data for yield forecast');
      return this.getMockYieldForecast(crop);
    }

    try {
      const response = await fetch(`${this.baseUrl}/predict/yield-forecast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          crop,
          location,
          plantingDate,
          farmingPractices,
        }),
      });

      if (!response.ok) {
        throw new Error(`ML Model API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('ML Model API Error:', error);
      return this.getMockYieldForecast(crop);
    }
  }

  async predictCropHealth(
    cropImages: string[],
    crop: string,
    location: { lat: number; lng: number }
  ): Promise<CropHealthPrediction> {
    if (this.baseUrl.includes('example.com') || this.baseUrl === 'YOUR_ML_MODEL_API_ENDPOINT' || isDevelopment()) {
      logger.info('Using mock data for crop health prediction');
      return this.getMockCropHealthPrediction();
    }

    try {
      const response = await fetch(`${this.baseUrl}/predict/crop-health`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          images: cropImages,
          crop,
          location,
        }),
      });

      if (!response.ok) {
        throw new Error(`ML Model API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('ML Model API Error:', error);
      return this.getMockCropHealthPrediction();
    }
  }

  async analyzeSoil(
    soilImage: string,
    location: { lat: number; lng: number },
    testResults?: any
  ): Promise<SoilAnalysisPrediction> {
    if (this.baseUrl.includes('example.com') || this.baseUrl === 'YOUR_ML_MODEL_API_ENDPOINT' || isDevelopment()) {
      logger.info('Using mock data for soil analysis');
      return this.getMockSoilAnalysis();
    }

    try {
      const response = await fetch(`${this.baseUrl}/predict/soil-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          soilImage,
          location,
          testResults,
        }),
      });

      if (!response.ok) {
        throw new Error(`ML Model API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('ML Model API Error:', error);
      return this.getMockSoilAnalysis();
    }
  }

  async predictWeatherImpact(
    location: { lat: number; lng: number },
    crop: string,
    plantingDate: string
  ): Promise<WeatherImpactPrediction> {
    if (this.baseUrl.includes('example.com') || this.baseUrl === 'YOUR_ML_MODEL_API_ENDPOINT' || isDevelopment()) {
      logger.info('Using mock data for weather impact prediction');
      return this.getMockWeatherImpact();
    }

    try {
      const response = await fetch(`${this.baseUrl}/predict/weather-impact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          location,
          crop,
          plantingDate,
        }),
      });

      if (!response.ok) {
        throw new Error(`ML Model API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('ML Model API Error:', error);
      return this.getMockWeatherImpact();
    }
  }

  // Mock data methods for development (replace when ML models are connected)
  private getMockCropPredictions(): CropPrediction[] {
    return [
      {
        crop: 'Rice',
        confidence: 0.92,
        suitability: 0.88,
        recommendedVariety: 'Basmati 1121',
        plantingDate: '2024-06-15',
        harvestDate: '2024-11-20',
        expectedYield: 4.2,
        riskFactors: ['Heavy rainfall in monsoon', 'Pest attack risk: Moderate']
      },
      {
        crop: 'Wheat',
        confidence: 0.85,
        suitability: 0.82,
        recommendedVariety: 'HD-2967',
        plantingDate: '2024-11-01',
        harvestDate: '2025-04-15',
        expectedYield: 3.8,
        riskFactors: ['Late frost risk', 'Water requirement: High']
      }
    ];
  }

  private getMockYieldForecast(crop: string): YieldForecast {
    return {
      crop,
      currentYield: 3.5,
      predictedYield: 4.2,
      yieldVariance: 0.3,
      factors: {
        weather: 0.75,
        soil: 0.85,
        irrigation: 0.90,
        fertilizer: 0.80
      },
      recommendations: [
        'Apply nitrogen-rich fertilizer in week 3',
        'Increase irrigation frequency during flowering stage',
        'Monitor for pest activity in next 2 weeks'
      ]
    };
  }

  private getMockCropHealthPrediction(): CropHealthPrediction {
    return {
      healthScore: 82,
      diseases: [
        {
          name: 'Leaf Blight',
          probability: 0.15,
          severity: 'Low',
          treatment: 'Apply copper-based fungicide'
        }
      ],
      pests: [
        {
          name: 'Aphids',
          probability: 0.25,
          severity: 'Medium',
          treatment: 'Use neem oil spray'
        }
      ],
      nutritionalDeficiency: [
        {
          nutrient: 'Nitrogen',
          deficiencyLevel: 'Mild',
          recommendation: 'Apply urea fertilizer'
        }
      ]
    };
  }

  private getMockSoilAnalysis(): SoilAnalysisPrediction {
    return {
      ph: 6.8,
      nitrogen: 75,
      phosphorus: 45,
      potassium: 125,
      organicMatter: 3.2,
      moisture: 22,
      recommendations: [
        'Soil pH is optimal for most crops',
        'Consider phosphorus supplementation',
        'Maintain current organic matter levels'
      ],
      fertilizerRecommendation: {
        type: 'NPK 10-26-26',
        quantity: 150,
        applicationMethod: 'Broadcasting before planting'
      }
    };
  }

  private getMockWeatherImpact(): WeatherImpactPrediction {
    return {
      droughtRisk: 0.25,
      floodRisk: 0.10,
      frostRisk: 0.05,
      optimalPlantingWindow: {
        start: '2024-06-01',
        end: '2024-06-30'
      },
      irrigationSchedule: [
        {
          date: '2024-06-20',
          amount: 25,
          reason: 'Germination support'
        },
        {
          date: '2024-07-05',
          amount: 30,
          reason: 'Vegetative growth'
        }
      ]
    };
  }
}

export const mlModelService = new MLModelService();