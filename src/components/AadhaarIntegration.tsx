import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  CreditCard, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Fingerprint, 
  Eye, 
  Phone, 
  User, 
  FileCheck, 
  Smartphone,
  Lock,
  Verified,
  IdCard,
  Building,
  Calendar
} from 'lucide-react';
import { getContent } from '../utils/languages';
import smsService from '../services/SMSService';

interface AadhaarIntegrationProps {
  language: string;
}

interface AadhaarProfile {
  number: string;
  name: string;
  address: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  isVerified: boolean;
}

export function AadhaarIntegration({ language }: AadhaarIntegrationProps) {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [currentStep, setCurrentStep] = useState('input'); // input, otp, biometric, verified
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [aadhaarProfile, setAadhaarProfile] = useState<AadhaarProfile | null>(null);
  const [linkedSchemes, setLinkedSchemes] = useState<string[]>([]);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  // Translation helper
  const t = {
    title: getContent(language, 'aadhaar') || 'Aadhaar Integration',
    subtitle: getContent(language, 'aadhaarSubtitle') || 'Secure Identity Verification for Government Benefits',
    enterAadhaar: getContent(language, 'enterAadhaar') || 'Enter Aadhaar Number',
    verifyIdentity: getContent(language, 'verifyIdentity') || 'Verify Identity',
    otpVerification: getContent(language, 'otpVerification') || 'OTP Verification',
    biometricVerification: getContent(language, 'biometricVerification') || 'Biometric Verification',
    verified: getContent(language, 'verified') || 'Verified',
    enterOtp: getContent(language, 'enterOtp') || 'Enter OTP sent to your mobile',
    resendOtp: getContent(language, 'resendOtp') || 'Resend OTP',
    verify: getContent(language, 'verify') || 'Verify',
    next: getContent(language, 'next') || 'Next',
    profile: getContent(language, 'profile') || 'Profile',
    schemes: getContent(language, 'schemes') || 'Linked Schemes',
    benefits: getContent(language, 'benefits') || 'Benefits',
    security: getContent(language, 'security') || 'Security',
    invalidAadhaar: getContent(language, 'invalidAadhaar') || 'Please enter a valid 12-digit Aadhaar number',
    invalidOtp: getContent(language, 'invalidOtp') || 'Please enter a valid 6-digit OTP',
    verificationFailed: getContent(language, 'verificationFailed') || 'Verification failed. Please try again.',
    resendIn: getContent(language, 'resendIn') || 'Resend in',
    seconds: getContent(language, 'seconds') || 'seconds',
    aadhaarLinked: getContent(language, 'aadhaarLinked') || 'Aadhaar Successfully Linked',
    personalInfo: getContent(language, 'personalInfo') || 'Personal Information',
    secureConnection: getContent(language, 'secureConnection') || 'Secure Connection with UIDAI',
    dataProtection: getContent(language, 'dataProtection') || 'Your data is protected with 256-bit encryption'
  };

  const validateAadhaar = (number: string) => {
    const cleanNumber = number.replace(/\s/g, '');
    return /^\d{12}$/.test(cleanNumber);
  };

  const formatAadhaar = (number: string) => {
    const cleanNumber = number.replace(/\D/g, '');
    return cleanNumber.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
  };

  const handleAadhaarSubmit = async () => {
    setError('');
    
    if (!validateAadhaar(aadhaarNumber)) {
      setError(t.invalidAadhaar);
      return;
    }

    setIsLoading(true);
    setVerificationProgress(25);

    try {
      // Send OTP via SMS
      const phoneNumber = '+91' + '9876543210'; // Mock phone number linked to Aadhaar
      const smsResponse = await smsService.sendOTP(phoneNumber, language);
      
      if (smsResponse.success) {
        setCurrentStep('otp');
        setVerificationProgress(50);
        setCanResendOtp(false);
        setResendTimer(30);
        
        // Start resend timer
        const timer = setInterval(() => {
          setResendTimer((prev) => {
            if (prev <= 1) {
              setCanResendOtp(true);
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        console.log('OTP sent successfully:', smsResponse.messageId);
      } else {
        setError('Failed to send OTP. Please try again.');
        setVerificationProgress(25);
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
      setVerificationProgress(25);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    setError('');
    
    if (!/^\d{6}$/.test(otp)) {
      setError(t.invalidOtp);
      return;
    }

    setIsLoading(true);
    setVerificationProgress(75);

    try {
      // Verify OTP using SMS service
      const phoneNumber = '+91' + '9876543210'; // Mock phone number
      const verification = smsService.verifyOTP(phoneNumber, otp);
      
      if (verification.valid) {
        setCurrentStep('biometric');
        setVerificationProgress(85);
      } else {
        setError(verification.message);
        setVerificationProgress(50);
      }
    } catch (error) {
      setError('OTP verification failed. Please try again.');
      setVerificationProgress(50);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      const phoneNumber = '+91' + '9876543210'; // Mock phone number
      const smsResponse = await smsService.sendOTP(phoneNumber, language);
      
      if (smsResponse.success) {
        setCanResendOtp(false);
        setResendTimer(30);
        
        // Start new resend timer
        const timer = setInterval(() => {
          setResendTimer((prev) => {
            if (prev <= 1) {
              setCanResendOtp(true);
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        console.log('OTP resent successfully:', smsResponse.messageId);
      } else {
        setError('Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricVerification = async () => {
    setIsLoading(true);
    setVerificationProgress(90);

    // Simulate biometric verification
    setTimeout(() => {
      // Mock Aadhaar profile data
      const mockProfile: AadhaarProfile = {
        number: aadhaarNumber,
        name: language === 'hi' ? 'राम कुमार शर्मा' : 'Ram Kumar Sharma',
        address: language === 'hi' ? 'ग्राम - कृषिनगर, जिला - भोपाल, मध्य प्रदेश - 462001' : 'Village - Krishinagar, District - Bhopal, Madhya Pradesh - 462001',
        phone: '+91 98765-43210',
        dateOfBirth: '15/08/1980',
        gender: language === 'hi' ? 'पुरुष' : 'Male',
        isVerified: true
      };

      setAadhaarProfile(mockProfile);
      setLinkedSchemes(['PM-KISAN', 'Crop Insurance', 'Soil Health Card']);
      setCurrentStep('verified');
      setVerificationProgress(100);
      setIsLoading(false);
    }, 3000);
  };

  const mockSchemes = [
    {
      name: 'PM-KISAN',
      status: 'Active',
      nextPayment: '₹2,000 on 1st Dec 2024',
      icon: '🌾'
    },
    {
      name: 'Crop Insurance',
      status: 'Enrolled',
      coverage: 'Kharif 2024 - ₹50,000',
      icon: '🛡️'
    },
    {
      name: 'Soil Health Card',
      status: 'Available',
      validity: 'Valid till March 2025',
      icon: '🧪'
    },
    {
      name: 'Kisan Credit Card',
      status: 'Eligible',
      limit: 'Up to ₹3,00,000',
      icon: '💳'
    }
  ];

  const renderVerificationSteps = () => {
    return (
      <div className="space-y-6">
        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              ['input', 'otp', 'biometric', 'verified'].includes(currentStep) 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200'
            }`}>
              <CreditCard className="h-4 w-4" />
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              ['otp', 'biometric', 'verified'].includes(currentStep) 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200'
            }`}>
              <Phone className="h-4 w-4" />
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              ['biometric', 'verified'].includes(currentStep) 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200'
            }`}>
              <Fingerprint className="h-4 w-4" />
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 'verified' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200'
            }`}>
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
        </div>

        <Progress value={verificationProgress} className="h-2" />

        {/* Step Content */}
        {currentStep === 'input' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                {t.enterAadhaar}
              </CardTitle>
              <CardDescription>
                {t.secureConnection}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="aadhaar">{t.enterAadhaar}</Label>
                <Input
                  id="aadhaar"
                  placeholder="XXXX XXXX XXXX"
                  value={formatAadhaar(aadhaarNumber)}
                  onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                  maxLength={14}
                  className="text-lg tracking-wider"
                />
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handleAadhaarSubmit} 
                disabled={isLoading || !aadhaarNumber}
                className="w-full farmer-primary-action"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    {t.verifyIdentity}...
                  </>
                ) : (
                  t.next
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === 'otp' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                {t.otpVerification}
              </CardTitle>
              <CardDescription>
                OTP sent to mobile number ending with **10
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="otp">{t.enterOtp}</Label>
                <Input
                  id="otp"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="text-lg tracking-wider text-center"
                />
              </div>

              <div className="text-center">
                {canResendOtp ? (
                  <Button 
                    variant="link" 
                    className="text-sm" 
                    onClick={handleResendOtp}
                    disabled={isLoading}
                  >
                    {t.resendOtp}
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {t.resendIn} {resendTimer} {t.seconds}
                  </p>
                )}
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handleOtpSubmit} 
                disabled={isLoading || !otp}
                className="w-full farmer-primary-action"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    {t.verify}...
                  </>
                ) : (
                  t.verify
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === 'biometric' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fingerprint className="h-5 w-5" />
                {t.biometricVerification}
              </CardTitle>
              <CardDescription>
                Place your finger on the scanner or look at the camera
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center space-x-8">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-2 mx-auto">
                    <Fingerprint className="h-12 w-12 text-green-600" />
                  </div>
                  <p className="text-sm">Fingerprint</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-2 mx-auto">
                    <Eye className="h-12 w-12 text-blue-600" />
                  </div>
                  <p className="text-sm">Iris Scan</p>
                </div>
              </div>

              <Button 
                onClick={handleBiometricVerification} 
                disabled={isLoading}
                className="w-full farmer-primary-action"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Scanning...
                  </>
                ) : (
                  'Start Biometric Verification'
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderVerifiedProfile = () => {
    if (!aadhaarProfile) return null;

    return (
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="profile">{t.profile}</TabsTrigger>
          <TabsTrigger value="schemes">{t.schemes}</TabsTrigger>
          <TabsTrigger value="benefits">{t.benefits}</TabsTrigger>
          <TabsTrigger value="security">{t.security}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Verified className="h-5 w-5 text-green-600" />
                    {t.personalInfo}
                  </CardTitle>
                  <CardDescription>
                    Verified Aadhaar Profile
                  </CardDescription>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {t.verified}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Name</Label>
                  <p className="font-medium">{aadhaarProfile.name}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Aadhaar Number</Label>
                  <p className="font-medium">XXXX XXXX {aadhaarProfile.number.slice(-4)}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Date of Birth</Label>
                  <p className="font-medium">{aadhaarProfile.dateOfBirth}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Gender</Label>
                  <p className="font-medium">{aadhaarProfile.gender}</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm text-muted-foreground">Address</Label>
                  <p className="font-medium">{aadhaarProfile.address}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Mobile Number</Label>
                  <p className="font-medium">{aadhaarProfile.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schemes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockSchemes.map((scheme, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{scheme.icon}</span>
                      <div>
                        <h3 className="font-semibold">{scheme.name}</h3>
                        <Badge variant={
                          scheme.status === 'Active' ? 'default' :
                          scheme.status === 'Enrolled' ? 'secondary' :
                          scheme.status === 'Available' ? 'outline' : 'destructive'
                        }>
                          {scheme.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">
                    {'nextPayment' in scheme && <p>{scheme.nextPayment}</p>}
                    {'coverage' in scheme && <p>{scheme.coverage}</p>}
                    {'validity' in scheme && <p>{scheme.validity}</p>}
                    {'limit' in scheme && <p>{scheme.limit}</p>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="benefits">
          <Card>
            <CardHeader>
              <CardTitle>Aadhaar Integration Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FileCheck className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Instant Scheme Verification</h4>
                      <p className="text-sm text-muted-foreground">
                        Verify eligibility for government schemes instantly
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Smartphone className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Digital Payments</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive payments directly to your bank account
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Government Services</h4>
                      <p className="text-sm text-muted-foreground">
                        Access all government services with single identity
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Secure Verification</h4>
                      <p className="text-sm text-muted-foreground">
                        Biometric verification ensures maximum security
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Real-time Updates</h4>
                      <p className="text-sm text-muted-foreground">
                        Get instant updates on scheme status and payments
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <IdCard className="h-5 w-5 text-teal-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Single Digital Identity</h4>
                      <p className="text-sm text-muted-foreground">
                        One identity for all agricultural services
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  {t.dataProtection}
                </AlertDescription>
              </Alert>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Biometric Authentication</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">End-to-End Encryption</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">UIDAI Compliance</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Verified</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-green-600" />
            {t.title}
          </h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
        
        {currentStep === 'verified' && (
          <Badge className="bg-green-100 text-green-800 px-3 py-1">
            <CheckCircle className="h-4 w-4 mr-1" />
            {t.aadhaarLinked}
          </Badge>
        )}
      </div>

      {currentStep !== 'verified' ? renderVerificationSteps() : renderVerifiedProfile()}
    </div>
  );
}