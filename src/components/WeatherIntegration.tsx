import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Cloud,
  Sun,
  CloudRain,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Zap,
  AlertTriangle,
  TrendingUp,
  Calendar,
  MapPin
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, AreaChart, Area } from 'recharts';
import { motion } from 'motion/react';

interface WeatherIntegrationProps {
  language: string;
  location?: { lat: number; lon: number; name: string };
}

interface WeatherData {
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    visibility: number;
    uvIndex: number;
    pressure: number;
    condition: string;
    icon: string;
    rainfall: number;
  };
  forecast: {
    date: string;
    temperature: { min: number; max: number };
    humidity: number;
    rainfall: number;
    windSpeed: number;
    condition: string;
    icon: string;
  }[];
  alerts: {
    type: string;
    severity: string;
    message: string;
    validUntil: string;
  }[];
  soilConditions: {
    moisture: number;
    temperature: number;
    ph: number;
  };
}

export function WeatherIntegration({ language, location }: WeatherIntegrationProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('temperature');
  const [viewMode, setViewMode] = useState('current');

  const content = {
    en: {
      title: 'Weather & Environmental Data',
      currentWeather: 'Current Conditions',
      forecast: 'Weather Forecast',
      soilConditions: 'Soil Conditions',
      weatherAlerts: 'Weather Alerts',
      temperature: 'Temperature',
      humidity: 'Humidity',
      windSpeed: 'Wind Speed',
      visibility: 'Visibility',
      uvIndex: 'UV Index',
      pressure: 'Pressure',
      rainfall: 'Rainfall',
      soilMoisture: 'Soil Moisture',
      soilTemp: 'Soil Temperature',
      soilPH: 'Soil pH',
      feelsLike: 'Feels like',
      low: 'Low',
      moderate: 'Moderate',
      high: 'High',
      veryHigh: 'Very High',
      extreme: 'Extreme',
      sunny: 'Sunny',
      cloudy: 'Cloudy',
      rainy: 'Rainy',
      stormy: 'Stormy',
      partlyCloudy: 'Partly Cloudy',
      today: 'Today',
      tomorrow: 'Tomorrow',
      thisWeek: 'This Week',
      irrigationRecommended: 'Irrigation Recommended',
      goodForSpraying: 'Good for Spraying',
      avoidFieldWork: 'Avoid Field Work',
      idealPlanting: 'Ideal for Planting',
      harvestWeather: 'Good Harvest Weather',
      refreshData: 'Refresh Data',
      locationNotSet: 'Location not set',
      setLocation: 'Set Location'
    },
    hi: {
      title: 'मौसम और पर्यावरणीय डेटा',
      currentWeather: 'वर्तमान स्थितियां',
      forecast: 'मौसम पूर्वानुमान',
      soilConditions: 'मिट्टी की स्थिति',
      weatherAlerts: 'मौसम अलर्ट',
      temperature: 'तापमान',
      humidity: 'आर्द्रता',
      windSpeed: 'हवा की गति',
      visibility: 'दृश्यता',
      uvIndex: 'यूवी इंडेक्स',
      pressure: 'दबाव',
      rainfall: 'बारिश',
      soilMoisture: 'मिट्टी की नमी',
      soilTemp: 'मिट्टी का तापमान',
      soilPH: 'मिट्टी का pH',
      feelsLike: 'महसूस होता है',
      low: 'कम',
      moderate: 'मध्यम',
      high: 'उच्च',
      veryHigh: 'बहुत उच्च',
      extreme: 'अत्यधिक',
      sunny: 'धूप',
      cloudy: 'बादलों से भरा',
      rainy: 'बारिश',
      stormy: 'तूफानी',
      partlyCloudy: 'आंशिक बादल',
      today: 'आज',
      tomorrow: 'कल',
      thisWeek: 'इस सप्ताह',
      irrigationRecommended: 'सिंचाई की सिफारिश',
      goodForSpraying: 'छिड़काव के लिए अच्छा',
      avoidFieldWork: 'खेत का काम न करें',
      idealPlanting: 'रोपण के लिए आदर्श',
      harvestWeather: 'फसल के लिए अच्छा मौसम',
      refreshData: 'डेटा रीफ्रेश करें',
      locationNotSet: 'स्थान सेट नहीं है',
      setLocation: 'स्थान सेट करें'
    }
  };

  const t = content[language as keyof typeof content] || content.en;

  useEffect(() => {
    fetchWeatherData();
  }, [location]);

  const fetchWeatherData = async () => {
    setLoading(true);
    
    try {
      // Mock weather data - In production, this would call actual weather APIs
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockWeatherData: WeatherData = {
        current: {
          temperature: 28,
          humidity: 65,
          windSpeed: 12,
          visibility: 10,
          uvIndex: 7,
          pressure: 1013,
          condition: 'partly-cloudy',
          icon: 'partly-cloudy',
          rainfall: 0
        },
        forecast: [
          {
            date: new Date().toISOString().split('T')[0],
            temperature: { min: 22, max: 32 },
            humidity: 70,
            rainfall: 2,
            windSpeed: 8,
            condition: 'rainy',
            icon: 'rain'
          },
          {
            date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            temperature: { min: 20, max: 28 },
            humidity: 80,
            rainfall: 15,
            windSpeed: 15,
            condition: 'rainy',
            icon: 'heavy-rain'
          },
          {
            date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
            temperature: { min: 24, max: 30 },
            humidity: 55,
            rainfall: 0,
            windSpeed: 10,
            condition: 'sunny',
            icon: 'sun'
          },
          {
            date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
            temperature: { min: 26, max: 33 },
            humidity: 45,
            rainfall: 0,
            windSpeed: 6,
            condition: 'sunny',
            icon: 'sun'
          },
          {
            date: new Date(Date.now() + 345600000).toISOString().split('T')[0],
            temperature: { min: 23, max: 29 },
            humidity: 75,
            rainfall: 5,
            windSpeed: 12,
            condition: 'cloudy',
            icon: 'clouds'
          }
        ],
        alerts: [
          {
            type: 'rainfall',
            severity: 'moderate',
            message: language === 'hi' ? 
              'अगले 24 घंटों में भारी बारिश की संभावना है' : 
              'Heavy rainfall expected in next 24 hours',
            validUntil: new Date(Date.now() + 86400000).toISOString()
          },
          {
            type: 'wind',
            severity: 'low',
            message: language === 'hi' ? 
              'तेज हवाएं - छिड़काव से बचें' : 
              'High winds - avoid spraying',
            validUntil: new Date(Date.now() + 43200000).toISOString()
          }
        ],
        soilConditions: {
          moisture: 45,
          temperature: 25,
          ph: 6.8
        }
      };

      setWeatherData(mockWeatherData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'cloudy':
      case 'partly-cloudy':
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      case 'stormy':
        return <Zap className="h-8 w-8 text-purple-500" />;
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  const getUVLevel = (uvIndex: number) => {
    if (uvIndex <= 2) return { level: t.low, color: 'text-green-600' };
    if (uvIndex <= 5) return { level: t.moderate, color: 'text-yellow-600' };
    if (uvIndex <= 7) return { level: t.high, color: 'text-orange-600' };
    if (uvIndex <= 10) return { level: t.veryHigh, color: 'text-red-600' };
    return { level: t.extreme, color: 'text-purple-600' };
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'border-green-200 bg-green-50 text-green-800';
      case 'moderate': return 'border-orange-200 bg-orange-50 text-orange-800';
      case 'high': return 'border-red-200 bg-red-50 text-red-800';
      default: return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  const getFarmingRecommendations = () => {
    if (!weatherData) return [];
    
    const recommendations = [];
    const current = weatherData.current;
    
    if (current.rainfall > 10) {
      recommendations.push({
        type: 'warning',
        message: t.avoidFieldWork,
        icon: <AlertTriangle className="h-4 w-4" />
      });
    } else if (weatherData.soilConditions.moisture < 30) {
      recommendations.push({
        type: 'info',
        message: t.irrigationRecommended,
        icon: <Droplets className="h-4 w-4" />
      });
    }
    
    if (current.windSpeed < 10 && current.humidity < 70) {
      recommendations.push({
        type: 'success',
        message: t.goodForSpraying,
        icon: <TrendingUp className="h-4 w-4" />
      });
    }
    
    return recommendations;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-orange-500" />
          <p className="text-muted-foreground mb-4">
            {language === 'hi' ? 'मौसम डेटा लोड करने में त्रुटि' : 'Error loading weather data'}
          </p>
          <Button onClick={fetchWeatherData}>
            {t.refreshData}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const chartData = weatherData.forecast.map(day => ({
    date: new Date(day.date).toLocaleDateString('en', { weekday: 'short' }),
    temperature: (day.temperature.min + day.temperature.max) / 2,
    rainfall: day.rainfall,
    humidity: day.humidity
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1>{t.title}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {location?.name || t.locationNotSet}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchWeatherData}>
            <TrendingUp className="h-4 w-4 mr-2" />
            {t.refreshData}
          </Button>
        </div>
      </motion.div>

      <Tabs defaultValue="current" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="current">{t.currentWeather}</TabsTrigger>
          <TabsTrigger value="forecast">{t.forecast}</TabsTrigger>
          <TabsTrigger value="soil">{t.soilConditions}</TabsTrigger>
          <TabsTrigger value="alerts">{t.weatherAlerts}</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          {/* Current Weather Overview */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  {getWeatherIcon(weatherData.current.condition)}
                  <div>
                    <div className="text-4xl font-bold">{weatherData.current.temperature}°C</div>
                    <div className="text-muted-foreground capitalize">{weatherData.current.condition}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">{t.feelsLike}</div>
                  <div className="text-2xl font-semibold">{weatherData.current.temperature + 2}°C</div>
                </div>
              </div>

              {/* Weather Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Droplets className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                  <div className="text-sm text-muted-foreground">{t.humidity}</div>
                  <div className="font-semibold">{weatherData.current.humidity}%</div>
                </div>
                
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <Wind className="h-5 w-5 text-green-500 mx-auto mb-1" />
                  <div className="text-sm text-muted-foreground">{t.windSpeed}</div>
                  <div className="font-semibold">{weatherData.current.windSpeed} km/h</div>
                </div>
                
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <Eye className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                  <div className="text-sm text-muted-foreground">{t.visibility}</div>
                  <div className="font-semibold">{weatherData.current.visibility} km</div>
                </div>
                
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <Sun className="h-5 w-5 text-orange-500 mx-auto mb-1" />
                  <div className="text-sm text-muted-foreground">{t.uvIndex}</div>
                  <div className={`font-semibold ${getUVLevel(weatherData.current.uvIndex).color}`}>
                    {weatherData.current.uvIndex}
                  </div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Thermometer className="h-5 w-5 text-gray-500 mx-auto mb-1" />
                  <div className="text-sm text-muted-foreground">{t.pressure}</div>
                  <div className="font-semibold">{weatherData.current.pressure} hPa</div>
                </div>
                
                <div className="text-center p-3 bg-cyan-50 rounded-lg">
                  <CloudRain className="h-5 w-5 text-cyan-500 mx-auto mb-1" />
                  <div className="text-sm text-muted-foreground">{t.rainfall}</div>
                  <div className="font-semibold">{weatherData.current.rainfall} mm</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Farming Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'hi' ? 'कृषि सिफारिशें' : 'Farming Recommendations'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getFarmingRecommendations().map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      rec.type === 'warning' ? 'border-red-200 bg-red-50' :
                      rec.type === 'info' ? 'border-blue-200 bg-blue-50' :
                      'border-green-200 bg-green-50'
                    }`}
                  >
                    {rec.icon}
                    <span className="text-sm font-medium">{rec.message}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-6">
          {/* Forecast Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'hi' ? '5-दिन का पूर्वानुमान' : '5-Day Forecast'}</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={selectedMetric === 'temperature' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedMetric('temperature')}
                >
                  {t.temperature}
                </Button>
                <Button
                  variant={selectedMetric === 'rainfall' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedMetric('rainfall')}
                >
                  {t.rainfall}
                </Button>
                <Button
                  variant={selectedMetric === 'humidity' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedMetric('humidity')}
                >
                  {t.humidity}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey={selectedMetric}
                      stroke={selectedMetric === 'temperature' ? '#f59e0b' : selectedMetric === 'rainfall' ? '#3b82f6' : '#10b981'}
                      fill={selectedMetric === 'temperature' ? '#fef3c7' : selectedMetric === 'rainfall' ? '#dbeafe' : '#d1fae5'}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Daily Forecast Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {weatherData.forecast.map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm font-medium mb-2">
                      {index === 0 ? t.today : index === 1 ? t.tomorrow : 
                       new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                    </div>
                    <div className="flex justify-center mb-2">
                      {getWeatherIcon(day.condition)}
                    </div>
                    <div className="text-lg font-bold mb-1">
                      {day.temperature.max}°/{day.temperature.min}°
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {day.rainfall}mm
                    </div>
                    <div className="flex justify-center items-center gap-1 text-xs">
                      <Droplets className="h-3 w-3" />
                      {day.humidity}%
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="soil" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  {t.soilMoisture}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {weatherData.soilConditions.moisture}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${weatherData.soilConditions.moisture}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {weatherData.soilConditions.moisture > 60 ? 
                      (language === 'hi' ? 'अच्छी नमी' : 'Good moisture') :
                      weatherData.soilConditions.moisture > 30 ?
                      (language === 'hi' ? 'मध्यम नमी' : 'Moderate moisture') :
                      (language === 'hi' ? 'कम नमी - सिंचाई की आवश्यकता' : 'Low moisture - irrigation needed')
                    }
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-orange-500" />
                  {t.soilTemp}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {weatherData.soilConditions.temperature}°C
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {weatherData.soilConditions.temperature > 25 ?
                      (language === 'hi' ? 'गर्म मिट्टी' : 'Warm soil') :
                      weatherData.soilConditions.temperature > 15 ?
                      (language === 'hi' ? 'सामान्य तापमान' : 'Normal temperature') :
                      (language === 'hi' ? 'ठंडी मिट्टी' : 'Cool soil')
                    }
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  {t.soilPH}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {weatherData.soilConditions.ph}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {weatherData.soilConditions.ph >= 6.0 && weatherData.soilConditions.ph <= 7.0 ?
                      (language === 'hi' ? 'आदर्श pH स्तर' : 'Ideal pH level') :
                      weatherData.soilConditions.ph < 6.0 ?
                      (language === 'hi' ? 'अम्लीय मिट्टी' : 'Acidic soil') :
                      (language === 'hi' ? 'क्षारीय मिट्टी' : 'Alkaline soil')
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {weatherData.alerts.length > 0 ? (
            weatherData.alerts.map((alert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`border-l-4 ${getAlertSeverityColor(alert.severity)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium mb-1">
                          {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Alert
                        </div>
                        <p className="text-sm mb-2">{alert.message}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {language === 'hi' ? 'वैध तक: ' : 'Valid until: '}
                          {new Date(alert.validUntil).toLocaleString()}
                        </div>
                      </div>
                      <Badge className={getAlertSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p className="text-muted-foreground">
                  {language === 'hi' ? 'कोई मौसम अलर्ट नहीं' : 'No weather alerts'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}