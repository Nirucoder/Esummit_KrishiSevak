// User Data Service for KrishiSevak Platform
// Handles user data storage, historical analytics, and data export

import { projectId, publicAnonKey } from '../utils/supabase/info';

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  phone: string;
  farmLocation: {
    lat: number;
    lng: number;
    address: string;
    pincode: string;
  };
  farmSize: number;
  primaryCrops: string[];
  farmingType: 'Organic' | 'Conventional' | 'Mixed';
  language: string;
  notifications: {
    weather: boolean;
    cropHealth: boolean;
    irrigation: boolean;
    marketPrices: boolean;
  };
}

export interface CropCycle {
  id: string;
  crop: string;
  variety: string;
  plantingDate: string;
  expectedHarvestDate: string;
  actualHarvestDate?: string;
  area: number;
  expectedYield: number;
  actualYield?: number;
  status: 'Planned' | 'Planted' | 'Growing' | 'Harvested';
  activities: Array<{
    date: string;
    type: 'Irrigation' | 'Fertilizer' | 'Pesticide' | 'Monitoring';
    description: string;
    cost?: number;
  }>;
}

export interface HistoricalYieldData {
  crop: string;
  year: number;
  season: string;
  area: number;
  yield: number;
  rainfall: number;
  temperature: {
    min: number;
    max: number;
    avg: number;
  };
  fertilizer: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  irrigation: number;
  cost: {
    seeds: number;
    fertilizer: number;
    irrigation: number;
    labor: number;
    pesticides: number;
    total: number;
  };
  revenue: number;
  profit: number;
}

export interface AlertData {
  id: string;
  type: 'weather' | 'crop_health' | 'irrigation' | 'pest' | 'disease' | 'market';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  title: string;
  message: string;
  actionRequired: boolean;
  actionDescription?: string;
  timestamp: string;
  isRead: boolean;
  location?: {
    lat: number;
    lng: number;
  };
}

class UserDataService {
  private baseUrl: string;
  private apiKey: string;
  private isDemoMode = false; // Enable demo mode

  constructor() {
    this.baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-cc69ee2d`;
    this.apiKey = publicAnonKey;
  }

  // User Profile Management
  async saveUserProfile(profile: UserProfile): Promise<{ success: boolean; error?: string }> {
    if (this.isDemoMode) {
      // Demo mode: Just return success
      console.log('Demo mode: Profile saved locally', profile);
      return { success: true };
    }

    try {
      const response = await fetch(`${this.baseUrl}/user/save-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          userId: profile.userId,
          type: 'profile',
          data: profile,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save profile: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error saving user profile:', error);
      return { success: false, error: error.message };
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const response = await fetch(`${this.baseUrl}/user/data/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }

      const data = await response.json();
      return data?.data || null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  // Crop Cycle Management
  async saveCropCycle(userId: string, cropCycle: CropCycle): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/user/save-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          userId,
          type: 'crop_cycle',
          data: cropCycle,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save crop cycle: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving crop cycle:', error);
      return { success: false, error: error.message };
    }
  }

  async getCropCycles(userId: string): Promise<CropCycle[]> {
    try {
      const response = await fetch(`${this.baseUrl}/user/crop-cycles/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch crop cycles: ${response.statusText}`);
      }

      const data = await response.json();
      return data.cropCycles || [];
    } catch (error) {
      console.error('Error fetching crop cycles:', error);
      return this.getMockCropCycles();
    }
  }

  // Historical Data Management
  async saveHistoricalYield(userId: string, yieldData: HistoricalYieldData): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/user/save-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          userId,
          type: 'historical_yield',
          data: yieldData,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save historical yield: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving historical yield:', error);
      return { success: false, error: error.message };
    }
  }

  async getHistoricalYields(userId: string, crop?: string, years?: number): Promise<HistoricalYieldData[]> {
    try {
      const queryParams = new URLSearchParams();
      if (crop) queryParams.append('crop', crop);
      if (years) queryParams.append('years', years.toString());

      const response = await fetch(`${this.baseUrl}/data/historical-yields?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch historical yields: ${response.statusText}`);
      }

      const data = await response.json();
      return data.historicalYields || this.getMockHistoricalYields();
    } catch (error) {
      console.error('Error fetching historical yields:', error);
      return this.getMockHistoricalYields();
    }
  }

  // Analytics and Insights
  async getYieldAnalytics(userId: string, crop: string): Promise<{
    averageYield: number;
    bestYear: { year: number; yield: number };
    worstYear: { year: number; yield: number };
    trendAnalysis: {
      trend: 'Increasing' | 'Decreasing' | 'Stable';
      changePercent: number;
    };
    profitabilityAnalysis: {
      averageProfit: number;
      profitMargin: number;
      bestProfitYear: { year: number; profit: number };
    };
    recommendations: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/analytics/yield-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ userId, crop }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch yield analytics: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching yield analytics:', error);
      return this.getMockYieldAnalytics();
    }
  }

  // Alert Management
  async saveAlert(userId: string, alert: AlertData): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/user/save-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          userId,
          type: 'alert',
          data: alert,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save alert: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving alert:', error);
      return { success: false, error: error.message };
    }
  }

  async getAlerts(userId: string, unreadOnly: boolean = false): Promise<AlertData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/user/alerts/${userId}?unreadOnly=${unreadOnly}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch alerts: ${response.statusText}`);
      }

      const data = await response.json();
      return data.alerts || this.getMockAlerts();
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return this.getMockAlerts();
    }
  }

  // Data Export
  async exportUserData(userId: string, format: 'excel' | 'csv' | 'json'): Promise<{ downloadUrl: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/export/user-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          userId,
          format,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to export data: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error exporting user data:', error);
      return { downloadUrl: '', error: error.message };
    }
  }

  // Mock data methods for development
  private getMockCropCycles(): CropCycle[] {
    return [
      {
        id: 'cycle-1',
        crop: 'Rice',
        variety: 'Basmati 1121',
        plantingDate: '2024-06-15',
        expectedHarvestDate: '2024-11-20',
        area: 2.5,
        expectedYield: 4.2,
        status: 'Growing',
        activities: [
          {
            date: '2024-06-15',
            type: 'Irrigation',
            description: 'Initial irrigation after planting',
            cost: 500
          },
          {
            date: '2024-07-01',
            type: 'Fertilizer',
            description: 'Urea application - 50kg',
            cost: 1200
          }
        ]
      },
      {
        id: 'cycle-2',
        crop: 'Wheat',
        variety: 'HD-2967',
        plantingDate: '2024-11-01',
        expectedHarvestDate: '2025-04-15',
        area: 1.8,
        expectedYield: 3.8,
        status: 'Planned',
        activities: []
      }
    ];
  }

  private getMockHistoricalYields(): HistoricalYieldData[] {
    return [
      {
        crop: 'Rice',
        year: 2023,
        season: 'Kharif',
        area: 2.5,
        yield: 4.1,
        rainfall: 1200,
        temperature: { min: 22, max: 35, avg: 28.5 },
        fertilizer: { nitrogen: 120, phosphorus: 60, potassium: 40 },
        irrigation: 15,
        cost: {
          seeds: 2000,
          fertilizer: 5000,
          irrigation: 3000,
          labor: 8000,
          pesticides: 1500,
          total: 19500
        },
        revenue: 41000,
        profit: 21500
      },
      {
        crop: 'Wheat',
        year: 2023,
        season: 'Rabi',
        area: 1.8,
        yield: 3.6,
        rainfall: 200,
        temperature: { min: 8, max: 25, avg: 16.5 },
        fertilizer: { nitrogen: 100, phosphorus: 50, potassium: 30 },
        irrigation: 8,
        cost: {
          seeds: 1500,
          fertilizer: 4000,
          irrigation: 2000,
          labor: 6000,
          pesticides: 1000,
          total: 14500
        },
        revenue: 32400,
        profit: 17900
      }
    ];
  }

  private getMockYieldAnalytics() {
    return {
      averageYield: 3.85,
      bestYear: { year: 2023, yield: 4.1 },
      worstYear: { year: 2021, yield: 3.2 },
      trendAnalysis: {
        trend: 'Increasing' as const,
        changePercent: 12.5
      },
      profitabilityAnalysis: {
        averageProfit: 19700,
        profitMargin: 53.8,
        bestProfitYear: { year: 2023, profit: 21500 }
      },
      recommendations: [
        'Continue current fertilizer application strategy',
        'Consider increasing area under cultivation',
        'Monitor irrigation efficiency for further improvements'
      ]
    };
  }

  private getMockAlerts(): AlertData[] {
    return [
      {
        id: 'alert-1',
        type: 'weather',
        priority: 'High',
        title: 'Heavy Rainfall Alert',
        message: 'Heavy rainfall expected in next 48 hours. Ensure proper drainage.',
        actionRequired: true,
        actionDescription: 'Check field drainage and protect harvested crops',
        timestamp: new Date().toISOString(),
        isRead: false,
        location: { lat: 28.6139, lng: 77.2090 }
      },
      {
        id: 'alert-2',
        type: 'crop_health',
        priority: 'Medium',
        title: 'Pest Activity Detected',
        message: 'Aphid activity detected in northwest section of rice field.',
        actionRequired: true,
        actionDescription: 'Apply neem oil spray within 24 hours',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        isRead: false,
        location: { lat: 28.6145, lng: 77.2085 }
      }
    ];
  }
}

export const userDataService = new UserDataService();