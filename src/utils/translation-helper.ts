import { getContent } from './languages';

// Helper function to create translation objects for components
export function createTranslations(language: string, keys: string[]) {
  const translations: { [key: string]: string } = {};
  keys.forEach(key => {
    translations[key] = getContent(language, key);
  });
  return translations;
}

// Common translation keys used across components
export const commonKeys = [
  'save', 'cancel', 'delete', 'edit', 'view', 'search', 'filter', 'loading',
  'error', 'success', 'warning', 'info', 'settings', 'profile', 'back',
  'next', 'submit', 'reset', 'close', 'refresh', 'download', 'upload',
  'enabled', 'disabled', 'active', 'inactive', 'excellent', 'good',
  'moderate', 'poor', 'low', 'high', 'critical'
];

// Farm monitoring keys
export const farmMonitoringKeys = [
  'farmMonitoring', 'farmMonitoringSubtitle', 'overview', 'satellite',
  'crops', 'soil', 'drought', 'ndviTitle', 'soilMoistureTitle',
  'droughtRiskTitle', 'cropHealthTitle', 'viewDetails', 'lastUpdated',
  'quickInsights', 'quickInsightsDesc', 'healthyVegetation',
  'healthyVegetationDesc', 'monitorSoilMoisture', 'monitorSoilMoistureDesc'
];

// Analytics keys
export const analyticsKeys = [
  'analyticsReports', 'analyticsSubtitle', 'yieldAnalytics', 'scenarios',
  'totalYield', 'avgYieldPerAcre', 'productivityGain', 'optimalScenarios'
];

// Yield prediction keys
export const yieldPredictionKeys = [
  'yieldPrediction', 'yieldPredictionSubtitle', 'selectCrop', 'selectSeason',
  'fieldSize', 'currentLocation', 'predictYield', 'predicting', 'results',
  'expectedYield', 'confidence', 'factors', 'recommendations', 'weatherImpact',
  'soilHealth', 'riskAssessment', 'productivity', 'downloadReport',
  'historicalData', 'seasonalTrends', 'optimizationTips', 'kharif', 'rabi',
  'zaid', 'tons', 'kg', 'percentage', 'favorable', 'risk', 'average'
];

// Crop names
export const cropKeys = ['rice', 'wheat', 'maize', 'sugarcane', 'cotton', 'soybean'];

// Government schemes keys
export const govSchemesKeys = [
  'govSchemes', 'pmKisan', 'pmFasalBima', 'eligibility', 'applicationStatus', 'applyNow'
];

// Smart alerts keys
export const alertKeys = [
  'smartAlerts', 'whatsappAlerts', 'alertSettings', 'phoneNumber', 'frequency',
  'alertTypes', 'irrigation', 'pestAlert', 'weather', 'cropHealthAlerts',
  'immediate', 'hourly', 'daily', 'testAlert', 'saveSettings', 'alertHistory',
  'messagesSent', 'activeAlerts', 'lastAlert', 'sent', 'failed', 'pending'
];