import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { motion } from 'motion/react';

interface VisualDashboardProps {
  language: string;
  setCurrentScreen?: (screen: string) => void;
  userName?: string;
}

// Simple visual data for farmers
const farmStatusData = [
  {
    emoji: '🌾',
    title: 'फसल / Crops',
    status: 'अच्छी / Good',
    value: '85%',
    color: 'bg-green-500',
    bgColor: '!bg-green-50 !dark:bg-green-950/40',
    textColor: 'dark:text-green-100'
  },
  {
    emoji: '💧',
    title: 'पानी / Water',
    status: 'पर्याप्त / Adequate',
    value: '72%',
    color: 'bg-blue-500',
    bgColor: '!bg-blue-50 !dark:bg-blue-950/40',
    textColor: 'dark:text-blue-100'
  },
  {
    emoji: '🌡️',
    title: 'मौसम / Weather',
    status: 'अनुकूल / Favorable',
    value: '28°C',
    color: 'bg-orange-500',
    bgColor: '!bg-orange-50 !dark:bg-orange-950/40',
    textColor: 'dark:text-orange-100'
  },
  {
    emoji: '🏔️',
    title: 'मिट्टी / Soil',
    status: 'स्वस्थ / Healthy',
    value: '90%',
    color: 'bg-amber-600',
    bgColor: '!bg-amber-50 !dark:bg-amber-950/40',
    textColor: 'dark:text-amber-100'
  }
];

const quickActions = [
  {
    emoji: '📱',
    title: 'व्हाट्सअप अलर्ट',
    subtitle: 'WhatsApp Alerts',
    desc: 'फसल की जानकारी पाएं',
    action: 'alerts',
    color: 'bg-green-500'
  },
  {
    emoji: '🌾',
    title: 'फसल की जांच',
    subtitle: 'Check Crops',
    desc: 'अपनी फसल देखें',
    action: 'monitoring',
    color: 'bg-blue-500'
  },
  {
    emoji: '📊',
    title: 'रिपोर्ट देखें',
    subtitle: 'View Reports',
    desc: 'खेत का विश्लेषण',
    action: 'analytics',
    color: 'bg-purple-500'
  },
  {
    emoji: '🏛️',
    title: 'सरकारी योजना',
    subtitle: 'Govt Schemes',
    desc: 'लाभ के लिए आवेदन',
    action: 'schemes',
    color: 'bg-red-500'
  },
  {
    emoji: '🤖',
    title: 'AI सहायक',
    subtitle: 'AI Helper',
    desc: 'स्मार्ट सुझाव पाएं',
    action: 'recommendations',
    color: 'bg-indigo-500'
  },
  {
    emoji: '🎯',
    title: 'उत्पादन पूर्वानुमान',
    subtitle: 'Yield Prediction',
    desc: 'फसल का अनुमान',
    action: 'yield-prediction',
    color: 'bg-green-600'
  },
  {
    emoji: '📊',
    title: 'परिदृश्य योजना',
    subtitle: 'Scenario Planning',
    desc: 'पानी, लागत और लाभ की गणना',
    action: 'simulation',
    color: 'bg-teal-500'
  }
];

const todaysTasks = [
  {
    emoji: '💧',
    task: 'खेत A में सिंचाई करें',
    taskEn: 'Irrigate Field A',
    time: '6:00 AM',
    status: 'pending'
  },
  {
    emoji: '🧪',
    task: 'मिट्टी की जांच',
    taskEn: 'Soil Testing',
    time: '10:00 AM',
    status: 'pending'
  },
  {
    emoji: '🌾',
    task: 'फसल का निरीक्षण',
    taskEn: 'Crop Inspection',
    time: '4:00 PM',
    status: 'completed'
  }
];

const weatherForecast = [
  { day: 'आज/Today', emoji: '☀️', temp: '28°C', desc: 'धूप/Sunny' },
  { day: 'कल/Tomorrow', emoji: '🌤️', temp: '26°C', desc: 'बादल/Cloudy' },
  { day: 'परसों/Day After', emoji: '🌧️', temp: '24°C', desc: 'बारिश/Rain' }
];

export function VisualDashboard({ language, setCurrentScreen, userName }: VisualDashboardProps) {
  const greeting = language === 'hi'
    ? `नमस्ते ${userName || 'किसान'} जी!`
    : `Hello ${userName || 'Farmer'}!`;
  const subtitle = language === 'hi' ? 'आपके खेत की स्थिति' : 'Your Farm Status';

  return (
    <div className="space-y-8 p-2">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 rounded-3xl shadow-xl"
      >
        <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-4">
          <span className="text-5xl">🧑‍🌾</span>
          {greeting}
        </h1>
        <p className="text-xl opacity-90">{subtitle}</p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          <span className="text-lg">
            {language === 'hi' ? 'लाइव डेटा' : 'Live Data'}
          </span>
        </div>
      </motion.div>

      {/* Farm Status Cards - Big Visual Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {farmStatusData.map((item, index) => (
          <Card key={index} className={`${item.bgColor} border-3 hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg`}>
            <CardContent className={`p-8 text-center ${item.textColor}`}>
              <div className="text-7xl mb-4">{item.emoji}</div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <div className="text-3xl font-bold mb-2">{item.value}</div>
              <Badge className={`${item.color} text-white text-sm px-4 py-1`}>
                {item.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Quick Actions - Large Visual Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 rounded-t-xl">
            <CardTitle className="text-2xl flex items-center gap-3">
              <span className="text-3xl">🚀</span>
              {language === 'hi' ? 'तुरंत करें / Quick Actions' : 'Quick Actions'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-24 p-6 flex flex-col gap-3 hover:scale-105 transition-all duration-300 border-3 shadow-md hover:shadow-lg dark:bg-slate-900/50"
                  onClick={() => {
                    if (setCurrentScreen) {
                      setCurrentScreen(action.action);
                    }
                  }}
                >
                  <span className="text-4xl">{action.emoji}</span>
                  <div className="text-center">
                    <div className="font-bold text-sm dark:text-gray-100">{action.title}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{action.subtitle}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Today's Tasks & Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Tasks */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-t-xl">
              <CardTitle className="text-xl flex items-center gap-3">
                <span className="text-3xl">📋</span>
                {language === 'hi' ? 'आज के काम / Today\'s Tasks' : 'Today\'s Tasks'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {todaysTasks.map((task, index) => (
                  <div key={index} className={`p-4 rounded-2xl border-2 ${task.status === 'completed'
                    ? 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800'
                    : 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800'
                    }`}>
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{task.emoji}</span>
                      <div className="flex-1">
                        <div className="font-bold dark:text-gray-100">{language === 'hi' ? task.task : task.taskEn}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                          <span>⏰ {task.time}</span>
                          {task.status === 'completed' && (
                            <Badge className="bg-green-500 text-white text-xs">
                              {language === 'hi' ? '✓ पूर्ण' : '✓ Done'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weather Forecast */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-xl">
              <CardTitle className="text-xl flex items-center gap-3">
                <span className="text-3xl">🌤️</span>
                {language === 'hi' ? 'मौसम का हाल / Weather Forecast' : 'Weather Forecast'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-4">
                {weatherForecast.map((weather, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-white dark:from-blue-950/30 dark:to-slate-900 rounded-2xl border-2 border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-4xl">{weather.emoji}</span>
                        <div>
                          <div className="font-bold text-lg dark:text-gray-100">{weather.day}</div>
                          <div className="text-gray-600 dark:text-gray-400">{weather.desc}</div>
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {weather.temp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Farm Summary - Visual Progress Bars */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-xl">
            <CardTitle className="text-2xl flex items-center gap-3">
              <span className="text-3xl">📈</span>
              {language === 'hi' ? 'खेत का सारांश / Farm Summary' : 'Farm Summary'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-2xl border-2 border-green-200 dark:border-green-900">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🌾</span>
                    <div>
                      <div className="font-bold text-lg dark:text-gray-100">
                        {language === 'hi' ? 'फसल की वृद्धि' : 'Crop Growth'}
                      </div>
                      <div className="text-green-600 dark:text-green-400 font-medium">85% स्वस्थ / Healthy</div>
                    </div>
                  </div>
                  <Progress value={85} className="h-4" />
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-2xl border-2 border-blue-200 dark:border-blue-900">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">💧</span>
                    <div>
                      <div className="font-bold text-lg dark:text-gray-100">
                        {language === 'hi' ? 'सिंचाई स्थिति' : 'Irrigation Status'}
                      </div>
                      <div className="text-blue-600 dark:text-blue-400 font-medium">72% पूर्ण / Complete</div>
                    </div>
                  </div>
                  <Progress value={72} className="h-4" />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-yellow-50 dark:bg-yellow-950/20 p-6 rounded-2xl border-2 border-yellow-200 dark:border-yellow-900">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🎯</span>
                    <div>
                      <div className="font-bold text-lg dark:text-gray-100">
                        {language === 'hi' ? 'उत्पादन लक्ष्य' : 'Yield Target'}
                      </div>
                      <div className="text-yellow-600 dark:text-yellow-400 font-medium">90% पूर्ण / Complete</div>
                    </div>
                  </div>
                  <Progress value={90} className="h-4" />
                </div>

                <div className="bg-purple-50 dark:bg-purple-950/20 p-6 rounded-2xl border-2 border-purple-200 dark:border-purple-900">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🛡️</span>
                    <div>
                      <div className="font-bold text-lg dark:text-gray-100">
                        {language === 'hi' ? 'सुरक्षा स्कोर' : 'Protection Score'}
                      </div>
                      <div className="text-purple-600 dark:text-purple-400 font-medium">95% सुरक्षित / Protected</div>
                    </div>
                  </div>
                  <Progress value={95} className="h-4" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Emergency Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-8 rounded-3xl shadow-xl"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-3">
            <span className="text-4xl">🚨</span>
            {language === 'hi' ? 'आपातकालीन सहायता' : 'Emergency Help'}
          </h2>
          <p className="text-lg opacity-90 mt-2">
            {language === 'hi' ? 'समस्या है? तुरंत सहायता पाएं' : 'Having problems? Get immediate help'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="secondary"
            className="h-16 bg-white text-red-600 hover:bg-red-50 font-bold text-lg flex items-center gap-3"
          >
            <span className="text-2xl">📞</span>
            {language === 'hi' ? 'कॉल करें' : 'Call Help'}
          </Button>

          <Button
            variant="secondary"
            className="h-16 bg-white text-red-600 hover:bg-red-50 font-bold text-lg flex items-center gap-3"
          >
            <span className="text-2xl">💬</span>
            {language === 'hi' ? 'चैट सहायता' : 'Chat Support'}
          </Button>

          <Button
            variant="secondary"
            className="h-16 bg-white text-red-600 hover:bg-red-50 font-bold text-lg flex items-center gap-3"
          >
            <span className="text-2xl">🤖</span>
            {language === 'hi' ? 'AI सहायक' : 'AI Assistant'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}