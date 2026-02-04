// Real-time Hardware Data Integration Service for KrishiSevak Platform
// Connects to field-deployed IoT devices and sensors for real-time agricultural monitoring

export interface SensorData {
  deviceId: string;
  farmId: string;
  timestamp: string;
  location: { lat: number; lng: number };
  sensorType: 'soil' | 'weather' | 'crop' | 'water' | 'air_quality' | 'camera';
  status: 'online' | 'offline' | 'error' | 'maintenance';
  batteryLevel: number;
  signalStrength: number;
  data: any; // Sensor-specific data structure
}

export interface SoilSensorData extends SensorData {
  sensorType: 'soil';
  data: {
    moisture: number; // %
    temperature: number; // °C
    ph: number;
    conductivity: number; // µS/cm
    nitrogen: number; // ppm
    phosphorus: number; // ppm
    potassium: number; // ppm
    organicMatter: number; // %
    compaction: number; // kPa
    depth: number; // cm
  };
}

export interface WeatherSensorData extends SensorData {
  sensorType: 'weather';
  data: {
    temperature: number; // °C
    humidity: number; // %
    rainfall: number; // mm
    windSpeed: number; // km/h
    windDirection: number; // degrees
    pressure: number; // hPa
    solarRadiation: number; // W/m²
    uvIndex: number;
    visibility: number; // km
    dewPoint: number; // °C
  };
}

export interface CropSensorData extends SensorData {
  sensorType: 'crop';
  data: {
    plantHeight: number; // cm
    leafAreaIndex: number;
    chlorophyll: number; // mg/g
    biomass: number; // kg/m²
    waterStress: number; // 0-1 scale
    pestActivity: number; // detected count
    diseaseIndicators: Array<{
      type: string;
      severity: number; // 0-1 scale
      location: string;
    }>;
    growthStage: string;
    canopyTemperature: number; // °C
  };
}

export interface WaterSensorData extends SensorData {
  sensorType: 'water';
  data: {
    flowRate: number; // L/min
    waterLevel: number; // cm
    quality: {
      ph: number;
      tds: number; // ppm
      turbidity: number; // NTU
      dissolvedOxygen: number; // mg/L
      temperature: number; // °C
    };
    pressure: number; // bar
    consumption: number; // L/day
    efficiency: number; // %
  };
}

export interface AirQualitySensorData extends SensorData {
  sensorType: 'air_quality';
  data: {
    co2: number; // ppm
    methane: number; // ppm
    ammonia: number; // ppm
    pm25: number; // µg/m³
    pm10: number; // µg/m³
    ozone: number; // ppb
    no2: number; // ppb
    so2: number; // ppb
    voc: number; // ppb
    aqi: number; // Air Quality Index
  };
}

export interface CameraSensorData extends SensorData {
  sensorType: 'camera';
  data: {
    imageUrl: string;
    analysisResults: {
      cropHealth: number; // 0-1 score
      pestDetection: Array<{
        type: string;
        confidence: number;
        boundingBox: { x: number; y: number; width: number; height: number };
      }>;
      diseaseDetection: Array<{
        type: string;
        confidence: number;
        severity: string;
        boundingBox: { x: number; y: number; width: number; height: number };
      }>;
      weedDetection: Array<{
        density: number; // weeds per m²
        coverage: number; // % area covered
        species: string;
      }>;
      growthMetrics: {
        plantCount: number;
        averageHeight: number;
        canopyCoverage: number; // %
        leafColor: string;
      };
    };
    metadata: {
      resolution: string;
      captureTime: string;
      weatherConditions: string;
      lightConditions: string;
    };
  };
}

export interface DeviceConfiguration {
  deviceId: string;
  farmId: string;
  deviceType: string;
  location: { lat: number; lng: number };
  samplingInterval: number; // minutes
  transmissionInterval: number; // minutes
  alertThresholds: Record<string, { min?: number; max?: number; critical?: boolean }>;
  calibrationDate: string;
  nextMaintenanceDate: string;
  isActive: boolean;
}

export interface RealTimeAlert {
  id: string;
  deviceId: string;
  farmId: string;
  alertType: 'threshold_exceeded' | 'device_offline' | 'battery_low' | 'sensor_error' | 'critical_reading';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  sensorData: any;
  actionRequired: string;
  acknowledged: boolean;
  resolvedAt?: string;
}

export interface DataProcessingPipeline {
  farmId: string;
  pipelineId: string;
  stages: Array<{
    name: string;
    type: 'validation' | 'cleaning' | 'aggregation' | 'ml_feature_extraction' | 'anomaly_detection';
    config: any;
    status: 'active' | 'inactive' | 'error';
  }>;
  outputDestination: 'ml_training' | 'analytics' | 'alerts' | 'storage';
  lastProcessed: string;
  processedRecords: number;
  errorCount: number;
}

import { getHardwareConfig, isDevelopment, logger } from './config';
import { mlModelTraining, TrainingData } from './MLModelTraining';

class HardwareDataService {
  private wsConnections: Map<string, WebSocket> = new Map();
  private deviceConfigs: Map<string, DeviceConfiguration> = new Map();
  private dataBuffer: Map<string, SensorData[]> = new Map();
  private processingPipelines: Map<string, DataProcessingPipeline> = new Map();
  private alertCallbacks: Array<(alert: RealTimeAlert) => void> = [];

  constructor() {
    logger.info('Hardware Data Service initialized');
    this.initializeDeviceConnections();
    this.startDataProcessing();
  }

  // Device Management
  async registerDevice(config: DeviceConfiguration): Promise<boolean> {
    try {
      this.deviceConfigs.set(config.deviceId, config);
      if (config.isActive) {
        await this.connectToDevice(config.deviceId);
      }
      logger.info(`Device registered: ${config.deviceId}`);
      return true;
    } catch (error) {
      logger.error(`Error registering device ${config.deviceId}:`, error);
      return false;
    }
  }

  async connectToDevice(deviceId: string): Promise<boolean> {
    const config = this.deviceConfigs.get(deviceId);
    if (!config) {
      logger.error(`Device configuration not found: ${deviceId}`);
      return false;
    }

    if (isDevelopment()) {
      // Mock connection for development
      this.startMockDataGeneration(deviceId);
      return true;
    }

    try {
      const wsUrl = `ws://device-${deviceId}.krishisevak.local:8080/stream`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        logger.info(`Connected to device: ${deviceId}`);
        this.wsConnections.set(deviceId, ws);
      };

      ws.onmessage = (event) => {
        try {
          const sensorData: SensorData = JSON.parse(event.data);
          this.processSensorData(sensorData);
        } catch (error) {
          logger.error(`Error parsing sensor data from ${deviceId}:`, error);
        }
      };

      ws.onclose = () => {
        logger.warn(`Connection closed for device: ${deviceId}`);
        this.wsConnections.delete(deviceId);
        this.generateAlert({
          id: `alert_${Date.now()}`,
          deviceId,
          farmId: config.farmId,
          alertType: 'device_offline',
          severity: 'medium',
          message: `Device ${deviceId} has gone offline`,
          timestamp: new Date().toISOString(),
          sensorData: null,
          actionRequired: 'Check device connectivity and power supply',
          acknowledged: false
        });
      };

      ws.onerror = (error) => {
        logger.error(`WebSocket error for device ${deviceId}:`, error);
      };

      return true;
    } catch (error) {
      logger.error(`Error connecting to device ${deviceId}:`, error);
      return false;
    }
  }

  // Real-time Data Processing
  private async processSensorData(sensorData: SensorData): Promise<void> {
    try {
      // Validate data
      if (!this.validateSensorData(sensorData)) {
        logger.warn(`Invalid sensor data from device ${sensorData.deviceId}`);
        return;
      }

      // Store in buffer for batch processing
      if (!this.dataBuffer.has(sensorData.farmId)) {
        this.dataBuffer.set(sensorData.farmId, []);
      }
      this.dataBuffer.get(sensorData.farmId)!.push(sensorData);

      // Check for alerts
      await this.checkAlertThresholds(sensorData);

      // Process through pipelines
      await this.processDataThroughPipelines(sensorData);

      logger.debug(`Processed sensor data from device ${sensorData.deviceId}`);
    } catch (error) {
      logger.error(`Error processing sensor data:`, error);
    }
  }

  private validateSensorData(data: SensorData): boolean {
    // Basic validation
    if (!data.deviceId || !data.farmId || !data.timestamp || !data.sensorType) {
      return false;
    }

    // Timestamp validation
    const timestamp = new Date(data.timestamp);
    const now = new Date();
    const timeDiff = Math.abs(now.getTime() - timestamp.getTime());
    if (timeDiff > 5 * 60 * 1000) { // 5 minutes tolerance
      return false;
    }

    // Sensor-specific validation
    switch (data.sensorType) {
      case 'soil':
        const soilData = data as SoilSensorData;
        return (
          soilData.data.moisture >= 0 && soilData.data.moisture <= 100 &&
          soilData.data.ph >= 0 && soilData.data.ph <= 14 &&
          soilData.data.temperature >= -10 && soilData.data.temperature <= 60
        );

      case 'weather':
        const weatherData = data as WeatherSensorData;
        return (
          weatherData.data.humidity >= 0 && weatherData.data.humidity <= 100 &&
          weatherData.data.temperature >= -50 && weatherData.data.temperature <= 60 &&
          weatherData.data.windSpeed >= 0 && weatherData.data.windSpeed <= 200
        );

      default:
        return true;
    }
  }

  private async checkAlertThresholds(sensorData: SensorData): Promise<void> {
    const config = this.deviceConfigs.get(sensorData.deviceId);
    if (!config || !config.alertThresholds) return;

    const alerts: RealTimeAlert[] = [];

    // Check battery level
    if (sensorData.batteryLevel < 20) {
      alerts.push({
        id: `battery_${sensorData.deviceId}_${Date.now()}`,
        deviceId: sensorData.deviceId,
        farmId: sensorData.farmId,
        alertType: 'battery_low',
        severity: sensorData.batteryLevel < 10 ? 'critical' : 'medium',
        message: `Device ${sensorData.deviceId} battery level is ${sensorData.batteryLevel}%`,
        timestamp: new Date().toISOString(),
        sensorData,
        actionRequired: 'Replace or recharge device battery',
        acknowledged: false
      });
    }

    // Check sensor-specific thresholds
    Object.entries(config.alertThresholds).forEach(([parameter, threshold]) => {
      const value = this.getParameterValue(sensorData, parameter);
      if (value !== undefined) {
        if (threshold.min !== undefined && value < threshold.min) {
          alerts.push({
            id: `threshold_${sensorData.deviceId}_${parameter}_${Date.now()}`,
            deviceId: sensorData.deviceId,
            farmId: sensorData.farmId,
            alertType: 'threshold_exceeded',
            severity: threshold.critical ? 'critical' : 'medium',
            message: `${parameter} is below threshold: ${value} < ${threshold.min}`,
            timestamp: new Date().toISOString(),
            sensorData,
            actionRequired: `Check ${parameter} levels and take corrective action`,
            acknowledged: false
          });
        }

        if (threshold.max !== undefined && value > threshold.max) {
          alerts.push({
            id: `threshold_${sensorData.deviceId}_${parameter}_${Date.now()}`,
            deviceId: sensorData.deviceId,
            farmId: sensorData.farmId,
            alertType: 'threshold_exceeded',
            severity: threshold.critical ? 'critical' : 'medium',
            message: `${parameter} is above threshold: ${value} > ${threshold.max}`,
            timestamp: new Date().toISOString(),
            sensorData,
            actionRequired: `Check ${parameter} levels and take corrective action`,
            acknowledged: false
          });
        }
      }
    });

    // Generate alerts
    alerts.forEach(alert => this.generateAlert(alert));
  }

  private getParameterValue(sensorData: SensorData, parameter: string): number | undefined {
    const parts = parameter.split('.');
    let value: any = sensorData;
    
    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        return undefined;
      }
    }
    
    return typeof value === 'number' ? value : undefined;
  }

  // ML Integration
  async prepareDataForMLTraining(farmId: string, timeRange: { start: string; end: string }): Promise<TrainingData[]> {
    try {
      const rawData = await this.getHistoricalData(farmId, timeRange);
      const trainingData: TrainingData[] = [];

      // Group data by time windows (e.g., daily aggregations)
      const groupedData = this.groupDataByTimeWindow(rawData, 'daily');

      Object.entries(groupedData).forEach(([date, dayData]) => {
        const soilData = dayData.filter(d => d.sensorType === 'soil') as SoilSensorData[];
        const weatherData = dayData.filter(d => d.sensorType === 'weather') as WeatherSensorData[];
        const cropData = dayData.filter(d => d.sensorType === 'crop') as CropSensorData[];

        if (soilData.length > 0 && weatherData.length > 0) {
          // Calculate averages for the day
          const avgSoil = this.calculateSoilAverages(soilData);
          const avgWeather = this.calculateWeatherAverages(weatherData);
          const avgCrop = cropData.length > 0 ? this.calculateCropAverages(cropData) : null;

          trainingData.push({
            id: `training_${farmId}_${date}`,
            farmId,
            date,
            cropType: this.detectCropType(cropData),
            weatherData: {
              temperature: avgWeather.temperature,
              humidity: avgWeather.humidity,
              rainfall: avgWeather.rainfall,
              solarRadiation: avgWeather.solarRadiation
            },
            soilData: {
              ph: avgSoil.ph,
              nitrogen: avgSoil.nitrogen,
              phosphorus: avgSoil.phosphorus,
              potassium: avgSoil.potassium,
              organicMatter: avgSoil.organicMatter,
              moisture: avgSoil.moisture
            },
            ndviData: this.calculateNDVIFromSensors(cropData),
            yieldData: {
              actualYield: avgCrop?.biomass || 0,
              qualityGrade: this.assessQualityGrade(avgCrop),
              harvestDate: date
            },
            managementPractices: {
              irrigation: 'automated',
              fertilizer: [],
              pesticides: [],
              cultivationMethod: 'precision'
            },
            diseaseIncidence: this.extractDiseaseData(cropData),
            pestIncidence: this.extractPestData(cropData)
          });
        }
      });

      return trainingData;
    } catch (error) {
      logger.error('Error preparing data for ML training:', error);
      return [];
    }
  }

  async triggerMLModelRetraining(farmId: string): Promise<boolean> {
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const trainingData = await this.prepareDataForMLTraining(farmId, { start: startDate, end: endDate });

      if (trainingData.length < 20) {
        logger.warn(`Insufficient training data for farm ${farmId}: ${trainingData.length} records`);
        return false;
      }

      // Upload training data
      const uploadResult = await mlModelTraining.uploadTrainingData(trainingData);
      if (!uploadResult.success) {
        throw new Error('Failed to upload training data');
      }

      // Generate optimal training configuration
      const config = await mlModelTraining.generateOptimalConfig(
        'yield_forecast',
        trainingData.length,
        ['temperature', 'humidity', 'rainfall', 'soilMoisture', 'ph', 'nitrogen', 'phosphorus', 'potassium']
      );

      config.trainingDataIds = uploadResult.dataIds;

      // Start training
      const trainingResult = await mlModelTraining.startTraining(config);
      
      if (trainingResult.success) {
        logger.info(`ML model retraining started for farm ${farmId}, training ID: ${trainingResult.trainingId}`);
        return true;
      }

      return false;
    } catch (error) {
      logger.error(`Error triggering ML model retraining for farm ${farmId}:`, error);
      return false;
    }
  }

  // Data Retrieval
  async getCurrentSensorData(farmId: string): Promise<SensorData[]> {
    const devices = Array.from(this.deviceConfigs.values()).filter(d => d.farmId === farmId);
    const currentData: SensorData[] = [];

    for (const device of devices) {
      const latestData = await this.getLatestSensorReading(device.deviceId);
      if (latestData) {
        currentData.push(latestData);
      }
    }

    return currentData;
  }

  async getHistoricalData(
    farmId: string,
    timeRange: { start: string; end: string },
    sensorTypes?: string[]
  ): Promise<SensorData[]> {
    if (isDevelopment()) {
      return this.generateMockHistoricalData(farmId, timeRange, sensorTypes);
    }

    try {
      // Implementation would query your actual database/storage
      // For now, return mock data
      return this.generateMockHistoricalData(farmId, timeRange, sensorTypes);
    } catch (error) {
      logger.error('Error fetching historical data:', error);
      return [];
    }
  }

  async getLatestSensorReading(deviceId: string): Promise<SensorData | null> {
    if (isDevelopment()) {
      return this.generateMockSensorData(deviceId);
    }

    // Implementation would query latest reading from database
    return null;
  }

  // Alert Management
  onAlert(callback: (alert: RealTimeAlert) => void): void {
    this.alertCallbacks.push(callback);
  }

  private generateAlert(alert: RealTimeAlert): void {
    this.alertCallbacks.forEach(callback => {
      try {
        callback(alert);
      } catch (error) {
        logger.error('Error in alert callback:', error);
      }
    });
  }

  async acknowledgeAlert(alertId: string): Promise<boolean> {
    // Implementation would update alert status in database
    logger.info(`Alert acknowledged: ${alertId}`);
    return true;
  }

  // Utility Methods
  private initializeDeviceConnections(): void {
    if (isDevelopment()) {
      // Initialize mock devices for development
      const mockDevices: DeviceConfiguration[] = [
        {
          deviceId: 'soil-sensor-001',
          farmId: 'farm-demo-001',
          deviceType: 'soil_sensor',
          location: { lat: 28.6139, lng: 77.2090 },
          samplingInterval: 15,
          transmissionInterval: 60,
          alertThresholds: {
            'data.moisture': { min: 20, max: 80, critical: true },
            'data.ph': { min: 6.0, max: 8.0 },
            'data.temperature': { min: 10, max: 40, critical: true }
          },
          calibrationDate: '2024-01-15',
          nextMaintenanceDate: '2024-07-15',
          isActive: true
        },
        {
          deviceId: 'weather-station-001',
          farmId: 'farm-demo-001',
          deviceType: 'weather_station',
          location: { lat: 28.6139, lng: 77.2090 },
          samplingInterval: 5,
          transmissionInterval: 30,
          alertThresholds: {
            'data.temperature': { min: -5, max: 45, critical: true },
            'data.windSpeed': { max: 50, critical: true }
          },
          calibrationDate: '2024-01-15',
          nextMaintenanceDate: '2024-07-15',
          isActive: true
        }
      ];

      mockDevices.forEach(device => {
        this.deviceConfigs.set(device.deviceId, device);
        this.startMockDataGeneration(device.deviceId);
      });
    }
  }

  private startDataProcessing(): void {
    // Process buffered data every 5 minutes
    setInterval(() => {
      this.processBatchData();
    }, 5 * 60 * 1000);

    // Trigger ML retraining weekly
    setInterval(() => {
      this.scheduleMLRetraining();
    }, 7 * 24 * 60 * 60 * 1000);
  }

  private async processBatchData(): Promise<void> {
    for (const [farmId, data] of this.dataBuffer.entries()) {
      if (data.length > 0) {
        logger.info(`Processing batch data for farm ${farmId}: ${data.length} records`);
        
        // Process data for analytics
        await this.updateAnalytics(farmId, data);
        
        // Clear processed data
        this.dataBuffer.set(farmId, []);
      }
    }
  }

  private async scheduleMLRetraining(): Promise<void> {
    const farms = new Set(Array.from(this.deviceConfigs.values()).map(d => d.farmId));
    
    for (const farmId of farms) {
      try {
        await this.triggerMLModelRetraining(farmId);
      } catch (error) {
        logger.error(`Error in scheduled ML retraining for farm ${farmId}:`, error);
      }
    }
  }

  private async updateAnalytics(farmId: string, data: SensorData[]): Promise<void> {
    // Implementation would update analytics database
    logger.debug(`Updated analytics for farm ${farmId} with ${data.length} records`);
  }

  // Helper methods for data processing
  private groupDataByTimeWindow(data: SensorData[], window: 'hourly' | 'daily'): Record<string, SensorData[]> {
    const grouped: Record<string, SensorData[]> = {};
    
    data.forEach(item => {
      const date = new Date(item.timestamp);
      let key: string;
      
      if (window === 'daily') {
        key = date.toISOString().split('T')[0];
      } else {
        key = `${date.toISOString().split('T')[0]}_${date.getHours()}`;
      }
      
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
    });
    
    return grouped;
  }

  private calculateSoilAverages(data: SoilSensorData[]): any {
    if (data.length === 0) return {};
    
    const sums = data.reduce((acc, item) => {
      Object.keys(item.data).forEach(key => {
        if (typeof item.data[key] === 'number') {
          acc[key] = (acc[key] || 0) + item.data[key];
        }
      });
      return acc;
    }, {} as any);
    
    Object.keys(sums).forEach(key => {
      sums[key] = sums[key] / data.length;
    });
    
    return sums;
  }

  private calculateWeatherAverages(data: WeatherSensorData[]): any {
    if (data.length === 0) return {};
    
    const sums = data.reduce((acc, item) => {
      Object.keys(item.data).forEach(key => {
        if (typeof item.data[key] === 'number') {
          acc[key] = (acc[key] || 0) + item.data[key];
        }
      });
      return acc;
    }, {} as any);
    
    Object.keys(sums).forEach(key => {
      sums[key] = sums[key] / data.length;
    });
    
    return sums;
  }

  private calculateCropAverages(data: CropSensorData[]): any {
    if (data.length === 0) return null;
    
    const sums = data.reduce((acc, item) => {
      Object.keys(item.data).forEach(key => {
        if (typeof item.data[key] === 'number') {
          acc[key] = (acc[key] || 0) + item.data[key];
        }
      });
      return acc;
    }, {} as any);
    
    Object.keys(sums).forEach(key => {
      sums[key] = sums[key] / data.length;
    });
    
    return sums;
  }

  private detectCropType(data: CropSensorData[]): string {
    // Logic to detect crop type from sensor data
    return data.length > 0 ? 'Rice' : 'Unknown';
  }

  private calculateNDVIFromSensors(data: CropSensorData[]): Array<{ value: number; date: string }> {
    return data.map(item => ({
      value: item.data.leafAreaIndex * 0.8, // Approximation
      date: item.timestamp
    }));
  }

  private assessQualityGrade(cropData: any): string {
    if (!cropData) return 'Unknown';
    const healthScore = cropData.waterStress ? (1 - cropData.waterStress) * 100 : 80;
    if (healthScore > 90) return 'Premium';
    if (healthScore > 70) return 'Grade A';
    if (healthScore > 50) return 'Grade B';
    return 'Grade C';
  }

  private extractDiseaseData(data: CropSensorData[]): any[] {
    const diseases: any[] = [];
    data.forEach(item => {
      if (item.data.diseaseIndicators) {
        item.data.diseaseIndicators.forEach(disease => {
          diseases.push({
            diseasePresent: disease.severity > 0.3,
            diseaseName: disease.type,
            severity: disease.severity > 0.7 ? 'High' : disease.severity > 0.4 ? 'Medium' : 'Low',
            treatmentApplied: 'Sensor-detected'
          });
        });
      }
    });
    return diseases;
  }

  private extractPestData(data: CropSensorData[]): any[] {
    return data.map(item => ({
      pestPresent: item.data.pestActivity > 0,
      pestName: 'Sensor-detected',
      severity: item.data.pestActivity > 10 ? 'High' : item.data.pestActivity > 5 ? 'Medium' : 'Low',
      treatmentApplied: 'Monitoring'
    }));
  }

  // Mock data generation for development
  private startMockDataGeneration(deviceId: string): void {
    setInterval(() => {
      const mockData = this.generateMockSensorData(deviceId);
      if (mockData) {
        this.processSensorData(mockData);
      }
    }, 30000); // Every 30 seconds
  }

  private generateMockSensorData(deviceId: string): SensorData | null {
    const config = this.deviceConfigs.get(deviceId);
    if (!config) return null;

    const baseData = {
      deviceId,
      farmId: config.farmId,
      timestamp: new Date().toISOString(),
      location: config.location,
      status: 'online' as const,
      batteryLevel: 85 + Math.random() * 15,
      signalStrength: 70 + Math.random() * 30
    };

    if (config.deviceType === 'soil_sensor') {
      return {
        ...baseData,
        sensorType: 'soil',
        data: {
          moisture: 30 + Math.random() * 40,
          temperature: 20 + Math.random() * 15,
          ph: 6.5 + Math.random() * 1.5,
          conductivity: 200 + Math.random() * 300,
          nitrogen: 50 + Math.random() * 100,
          phosphorus: 20 + Math.random() * 60,
          potassium: 80 + Math.random() * 120,
          organicMatter: 2 + Math.random() * 3,
          compaction: 100 + Math.random() * 200,
          depth: 15
        }
      } as SoilSensorData;
    }

    if (config.deviceType === 'weather_station') {
      return {
        ...baseData,
        sensorType: 'weather',
        data: {
          temperature: 25 + Math.random() * 10,
          humidity: 60 + Math.random() * 30,
          rainfall: Math.random() * 5,
          windSpeed: Math.random() * 20,
          windDirection: Math.random() * 360,
          pressure: 1010 + Math.random() * 20,
          solarRadiation: 200 + Math.random() * 600,
          uvIndex: Math.random() * 10,
          visibility: 5 + Math.random() * 15,
          dewPoint: 15 + Math.random() * 10
        }
      } as WeatherSensorData;
    }

    return null;
  }

  private generateMockHistoricalData(
    farmId: string,
    timeRange: { start: string; end: string },
    sensorTypes?: string[]
  ): SensorData[] {
    const data: SensorData[] = [];
    const startDate = new Date(timeRange.start);
    const endDate = new Date(timeRange.end);
    const devices = Array.from(this.deviceConfigs.values()).filter(d => d.farmId === farmId);

    for (let date = new Date(startDate); date <= endDate; date.setHours(date.getHours() + 1)) {
      devices.forEach(device => {
        if (!sensorTypes || sensorTypes.includes(device.deviceType)) {
          const mockData = this.generateMockSensorData(device.deviceId);
          if (mockData) {
            mockData.timestamp = new Date(date).toISOString();
            data.push(mockData);
          }
        }
      });
    }

    return data;
  }

  private async processDataThroughPipelines(sensorData: SensorData): Promise<void> {
    // Implementation for processing data through configured pipelines
    logger.debug(`Processing data through pipelines for farm ${sensorData.farmId}`);
  }
}

export const hardwareDataService = new HardwareDataService();