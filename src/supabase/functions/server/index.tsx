import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client for server operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-cc69ee2d/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ================== AUTHENTICATION ENDPOINTS ==================

// User signup endpoint
app.post("/make-server-cc69ee2d/auth/signup", async (c) => {
  try {
    const { email, password, name, phone } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, phone },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      throw error;
    }

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.log("Signup error:", error);
    return c.json({ success: false, error: error.message }, 400);
  }
});

// ================== ML MODEL ENDPOINTS ==================

// Crop suitability prediction
app.post("/make-server-cc69ee2d/ml/predict/crop-suitability", async (c) => {
  try {
    const { location, soilData, weatherData, farmSize } = await c.req.json();
    
    // For now, we'll generate enhanced predictions based on input data
    // In production, this would call your actual ML models
    const predictions = generateCropSuitabilityPredictions(location, soilData, weatherData, farmSize);
    
    // Store prediction in database for historical tracking
    await kv.set(`crop_prediction_${Date.now()}`, {
      location,
      predictions,
      timestamp: new Date().toISOString()
    });
    
    return c.json(predictions);
  } catch (error) {
    console.log("Crop suitability prediction error:", error);
    return c.json({ error: "Prediction failed" }, 500);
  }
});

// Yield forecasting
app.post("/make-server-cc69ee2d/ml/predict/yield-forecast", async (c) => {
  try {
    const { crop, location, plantingDate, farmingPractices } = await c.req.json();
    
    const forecast = generateYieldForecast(crop, location, plantingDate, farmingPractices);
    
    // Store forecast for tracking accuracy
    await kv.set(`yield_forecast_${Date.now()}`, {
      crop,
      location,
      forecast,
      timestamp: new Date().toISOString()
    });
    
    return c.json(forecast);
  } catch (error) {
    console.log("Yield forecast error:", error);
    return c.json({ error: "Forecast failed" }, 500);
  }
});

// Crop health prediction
app.post("/make-server-cc69ee2d/ml/predict/crop-health", async (c) => {
  try {
    const { images, crop, location } = await c.req.json();
    
    const healthPrediction = generateCropHealthPrediction(crop, location, images);
    
    await kv.set(`health_prediction_${Date.now()}`, {
      crop,
      location,
      healthPrediction,
      timestamp: new Date().toISOString()
    });
    
    return c.json(healthPrediction);
  } catch (error) {
    console.log("Crop health prediction error:", error);
    return c.json({ error: "Health prediction failed" }, 500);
  }
});

// Soil analysis
app.post("/make-server-cc69ee2d/ml/predict/soil-analysis", async (c) => {
  try {
    const { soilImage, location, testResults } = await c.req.json();
    
    const soilAnalysis = generateSoilAnalysis(location, testResults);
    
    await kv.set(`soil_analysis_${Date.now()}`, {
      location,
      soilAnalysis,
      timestamp: new Date().toISOString()
    });
    
    return c.json(soilAnalysis);
  } catch (error) {
    console.log("Soil analysis error:", error);
    return c.json({ error: "Soil analysis failed" }, 500);
  }
});

// Weather impact prediction
app.post("/make-server-cc69ee2d/ml/predict/weather-impact", async (c) => {
  try {
    const { location, crop, plantingDate } = await c.req.json();
    
    const weatherImpact = generateWeatherImpactPrediction(location, crop, plantingDate);
    
    await kv.set(`weather_impact_${Date.now()}`, {
      location,
      crop,
      weatherImpact,
      timestamp: new Date().toISOString()
    });
    
    return c.json(weatherImpact);
  } catch (error) {
    console.log("Weather impact prediction error:", error);
    return c.json({ error: "Weather impact prediction failed" }, 500);
  }
});

// ================== GOOGLE EARTH ENGINE ENDPOINTS ==================

// Satellite analysis
app.post("/make-server-cc69ee2d/gee/satellite-analysis", async (c) => {
  try {
    const { location, startDate, endDate, analysisType } = await c.req.json();
    
    const analysis = generateSatelliteAnalysis(location, startDate, endDate, analysisType);
    
    await kv.set(`satellite_analysis_${Date.now()}`, {
      location,
      analysis,
      timestamp: new Date().toISOString()
    });
    
    return c.json(analysis);
  } catch (error) {
    console.log("Satellite analysis error:", error);
    return c.json({ error: "Satellite analysis failed" }, 500);
  }
});

// NDVI calculation
app.post("/make-server-cc69ee2d/gee/calculate-ndvi", async (c) => {
  try {
    const { location, date } = await c.req.json();
    
    const ndviData = generateNDVIData(location, date);
    
    return c.json(ndviData);
  } catch (error) {
    console.log("NDVI calculation error:", error);
    return c.json({ error: "NDVI calculation failed" }, 500);
  }
});

// Soil moisture analysis
app.post("/make-server-cc69ee2d/gee/soil-moisture", async (c) => {
  try {
    const { location, radius, date } = await c.req.json();
    
    const soilMoistureData = generateSoilMoistureData(location, radius, date);
    
    return c.json(soilMoistureData);
  } catch (error) {
    console.log("Soil moisture analysis error:", error);
    return c.json({ error: "Soil moisture analysis failed" }, 500);
  }
});

// ================== DATA MANAGEMENT ENDPOINTS ==================

// Get historical yield data
app.get("/make-server-cc69ee2d/data/historical-yields", async (c) => {
  try {
    const location = c.req.query("location");
    const crop = c.req.query("crop");
    
    const yields = await getHistoricalYields(location, crop);
    
    return c.json(yields);
  } catch (error) {
    console.log("Historical yields error:", error);
    return c.json({ error: "Failed to fetch historical yields" }, 500);
  }
});

// Save user data
app.post("/make-server-cc69ee2d/user/save-data", async (c) => {
  try {
    const userData = await c.req.json();
    
    await kv.set(`user_data_${userData.userId}`, {
      ...userData,
      timestamp: new Date().toISOString()
    });
    
    return c.json({ success: true });
  } catch (error) {
    console.log("Save user data error:", error);
    return c.json({ error: "Failed to save user data" }, 500);
  }
});

// Get user data
app.get("/make-server-cc69ee2d/user/data/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const userData = await kv.get(`user_data_${userId}`);
    
    return c.json(userData || {});
  } catch (error) {
    console.log("Get user data error:", error);
    return c.json({ error: "Failed to fetch user data" }, 500);
  }
});

// Get crop cycles for user
app.get("/make-server-cc69ee2d/user/crop-cycles/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const cropCycles = await kv.getByPrefix(`crop_cycle_${userId}_`);
    
    return c.json({ cropCycles: cropCycles || [] });
  } catch (error) {
    console.log("Get crop cycles error:", error);
    return c.json({ error: "Failed to fetch crop cycles" }, 500);
  }
});

// Get alerts for user
app.get("/make-server-cc69ee2d/user/alerts/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const unreadOnly = c.req.query("unreadOnly") === "true";
    
    const alerts = await kv.getByPrefix(`alert_${userId}_`);
    let filteredAlerts = alerts || [];
    
    if (unreadOnly) {
      filteredAlerts = filteredAlerts.filter((alert: any) => !alert.isRead);
    }
    
    return c.json({ alerts: filteredAlerts });
  } catch (error) {
    console.log("Get alerts error:", error);
    return c.json({ error: "Failed to fetch alerts" }, 500);
  }
});

// Yield analytics
app.post("/make-server-cc69ee2d/analytics/yield-analysis", async (c) => {
  try {
    const { userId, crop } = await c.req.json();
    
    // Get historical yield data for the user and crop
    const historicalData = await kv.getByPrefix(`historical_yield_${userId}_`);
    const cropData = historicalData.filter((data: any) => data.crop === crop);
    
    // Calculate analytics
    const analytics = calculateYieldAnalytics(cropData);
    
    return c.json(analytics);
  } catch (error) {
    console.log("Yield analytics error:", error);
    return c.json({ error: "Failed to generate analytics" }, 500);
  }
});

// Data export
app.post("/make-server-cc69ee2d/export/user-data", async (c) => {
  try {
    const { userId, format } = await c.req.json();
    
    // Collect all user data
    const userData = await kv.get(`user_data_${userId}`);
    const cropCycles = await kv.getByPrefix(`crop_cycle_${userId}_`);
    const historicalYields = await kv.getByPrefix(`historical_yield_${userId}_`);
    const alerts = await kv.getByPrefix(`alert_${userId}_`);
    
    const exportData = {
      profile: userData,
      cropCycles,
      historicalYields,
      alerts,
      exportDate: new Date().toISOString()
    };
    
    // Generate export file
    const exportResult = await generateExportFile(exportData, format);
    
    return c.json(exportResult);
  } catch (error) {
    console.log("Data export error:", error);
    return c.json({ error: "Failed to export data" }, 500);
  }
});

// WhatsApp alerts endpoint
app.post("/make-server-cc69ee2d/alerts/whatsapp", async (c) => {
  try {
    const { userId, message, phoneNumber } = await c.req.json();
    
    // For demo purposes, we'll just log the alert
    // In production, this would integrate with WhatsApp Business API
    console.log(`WhatsApp Alert for ${phoneNumber}: ${message}`);
    
    // Store alert in database
    await kv.set(`whatsapp_alert_${Date.now()}`, {
      userId,
      message,
      phoneNumber,
      timestamp: new Date().toISOString(),
      status: 'sent'
    });
    
    return c.json({ success: true, status: 'sent' });
  } catch (error) {
    console.log("WhatsApp alert error:", error);
    return c.json({ error: "Failed to send WhatsApp alert" }, 500);
  }
});

// Government schemes endpoint
app.get("/make-server-cc69ee2d/government-schemes", async (c) => {
  try {
    const location = c.req.query("location");
    const crop = c.req.query("crop");
    
    const schemes = getGovernmentSchemes(location, crop);
    
    return c.json(schemes);
  } catch (error) {
    console.log("Government schemes error:", error);
    return c.json({ error: "Failed to fetch government schemes" }, 500);
  }
});

// ================== ML MODEL TRAINING ENDPOINTS ==================

// Upload training data
app.post("/make-server-cc69ee2d/ml/upload-training-data", async (c) => {
  try {
    const { data } = await c.req.json();
    
    // Store training data
    const dataIds = [];
    for (const item of data) {
      const dataId = `training_data_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await kv.set(`training_data_${dataId}`, {
        ...item,
        dataId,
        uploadedAt: new Date().toISOString()
      });
      dataIds.push(dataId);
    }
    
    return c.json({ success: true, dataIds });
  } catch (error) {
    console.log("Upload training data error:", error);
    return c.json({ error: "Failed to upload training data" }, 500);
  }
});

// Start model training
app.post("/make-server-cc69ee2d/ml/start-training", async (c) => {
  try {
    const config = await c.req.json();
    
    const trainingId = `training_${Date.now()}`;
    
    // Store training configuration
    await kv.set(`training_config_${trainingId}`, {
      ...config,
      trainingId,
      status: 'pending',
      startedAt: new Date().toISOString(),
      progress: 0
    });
    
    return c.json({ trainingId, success: true });
  } catch (error) {
    console.log("Start training error:", error);
    return c.json({ error: "Failed to start training" }, 500);
  }
});

// Get training progress
app.get("/make-server-cc69ee2d/ml/training-progress/:trainingId", async (c) => {
  try {
    const trainingId = c.req.param("trainingId");
    
    // Simulate training progress
    const progress = Math.min(100, Math.floor(Math.random() * 100));
    const status = progress >= 100 ? 'completed' : 'training';
    
    const trainingProgress = {
      status,
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
    
    return c.json(trainingProgress);
  } catch (error) {
    console.log("Training progress error:", error);
    return c.json({ error: "Failed to get training progress" }, 500);
  }
});

// Get trained model
app.get("/make-server-cc69ee2d/ml/models/:modelId", async (c) => {
  try {
    const modelId = c.req.param("modelId");
    
    const trainedModel = {
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
      modelSize: 2.5,
      deploymentStatus: 'deployed',
      metadata: {
        trainingDataCount: 1250,
        validationDataCount: 312,
        trainingDuration: 1800,
        lastUpdated: new Date().toISOString()
      }
    };
    
    return c.json(trainedModel);
  } catch (error) {
    console.log("Get trained model error:", error);
    return c.json({ error: "Failed to get trained model" }, 500);
  }
});

// List farmer models
app.get("/make-server-cc69ee2d/ml/farmers/:farmerId/models", async (c) => {
  try {
    const farmerId = c.req.param("farmerId");
    
    const farmerModels = [
      {
        id: 'model-1',
        farmerId,
        modelType: 'yield_forecast',
        version: '1.0',
        trainingDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        performance: {
          accuracy: 0.85,
          precision: 0.82,
          recall: 0.88,
          f1Score: 0.85
        },
        deploymentStatus: 'deployed'
      },
      {
        id: 'model-2',
        farmerId,
        modelType: 'disease_detection',
        version: '1.0',
        trainingDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        performance: {
          accuracy: 0.92,
          precision: 0.89,
          recall: 0.95,
          f1Score: 0.92
        },
        deploymentStatus: 'deployed'
      },
      {
        id: 'model-3',
        farmerId,
        modelType: 'pest_prediction',
        version: '1.0',
        trainingDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        performance: {
          accuracy: 0.78,
          precision: 0.75,
          recall: 0.82,
          f1Score: 0.78
        },
        deploymentStatus: 'pending'
      }
    ];
    
    return c.json(farmerModels);
  } catch (error) {
    console.log("List farmer models error:", error);
    return c.json({ error: "Failed to list farmer models" }, 500);
  }
});

// Deploy model
app.post("/make-server-cc69ee2d/ml/models/:modelId/deploy", async (c) => {
  try {
    const modelId = c.req.param("modelId");
    
    return c.json({
      success: true,
      endpoint: `https://jtoioakoasnckzqirpqz.supabase.co/functions/v1/make-server-cc69ee2d/ml/models/${modelId}/predict`
    });
  } catch (error) {
    console.log("Deploy model error:", error);
    return c.json({ error: "Failed to deploy model" }, 500);
  }
});

// Make prediction with custom model
app.post("/make-server-cc69ee2d/ml/models/:modelId/predict", async (c) => {
  try {
    const modelId = c.req.param("modelId");
    const { input } = await c.req.json();
    
    const prediction = {
      prediction: 4.2,
      confidence: 0.87,
      factors: {
        ndvi: 0.3,
        moisture: 0.25,
        weather: 0.45
      },
      explanation: 'High NDVI and optimal moisture levels indicate strong yield potential'
    };
    
    return c.json(prediction);
  } catch (error) {
    console.log("Model prediction error:", error);
    return c.json({ error: "Failed to make prediction" }, 500);
  }
});

// ================== GOOGLE EARTH ENGINE SCRIPTS ENDPOINTS ==================

// Get script templates
app.get("/make-server-cc69ee2d/gee/script-templates", async (c) => {
  try {
    const templates = getScriptTemplates();
    return c.json(templates);
  } catch (error) {
    console.log("Script templates error:", error);
    return c.json({ error: "Failed to fetch script templates" }, 500);
  }
});

// Execute GEE script
app.post("/make-server-cc69ee2d/gee/execute", async (c) => {
  try {
    const { scriptId, parameters } = await c.req.json();
    
    const taskId = `task_${Date.now()}`;
    
    // Store execution task
    await kv.set(`gee_task_${taskId}`, {
      taskId,
      scriptId,
      parameters,
      status: 'RUNNING',
      startedAt: new Date().toISOString(),
      progress: 0
    });
    
    return c.json({ taskId, success: true });
  } catch (error) {
    console.log("Execute script error:", error);
    return c.json({ error: "Failed to execute script" }, 500);
  }
});

// Get execution status
app.get("/make-server-cc69ee2d/gee/tasks/:taskId", async (c) => {
  try {
    const taskId = c.req.param("taskId");
    
    // Simulate execution progress
    const progress = Math.min(100, Math.floor(Math.random() * 100));
    const status = progress >= 100 ? 'COMPLETED' : 'RUNNING';
    
    const executionResult = {
      taskId,
      status,
      progress,
      outputs: status === 'COMPLETED' ? [
        {
          name: 'NDVI_Analysis',
          type: 'image',
          downloadUrl: 'https://drive.google.com/mock-download-url'
        },
        {
          name: 'Statistics',
          type: 'feature',
          value: {
            mean_ndvi: 0.72,
            std_ndvi: 0.15,
            area_hectares: 25.6
          }
        }
      ] : [],
      logs: [
        'Script execution started',
        'Loading Sentinel-2 imagery...',
        'Calculating NDVI...',
        status === 'COMPLETED' ? 'Analysis complete' : 'Processing...'
      ],
      executionTime: Math.floor(Math.random() * 300),
      resourceUsage: {
        computeUnits: Math.floor(Math.random() * 100),
        memoryMb: Math.floor(Math.random() * 2000),
        storageMb: Math.floor(Math.random() * 500)
      }
    };
    
    return c.json(executionResult);
  } catch (error) {
    console.log("Get execution status error:", error);
    return c.json({ error: "Failed to get execution status" }, 500);
  }
});

// ================== UTILITY FUNCTIONS ==================

function generateCropSuitabilityPredictions(location: any, soilData: any, weatherData: any, farmSize: number) {
  // Enhanced mock data that varies based on location and conditions
  const baseConfidence = 0.7 + Math.random() * 0.25;
  
  return [
    {
      crop: 'Rice',
      confidence: Math.min(baseConfidence + 0.1, 0.95),
      suitability: Math.min(baseConfidence + 0.05, 0.92),
      recommendedVariety: location.lat > 25 ? 'Basmati 1121' : 'IR-64',
      plantingDate: getOptimalPlantingDate('Rice', location),
      harvestDate: getHarvestDate('Rice', getOptimalPlantingDate('Rice', location)),
      expectedYield: (3.5 + Math.random() * 1.5) * (farmSize / 10),
      riskFactors: generateRiskFactors('Rice', location)
    },
    {
      crop: 'Wheat',
      confidence: baseConfidence,
      suitability: baseConfidence - 0.05,
      recommendedVariety: 'HD-2967',
      plantingDate: getOptimalPlantingDate('Wheat', location),
      harvestDate: getHarvestDate('Wheat', getOptimalPlantingDate('Wheat', location)),
      expectedYield: (3.0 + Math.random() * 1.2) * (farmSize / 10),
      riskFactors: generateRiskFactors('Wheat', location)
    },
    {
      crop: 'Cotton',
      confidence: baseConfidence - 0.1,
      suitability: baseConfidence - 0.15,
      recommendedVariety: 'Bt Cotton Hybrid',
      plantingDate: getOptimalPlantingDate('Cotton', location),
      harvestDate: getHarvestDate('Cotton', getOptimalPlantingDate('Cotton', location)),
      expectedYield: (2.5 + Math.random() * 1.0) * (farmSize / 10),
      riskFactors: generateRiskFactors('Cotton', location)
    }
  ];
}

function generateYieldForecast(crop: string, location: any, plantingDate: string, farmingPractices: any) {
  const baseYield = 3.5 + Math.random() * 1.5;
  const practiceMultiplier = farmingPractices?.organic ? 0.9 : 1.0;
  
  return {
    crop,
    currentYield: baseYield * practiceMultiplier,
    predictedYield: (baseYield + 0.5) * practiceMultiplier,
    yieldVariance: 0.2 + Math.random() * 0.3,
    factors: {
      weather: 0.7 + Math.random() * 0.25,
      soil: 0.75 + Math.random() * 0.2,
      irrigation: 0.8 + Math.random() * 0.15,
      fertilizer: 0.7 + Math.random() * 0.25
    },
    recommendations: generateYieldRecommendations(crop, location)
  };
}

function generateCropHealthPrediction(crop: string, location: any, images: string[]) {
  const healthScore = 75 + Math.random() * 20;
  
  return {
    healthScore: Math.round(healthScore),
    diseases: generateDiseasesPrediction(crop, healthScore),
    pests: generatePestsPrediction(crop, location),
    nutritionalDeficiency: generateNutritionalDeficiency(healthScore)
  };
}

function generateSoilAnalysis(location: any, testResults: any) {
  return {
    ph: testResults?.ph || (6.0 + Math.random() * 2.0),
    nitrogen: testResults?.nitrogen || Math.round(50 + Math.random() * 100),
    phosphorus: testResults?.phosphorus || Math.round(30 + Math.random() * 70),
    potassium: testResults?.potassium || Math.round(80 + Math.random() * 120),
    organicMatter: testResults?.organicMatter || (2.0 + Math.random() * 3.0),
    moisture: Math.round(15 + Math.random() * 20),
    recommendations: generateSoilRecommendations(),
    fertilizerRecommendation: {
      type: 'NPK 10-26-26',
      quantity: Math.round(100 + Math.random() * 100),
      applicationMethod: 'Broadcasting before planting'
    }
  };
}

function generateWeatherImpactPrediction(location: any, crop: string, plantingDate: string) {
  return {
    droughtRisk: Math.random() * 0.4,
    floodRisk: Math.random() * 0.3,
    frostRisk: location.lat > 25 ? Math.random() * 0.2 : 0.05,
    optimalPlantingWindow: {
      start: getSeasonalDate(crop, 'start'),
      end: getSeasonalDate(crop, 'end')
    },
    irrigationSchedule: generateIrrigationSchedule(crop, plantingDate)
  };
}

function generateSatelliteAnalysis(location: any, startDate: string, endDate: string, analysisType: string) {
  return {
    ndviTrend: generateNDVITrend(startDate, endDate),
    vegetationHealth: Math.round(70 + Math.random() * 25),
    cropGrowthStage: determineCropGrowthStage(),
    irrigationEfficiency: Math.round(75 + Math.random() * 20),
    anomalies: generateAnomalies(),
    recommendations: [
      'Vegetation health is good in 80% of the field',
      'Consider targeted irrigation in the northeast section',
      'Monitor crop development in next 2 weeks'
    ]
  };
}

function generateNDVIData(location: any, date: string) {
  const baseNDVI = 0.3 + Math.random() * 0.4;
  const healthPercentage = Math.round(baseNDVI * 100);
  const vegetationHealth = baseNDVI > 0.7 ? 'Excellent' : 
                          baseNDVI > 0.6 ? 'Good' : 
                          baseNDVI > 0.4 ? 'Fair' : 'Poor';
  
  return {
    averageNDVI: parseFloat(baseNDVI.toFixed(3)),
    maxNDVI: parseFloat((baseNDVI + 0.1).toFixed(3)),
    minNDVI: parseFloat((baseNDVI - 0.1).toFixed(3)),
    vegetationHealth: vegetationHealth as 'Poor' | 'Fair' | 'Good' | 'Excellent',
    healthPercentage,
    trendAnalysis: {
      trend: 'Stable' as 'Improving' | 'Stable' | 'Declining',
      changeRate: (Math.random() - 0.5) * 0.1
    },
    hotspots: [
      {
        lat: location.lat + (Math.random() - 0.5) * 0.01,
        lng: location.lng + (Math.random() - 0.5) * 0.01,
        ndviValue: baseNDVI - 0.2,
        concern: 'Lower vegetation density detected'
      }
    ]
  };
}

async function getHistoricalYields(location: string, crop: string) {
  try {
    const historicalData = await kv.getByPrefix('yield_forecast_');
    
    // Generate additional historical data for demonstration
    const years = [2019, 2020, 2021, 2022, 2023];
    const yields = years.map(year => ({
      year,
      yield: 3.0 + Math.random() * 2.0,
      rainfall: 800 + Math.random() * 400,
      temperature: 25 + Math.random() * 10
    }));
    
    return {
      location,
      crop,
      historicalYields: yields,
      averageYield: yields.reduce((sum, y) => sum + y.yield, 0) / yields.length
    };
  } catch (error) {
    console.log("Error fetching historical yields:", error);
    return { error: "Failed to fetch historical data" };
  }
}

// Helper functions
function getOptimalPlantingDate(crop: string, location: any): string {
  const baseDate = new Date();
  switch (crop) {
    case 'Rice':
      return new Date(baseDate.getFullYear(), 5, 15).toISOString().split('T')[0];
    case 'Wheat':
      return new Date(baseDate.getFullYear(), 10, 1).toISOString().split('T')[0];
    case 'Cotton':
      return new Date(baseDate.getFullYear(), 3, 15).toISOString().split('T')[0];
    default:
      return baseDate.toISOString().split('T')[0];
  }
}

function getHarvestDate(crop: string, plantingDate: string): string {
  const planting = new Date(plantingDate);
  const harvestDays = crop === 'Rice' ? 120 : crop === 'Wheat' ? 135 : 180;
  const harvest = new Date(planting);
  harvest.setDate(harvest.getDate() + harvestDays);
  return harvest.toISOString().split('T')[0];
}

function generateRiskFactors(crop: string, location: any): string[] {
  const factors = [];
  if (Math.random() > 0.7) factors.push('Water stress risk during flowering');
  if (Math.random() > 0.8) factors.push('Pest attack probability: Medium');
  if (location.lat > 25 && Math.random() > 0.6) factors.push('Late frost risk');
  return factors.length > 0 ? factors : ['Optimal growing conditions'];
}

function generateYieldRecommendations(crop: string, location: any): string[] {
  return [
    `Apply split dose nitrogen fertilization for ${crop}`,
    'Monitor soil moisture levels weekly',
    'Implement integrated pest management practices',
    'Consider cover crops to improve soil health'
  ];
}

function generateDiseasesPrediction(crop: string, healthScore: number) {
  const diseases = [];
  if (healthScore < 80) {
    diseases.push({
      name: 'Leaf Blight',
      probability: Math.random() * 0.3,
      severity: 'Low',
      treatment: 'Apply copper-based fungicide'
    });
  }
  return diseases;
}

function generatePestsPrediction(crop: string, location: any) {
  return [{
    name: 'Aphids',
    probability: Math.random() * 0.4,
    severity: 'Medium',
    treatment: 'Use neem oil spray or beneficial insects'
  }];
}

function generateNutritionalDeficiency(healthScore: number) {
  const deficiencies = [];
  if (healthScore < 85) {
    deficiencies.push({
      nutrient: 'Nitrogen',
      deficiencyLevel: 'Mild',
      recommendation: 'Apply urea fertilizer at recommended rate'
    });
  }
  return deficiencies;
}

function generateSoilRecommendations(): string[] {
  return [
    'Soil pH is within optimal range',
    'Consider adding organic matter to improve soil structure',
    'Maintain balanced NPK ratios'
  ];
}

function getSeasonalDate(crop: string, type: 'start' | 'end'): string {
  const year = new Date().getFullYear();
  const dates = {
    Rice: { start: new Date(year, 5, 1), end: new Date(year, 6, 15) },
    Wheat: { start: new Date(year, 9, 15), end: new Date(year, 10, 30) },
    Cotton: { start: new Date(year, 3, 1), end: new Date(year, 4, 15) }
  };
  return (dates[crop as keyof typeof dates]?.[type] || new Date()).toISOString().split('T')[0];
}

function generateIrrigationSchedule(crop: string, plantingDate: string) {
  const planting = new Date(plantingDate);
  const schedule = [];
  
  for (let i = 1; i <= 4; i++) {
    const date = new Date(planting);
    date.setDate(date.getDate() + (i * 20));
    schedule.push({
      date: date.toISOString().split('T')[0],
      amount: 25 + Math.random() * 15,
      reason: `Growth stage ${i} irrigation`
    });
  }
  
  return schedule;
}

function generateNDVITrend(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const trend = [];
  
  const daysDiff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const intervals = Math.min(10, Math.max(5, Math.floor(daysDiff / 7)));
  
  for (let i = 0; i < intervals; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + (i * Math.floor(daysDiff / intervals)));
    trend.push({
      date: date.toISOString().split('T')[0],
      ndvi: 0.3 + Math.random() * 0.4
    });
  }
  
  return trend;
}

function determineCropGrowthStage(): string {
  const stages = ['Germination', 'Vegetative', 'Flowering', 'Fruit Development', 'Maturation'];
  return stages[Math.floor(Math.random() * stages.length)];
}

function generateAnomalies() {
  const anomalies = [];
  if (Math.random() > 0.7) {
    anomalies.push({
      type: 'Water stress',
      severity: 'Medium',
      location: 'Northeast quadrant',
      recommendation: 'Increase irrigation in affected area'
    });
  }
  return anomalies;
}

function generateNDVIRecommendations(ndvi: number): string[] {
  if (ndvi > 0.6) {
    return ['Vegetation is healthy', 'Continue current management practices'];
  } else if (ndvi > 0.4) {
    return ['Monitor plant health closely', 'Consider fertilizer application'];
  } else {
    return ['Poor vegetation health detected', 'Immediate intervention required'];
  }
}

function generateSoilMoistureData(location: any, radius: number, date: string) {
  const baseMoisture = 30 + Math.random() * 40; // 30-70% moisture
  
  return {
    averageMoisture: Math.round(baseMoisture),
    moistureMap: [
      { lat: location.lat, lng: location.lng, moisture: Math.round(baseMoisture) },
      { lat: location.lat + 0.001, lng: location.lng + 0.001, moisture: Math.round(baseMoisture + (Math.random() - 0.5) * 10) },
      { lat: location.lat - 0.001, lng: location.lng - 0.001, moisture: Math.round(baseMoisture + (Math.random() - 0.5) * 10) }
    ],
    irrigationNeeded: baseMoisture < 40 ? [
      {
        area: 'Main Field',
        priority: baseMoisture < 30 ? 'High' : 'Medium' as 'High' | 'Medium' | 'Low',
        recommendedAmount: Math.round(50 - baseMoisture)
      }
    ] : []
  };
}

function calculateYieldAnalytics(cropData: any[]) {
  if (cropData.length === 0) {
    return {
      averageYield: 0,
      bestYear: { year: new Date().getFullYear(), yield: 0 },
      worstYear: { year: new Date().getFullYear(), yield: 0 },
      trendAnalysis: { trend: 'Stable', changePercent: 0 },
      profitabilityAnalysis: {
        averageProfit: 0,
        profitMargin: 0,
        bestProfitYear: { year: new Date().getFullYear(), profit: 0 }
      },
      recommendations: ['Insufficient historical data for analysis']
    };
  }

  const yields = cropData.map(d => d.yield);
  const profits = cropData.map(d => d.profit);
  
  const averageYield = yields.reduce((sum, y) => sum + y, 0) / yields.length;
  const averageProfit = profits.reduce((sum, p) => sum + p, 0) / profits.length;
  
  const bestYield = Math.max(...yields);
  const worstYield = Math.min(...yields);
  const bestProfit = Math.max(...profits);
  
  const bestYearData = cropData.find(d => d.yield === bestYield);
  const worstYearData = cropData.find(d => d.yield === worstYield);
  const bestProfitData = cropData.find(d => d.profit === bestProfit);

  // Calculate trend
  const firstHalf = yields.slice(0, Math.floor(yields.length / 2));
  const secondHalf = yields.slice(Math.floor(yields.length / 2));
  const firstAvg = firstHalf.reduce((sum, y) => sum + y, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, y) => sum + y, 0) / secondHalf.length;
  
  const changePercent = ((secondAvg - firstAvg) / firstAvg) * 100;
  const trend = changePercent > 5 ? 'Increasing' : changePercent < -5 ? 'Decreasing' : 'Stable';

  return {
    averageYield: parseFloat(averageYield.toFixed(2)),
    bestYear: { year: bestYearData?.year || new Date().getFullYear(), yield: bestYield },
    worstYear: { year: worstYearData?.year || new Date().getFullYear(), yield: worstYield },
    trendAnalysis: { trend, changePercent: parseFloat(changePercent.toFixed(1)) },
    profitabilityAnalysis: {
      averageProfit: Math.round(averageProfit),
      profitMargin: parseFloat(((averageProfit / (averageProfit + 20000)) * 100).toFixed(1)),
      bestProfitYear: { year: bestProfitData?.year || new Date().getFullYear(), profit: bestProfit }
    },
    recommendations: generateAnalyticsRecommendations(trend, changePercent, averageYield)
  };
}

function generateAnalyticsRecommendations(trend: string, changePercent: number, averageYield: number): string[] {
  const recommendations = [];
  
  if (trend === 'Increasing') {
    recommendations.push('Excellent progress! Continue current farming practices');
    recommendations.push('Consider expanding cultivated area');
  } else if (trend === 'Decreasing') {
    recommendations.push('Yield declining - review farming practices');
    recommendations.push('Consider soil testing and nutrient management');
    recommendations.push('Evaluate irrigation and pest control strategies');
  } else {
    recommendations.push('Stable yields - good consistency');
    recommendations.push('Explore yield enhancement techniques');
  }
  
  if (averageYield < 3.0) {
    recommendations.push('Below average yield - consider improved varieties');
    recommendations.push('Focus on soil health improvement');
  }
  
  return recommendations;
}

async function generateExportFile(data: any, format: string) {
  // For demo purposes, we'll create a simple export
  // In production, this would generate actual Excel/CSV files
  
  const filename = `krishisevak_export_${Date.now()}.${format}`;
  const exportContent = format === 'json' ? JSON.stringify(data, null, 2) : 
                       format === 'csv' ? convertToCSV(data) :
                       'Excel export not implemented in demo';
  
  // In production, you would save this to Supabase Storage and return a signed URL
  return {
    downloadUrl: `data:text/plain;charset=utf-8,${encodeURIComponent(exportContent)}`,
    filename,
    format
  };
}

function convertToCSV(data: any): string {
  // Simple CSV conversion for demo
  let csv = 'Type,Date,Data\n';
  
  if (data.cropCycles) {
    data.cropCycles.forEach((cycle: any) => {
      csv += `Crop Cycle,${cycle.plantingDate},"${cycle.crop} - ${cycle.variety}"\n`;
    });
  }
  
  if (data.historicalYields) {
    data.historicalYields.forEach((yieldData: any) => {
      csv += `Historical Yield,${yieldData.year},"${yieldData.crop}: ${yieldData.yield} tons"\n`;
    });
  }
  
  return csv;
}

function getGovernmentSchemes(location?: string, crop?: string) {
  // Mock government schemes data
  return {
    schemes: [
      {
        id: 'pm-kisan',
        name: 'PM-KISAN',
        description: 'Financial assistance of Rs. 6000 per year to farmer families',
        eligibility: 'All landholding farmers',
        benefits: 'Rs. 2000 every 4 months',
        applicationUrl: 'https://www.pmkisan.gov.in/',
        deadline: '2024-12-31',
        category: 'Financial Support'
      },
      {
        id: 'crop-insurance',
        name: 'Pradhan Mantri Fasal Bima Yojana',
        description: 'Crop insurance scheme for farmers',
        eligibility: 'All farmers growing notified crops',
        benefits: 'Insurance coverage against crop loss',
        applicationUrl: 'https://www.pmfby.gov.in/',
        deadline: '2024-06-30',
        category: 'Insurance'
      },
      {
        id: 'soil-health',
        name: 'Soil Health Card Scheme',
        description: 'Free soil testing and health cards',
        eligibility: 'All farmers',
        benefits: 'Free soil testing every 2 years',
        applicationUrl: 'https://soilhealth.dac.gov.in/',
        deadline: 'Ongoing',
        category: 'Soil Health'
      }
    ],
    location: location || 'All India',
    crop: crop || 'All Crops'
  };
}

function getScriptTemplates() {
  return [
    {
      id: 'ndvi_time_series',
      name: 'NDVI Time Series Analysis',
      description: 'Calculate NDVI time series for crop monitoring using Sentinel-2 imagery',
      category: 'ndvi',
      difficulty: 'beginner',
      script: `
// NDVI Time Series Analysis Script for KrishiSevak
var aoi = /* geometry parameter */;
var startDate = /* start_date parameter */;
var endDate = /* end_date parameter */;

var s2 = ee.ImageCollection('COPERNICUS/S2_SR')
  .filterBounds(aoi)
  .filterDate(startDate, endDate)
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20));

var addNDVI = function(image) {
  var ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
  return image.addBands(ndvi);
};

var s2WithNDVI = s2.map(addNDVI);
var ndviTimeSeries = s2WithNDVI.select('NDVI');

Map.centerObject(aoi, 12);
Map.addLayer(s2WithNDVI.select('NDVI').median(), {min: 0, max: 1, palette: ['red', 'yellow', 'green']}, 'NDVI');
      `,
      parameters: [
        {
          name: 'geometry',
          type: 'geometry',
          description: 'Area of interest for NDVI calculation',
          required: true
        },
        {
          name: 'start_date',
          type: 'date',
          description: 'Start date for time series',
          defaultValue: '2024-01-01',
          required: true
        },
        {
          name: 'end_date',
          type: 'date',
          description: 'End date for time series',
          defaultValue: '2024-12-31',
          required: true
        }
      ],
      outputs: [
        {
          name: 'NDVI_TimeSeries',
          type: 'feature',
          description: 'CSV file with NDVI time series data'
        },
        {
          name: 'NDVI_Map',
          type: 'image',
          description: 'Visual NDVI map layer'
        }
      ],
      requirements: ['Sentinel-2 imagery access'],
      author: 'KrishiSevak Team',
      version: '1.0',
      lastModified: '2024-03-15'
    },
    {
      id: 'crop_classification',
      name: 'Crop Type Classification',
      description: 'Classify crop types using machine learning on satellite imagery',
      category: 'classification',
      difficulty: 'advanced',
      script: `
// Crop Classification Script for KrishiSevak
var aoi = /* geometry parameter */;
var year = /* year parameter */;

var s2 = ee.ImageCollection('COPERNICUS/S2_SR')
  .filterBounds(aoi)
  .filterDate(ee.Date.fromYMD(year, 6, 1), ee.Date.fromYMD(year, 10, 31))
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 15));

var composite = s2.median();
var ndvi = composite.normalizedDifference(['B8', 'B4']).rename('NDVI');

Map.centerObject(aoi, 12);
Map.addLayer(composite, {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000}, 'True Color');
      `,
      parameters: [
        {
          name: 'geometry',
          type: 'geometry',
          description: 'Area of interest for crop classification',
          required: true
        },
        {
          name: 'year',
          type: 'number',
          description: 'Year for crop classification',
          defaultValue: 2024,
          required: true
        }
      ],
      outputs: [
        {
          name: 'Crop_Classification',
          type: 'image',
          description: 'Classified crop type raster'
        }
      ],
      requirements: ['Sentinel-2 imagery access'],
      author: 'KrishiSevak Team',
      version: '1.2',
      lastModified: '2024-03-15'
    },
    {
      id: 'soil_moisture_monitoring',
      name: 'Soil Moisture Monitoring',
      description: 'Monitor soil moisture using Sentinel-1 radar data',
      category: 'moisture',
      difficulty: 'intermediate',
      script: `
// Soil Moisture Monitoring Script using Sentinel-1 SAR data
var aoi = /* geometry parameter */;
var startDate = /* start_date parameter */;
var endDate = /* end_date parameter */;

var s1 = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filterBounds(aoi)
  .filterDate(startDate, endDate)
  .filter(ee.Filter.eq('instrumentMode', 'IW'));

var vv = s1.select('VV').mean();
var soilMoisture = vv.multiply(-0.1).add(0.5).clamp(0, 1).rename('Soil_Moisture');

Map.centerObject(aoi, 12);
Map.addLayer(soilMoisture, {min: 0, max: 1, palette: ['brown', 'yellow', 'blue']}, 'Soil Moisture');
      `,
      parameters: [
        {
          name: 'geometry',
          type: 'geometry',
          description: 'Area of interest for soil moisture monitoring',
          required: true
        },
        {
          name: 'start_date',
          type: 'date',
          description: 'Start date for monitoring period',
          defaultValue: '2024-01-01',
          required: true
        },
        {
          name: 'end_date',
          type: 'date',
          description: 'End date for monitoring period',
          defaultValue: '2024-12-31',
          required: true
        }
      ],
      outputs: [
        {
          name: 'Soil_Moisture',
          type: 'image',
          description: 'Soil moisture raster map'
        }
      ],
      requirements: ['Sentinel-1 SAR imagery access'],
      author: 'KrishiSevak Team',
      version: '1.1',
      lastModified: '2024-03-15'
    }
  ];
}

Deno.serve(app.fetch);