import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Sprout, Phone, Mail, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { motion } from 'motion/react';
import { authService } from '../services/AuthService';
import { userDataService } from '../services/UserDataService';
import { KrishiLogo } from './KrishiLogo';

interface AuthScreenProps {
  onAuth: () => void;
  language: string;
}

export function AuthScreen({ onAuth, language }: AuthScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [location, setLocation] = useState('');

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      setError(language === 'en' ? 'Please fill in all fields' : 'कृपया सभी फ़ील्ड भरें');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await authService.signIn({
        email: loginEmail,
        password: loginPassword,
      });

      if (result.success && result.user) {
        onAuth();
      } else {
        setError(result.error || (language === 'en' ? 'Login failed' : 'लॉगिन असफल'));
      }
    } catch (error) {
      setError(language === 'en' ? 'Login failed. Please try again.' : 'लॉगिन असफल। कृपया पुनः प्रयास करें।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!signupName || !signupEmail || !signupPassword) {
      setError(language === 'en' ? 'Please fill in all required fields' : 'कृपया सभी आवश्यक फ़ील्ड भरें');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await authService.signUp({
        email: signupEmail,
        password: signupPassword,
        name: signupName,
        phone: signupPhone,
      });

      if (result.success && result.user) {
        // Save additional profile data
        await userDataService.saveUserProfile({
          userId: result.user.id,
          name: signupName,
          email: signupEmail,
          phone: signupPhone,
          farmLocation: {
            lat: 0,
            lng: 0,
            address: location,
            pincode: ''
          },
          farmSize: parseFloat(farmSize) || 0,
          primaryCrops: [],
          farmingType: 'Conventional',
          language,
          notifications: {
            weather: true,
            cropHealth: true,
            irrigation: true,
            marketPrices: true
          }
        });

        onAuth();
      } else {
        setError(result.error || (language === 'en' ? 'Sign up failed' : 'साइन अप असफल'));
      }
    } catch (error) {
      setError(language === 'en' ? 'Sign up failed. Please try again.' : 'साइन अप असफल। कृपया पुनः प्रयास करें।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await authService.signInWithGoogle();
      if (!result.success) {
        setError(result.error || (language === 'en' ? 'Google sign-in failed' : 'Google साइन-इन असफल'));
      }
      // OAuth will redirect, so we don't need to handle success here
    } catch (error) {
      setError(language === 'en' ? 'Google sign-in failed. Please try again.' : 'Google साइन-इन असफल। कृपया पुनः प्रयास करें।');
    } finally {
      setIsLoading(false);
    }
  };

  const content = {
    en: {
      welcome: 'Welcome to KrishiSevak',
      subtitle: 'Empowering farmers with AI-powered insights',
      login: 'Login',
      signup: 'Sign Up',
      phone: 'Phone Number',
      password: 'Password',
      email: 'Email Address',
      name: 'Full Name',
      farmSize: 'Farm Size (acres)',
      location: 'Location',
      loginBtn: 'Sign In',
      signupBtn: 'Create Account',
      phonePlaceholder: '+91 98765 43210',
      emailPlaceholder: 'farmer@example.com',
      namePlaceholder: 'Your full name',
      locationPlaceholder: 'Village, District, State'
    },
    hi: {
      welcome: 'कृषिसेवक में आपका स्वागत है',
      subtitle: 'AI-संचालित अंतर्दृष्टि के साथ किसानों को सशक्त बनाना',
      login: 'लॉगिन',
      signup: 'साइन अप',
      phone: 'फोन नंबर',
      password: 'पासवर्ड',
      email: 'ईमेल पता',
      name: 'पूरा नाम',
      farmSize: 'खेत का आकार (एकड़)',
      location: 'स्थान',
      loginBtn: 'साइन इन करें',
      signupBtn: 'खाता बनाएं',
      phonePlaceholder: '+91 98765 43210',
      emailPlaceholder: 'farmer@example.com',
      namePlaceholder: 'आपका पूरा नाम',
      locationPlaceholder: 'गांव, जिला, राज्य'
    }
  };

  const t = content[language as keyof typeof content];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <KrishiLogo size="xl" className="rounded-full" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.welcome}</h1>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>

        <Card>
          <CardHeader>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">{t.login}</TabsTrigger>
                <TabsTrigger value="signup">{t.signup}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <CardTitle>{t.login}</CardTitle>
                <CardDescription>
                  {language === 'en' 
                    ? 'Enter your credentials to access your account' 
                    : 'अपने खाते तक पहुंचने के लिए अपनी जानकारी दर्ज करें'
                  }
                </CardDescription>
                
                {/* Demo instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                  <p className="font-medium text-blue-800 mb-1">
                    {language === 'en' ? 'Demo Access' : 'डेमो एक्सेस'}
                  </p>
                  <p className="text-blue-700 text-xs">
                    {language === 'en' 
                      ? 'Use farmer@demo.com / demo123 or admin@demo.com / admin123'
                      : 'farmer@demo.com / demo123 या admin@demo.com / admin123 का उपयोग करें'
                    }
                  </p>
                </div>
                
                <div className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-email">{t.email}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder={t.emailPlaceholder}
                        className="pl-10"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">{t.password}</Label>
                    <Input 
                      id="login-password" 
                      type="password" 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleLogin} 
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    ) : (
                      t.loginBtn
                    )}
                  </Button>
                  
                  {/* Quick Demo Login */}
                  <Button 
                    onClick={() => {
                      setLoginEmail('farmer@demo.com');
                      setLoginPassword('demo123');
                      setTimeout(() => handleLogin(), 100);
                    }}
                    variant="outline"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {language === 'en' ? 'Quick Demo Login' : 'त्वरित डेमो लॉगिन'}
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">
                        {language === 'en' ? 'Or continue with' : 'या जारी रखें'}
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleGoogleSignIn} 
                    variant="outline" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    {language === 'en' ? 'Continue with Google' : 'Google के साथ जारी रखें'}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <CardTitle>{t.signup}</CardTitle>
                <CardDescription>
                  {language === 'en' 
                    ? 'Create a new account to get started' 
                    : 'शुरू करने के लिए एक नया खाता बनाएं'
                  }
                </CardDescription>
                
                <div className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">{t.name}</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder={t.namePlaceholder}
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">{t.email}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder={t.emailPlaceholder}
                        className="pl-10"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">{t.phone}</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-phone"
                        type="tel"
                        placeholder={t.phonePlaceholder}
                        className="pl-10"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-farmSize">{t.farmSize}</Label>
                      <Input 
                        id="signup-farmSize" 
                        type="number" 
                        placeholder="5" 
                        value={farmSize}
                        onChange={(e) => setFarmSize(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-location">{t.location}</Label>
                      <Input
                        id="signup-location"
                        type="text"
                        placeholder={t.locationPlaceholder}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">{t.password}</Label>
                    <Input 
                      id="signup-password" 
                      type="password" 
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleSignup} 
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    ) : (
                      t.signupBtn
                    )}
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">
                        {language === 'en' ? 'Or continue with' : 'या जारी रखें'}
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleGoogleSignIn} 
                    variant="outline" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    {language === 'en' ? 'Continue with Google' : 'Google के साथ जारी रखें'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </motion.div>
    </div>
  );
}