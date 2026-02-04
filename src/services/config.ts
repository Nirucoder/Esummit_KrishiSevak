// Configuration for KrishiSevak Platform
// Manages API endpoints and configuration in browser environment

import { projectId, publicAnonKey } from '../utils/supabase/info';

export interface KrishiSevakConfig {
  mlModel: {
    baseUrl: string;
    apiKey: string;
  };
  googleEarthEngine: {
    endpoint: string;
    scriptsEndpoint: string;
    apiKey: string;
  };
  mlTraining: {
    endpoint: string;
    apiKey: string;
  };
  development: {
    useMockData: boolean;
    enableLogging: boolean;
  };
}

// Default configuration - Now connected to Supabase backend
const defaultConfig: KrishiSevakConfig = {
  mlModel: {
    baseUrl: `https://${projectId}.supabase.co/functions/v1/make-server-cc69ee2d/ml`,
    apiKey: publicAnonKey,
  },
  googleEarthEngine: {
    endpoint: `https://${projectId}.supabase.co/functions/v1/make-server-cc69ee2d/gee`,
    scriptsEndpoint: `https://${projectId}.supabase.co/functions/v1/make-server-cc69ee2d/gee`,
    apiKey: publicAnonKey,
  },
  mlTraining: {
    endpoint: `https://${projectId}.supabase.co/functions/v1/make-server-cc69ee2d/ml`,
    apiKey: publicAnonKey,
  },
  development: {
    useMockData: false, // Now connected to real backend
    enableLogging: true,
  },
};

// Configuration loader with environment variable support
function loadConfig(): KrishiSevakConfig {
  // Check if we're in a Node.js environment (server-side)
  const isNode = typeof process !== "undefined" && process.env;

  if (isNode) {
    // Server-side configuration with environment variables
    return {
      mlModel: {
        baseUrl:
          process.env.ML_MODEL_BASE_URL ||
          defaultConfig.mlModel.baseUrl,
        apiKey:
          process.env.ML_MODEL_API_KEY ||
          defaultConfig.mlModel.apiKey,
      },
      googleEarthEngine: {
        endpoint:
          process.env.GEE_ENDPOINT ||
          defaultConfig.googleEarthEngine.endpoint,
        scriptsEndpoint:
          process.env.GEE_SCRIPTS_ENDPOINT ||
          defaultConfig.googleEarthEngine.scriptsEndpoint,
        apiKey:
          process.env.GEE_API_KEY ||
          defaultConfig.googleEarthEngine.apiKey,
      },
      mlTraining: {
        endpoint:
          process.env.ML_TRAINING_ENDPOINT ||
          defaultConfig.mlTraining.endpoint,
        apiKey:
          process.env.ML_TRAINING_API_KEY ||
          defaultConfig.mlTraining.apiKey,
      },
      development: {
        useMockData:
          process.env.NODE_ENV === "development" ||
          defaultConfig.development.useMockData,
        enableLogging:
          process.env.NODE_ENV === "development" ||
          defaultConfig.development.enableLogging,
      },
    };
  }

  // Client-side configuration
  // Now connected to Supabase backend
  return {
    ...defaultConfig,
    development: {
      useMockData: false, // Use real backend data
      enableLogging: true,
    },
  };
}

// Global configuration instance
export const config = loadConfig();

// Utility functions
export const isDevelopment = () =>
  config.development.useMockData;
export const shouldLog = () => config.development.enableLogging;

// API Configuration helpers
export const getMLModelConfig = () => config.mlModel;
export const getGEEConfig = () => config.googleEarthEngine;
export const getMLTrainingConfig = () => config.mlTraining;

// Logger utility
export const logger = {
  info: (message: string, data?: any) => {
    if (shouldLog()) {
      console.log(`[KrishiSevak] ${message}`, data || "");
    }
  },
  warn: (message: string, data?: any) => {
    if (shouldLog()) {
      console.warn(`[KrishiSevak] ${message}`, data || "");
    }
  },
  error: (message: string, error?: any) => {
    if (shouldLog()) {
      console.error(`[KrishiSevak] ${message}`, error || "");
    }
  },
};

// Configuration validator
export const validateConfig = (): {
  isValid: boolean;
  issues: string[];
} => {
  const issues: string[] = [];

  // Check ML Model configuration
  if (
    !config.mlModel.baseUrl ||
    config.mlModel.baseUrl.includes("example.com")
  ) {
    issues.push("ML Model API endpoint not configured");
  }
  if (
    !config.mlModel.apiKey ||
    config.mlModel.apiKey.startsWith("YOUR_")
  ) {
    issues.push("ML Model API key not configured");
  }

  // Check GEE configuration
  if (
    !config.googleEarthEngine.endpoint ||
    config.googleEarthEngine.endpoint.includes("example.com")
  ) {
    issues.push(
      "Google Earth Engine API endpoint not configured",
    );
  }
  if (
    !config.googleEarthEngine.apiKey ||
    config.googleEarthEngine.apiKey.startsWith("YOUR_")
  ) {
    issues.push("Google Earth Engine API key not configured");
  }

  // Check ML Training configuration
  if (
    !config.mlTraining.endpoint ||
    config.mlTraining.endpoint.includes("example.com")
  ) {
    issues.push("ML Training API endpoint not configured");
  }
  if (
    !config.mlTraining.apiKey ||
    config.mlTraining.apiKey.startsWith("YOUR_")
  ) {
    issues.push("ML Training API key not configured");
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
};

// Export configuration status
export const getConfigurationStatus = () => {
  const validation = validateConfig();
  return {
    ...validation,
    developmentMode: isDevelopment(),
    mockDataEnabled: config.development.useMockData,
    loggingEnabled: config.development.enableLogging,
  };
};