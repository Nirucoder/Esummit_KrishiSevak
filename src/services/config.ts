// Configuration for KrishiSevak Platform
// Manages API endpoints and configuration in browser environment

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
    baseUrl: `https://jtoioakoasnckzqirpqz.supabase.co/functions/v1/make-server-cc69ee2d/ml`,
    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0b2lvYWtvYXNuY2t6cWlycHF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4Mzg1MjUsImV4cCI6MjA3MzQxNDUyNX0.s3bKKTK6YAo107FCUi3nH4P7ocXSUEUSLXisMN735BA",
  },
  googleEarthEngine: {
    endpoint: `https://jtoioakoasnckzqirpqz.supabase.co/functions/v1/make-server-cc69ee2d/gee`,
    scriptsEndpoint: `https://jtoioakoasnckzqirpqz.supabase.co/functions/v1/make-server-cc69ee2d/gee`,
    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0b2lvYWtvYXNuY2t6cWlycHF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4Mzg1MjUsImV4cCI6MjA3MzQxNDUyNX0.s3bKKTK6YAo107FCUi3nH4P7ocXSUEUSLXisMN735BA",
  },
  mlTraining: {
    endpoint: `https://jtoioakoasnckzqirpqz.supabase.co/functions/v1/make-server-cc69ee2d/ml`,
    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0b2lvYWtvYXNuY2t6cWlycHF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4Mzg1MjUsImV4cCI6MjA3MzQxNDUyNX0.s3bKKTK6YAo107FCUi3nH4P7ocXSUEUSLXisMN735BA",
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