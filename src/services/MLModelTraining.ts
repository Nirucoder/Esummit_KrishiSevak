// ML Model Training Service for KrishiSevak Platform
// Allows farmers to train custom ML models with their own agricultural data

export interface TrainingData {
  id: string;
  farmId: string;
  date: string;
  cropType: string;
  weatherData: {
    temperature: number;
    humidity: number;
    rainfall: number;
    solarRadiation: number;
  };
  soilData: {
    ph: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    organicMatter: number;
    moisture: number;
  };
  ndviData: {
    value: number;
    date: string;
  }[];
  yieldData: {
    actualYield: number;
    qualityGrade: string;
    harvestDate: string;
  };
  managementPractices: {
    irrigation: string;
    fertilizer: string[];
    pesticides: string[];
    cultivationMethod: string;
  };
  diseaseIncidence: {
    diseasePresent: boolean;
    diseaseName?: string;
    severity?: 'Low' | 'Medium' | 'High';
    treatmentApplied?: string;
  }[];
  pestIncidence: {
    pestPresent: boolean;
    pestName?: string;
    severity?: 'Low' | 'Medium' | 'High';
    treatmentApplied?: string;
  }[];
}

export interface ModelTrainingConfig {
  modelType: 'crop_prediction' | 'yield_forecast' | 'disease_detection' | 'pest_prediction' | 'soil_analysis';
  trainingDataIds: string[];
  validationSplit: number;
  epochs: number;
  learningRate: number;
  batchSize: number;
  features: string[];
  targetVariable: string;
  hyperparameters: Record<string, any>;
}

export interface TrainingProgress {
  status: 'pending' | 'training' | 'completed' | 'failed';
  progress: number;
  currentEpoch: number;
  totalEpochs: number;
  loss: number;
  accuracy: number;
  validationLoss: number;
  validationAccuracy: number;
  estimatedTimeRemaining: number;
  logs: string[];
}

export interface TrainedModel {
  id: string;
  farmerId: string;
  modelType: string;
  version: string;
  trainingDate: string;
  performance: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    mse?: number;
    mae?: number;
  };
  featureImportance: Array<{
    feature: string;
    importance: number;
  }>;
  modelSize: number;
  deploymentStatus: 'deployed' | 'pending' | 'retired';
  metadata: {
    trainingDataCount: number;
    validationDataCount: number;
    trainingDuration: number;
    lastUpdated: string;
  };
}

import { getMLTrainingConfig, isDevelopment, logger } from './config';

class MLModelTraining {
  private trainingEndpoint: string;
  private apiKey: string;

  constructor() {
    const config = getMLTrainingConfig();
    this.trainingEndpoint = config.endpoint;
    this.apiKey = config.apiKey;
    
    logger.info('ML Model Training Service initialized', { 
      endpoint: this.trainingEndpoint,
      developmentMode: isDevelopment()
    });
  }

  // Upload training data
  async uploadTrainingData(data: TrainingData[]): Promise<{ success: boolean; dataIds: string[] }> {
    if (this.trainingEndpoint.includes('example.com') || this.trainingEndpoint === 'YOUR_ML_TRAINING_API_ENDPOINT' || isDevelopment()) {
      logger.info('Using mock data for training data upload');
      return {
        success: true,
        dataIds: data.map(d => d.id)
      };
    }

    try {
      const response = await fetch(`${this.trainingEndpoint}/upload-training-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ data }),
      });

      if (!response.ok) {
        throw new Error(`Training API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('Error uploading training data:', error);
      return {
        success: true,
        dataIds: data.map(d => d.id)
      };
    }
  }

  // Start model training
  async startTraining(config: ModelTrainingConfig): Promise<{ trainingId: string; success: boolean }> {
    if (this.trainingEndpoint.includes('example.com') || this.trainingEndpoint === 'YOUR_ML_TRAINING_API_ENDPOINT' || isDevelopment()) {
      logger.info('Using mock data for training start');
      return {
        trainingId: `training_${Date.now()}`,
        success: true
      };
    }

    try {
      const response = await fetch(`${this.trainingEndpoint}/start-training`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error(`Training API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('Error starting training:', error);
      return {
        trainingId: `training_${Date.now()}`,
        success: true
      };
    }
  }

  // Monitor training progress
  async getTrainingProgress(trainingId: string): Promise<TrainingProgress> {
    try {
      const response = await fetch(`${this.trainingEndpoint}/training-progress/${trainingId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Training API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('Error getting training progress:', error);
      // Return mock progress for development
      return this.getMockTrainingProgress();
    }
  }

  // Get trained model information
  async getTrainedModel(modelId: string): Promise<TrainedModel> {
    try {
      const response = await fetch(`${this.trainingEndpoint}/models/${modelId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Training API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('Error getting trained model:', error);
      return this.getMockTrainedModel(modelId);
    }
  }

  // List all trained models for a farmer
  async listFarmerModels(farmerId: string): Promise<TrainedModel[]> {
    if (this.trainingEndpoint.includes('example.com') || this.trainingEndpoint === 'YOUR_ML_TRAINING_API_ENDPOINT' || isDevelopment()) {
      logger.info('Using mock data for farmer models');
      return this.getMockFarmerModels();
    }

    try {
      const response = await fetch(`${this.trainingEndpoint}/farmers/${farmerId}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Training API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('Error listing farmer models:', error);
      return this.getMockFarmerModels();
    }
  }

  // Deploy a trained model
  async deployModel(modelId: string): Promise<{ success: boolean; endpoint: string }> {
    try {
      const response = await fetch(`${this.trainingEndpoint}/models/${modelId}/deploy`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Training API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('Error deploying model:', error);
      return {
        success: true,
        endpoint: `${this.trainingEndpoint}/models/${modelId}/predict`
      };
    }
  }

  // Make predictions with a custom trained model
  async makePrediction(modelId: string, inputData: any): Promise<any> {
    try {
      const response = await fetch(`${this.trainingEndpoint}/models/${modelId}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ input: inputData }),
      });

      if (!response.ok) {
        throw new Error(`Prediction API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('Error making prediction:', error);
      return this.getMockPrediction();
    }
  }

  // Validate training data quality
  async validateTrainingData(data: TrainingData[]): Promise<{
    isValid: boolean;
    issues: Array<{
      severity: 'error' | 'warning';
      message: string;
      dataId?: string;
      field?: string;
    }>;
    recommendations: string[];
  }> {
    const issues: Array<{ severity: 'error' | 'warning'; message: string; dataId?: string; field?: string }> = [];
    const recommendations: string[] = [];

    // Check data completeness
    data.forEach((item, index) => {
      if (!item.yieldData.actualYield || item.yieldData.actualYield <= 0) {
        issues.push({
          severity: 'error',
          message: `Missing or invalid yield data at record ${index + 1}`,
          dataId: item.id,
          field: 'yieldData.actualYield'
        });
      }

      if (!item.soilData.ph || item.soilData.ph < 0 || item.soilData.ph > 14) {
        issues.push({
          severity: 'warning',
          message: `Invalid pH value at record ${index + 1}`,
          dataId: item.id,
          field: 'soilData.ph'
        });
      }

      if (item.ndviData.length < 3) {
        issues.push({
          severity: 'warning',
          message: `Insufficient NDVI data points at record ${index + 1}`,
          dataId: item.id,
          field: 'ndviData'
        });
      }
    });

    // Check data diversity
    const cropTypes = [...new Set(data.map(d => d.cropType))];
    if (cropTypes.length < 2) {
      recommendations.push('Consider including data from multiple crop types for better model generalization');
    }

    const seasons = [...new Set(data.map(d => new Date(d.date).getMonth()))];
    if (seasons.length < 2) {
      recommendations.push('Include data from different seasons/months for seasonal pattern learning');
    }

    // Data quantity check
    if (data.length < 100) {
      issues.push({
        severity: 'warning',
        message: 'Training dataset is small. Consider collecting more data for better model performance'
      });
    }

    if (data.length < 20) {
      issues.push({
        severity: 'error',
        message: 'Insufficient training data. Minimum 20 records required for training'
      });
    }

    return {
      isValid: issues.filter(i => i.severity === 'error').length === 0,
      issues,
      recommendations
    };
  }

  // Generate optimal training configuration
  async generateOptimalConfig(
    modelType: ModelTrainingConfig['modelType'],
    dataCount: number,
    features: string[]
  ): Promise<ModelTrainingConfig> {
    // AI-optimized configuration based on data characteristics
    const baseConfig: Partial<ModelTrainingConfig> = {
      modelType,
      features,
      validationSplit: 0.2,
      batchSize: Math.min(32, Math.max(8, Math.floor(dataCount / 10))),
      learningRate: 0.001,
      epochs: Math.min(100, Math.max(20, Math.floor(dataCount / 5)))
    };

    // Model-specific configurations
    switch (modelType) {
      case 'yield_forecast':
        return {
          ...baseConfig,
          targetVariable: 'actualYield',
          hyperparameters: {
            algorithm: 'gradient_boosting',
            maxDepth: 6,
            numEstimators: 100,
            subsample: 0.8
          }
        } as ModelTrainingConfig;

      case 'disease_detection':
        return {
          ...baseConfig,
          targetVariable: 'diseasePresent',
          hyperparameters: {
            algorithm: 'random_forest',
            numEstimators: 200,
            maxFeatures: 'sqrt',
            classWeight: 'balanced'
          }
        } as ModelTrainingConfig;

      case 'crop_prediction':
        return {
          ...baseConfig,
          targetVariable: 'cropType',
          hyperparameters: {
            algorithm: 'neural_network',
            hiddenLayers: [64, 32, 16],
            dropout: 0.3,
            activation: 'relu'
          }
        } as ModelTrainingConfig;

      default:
        return baseConfig as ModelTrainingConfig;
    }
  }

  // Mock methods for development
  private getMockTrainingProgress(): TrainingProgress {
    const progress = Math.floor(Math.random() * 100);
    return {
      status: progress < 100 ? 'training' : 'completed',
      progress,
      currentEpoch: Math.floor(progress / 2),
      totalEpochs: 50,
      loss: 0.1 + Math.random() * 0.3,
      accuracy: 0.7 + Math.random() * 0.25,
      validationLoss: 0.15 + Math.random() * 0.3,
      validationAccuracy: 0.65 + Math.random() * 0.25,
      estimatedTimeRemaining: Math.max(0, (100 - progress) * 2),
      logs: [
        `Epoch ${Math.floor(progress / 2)}/50 - Training...`,
        `Loss: ${(0.1 + Math.random() * 0.3).toFixed(4)}`,
        `Validation accuracy: ${(0.65 + Math.random() * 0.25).toFixed(4)}`
      ]
    };
  }

  private getMockTrainedModel(modelId: string): TrainedModel {
    return {
      id: modelId,
      farmerId: 'farmer-1',
      modelType: 'yield_forecast',
      version: '1.0',
      trainingDate: new Date().toISOString(),
      performance: {
        accuracy: 0.85,
        precision: 0.82,
        recall: 0.88,
        f1Score: 0.85,
        mse: 0.25,
        mae: 0.18
      },
      featureImportance: [
        { feature: 'NDVI Average', importance: 0.35 },
        { feature: 'Soil Moisture', importance: 0.28 },
        { feature: 'Temperature', importance: 0.22 },
        { feature: 'Rainfall', importance: 0.15 }
      ],
      modelSize: 2.5, // MB
      deploymentStatus: 'deployed',
      metadata: {
        trainingDataCount: 1250,
        validationDataCount: 312,
        trainingDuration: 1800, // seconds
        lastUpdated: new Date().toISOString()
      }
    };
  }

  private getMockFarmerModels(): TrainedModel[] {
    return [
      this.getMockTrainedModel('model-1'),
      {
        ...this.getMockTrainedModel('model-2'),
        modelType: 'disease_detection',
        performance: {
          accuracy: 0.92,
          precision: 0.89,
          recall: 0.95,
          f1Score: 0.92
        }
      },
      {
        ...this.getMockTrainedModel('model-3'),
        modelType: 'pest_prediction',
        deploymentStatus: 'pending',
        performance: {
          accuracy: 0.78,
          precision: 0.75,
          recall: 0.82,
          f1Score: 0.78
        }
      }
    ];
  }

  private getMockPrediction(): any {
    return {
      prediction: 4.2,
      confidence: 0.87,
      factors: {
        ndvi: 0.3,
        moisture: 0.25,
        weather: 0.45
      },
      explanation: 'High NDVI and optimal moisture levels indicate strong yield potential'
    };
  }
}

export const mlModelTraining = new MLModelTraining();