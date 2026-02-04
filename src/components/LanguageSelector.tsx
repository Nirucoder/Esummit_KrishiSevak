import React, { useState } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Globe, Languages, X } from 'lucide-react';
import { languages } from '../utils/languages';

interface LanguageSelectorProps {
  language: string;
  setLanguage: (language: string) => void;
  compact?: boolean;
}

export function LanguageSelector({ language, setLanguage, compact = false }: LanguageSelectorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const currentLanguage = languages.find(lang => lang.code === language);
  
  if (compact) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 px-2 md:px-3 hover:scale-105 transition-transform">
            <Languages className="h-4 w-4" />
            <span className="text-lg">{currentLanguage?.flag}</span>
            <span className="hidden md:inline text-xs font-medium">
              {currentLanguage?.nativeName.split(' ')[0]}
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl mb-4">
              <Languages className="h-8 w-8 text-primary" />
              <div className="text-center">
                <div className="text-xl">भाषा चुनें</div>
                <div className="text-lg">Choose Language</div>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {/* Visual Language Grid with Large Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-6">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant={language === lang.code ? "default" : "outline"}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsDialogOpen(false);
                }}
                className="flex flex-col items-center gap-3 h-24 p-4 border-2 hover:scale-105 transition-all duration-200 hover:shadow-xl text-center"
                style={{
                  background: language === lang.code ? 'linear-gradient(135deg, #16a34a, #22c55e)' : undefined,
                  boxShadow: language === lang.code ? '0 8px 25px rgba(34, 197, 94, 0.3)' : undefined
                }}
              >
                <span className="text-4xl drop-shadow-sm">{lang.flag}</span>
                <div>
                  <div className="font-bold text-sm leading-tight">{lang.nativeName}</div>
                  <div className="text-xs opacity-70 mt-1">{lang.name}</div>
                </div>
              </Button>
            ))}
          </div>
          
          {/* Regional Categories with Visual Grouping */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="p-6 rounded-xl bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200">
              <h4 className="font-bold text-orange-800 mb-4 flex items-center gap-3 text-lg">
                <span className="text-2xl">🌾</span>
                उत्तर भारत / North India
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {['hi', 'pa'].map((langCode) => {
                  const lang = languages.find(l => l.code === langCode);
                  if (!lang) return null;
                  return (
                    <Button
                      key={lang.code}
                      variant={language === lang.code ? "default" : "secondary"}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsDialogOpen(false);
                      }}
                      className="gap-2 h-16 flex-col hover:scale-105 transition-transform"
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="text-xs font-medium">{lang.nativeName}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
            
            <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
              <h4 className="font-bold text-green-800 mb-4 flex items-center gap-3 text-lg">
                <span className="text-2xl">🥥</span>
                दक्षिण भारत / South India
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {['ta', 'te', 'kn', 'ml'].map((langCode) => {
                  const lang = languages.find(l => l.code === langCode);
                  if (!lang) return null;
                  return (
                    <Button
                      key={lang.code}
                      variant={language === lang.code ? "default" : "secondary"}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsDialogOpen(false);
                      }}
                      className="gap-2 h-16 flex-col hover:scale-105 transition-transform"
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="text-xs font-medium">{lang.nativeName}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
            
            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
              <h4 className="font-bold text-purple-800 mb-4 flex items-center gap-3 text-lg">
                <span className="text-2xl">🏔️</span>
                पश्चिम भारत / West India
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {['mr', 'gu'].map((langCode) => {
                  const lang = languages.find(l => l.code === langCode);
                  if (!lang) return null;
                  return (
                    <Button
                      key={lang.code}
                      variant={language === lang.code ? "default" : "secondary"}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsDialogOpen(false);
                      }}
                      className="gap-2 h-16 flex-col hover:scale-105 transition-transform"
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="text-xs font-medium">{lang.nativeName}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
            
            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
              <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-3 text-lg">
                <span className="text-2xl">🐟</span>
                पूर्व भारत / East India
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {['bn', 'en'].map((langCode) => {
                  const lang = languages.find(l => l.code === langCode);
                  if (!lang) return null;
                  return (
                    <Button
                      key={lang.code}
                      variant={language === lang.code ? "default" : "secondary"}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsDialogOpen(false);
                      }}
                      className="gap-2 h-16 flex-col hover:scale-105 transition-transform"
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="text-xs font-medium">{lang.nativeName}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h3 className="text-3xl font-bold flex items-center justify-center gap-4">
          <Languages className="h-10 w-10 text-primary" />
          <div>
            <div className="text-primary">भाषा चुनें</div>
            <div className="text-xl text-muted-foreground">Choose Your Language</div>
          </div>
        </h3>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          अपनी भाषा का चयन करें / Select your preferred language for better farming experience
        </p>
      </div>
      
      {/* Main Language Grid - Extra Large for Farmers */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {languages.map((lang) => (
          <Button
            key={lang.code}
            variant={language === lang.code ? "default" : "outline"}
            onClick={() => setLanguage(lang.code)}
            className="flex flex-col items-center gap-4 h-32 p-6 border-3 hover:scale-105 transition-all duration-300 hover:shadow-2xl text-center"
            style={{
              background: language === lang.code ? 'linear-gradient(135deg, #16a34a, #22c55e)' : undefined,
              boxShadow: language === lang.code ? '0 12px 35px rgba(34, 197, 94, 0.4)' : undefined,
              borderWidth: '3px'
            }}
          >
            <span className="text-5xl drop-shadow-lg">{lang.flag}</span>
            <div className="space-y-1">
              <div className="font-bold text-sm leading-tight">{lang.nativeName}</div>
              <div className="text-xs opacity-70">{lang.name}</div>
            </div>
          </Button>
        ))}
      </div>
      
      {/* Regional Categories with Enhanced Visuals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 border-3 border-orange-200 shadow-xl">
          <h4 className="font-bold text-orange-900 mb-6 flex items-center gap-4 text-xl">
            <span className="text-4xl drop-shadow-md">🌾</span>
            <div>
              <div>उत्तर भारत</div>
              <div className="text-base opacity-80">North India</div>
            </div>
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {['hi', 'pa'].map((langCode) => {
              const lang = languages.find(l => l.code === langCode);
              if (!lang) return null;
              return (
                <Button
                  key={lang.code}
                  variant={language === lang.code ? "default" : "secondary"}
                  onClick={() => setLanguage(lang.code)}
                  className="gap-3 h-20 flex-col hover:scale-105 transition-all duration-300 border-2"
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="text-sm font-bold">{lang.nativeName}</span>
                </Button>
              );
            })}
          </div>
        </div>
        
        <div className="p-8 rounded-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-3 border-green-200 shadow-xl">
          <h4 className="font-bold text-green-900 mb-6 flex items-center gap-4 text-xl">
            <span className="text-4xl drop-shadow-md">🥥</span>
            <div>
              <div>दक्षिण भारत</div>
              <div className="text-base opacity-80">South India</div>
            </div>
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {['ta', 'te', 'kn', 'ml'].map((langCode) => {
              const lang = languages.find(l => l.code === langCode);
              if (!lang) return null;
              return (
                <Button
                  key={lang.code}
                  variant={language === lang.code ? "default" : "secondary"}
                  onClick={() => setLanguage(lang.code)}
                  className="gap-3 h-20 flex-col hover:scale-105 transition-all duration-300 border-2"
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="text-sm font-bold">{lang.nativeName}</span>
                </Button>
              );
            })}
          </div>
        </div>
        
        <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 border-3 border-purple-200 shadow-xl">
          <h4 className="font-bold text-purple-900 mb-6 flex items-center gap-4 text-xl">
            <span className="text-4xl drop-shadow-md">🏔️</span>
            <div>
              <div>पश्चिम भारत</div>
              <div className="text-base opacity-80">West India</div>
            </div>
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {['mr', 'gu'].map((langCode) => {
              const lang = languages.find(l => l.code === langCode);
              if (!lang) return null;
              return (
                <Button
                  key={lang.code}
                  variant={language === lang.code ? "default" : "secondary"}
                  onClick={() => setLanguage(lang.code)}
                  className="gap-3 h-20 flex-col hover:scale-105 transition-all duration-300 border-2"
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="text-sm font-bold">{lang.nativeName}</span>
                </Button>
              );
            })}
          </div>
        </div>
        
        <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 border-3 border-blue-200 shadow-xl">
          <h4 className="font-bold text-blue-900 mb-6 flex items-center gap-4 text-xl">
            <span className="text-4xl drop-shadow-md">🐟</span>
            <div>
              <div>पूर्व भारत</div>
              <div className="text-base opacity-80">East India</div>
            </div>
          </h4>
          <div className="grid grid-cols-1 gap-4">
            {['bn', 'en'].map((langCode) => {
              const lang = languages.find(l => l.code === langCode);
              if (!lang) return null;
              return (
                <Button
                  key={lang.code}
                  variant={language === lang.code ? "default" : "secondary"}
                  onClick={() => setLanguage(lang.code)}
                  className="gap-3 h-20 flex-col hover:scale-105 transition-all duration-300 border-2"
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="text-sm font-bold">{lang.nativeName}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}