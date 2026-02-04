import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  MapPin, 
  Navigation, 
  Search, 
  CheckCircle,
  AlertCircle,
  Loader,
  Target
} from 'lucide-react';
import { motion } from 'motion/react';

interface LocationManagerProps {
  language: string;
  onLocationUpdate?: (location: any) => void;
}

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  district: string;
  state: string;
  accuracy?: number;
  source: 'gps' | 'manual' | 'search';
}

export function LocationManager({ language, onLocationUpdate }: LocationManagerProps) {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [manualCoords, setManualCoords] = useState({ lat: '', lng: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const content = {
    en: {
      title: 'Farm Location',
      subtitle: 'Set your farm location for accurate weather and satellite data',
      currentLocation: 'Current Location',
      gpsLocation: 'Use GPS Location',
      manualLocation: 'Manual Entry',
      searchLocation: 'Search Location',
      latitude: 'Latitude',
      longitude: 'Longitude',
      searchPlaceholder: 'Search for your location...',
      getGPS: 'Get GPS Location',
      saveLocation: 'Save Location',
      searchBtn: 'Search',
      accuracy: 'Accuracy',
      meters: 'meters',
      locationSaved: 'Location saved successfully',
      gpsNotSupported: 'GPS not supported in this browser',
      gpsError: 'Unable to get GPS location',
      invalidCoords: 'Please enter valid coordinates',
      district: 'District',
      state: 'State',
      gpsSource: 'GPS',
      manualSource: 'Manual',
      searchSource: 'Search',
      detecting: 'Detecting location...',
      searching: 'Searching...'
    },
    hi: {
      title: 'खेत का स्थान',
      subtitle: 'सटीक मौसम और उपग्रह डेटा के लिए अपने खेत का स्थान निर्धारित करें',
      currentLocation: 'वर्तमान स्थान',
      gpsLocation: 'GPS स्थान का उपयोग करें',
      manualLocation: 'मैन्युअल एंट्री',
      searchLocation: 'स्थान खोजें',
      latitude: 'अक्षांश',
      longitude: 'देशांतर',
      searchPlaceholder: 'अपना स्थान खोजें...',
      getGPS: 'GPS स्थान प्राप्त करें',
      saveLocation: 'स्थान सेव करें',
      searchBtn: 'खोजें',
      accuracy: 'सटीकता',
      meters: 'मीटर',
      locationSaved: 'स्थान सफलतापूर्वक सेव किया गया',
      gpsNotSupported: 'इस ब्राउज़र में GPS समर्थित नहीं है',
      gpsError: 'GPS स्थान प्राप्त करने में असमर्थ',
      invalidCoords: 'कृपया वैध निर्देशांक दर्ज करें',
      district: 'जिला',
      state: 'राज्य',
      gpsSource: 'GPS',
      manualSource: 'मैन्युअल',
      searchSource: 'खोज',
      detecting: 'स्थान का पता लगा रहे हैं...',
      searching: 'खोज रहे हैं...'
    }
  };

  const t = content[language as keyof typeof content] || content.en;

  // Mock reverse geocoding function
  const reverseGeocode = async (lat: number, lng: number): Promise<Partial<LocationData>> => {
    // In a real app, this would call a geocoding API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          address: `Farm Location ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          district: 'Pune',
          state: 'Maharashtra'
        });
      }, 1000);
    });
  };

  const getGPSLocation = () => {
    if (!navigator.geolocation) {
      setError(t.gpsNotSupported);
      return;
    }

    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        try {
          const geoData = await reverseGeocode(latitude, longitude);
          
          const locationData: LocationData = {
            latitude,
            longitude,
            accuracy,
            source: 'gps',
            address: geoData.address || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            district: geoData.district || 'Unknown',
            state: geoData.state || 'Unknown'
          };

          setCurrentLocation(locationData);
          onLocationUpdate?.(locationData);
          setLoading(false);
        } catch (err) {
          setError(t.gpsError);
          setLoading(false);
        }
      },
      (error) => {
        setError(t.gpsError);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const saveManualLocation = async () => {
    const lat = parseFloat(manualCoords.lat);
    const lng = parseFloat(manualCoords.lng);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setError(t.invalidCoords);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const geoData = await reverseGeocode(lat, lng);
      
      const locationData: LocationData = {
        latitude: lat,
        longitude: lng,
        source: 'manual',
        address: geoData.address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        district: geoData.district || 'Unknown',
        state: geoData.state || 'Unknown'
      };

      setCurrentLocation(locationData);
      onLocationUpdate?.(locationData);
      setLoading(false);
    } catch (err) {
      setError('Failed to process location');
      setLoading(false);
    }
  };

  const searchLocation = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');

    // Mock search function - in real app would use geocoding API
    setTimeout(async () => {
      try {
        // Mock search results - would normally search for real places
        const mockResults = [
          { lat: 18.5204, lng: 73.8567, name: 'Pune, Maharashtra' },
          { lat: 19.0760, lng: 72.8777, name: 'Mumbai, Maharashtra' },
          { lat: 28.7041, lng: 77.1025, name: 'Delhi' }
        ];

        const result = mockResults.find(r => 
          r.name.toLowerCase().includes(searchQuery.toLowerCase())
        ) || mockResults[0];

        const geoData = await reverseGeocode(result.lat, result.lng);
        
        const locationData: LocationData = {
          latitude: result.lat,
          longitude: result.lng,
          source: 'search',
          address: result.name,
          district: geoData.district || 'Unknown',
          state: geoData.state || 'Unknown'
        };

        setCurrentLocation(locationData);
        onLocationUpdate?.(locationData);
        setLoading(false);
      } catch (err) {
        setError('Search failed');
        setLoading(false);
      }
    }, 1500);
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'gps':
        return <Navigation className="h-4 w-4 text-blue-500" />;
      case 'manual':
        return <Target className="h-4 w-4 text-orange-500" />;
      case 'search':
        return <Search className="h-4 w-4 text-green-500" />;
      default:
        return <MapPin className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              {t.title}
            </CardTitle>
            <CardDescription>{t.subtitle}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Location Display */}
            {currentLocation && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800">{t.currentLocation}</h4>
                      <p className="text-sm text-green-700 mt-1">{currentLocation.address}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-green-600">
                          {t.latitude}: {currentLocation.latitude.toFixed(6)}
                        </span>
                        <span className="text-xs text-green-600">
                          {t.longitude}: {currentLocation.longitude.toFixed(6)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="border-green-200 text-green-700">
                          {getSourceIcon(currentLocation.source)}
                          <span className="ml-1">{t[`${currentLocation.source}Source` as keyof typeof t]}</span>
                        </Badge>
                        {currentLocation.accuracy && (
                          <Badge variant="outline" className="border-blue-200 text-blue-700">
                            {t.accuracy}: {Math.round(currentLocation.accuracy)} {t.meters}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* GPS Location */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Navigation className="h-4 w-4 text-blue-500" />
                {t.gpsLocation}
              </h4>
              <Button 
                onClick={getGPSLocation} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    {t.detecting}
                  </>
                ) : (
                  <>
                    <Navigation className="h-4 w-4 mr-2" />
                    {t.getGPS}
                  </>
                )}
              </Button>
            </div>

            {/* Manual Entry */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-orange-500" />
                {t.manualLocation}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">{t.latitude}</Label>
                  <Input
                    id="latitude"
                    value={manualCoords.lat}
                    onChange={(e) => setManualCoords(prev => ({ ...prev, lat: e.target.value }))}
                    placeholder="18.5204"
                    type="number"
                    step="any"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">{t.longitude}</Label>
                  <Input
                    id="longitude"
                    value={manualCoords.lng}
                    onChange={(e) => setManualCoords(prev => ({ ...prev, lng: e.target.value }))}
                    placeholder="73.8567"
                    type="number"
                    step="any"
                  />
                </div>
              </div>
              <Button 
                onClick={saveManualLocation} 
                disabled={loading || !manualCoords.lat || !manualCoords.lng}
                variant="outline"
                className="w-full"
              >
                <Target className="h-4 w-4 mr-2" />
                {t.saveLocation}
              </Button>
            </div>

            {/* Search Location */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Search className="h-4 w-4 text-green-500" />
                {t.searchLocation}
              </h4>
              <div className="flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
                />
                <Button 
                  onClick={searchLocation}
                  disabled={loading || !searchQuery.trim()}
                  variant="outline"
                >
                  {loading ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}