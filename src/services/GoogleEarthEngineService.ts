// Google Earth Engine Service for KrishiSevak Platform
// Integrates with your GEE scripts for satellite imagery analysis

export interface SatelliteImagery {
  imageUrl: string;
  date: string;
  cloudCover: number;
  resolution: number;
  bands: string[];
}

export interface NDVIAnalysis {
  averageNDVI: number;
  maxNDVI: number;
  minNDVI: number;
  vegetationHealth: 'Poor' | 'Fair' | 'Good' | 'Excellent';
  healthPercentage: number;
  trendAnalysis: {
    trend: 'Improving' | 'Stable' | 'Declining';
    changeRate: number;
  };
  hotspots: Array<{
    lat: number;
    lng: number;
    ndviValue: number;
    concern: string;
  }>;
}

export interface CropMapping {
  cropType: string;
  confidence: number;
  area: number; // in hectares
  boundingBox: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  growthStage: string;
  plantingDate: string;
}

export interface SoilMoistureAnalysis {
  averageMoisture: number;
  moistureMap: Array<{
    lat: number;
    lng: number;
    moisture: number;
  }>;
  irrigationNeeded: Array<{
    area: string;
    priority: 'High' | 'Medium' | 'Low';
    recommendedAmount: number;
  }>;
}

export interface LandUseClassification {
  classes: Array<{
    type: 'Agricultural' | 'Forest' | 'Water' | 'Urban' | 'Barren';
    area: number;
    percentage: number;
  }>;
  changeDetection: Array<{
    fromClass: string;
    toClass: string;
    area: number;
    timeframe: string;
  }>;
}

export interface WeatherData {
  temperature: {
    current: number;
    min: number;
    max: number;
  };
  humidity: number;
  precipitation: number;
  windSpeed: number;
  solarRadiation: number;
  forecast: Array<{
    date: string;
    temperature: { min: number; max: number };
    precipitation: number;
    humidity: number;
  }>;
}

import { getGEEConfig, isDevelopment, logger } from './config';

class GoogleEarthEngineService {
  private geeEndpoint: string;
  private apiKey: string;

  constructor() {
    const config = getGEEConfig();
    this.geeEndpoint = config.endpoint;
    this.apiKey = config.apiKey;
    
    logger.info('Google Earth Engine Service initialized', { 
      endpoint: this.geeEndpoint,
      developmentMode: isDevelopment()
    });
  }

  async getSatelliteImagery(
    location: { lat: number; lng: number },
    startDate: string,
    endDate: string,
    satellite: 'Landsat' | 'Sentinel' = 'Sentinel'
  ): Promise<SatelliteImagery[]> {
    try {
      const response = await fetch(`${this.geeEndpoint}/satellite-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          location,
          startDate,
          endDate,
          analysisType: 'satellite-imagery',
        }),
      });

      if (!response.ok) {
        throw new Error(`GEE API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('GEE API Error:', error);
      return this.getMockSatelliteImagery();
    }
  }

  async calculateNDVI(
    location: { lat: number; lng: number },
    radius: number,
    startDate: string,
    endDate: string
  ): Promise<NDVIAnalysis> {
    try {
      const response = await fetch(`${this.geeEndpoint}/calculate-ndvi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          location,
          date: endDate,
        }),
      });

      if (!response.ok) {
        throw new Error(`GEE API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('GEE API Error:', error);
      return this.getMockNDVIAnalysis();
    }
  }

  async classifyCrops(
    boundingBox: {
      north: number;
      south: number;
      east: number;
      west: number;
    },
    date: string
  ): Promise<CropMapping[]> {
    try {
      const response = await fetch(`${this.geeEndpoint}/crop-classification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          boundingBox,
          date,
        }),
      });

      if (!response.ok) {
        throw new Error(`GEE API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('GEE API Error:', error);
      return this.getMockCropMapping();
    }
  }

  async analyzeSoilMoisture(
    location: { lat: number; lng: number },
    radius: number,
    date: string
  ): Promise<SoilMoistureAnalysis> {


    try {
      const response = await fetch(`${this.geeEndpoint}/soil-moisture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          location,
          radius,
          date,
        }),
      });

      if (!response.ok) {
        throw new Error(`GEE API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('GEE API Error:', error);
      return this.getMockSoilMoisture();
    }
  }

  async classifyLandUse(
    boundingBox: {
      north: number;
      south: number;
      east: number;
      west: number;
    },
    year: number
  ): Promise<LandUseClassification> {
    try {
      const response = await fetch(`${this.geeEndpoint}/land-use-classification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          boundingBox,
          year,
        }),
      });

      if (!response.ok) {
        throw new Error(`GEE API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('GEE API Error:', error);
      return this.getMockLandUse();
    }
  }

  async getWeatherData(
    location: { lat: number; lng: number },
    days: number = 7
  ): Promise<WeatherData> {


    try {
      const response = await fetch(`${this.geeEndpoint}/weather-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          location,
          days,
        }),
      });

      if (!response.ok) {
        throw new Error(`GEE API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('GEE API Error:', error);
      return this.getMockWeatherData();
    }
  }

  async detectChangeInVegetation(
    location: { lat: number; lng: number },
    radius: number,
    beforeDate: string,
    afterDate: string
  ): Promise<{
    changeDetected: boolean;
    changePercentage: number;
    changeType: 'Increase' | 'Decrease' | 'No Change';
    analysis: string;
  }> {
    try {
      const response = await fetch(`${this.geeEndpoint}/vegetation-change`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          location,
          radius,
          beforeDate,
          afterDate,
        }),
      });

      if (!response.ok) {
        throw new Error(`GEE API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('GEE API Error:', error);
      return {
        changeDetected: true,
        changePercentage: 15.3,
        changeType: 'Increase',
        analysis: 'Vegetation has improved by 15.3% indicating healthy crop growth.'
      };
    }
  }

  // Mock data methods for development (replace when GEE scripts are connected)
  private getMockSatelliteImagery(): SatelliteImagery[] {
    return [
      {
        imageUrl: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800',
        date: '2024-03-15',
        cloudCover: 5,
        resolution: 10,
        bands: ['Red', 'Green', 'Blue', 'NIR']
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1595147389795-37094173bfd8?w=800',
        date: '2024-03-10',
        cloudCover: 12,
        resolution: 10,
        bands: ['Red', 'Green', 'Blue', 'NIR']
      }
    ];
  }

  private getMockNDVIAnalysis(): NDVIAnalysis {
    return {
      averageNDVI: 0.72,
      maxNDVI: 0.89,
      minNDVI: 0.45,
      vegetationHealth: 'Good',
      healthPercentage: 78,
      trendAnalysis: {
        trend: 'Improving',
        changeRate: 0.05
      },
      hotspots: [
        {
          lat: 28.6139,
          lng: 77.2090,
          ndviValue: 0.35,
          concern: 'Low vegetation density - possible water stress'
        }
      ]
    };
  }

  private getMockCropMapping(): CropMapping[] {
    return [
      {
        cropType: 'Rice',
        confidence: 0.92,
        area: 12.5,
        boundingBox: {
          north: 28.62,
          south: 28.60,
          east: 77.22,
          west: 77.20
        },
        growthStage: 'Vegetative',
        plantingDate: '2024-06-15'
      },
      {
        cropType: 'Wheat',
        confidence: 0.87,
        area: 8.3,
        boundingBox: {
          north: 28.65,
          south: 28.63,
          east: 77.25,
          west: 77.23
        },
        growthStage: 'Flowering',
        plantingDate: '2024-11-10'
      }
    ];
  }

  private getMockSoilMoisture(): SoilMoistureAnalysis {
    return {
      averageMoisture: 35,
      moistureMap: [
        { lat: 28.6139, lng: 77.2090, moisture: 32 },
        { lat: 28.6145, lng: 77.2095, moisture: 38 },
        { lat: 28.6135, lng: 77.2085, moisture: 29 }
      ],
      irrigationNeeded: [
        {
          area: 'North Field',
          priority: 'High',
          recommendedAmount: 25
        },
        {
          area: 'South Field',
          priority: 'Medium',
          recommendedAmount: 15
        }
      ]
    };
  }

  private getMockLandUse(): LandUseClassification {
    return {
      classes: [
        { type: 'Agricultural', area: 125.5, percentage: 68.2 },
        { type: 'Forest', area: 35.8, percentage: 19.5 },
        { type: 'Water', area: 12.3, percentage: 6.7 },
        { type: 'Urban', area: 8.1, percentage: 4.4 },
        { type: 'Barren', area: 2.3, percentage: 1.2 }
      ],
      changeDetection: [
        {
          fromClass: 'Forest',
          toClass: 'Agricultural',
          area: 5.2,
          timeframe: '2023-2024'
        }
      ]
    };
  }

  private getMockWeatherData(): WeatherData {
    return {
      temperature: {
        current: 28,
        min: 22,
        max: 34
      },
      humidity: 65,
      precipitation: 2.5,
      windSpeed: 12,
      solarRadiation: 22.5,
      forecast: [
        {
          date: '2024-03-16',
          temperature: { min: 23, max: 35 },
          precipitation: 0,
          humidity: 60
        },
        {
          date: '2024-03-17',
          temperature: { min: 24, max: 36 },
          precipitation: 1.2,
          humidity: 68
        }
      ]
    };
  }
}

export const geeService = new GoogleEarthEngineService();