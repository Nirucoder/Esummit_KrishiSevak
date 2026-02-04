import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  Building2, 
  CheckCircle, 
  Clock, 
  Phone,
  FileText,
  CreditCard,
  Shield,
  TrendingUp,
  User,
  MapPin,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';
import { getContent } from '../utils/languages';

interface GovernmentSchemesScreenProps {
  language: string;
}

// Mock data for schemes
const schemes = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN',
    fullName: 'Pradhan Mantri Kisan Samman Nidhi',
    description: 'Income support of ₹6,000 per year to small and marginal farmers',
    benefit: '₹6,000/year',
    eligibility: 'Small & marginal farmers with landholding up to 2 hectares',
    status: 'eligible',
    category: 'income-support',
    documents: ['Aadhaar Card', 'Land Records', 'Bank Details'],
    applicationStatus: 'approved',
    lastPayment: '₹2,000 - March 2024'
  },
  {
    id: 'pm-fasal-bima',
    name: 'PM Fasal Bima Yojana',
    fullName: 'Pradhan Mantri Fasal Bima Yojana',
    description: 'Crop insurance scheme for farmers against crop losses',
    benefit: 'Up to ₹2,00,000 coverage',
    eligibility: 'All farmers growing notified crops',
    status: 'eligible',
    category: 'insurance',
    documents: ['Aadhaar Card', 'Land Records', 'Crop Details', 'Bank Details'],
    applicationStatus: 'active',
    lastPayment: 'Premium: ₹1,500 - April 2024'
  },
  {
    id: 'kisan-credit-card',
    name: 'Kisan Credit Card',
    fullName: 'Kisan Credit Card Scheme',
    description: 'Credit facility for agriculture and allied activities',
    benefit: 'Credit limit up to ₹3,00,000',
    eligibility: 'All farmers with valid land records',
    status: 'eligible',
    category: 'credit',
    documents: ['Aadhaar Card', 'PAN Card', 'Land Records', 'Income Proof'],
    applicationStatus: 'pending',
    lastPayment: 'Not yet disbursed'
  },
  {
    id: 'pm-kusum',
    name: 'PM-KUSUM',
    fullName: 'PM Kisan Urja Suraksha evam Utthaan Mahabhiyan',
    description: 'Solar power generation and grid connection for farmers',
    benefit: 'Up to 90% subsidy on solar pumps',
    eligibility: 'Farmers with existing grid connection',
    status: 'not-eligible',
    category: 'energy',
    documents: ['Aadhaar Card', 'Land Records', 'Electricity Bill'],
    applicationStatus: 'not-applied',
    lastPayment: 'N/A'
  }
];

const applicationStatuses = [
  { id: 'pm-kisan', scheme: 'PM-KISAN', status: 'approved', progress: 100, nextAction: 'Next payment in June 2024' },
  { id: 'pm-fasal-bima', scheme: 'PM Fasal Bima', status: 'active', progress: 100, nextAction: 'Renew for Kharif season' },
  { id: 'kisan-credit-card', scheme: 'Kisan Credit Card', status: 'pending', progress: 60, nextAction: 'Bank verification pending' }
];

export function GovernmentSchemesScreen({ language }: GovernmentSchemesScreenProps) {
  const [selectedScheme, setSelectedScheme] = useState('');
  const [eligibilityData, setEligibilityData] = useState({
    landSize: '',
    cropType: '',
    income: '',
    location: ''
  });

  const content = {
    en: {
      title: 'Government Schemes',
      subtitle: 'Access government schemes and benefits for farmers',
      availableSchemes: 'Available Schemes',
      eligibilityChecker: 'Eligibility Checker',
      applicationStatus: 'Application Status',
      helplines: 'Helplines & Support',
      incomeSupport: 'Income Support',
      insurance: 'Insurance',
      credit: 'Credit & Loans',
      energy: 'Energy & Solar',
      eligible: 'Eligible',
      notEligible: 'Not Eligible',
      checkEligibility: 'Check Eligibility',
      applyNow: 'Apply Now',
      viewDetails: 'View Details',
      approved: 'Approved',
      pending: 'Pending',
      active: 'Active',
      rejected: 'Rejected',
      notApplied: 'Not Applied',
      benefit: 'Benefit',
      documents: 'Required Documents',
      status: 'Status',
      progress: 'Progress',
      nextAction: 'Next Action',
      landSize: 'Land Size (hectares)',
      cropType: 'Primary Crop',
      annualIncome: 'Annual Income',
      location: 'District/State',
      checkResults: 'Check Results',
      schemeDetails: 'Scheme Details',
      applicationProcess: 'Application Process',
      supportContacts: 'Support Contacts',
      helplineNumber: 'Scheme Helpline: 1800-115-526',
      pmKisanHelpline: 'PM-KISAN Helpline: 155261',
      grievancePortal: 'Grievance Portal: pgportal.gov.in',
      selectScheme: 'Select a scheme to check eligibility',
      eligibilityResult: 'Eligibility Result',
      youAreEligible: 'You are eligible for this scheme!',
      youAreNotEligible: 'You are not eligible for this scheme.',
      eligibilityCriteria: 'Eligibility Criteria'
    },
    hi: {
      title: 'सरकारी योजनाएं',
      subtitle: 'किसानों के लिए सरकारी योजनाओं और लाभों तक पहुंच',
      availableSchemes: 'उपलब्ध योजनाएं',
      eligibilityChecker: 'पात्रता जांचकर्ता',
      applicationStatus: 'आवेदन स्थिति',
      helplines: 'हेल्पलाइन और सहायता',
      incomeSupport: 'आय सहायता',
      insurance: 'बीमा',
      credit: 'क्रेडिट और ऋण',
      energy: 'ऊर्जा और सोलर',
      eligible: 'पात्र',
      notEligible: 'अपात्र',
      checkEligibility: 'पात्रता जांचें',
      applyNow: 'अभी आवेदन करें',
      viewDetails: 'विवरण देखें',
      approved: 'अनुमोदित',
      pending: 'लंबित',
      active: 'सक्रिय',
      rejected: 'अस्वीकृत',
      notApplied: 'आवेदन नहीं किया',
      benefit: 'लाभ',
      documents: 'आवश्यक दस्तावेज',
      status: 'स्थिति',
      progress: 'प्रगति',
      nextAction: 'अगली कार्रवाई',
      landSize: 'भूमि का आकार (हेक्टेयर)',
      cropType: 'मुख्य फसल',
      annualIncome: 'वार्षिक आय',
      location: 'जिला/राज्य',
      checkResults: 'परिणाम जांचें',
      schemeDetails: 'योजना विवरण',
      applicationProcess: 'आवेदन प्रक्रिया',
      supportContacts: 'सहायता संपर्क',
      helplineNumber: 'योजना हेल्पलाइन: 1800-115-526',
      pmKisanHelpline: 'PM-KISAN हेल्पलाइन: 155261',
      grievancePortal: 'शिकायत पोर्टल: pgportal.gov.in',
      selectScheme: 'पात्रता जांचने के लिए योजना चुनें',
      eligibilityResult: 'पात्रता परिणाम',
      youAreEligible: 'आप इस योजना के लिए पात्र हैं!',
      youAreNotEligible: 'आप इस योजना के लिए पात्र नहीं हैं।',
      eligibilityCriteria: 'पात्रता मानदंड'
    }
  };

  const t = content[language as keyof typeof content];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'active':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'pending':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'rejected':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'eligible':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'not-eligible':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'income-support':
        return <CreditCard className="h-5 w-5 text-green-500" />;
      case 'insurance':
        return <Shield className="h-5 w-5 text-blue-500" />;
      case 'credit':
        return <TrendingUp className="h-5 w-5 text-purple-500" />;
      case 'energy':
        return <Building2 className="h-5 w-5 text-orange-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const checkEligibility = () => {
    // Mock eligibility check logic
    console.log('Checking eligibility with data:', eligibilityData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="gap-2">
            <Building2 className="h-3 w-3" />
            {language === 'en' ? 'Official Portal' : 'आधिकारिक पोर्टल'}
          </Badge>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Tabs defaultValue="schemes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="schemes">{t.availableSchemes}</TabsTrigger>
            <TabsTrigger value="eligibility">{t.eligibilityChecker}</TabsTrigger>
            <TabsTrigger value="status">{t.applicationStatus}</TabsTrigger>
            <TabsTrigger value="support">{t.helplines}</TabsTrigger>
          </TabsList>

          <TabsContent value="schemes" className="space-y-6">
            {/* Scheme Categories */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                <CardContent className="p-4 text-center">
                  <CreditCard className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="font-medium">{t.incomeSupport}</p>
                  <p className="text-sm text-muted-foreground">2 schemes</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                <CardContent className="p-4 text-center">
                  <Shield className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="font-medium">{t.insurance}</p>
                  <p className="text-sm text-muted-foreground">1 scheme</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <p className="font-medium">{t.credit}</p>
                  <p className="text-sm text-muted-foreground">1 scheme</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                <CardContent className="p-4 text-center">
                  <Building2 className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <p className="font-medium">{t.energy}</p>
                  <p className="text-sm text-muted-foreground">1 scheme</p>
                </CardContent>
              </Card>
            </div>

            {/* Scheme Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {schemes.map((scheme) => (
                <motion.div
                  key={scheme.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {getCategoryIcon(scheme.category)}
                          <div>
                            <CardTitle className="text-lg">{scheme.name}</CardTitle>
                            <CardDescription className="text-sm">
                              {scheme.fullName}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className={getStatusColor(scheme.status)}>
                          {t[scheme.status as keyof typeof t]}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {scheme.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{t.benefit}:</span>
                          <span className="text-sm text-green-600 font-medium">
                            {scheme.benefit}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{t.status}:</span>
                          <Badge variant="outline" className={getStatusColor(scheme.applicationStatus)}>
                            {t[scheme.applicationStatus as keyof typeof t]}
                          </Badge>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <p className="text-xs text-muted-foreground mb-2">
                          {scheme.eligibility}
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            variant={scheme.status === 'eligible' ? 'default' : 'outline'}
                            disabled={scheme.status === 'not-eligible'}
                            onClick={() => {
                              // Open government scheme URL in new tab
                              const schemeUrls: {[key: string]: string} = {
                                'pm-kisan': 'https://pmkisan.gov.in/',
                                'pm-fasal-bima': 'https://pmfby.gov.in/',
                                'kisan-credit-card': 'https://www.nabard.org/auth/writereaddata/tender/1806181145Kisan%20Credit%20Card_Guidelines.pdf',
                                'pm-kusum': 'https://pmkusum.mnre.gov.in/'
                              };
                              window.open(schemeUrls[scheme.id] || '#', '_blank');
                            }}
                          >
                            {scheme.applicationStatus === 'not-applied' ? t.applyNow : t.viewDetails}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              const schemeUrls: {[key: string]: string} = {
                                'pm-kisan': 'https://pmkisan.gov.in/',
                                'pm-fasal-bima': 'https://pmfby.gov.in/',
                                'kisan-credit-card': 'https://www.nabard.org/auth/writereaddata/tender/1806181145Kisan%20Credit%20Card_Guidelines.pdf',
                                'pm-kusum': 'https://pmkusum.mnre.gov.in/'
                              };
                              window.open(schemeUrls[scheme.id] || '#', '_blank');
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="eligibility" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Eligibility Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    {t.eligibilityChecker}
                  </CardTitle>
                  <CardDescription>
                    {language === 'en' 
                      ? 'Check your eligibility for various government schemes' 
                      : 'विभिन्न सरकारी योजनाओं के लिए अपनी पात्रता जांचें'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="scheme-select">{language === 'en' ? 'Select Scheme' : 'योजना चुनें'}</Label>
                    <Select value={selectedScheme} onValueChange={setSelectedScheme}>
                      <SelectTrigger>
                        <SelectValue placeholder={t.selectScheme} />
                      </SelectTrigger>
                      <SelectContent>
                        {schemes.map((scheme) => (
                          <SelectItem key={scheme.id} value={scheme.id}>
                            {scheme.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="land-size">{t.landSize}</Label>
                      <Input
                        id="land-size"
                        type="number"
                        placeholder="2.5"
                        value={eligibilityData.landSize}
                        onChange={(e) => setEligibilityData({...eligibilityData, landSize: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="crop-type">{t.cropType}</Label>
                      <Select value={eligibilityData.cropType} onValueChange={(value) => setEligibilityData({...eligibilityData, cropType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select crop" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wheat">Wheat</SelectItem>
                          <SelectItem value="rice">Rice</SelectItem>
                          <SelectItem value="corn">Corn</SelectItem>
                          <SelectItem value="soybean">Soybean</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="income">{t.annualIncome}</Label>
                    <Input
                      id="income"
                      type="number"
                      placeholder="200000"
                      value={eligibilityData.income}
                      onChange={(e) => setEligibilityData({...eligibilityData, income: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">{t.location}</Label>
                    <Input
                      id="location"
                      placeholder="District, State"
                      value={eligibilityData.location}
                      onChange={(e) => setEligibilityData({...eligibilityData, location: e.target.value})}
                    />
                  </div>

                  <Button 
                    onClick={checkEligibility} 
                    className="w-full"
                    disabled={!selectedScheme}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {t.checkEligibility}
                  </Button>
                </CardContent>
              </Card>

              {/* Eligibility Results */}
              <Card>
                <CardHeader>
                  <CardTitle>{t.eligibilityResult}</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedScheme ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="font-medium text-green-800">{t.youAreEligible}</span>
                        </div>
                        <p className="text-sm text-green-700">
                          {language === 'en' 
                            ? 'Based on your profile, you meet the criteria for this scheme.' 
                            : 'आपकी प्रोफ़ाइल के आधार पर, आप इस योजना के मानदंडों को पूरा करते हैं।'
                          }
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">{t.eligibilityCriteria}</h4>
                        {selectedScheme && (
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              {schemes.find(s => s.id === selectedScheme)?.eligibility}
                            </li>
                          </ul>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">{t.documents}</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {selectedScheme && schemes.find(s => s.id === selectedScheme)?.documents.map((doc, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{doc}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button 
                        className="w-full"
                        onClick={() => {
                          // Open specific government scheme application URL
                          const schemeUrls: {[key: string]: string} = {
                            'pm-kisan': 'https://pmkisan.gov.in/',
                            'pm-fasal-bima': 'https://pmfby.gov.in/',
                            'kisan-credit-card': 'https://www.nabard.org/auth/writereaddata/tender/1806181145Kisan%20Credit%20Card_Guidelines.pdf',
                            'pm-kusum': 'https://pmkusum.mnre.gov.in/'
                          };
                          const url = schemeUrls[selectedScheme] || 'https://pmkisan.gov.in/';
                          window.open(url, '_blank');
                          
                          // Show confirmation
                          alert(language === 'en' 
                            ? 'Redirecting to official government portal for application...'
                            : 'आवेदन के लिए आधिकारिक सरकारी पोर्टल पर पुनर्निर्देशित कर रहे हैं...'
                          );
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {getContent(language, 'applyNow')}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>{t.selectScheme}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="status" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  {t.applicationStatus}
                </CardTitle>
                <CardDescription>
                  {language === 'en' 
                    ? 'Track your application status and payments' 
                    : 'अपनी आवेदन स्थिति और भुगतान को ट्रैक करें'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {applicationStatuses.map((app) => (
                    <div key={app.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            app.status === 'approved' 
                              ? 'bg-green-100 text-green-600' 
                              : app.status === 'active'
                                ? 'bg-blue-100 text-blue-600' 
                                : 'bg-orange-100 text-orange-600'
                          }`}>
                            {app.status === 'approved' ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : app.status === 'active' ? (
                              <TrendingUp className="h-5 w-5" />
                            ) : (
                              <Clock className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium">{app.scheme}</h4>
                            <p className="text-sm text-muted-foreground">{app.nextAction}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(app.status)}>
                          {t[app.status as keyof typeof t]}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{t.progress}</span>
                          <span>{app.progress}%</span>
                        </div>
                        <Progress value={app.progress} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-green-500" />
                    {t.supportContacts}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Phone className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">{t.helplineNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {language === 'en' ? 'General scheme queries' : 'सामान्य योजना प्रश्न'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Phone className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{t.pmKisanHelpline}</p>
                        <p className="text-sm text-muted-foreground">
                          {language === 'en' ? 'PM-KISAN specific queries' : 'PM-KISAN विशिष्ट प्रश्न'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <ExternalLink className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="font-medium">{t.grievancePortal}</p>
                        <p className="text-sm text-muted-foreground">
                          {language === 'en' ? 'File complaints and grievances' : 'शिकायतें और शिकायतें दर्ज करें'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{language === 'en' ? 'Quick Links' : 'त्वरित लिंक'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.open('https://pmkisan.gov.in/', '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {language === 'en' ? 'PM-KISAN Portal' : 'PM-KISAN पोर्टल'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.open('https://pmfby.gov.in/', '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {language === 'en' ? 'Crop Insurance Portal' : 'फसल बीमा पोर्टल'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.open('https://www.nabard.org/', '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {language === 'en' ? 'KCC Application' : 'KCC आवेदन'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.open('https://soilhealth.dac.gov.in/', '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {language === 'en' ? 'Soil Health Card' : 'मिट्टी स्वास्थ्य कार्ड'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}