import React from 'react';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ExcelExportProps {
  data: any[];
  filename: string;
  sheetName?: string;
  language?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export function ExcelExport({ 
  data, 
  filename, 
  sheetName = 'Sheet1', 
  language = 'en',
  variant = 'outline',
  size = 'sm',
  className = ''
}: ExcelExportProps) {
  const content = {
    en: {
      exportToExcel: 'Export to Excel',
      downloading: 'Downloading...'
    },
    hi: {
      exportToExcel: 'Excel में एक्सपोर्ट करें',
      downloading: 'डाउनलोड हो रहा है...'
    }
  };

  const t = content[language as keyof typeof content] || content.en;

  const exportToExcel = () => {
    try {
      // Create a new workbook
      const workbook = XLSX.utils.book_new();

      // Convert data to worksheet
      const worksheet = XLSX.utils.json_to_sheet(data);

      // Set column widths
      const colWidths = Object.keys(data[0] || {}).map(() => ({ wch: 15 }));
      worksheet['!cols'] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      // Generate Excel file and trigger download
      const excelBuffer = XLSX.write(workbook, { 
        bookType: 'xlsx', 
        type: 'array' 
      });

      const blob = new Blob([excelBuffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={exportToExcel}
      className={`gap-2 ${className}`}
      disabled={!data || data.length === 0}
    >
      <Download className="h-4 w-4" />
      {t.exportToExcel}
    </Button>
  );
}

// Utility functions for different data types
export const createYieldData = (yieldData: any[], language: string = 'en') => {
  return yieldData.map(item => ({
    [language === 'hi' ? 'तारीख' : 'Date']: item.date,
    [language === 'hi' ? 'फसल' : 'Crop']: item.crop,
    [language === 'hi' ? 'उत्पादन (टन)' : 'Yield (tons)']: item.yield,
    [language === 'hi' ? 'क्षेत्र (हेक्टेयर)' : 'Area (hectares)']: item.area,
    [language === 'hi' ? 'गुणवत्ता स्कोर' : 'Quality Score']: item.qualityScore,
    [language === 'hi' ? 'मूल्य (₹/टन)' : 'Price (₹/ton)']: item.price
  }));
};

export const createSoilData = (soilData: any[], language: string = 'en') => {
  return soilData.map(item => ({
    [language === 'hi' ? 'तारीख' : 'Date']: item.date,
    [language === 'hi' ? 'pH स्तर' : 'pH Level']: item.ph,
    [language === 'hi' ? 'नाइट्रोजन (ppm)' : 'Nitrogen (ppm)']: item.nitrogen,
    [language === 'hi' ? 'फास्फोरस (ppm)' : 'Phosphorus (ppm)']: item.phosphorus,
    [language === 'hi' ? 'पोटैशियम (ppm)' : 'Potassium (ppm)']: item.potassium,
    [language === 'hi' ? 'कार्बनिक पदार्थ (%)' : 'Organic Matter (%)']: item.organicMatter,
    [language === 'hi' ? 'नमी (%)' : 'Moisture (%)']: item.moisture
  }));
};

export const createWeatherData = (weatherData: any[], language: string = 'en') => {
  return weatherData.map(item => ({
    [language === 'hi' ? 'तारीख' : 'Date']: item.date,
    [language === 'hi' ? 'तापमान (°C)' : 'Temperature (°C)']: item.temperature,
    [language === 'hi' ? 'आर्द्रता (%)' : 'Humidity (%)']: item.humidity,
    [language === 'hi' ? 'वर्षा (mm)' : 'Rainfall (mm)']: item.rainfall,
    [language === 'hi' ? 'हवा की गति (km/h)' : 'Wind Speed (km/h)']: item.windSpeed,
    [language === 'hi' ? 'मिट्टी की नमी (%)' : 'Soil Moisture (%)']: item.soilMoisture
  }));
};

export const createSatelliteData = (satelliteData: any[], language: string = 'en') => {
  return satelliteData.map(item => ({
    [language === 'hi' ? 'तारीख' : 'Date']: item.date,
    [language === 'hi' ? 'NDVI मान' : 'NDVI Value']: item.ndvi,
    [language === 'hi' ? 'फसल स्वास्थ्य' : 'Crop Health']: item.cropHealth,
    [language === 'hi' ? 'तनाव स्तर' : 'Stress Level']: item.stressLevel,
    [language === 'hi' ? 'सिंचाई आवश्यकता' : 'Irrigation Need']: item.irrigationNeed,
    [language === 'hi' ? 'रोग संकेत' : 'Disease Indicators']: item.diseaseIndicators
  }));
};

export const createRecommendationData = (recommendations: any[], language: string = 'en') => {
  return recommendations.map(item => ({
    [language === 'hi' ? 'तारीख' : 'Date']: item.date,
    [language === 'hi' ? 'सिफारिश प्रकार' : 'Recommendation Type']: item.type,
    [language === 'hi' ? 'प्राथमिकता' : 'Priority']: item.priority,
    [language === 'hi' ? 'विवरण' : 'Description']: item.description,
    [language === 'hi' ? 'कार्य' : 'Action']: item.action,
    [language === 'hi' ? 'समयसीमा' : 'Timeline']: item.timeline,
    [language === 'hi' ? 'स्थिति' : 'Status']: item.status
  }));
};

export const createSchemeData = (schemes: any[], language: string = 'en') => {
  return schemes.map(item => ({
    [language === 'hi' ? 'योजना नाम' : 'Scheme Name']: item.name,
    [language === 'hi' ? 'पूरा नाम' : 'Full Name']: item.fullName,
    [language === 'hi' ? 'लाभ' : 'Benefit']: item.benefit,
    [language === 'hi' ? 'पात्रता' : 'Eligibility']: item.eligibility,
    [language === 'hi' ? 'श्रेणी' : 'Category']: item.category,
    [language === 'hi' ? 'आवेदन स्थिति' : 'Application Status']: item.applicationStatus,
    [language === 'hi' ? 'अंतिम भुगतान' : 'Last Payment']: item.lastPayment
  }));
};