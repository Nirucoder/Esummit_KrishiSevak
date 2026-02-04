import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { ScrollArea } from './ui/scroll-area';
import { 
  Activity, 
  Thermometer, 
  Droplets, 
  Gauge, 
  Battery, 
  Wifi, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Camera,
  Zap,
  Wind,
  Sun,
  Eye,
  Settings,
  TrendingUp,
  MapPin,
  RefreshCw,
  Download,
  Bell,
  BrainCircuit
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { hardwareDataService, SensorData, SoilSensorData, WeatherSensorData, CropSensorData, RealTimeAlert, DeviceConfiguration } from '../services/HardwareDataService';
import { getContent } from '../utils/languages';

interface HardwareDashboardProps {
  language: string;
}

export function HardwareDashboard({ language }: HardwareDashboardProps) {
  const [currentData, setCurrentData] = useState<SensorData[]>([]);
  const [historicalData, setHistoricalData] = useState<SensorData[]>([]);
  const [alerts, setAlerts] = useState<RealTimeAlert[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [mlTrainingStatus, setMlTrainingStatus] = useState<'idle' | 'preparing' | 'training' | 'completed'>('idle');

  useEffect(() => {
    loadData();
    
    // Set up real-time updates
    const interval = setInterval(loadCurrentData, 30000); // Update every 30 seconds
    
    // Set up alert listener
    hardwareDataService.onAlert(handleNewAlert);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    loadHistoricalData();
  }, [selectedTimeRange]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadCurrentData(),
        loadHistoricalData()
      ]);
    } catch (error) {
      console.error('Error loading hardware data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCurrentData = async () => {
    try {
      const data = await hardwareDataService.getCurrentSensorData('farm-demo-001');
      setCurrentData(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading current data:', error);
    }
  };

  const loadHistoricalData = async () => {
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const daysBack = selectedTimeRange === '24h' ? 1 : selectedTimeRange === '7d' ? 7 : 30;
      const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const data = await hardwareDataService.getHistoricalData('farm-demo-001', { start: startDate, end: endDate });
      setHistoricalData(data);
    } catch (error) {
      console.error('Error loading historical data:', error);
    }
  };

  const handleNewAlert = (alert: RealTimeAlert) => {
    setAlerts(prev => [alert, ...prev.slice(0, 9)]); // Keep last 10 alerts
  };

  const triggerMLRetraining = async () => {
    setMlTrainingStatus('preparing');
    
    try {
      const success = await hardwareDataService.triggerMLModelRetraining('farm-demo-001');
      if (success) {
        setMlTrainingStatus('training');
        
        // Simulate training progress
        setTimeout(() => {
          setMlTrainingStatus('completed');
          setTimeout(() => setMlTrainingStatus('idle'), 5000);
        }, 10000);
      } else {
        setMlTrainingStatus('idle');
      }
    } catch (error) {
      console.error('Error triggering ML retraining:', error);
      setMlTrainingStatus('idle');
    }
  };

  const getDeviceStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'offline': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getSensorIcon = (sensorType: string) => {
    switch (sensorType) {
      case 'soil': return <Gauge className="h-5 w-5" />;
      case 'weather': return <Sun className="h-5 w-5" />;
      case 'crop': return <Activity className="h-5 w-5" />;
      case 'water': return <Droplets className="h-5 w-5" />;
      case 'camera': return <Camera className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const formatChartData = (data: SensorData[], parameter: string) => {
    return data
      .filter(d => d.sensorType === 'soil' || d.sensorType === 'weather')
      .map(d => ({
        time: new Date(d.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        timestamp: d.timestamp,
        value: getParameterFromData(d, parameter),
        deviceId: d.deviceId
      }))
      .filter(d => d.value !== undefined)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const getParameterFromData = (data: SensorData, parameter: string): number | undefined => {
    switch (parameter) {
      case 'soilMoisture':
        return data.sensorType === 'soil' ? (data as SoilSensorData).data.moisture : undefined;
      case 'soilTemperature':
        return data.sensorType === 'soil' ? (data as SoilSensorData).data.temperature : undefined;
      case 'soilPH':
        return data.sensorType === 'soil' ? (data as SoilSensorData).data.ph : undefined;
      case 'airTemperature':
        return data.sensorType === 'weather' ? (data as WeatherSensorData).data.temperature : undefined;
      case 'humidity':
        return data.sensorType === 'weather' ? (data as WeatherSensorData).data.humidity : undefined;
      case 'rainfall':
        return data.sensorType === 'weather' ? (data as WeatherSensorData).data.rainfall : undefined;
      default:
        return undefined;
    }
  };

  const getLatestValue = (sensorType: string, parameter: string): number | undefined => {
    const latestData = currentData
      .filter(d => d.sensorType === sensorType)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    
    if (!latestData) return undefined;
    return getParameterFromData(latestData, parameter);
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Device Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentData.map((sensor, index) => (
          <Card key={`${sensor.deviceId}-${index}`} className="card-farmer">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getSensorIcon(sensor.sensorType)}
                  <CardTitle className="text-lg">{sensor.sensorType.charAt(0).toUpperCase() + sensor.sensorType.slice(1)}</CardTitle>
                </div>
                {getDeviceStatusIcon(sensor.status)}
              </div>
              <CardDescription className="text-sm">{sensor.deviceId}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Battery className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      {language === 'en' ? 'Battery' : getContent(language, 'battery')}
                    </span>
                  </div>
                  <Badge variant={sensor.batteryLevel > 50 ? 'default' : sensor.batteryLevel > 20 ? 'secondary' : 'destructive'}>
                    {sensor.batteryLevel}%
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      {language === 'en' ? 'Signal' : getContent(language, 'signal')}
                    </span>
                  </div>
                  <Badge variant={sensor.signalStrength > 70 ? 'default' : 'secondary'}>
                    {Math.round(sensor.signalStrength)}%
                  </Badge>
                </div>

                <div className="text-xs text-muted-foreground">
                  {language === 'en' ? 'Last update:' : getContent(language, 'lastUpdate')} {' '}
                  {new Date(sensor.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Current Readings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="card-farmer section-soil">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5" />
              {language === 'en' ? 'Soil Moisture' : getContent(language, 'soilMoisture')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-blue-600">
              {getLatestValue('soil', 'soilMoisture')?.toFixed(1) || '--'}%
            </div>
            <Progress value={getLatestValue('soil', 'soilMoisture') || 0} className="mt-2" />
            <p className="text-sm text-muted-foreground mt-1">
              {language === 'en' ? 'Optimal range: 40-60%' : getContent(language, 'optimalRange')}
            </p>
          </CardContent>
        </Card>

        <Card className="card-farmer section-weather">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5" />
              {language === 'en' ? 'Temperature' : getContent(language, 'temperature')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-orange-600">
              {getLatestValue('weather', 'airTemperature')?.toFixed(1) || '--'}°C
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              Soil: {getLatestValue('soil', 'soilTemperature')?.toFixed(1) || '--'}°C
            </div>
          </CardContent>
        </Card>

        <Card className="card-farmer section-soil">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              {language === 'en' ? 'Soil pH' : getContent(language, 'soilPH')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-green-600">
              {getLatestValue('soil', 'soilPH')?.toFixed(1) || '--'}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {language === 'en' ? 'Optimal range: 6.0-7.5' : getContent(language, 'optimalRange')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Alerts */}
      {alerts.length > 0 && (
        <Card className="card-farmer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              {language === 'en' ? 'Real-time Alerts' : getContent(language, 'realTimeAlerts')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {alerts.slice(0, 5).map((alert, index) => (
                  <Alert key={alert.id} className={`
                    ${alert.severity === 'critical' ? 'border-red-500 bg-red-50' : 
                      alert.severity === 'high' ? 'border-orange-500 bg-orange-50' : 
                      'border-yellow-500 bg-yellow-50'}
                  `}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{alert.message}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                          {alert.severity}
                        </Badge>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* ML Training Status */}
      <Card className="card-farmer">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5" />
            {language === 'en' ? 'AI Model Training' : getContent(language, 'aiModelTraining')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {language === 'en' ? 'Status:' : getContent(language, 'status')} 
                <span className={`ml-2 font-medium ${
                  mlTrainingStatus === 'training' ? 'text-blue-600' :
                  mlTrainingStatus === 'completed' ? 'text-green-600' :
                  'text-gray-600'
                }`}>
                  {mlTrainingStatus === 'idle' && (language === 'en' ? 'Ready' : 'तैयार')}
                  {mlTrainingStatus === 'preparing' && (language === 'en' ? 'Preparing Data...' : 'डेटा तैयार कर रहे हैं...')}
                  {mlTrainingStatus === 'training' && (language === 'en' ? 'Training Model...' : 'मॉडल प्रशिक्षण...')}
                  {mlTrainingStatus === 'completed' && (language === 'en' ? 'Training Complete!' : 'प्रशिक्षण पूर्ण!')}
                </span>
              </p>
              {mlTrainingStatus === 'training' && (
                <Progress value={65} className="mt-2 w-48" />
              )}
            </div>
            <Button 
              onClick={triggerMLRetraining}
              disabled={mlTrainingStatus !== 'idle'}
              className="farmer-primary-action"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${mlTrainingStatus === 'training' ? 'animate-spin' : ''}`} />
              {language === 'en' ? 'Retrain Model' : 'मॉडल पुनः प्रशिक्षण'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderChartsTab = () => (
    <div className="space-y-6">
      <div className="flex gap-2 mb-4">
        {['24h', '7d', '30d'].map((range) => (
          <Button
            key={range}
            variant={selectedTimeRange === range ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeRange(range)}
          >
            {range}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Soil Moisture Chart */}
        <Card className="card-farmer">
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Soil Moisture Trend' : getContent(language, 'soilMoistureTrend')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={formatChartData(historicalData, 'soilMoisture')}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [`${value?.toFixed(1)}%`, 'Moisture']}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Temperature Chart */}
        <Card className="card-farmer">
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Temperature Trend' : getContent(language, 'temperatureTrend')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formatChartData(historicalData, 'airTemperature')}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [`${value?.toFixed(1)}°C`, 'Temperature']}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} name="Air Temp" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* pH Level Chart */}
        <Card className="card-farmer">
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Soil pH Level' : getContent(language, 'soilPHLevel')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formatChartData(historicalData, 'soilPH')}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[5, 9]} />
                <Tooltip 
                  formatter={(value: any) => [value?.toFixed(1), 'pH']}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Humidity Chart */}
        <Card className="card-farmer">
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Humidity Level' : getContent(language, 'humidityLevel')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={formatChartData(historicalData, 'humidity')}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [`${value?.toFixed(1)}%`, 'Humidity']}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Area type="monotone" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderDevicesTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {currentData.map((sensor, index) => (
          <Card key={`${sensor.deviceId}-details-${index}`} className="card-farmer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getSensorIcon(sensor.sensorType)}
                  <div>
                    <CardTitle>{sensor.deviceId}</CardTitle>
                    <CardDescription>
                      {sensor.sensorType.charAt(0).toUpperCase() + sensor.sensorType.slice(1)} Sensor
                    </CardDescription>
                  </div>
                </div>
                {getDeviceStatusIcon(sensor.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Location */}
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {sensor.location.lat.toFixed(4)}, {sensor.location.lng.toFixed(4)}
                  </span>
                </div>

                {/* Sensor-specific data */}
                {sensor.sensorType === 'soil' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-semibold text-blue-600">
                        {(sensor as SoilSensorData).data.moisture.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Moisture</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-semibold text-green-600">
                        {(sensor as SoilSensorData).data.ph.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600">pH</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-semibold text-orange-600">
                        {(sensor as SoilSensorData).data.temperature.toFixed(1)}°C
                      </div>
                      <div className="text-sm text-gray-600">Temperature</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-semibold text-purple-600">
                        {(sensor as SoilSensorData).data.nitrogen.toFixed(0)}
                      </div>
                      <div className="text-sm text-gray-600">Nitrogen (ppm)</div>
                    </div>
                  </div>
                )}

                {sensor.sensorType === 'weather' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-semibold text-orange-600">
                        {(sensor as WeatherSensorData).data.temperature.toFixed(1)}°C
                      </div>
                      <div className="text-sm text-gray-600">Temperature</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-semibold text-blue-600">
                        {(sensor as WeatherSensorData).data.humidity.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Humidity</div>
                    </div>
                    <div className="text-center p-3 bg-cyan-50 rounded-lg">
                      <div className="text-2xl font-semibold text-cyan-600">
                        {(sensor as WeatherSensorData).data.windSpeed.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600">Wind (km/h)</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-semibold text-yellow-600">
                        {(sensor as WeatherSensorData).data.solarRadiation.toFixed(0)}
                      </div>
                      <div className="text-sm text-gray-600">Solar (W/m²)</div>
                    </div>
                  </div>
                )}

                {/* Device status info */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center text-sm">
                    <span>Last reading:</span>
                    <span>{new Date(sensor.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span>Battery level:</span>
                    <Badge variant={sensor.batteryLevel > 50 ? 'default' : 'secondary'}>
                      {sensor.batteryLevel}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span>Signal strength:</span>
                    <Badge variant={sensor.signalStrength > 70 ? 'default' : 'secondary'}>
                      {Math.round(sensor.signalStrength)}%
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-green-600" />
          <p className="text-muted-foreground">
            {language === 'en' ? 'Loading hardware data...' : 'हार्डवेयर डेटा लोड हो रहा है...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-green-700">
            {language === 'en' ? 'Real-time Hardware Monitoring' : 'वास्तविक समय हार्डवेयर निगरानी'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'en' 
              ? 'Live data from your field sensors and IoT devices' 
              : 'आपके खेत के सेंसर और IoT उपकरणों से लाइव डेटा'
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {language === 'en' ? 'Live' : 'लाइव'}
          </Badge>
          <Button variant="outline" size="sm" onClick={loadData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {language === 'en' ? 'Refresh' : 'रीफ्रेश'}
          </Button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        {language === 'en' ? 'Last updated:' : 'अंतिम अद्यतन:'} {lastUpdate.toLocaleString()}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            {language === 'en' ? 'Overview' : 'सिंहावलोकन'}
          </TabsTrigger>
          <TabsTrigger value="charts">
            {language === 'en' ? 'Charts' : 'चार्ट'}
          </TabsTrigger>
          <TabsTrigger value="devices">
            {language === 'en' ? 'Devices' : 'उपकरण'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {renderOverviewTab()}
        </TabsContent>

        <TabsContent value="charts">
          {renderChartsTab()}
        </TabsContent>

        <TabsContent value="devices">
          {renderDevicesTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
}