# 🌾 KrishiSevak - AI-Powered Smart Farming Platform

<div align="center">

![KrishiSevak Banner](https://img.shields.io/badge/KrishiSevak-Smart%20Farming-green?style=for-the-badge&logo=leaf)

**Empowering Farmers with AI, Satellite Technology, and Real-Time Insights**

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=flat-square)](https://your-app.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Powered by AI](https://img.shields.io/badge/Powered%20by-OpenAI-412991?style=flat-square&logo=openai)](https://openai.com/)

</div>

---

## 📖 About KrishiSevak

**KrishiSevak** (meaning "Servant of Agriculture" in Hindi) is a comprehensive web application designed to revolutionize farming through technology. Built with modern web technologies and powered by AI, it provides farmers with actionable insights for better crop management, soil health monitoring, and data-driven decision making.

### 🎯 Mission
To bridge the technology gap in agriculture and empower farmers with tools that were previously accessible only to large agricultural corporations.

---

## ✨ Key Features

### 🛰️ **Satellite Crop Monitoring**
- Real-time NDVI (Normalized Difference Vegetation Index) analysis
- Historical crop health trends
- Satellite imagery from AgroMonitoring API
- Visual health indicators with color-coded maps

### 🌡️ **Weather Intelligence**
- 7-day weather forecasts
- Temperature, humidity, and precipitation data
- Weather-based farming recommendations
- Alert system for adverse conditions

### 🧪 **Soil Health Analysis**
- Comprehensive soil testing metrics (NPK, pH, moisture)
- Personalized fertilizer recommendations
- Soil improvement strategies
- Historical soil data tracking

### 🤖 **AI-Powered Assistant**
- Natural language conversations about farming
- Crop-specific advice and recommendations
- Pest and disease identification
- Best practices and seasonal tips
- Powered by OpenAI GPT

### 🎤 **Voice Support (Bilingual)**
- Hands-free operation for farmers in the field
- English and Hindi voice commands
- Text-to-speech responses
- Browser-based speech recognition (no app installation needed)

### 📊 **Analytics & Insights**
- Yield prediction models
- Cost-benefit analysis
- Water usage optimization
- Scenario planning tools
- Export reports (CSV/PDF)

### 🌍 **Bilingual Interface**
- Full support for **English** and **हिंदी (Hindi)**
- Seamless language switching
- Culturally appropriate content
- Voice support in both languages

### 📱 **Responsive Design**
- Works on desktop, tablet, and mobile
- Progressive Web App (PWA) capabilities
- Offline-first architecture for critical features
- Touch-optimized interface

---

## 🖼️ Screenshots

<div align="center">

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)
*Main dashboard with farm status overview*

### Crop Monitoring
![Crop Monitoring](docs/screenshots/crop-monitoring.png)
*Satellite-based crop health analysis*

### AI Assistant
![AI Assistant](docs/screenshots/ai-assistant.png)
*Intelligent farming recommendations*

</div>

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- API keys (see [Environment Variables](#-environment-variables))

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/krishisevak-app.git
cd krishisevak-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your API keys

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the app running locally.

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
# AgroMonitoring API (Required for satellite features)
# Get your key at: https://agromonitoring.com/api
VITE_AGROMONITORING_API_KEY=your_agromonitoring_api_key

# OpenAI API (Required for AI Assistant)
# Get your key at: https://platform.openai.com/api-keys
VITE_OPENAI_API_KEY=your_openai_api_key

# Supabase (Optional - for user authentication)
# Get your credentials at: https://supabase.com
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id

# Google Earth Engine (Optional - for advanced satellite data)
VITE_GOOGLE_EARTH_ENGINE_API_KEY=your_gee_api_key
```

### Getting API Keys

| Service | Purpose | Free Tier | Sign Up Link |
|---------|---------|-----------|--------------|
| **AgroMonitoring** | Satellite imagery & weather | ✅ Yes | [Sign Up](https://agromonitoring.com/api) |
| **OpenAI** | AI Assistant | ✅ $5 credit | [Sign Up](https://platform.openai.com/signup) |
| **Supabase** | User authentication | ✅ Yes | [Sign Up](https://supabase.com) |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **TailwindCSS** - Styling
- **shadcn/ui** - Component library

### Data & APIs
- **AgroMonitoring API** - Satellite data & weather
- **OpenAI GPT-4** - AI assistant
- **Web Speech API** - Voice recognition
- **Leaflet** - Interactive maps
- **Recharts** - Data visualization

### Deployment
- **Vercel** - Hosting & CI/CD
- **GitHub** - Version control

---

## 📦 Project Structure

```
krishisevak-app/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   ├── CropMonitoring.tsx
│   │   ├── SoilHealthAnalysis.tsx
│   │   ├── WeatherForecast.tsx
│   │   ├── AIAssistant.tsx
│   │   └── VoiceSupport.tsx
│   ├── services/           # API integrations
│   │   └── AgroMonitoringService.ts
│   ├── utils/              # Helper functions
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── .env.example            # Environment template
├── vercel.json            # Vercel configuration
├── DEPLOYMENT.md          # Deployment guide
└── README.md              # This file
```

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/krishisevak-app)

**Manual Deployment:**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Add environment variables
   - Click "Deploy"

3. **Configure Environment Variables**
   - In Vercel Dashboard → Settings → Environment Variables
   - Add all variables from `.env.example`

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🎤 Voice Commands

The app supports voice commands in both English and Hindi:

### English Commands
- "Show crop monitoring"
- "Check soil health"
- "What is the weather today?"
- "Show recommendations"
- "Navigate to satellite analysis"

### Hindi Commands (हिंदी)
- "फसल निगरानी दिखाएं" (Show crop monitoring)
- "मिट्टी का स्वास्थ्य जांचें" (Check soil health)
- "आज मौसम कैसा है?" (What is the weather today?)
- "सुझाव दिखाएं" (Show recommendations)

**Note:** Voice features require an internet connection and work best on Chrome/Edge browsers.

---

## 🧪 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Type check
npm run type-check
```

### Code Quality
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Git hooks** for pre-commit checks

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Contribution Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **AgroMonitoring** for providing satellite data APIs
- **OpenAI** for powering the AI assistant
- **shadcn/ui** for beautiful, accessible components
- **The farming community** for inspiration and feedback
- **Open source contributors** who made this possible

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/krishisevak-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/krishisevak-app/discussions)
- **Email**: your.email@example.com

---

## 🗺️ Roadmap

### Current Version (v1.0)
- ✅ Satellite crop monitoring
- ✅ Weather forecasting
- ✅ Soil health analysis
- ✅ AI assistant
- ✅ Voice support (English/Hindi)
- ✅ Bilingual interface

### Planned Features (v2.0)
- [ ] Mobile app (React Native)
- [ ] Offline mode with local data sync
- [ ] Community marketplace
- [ ] Crop disease detection via image upload
- [ ] Integration with IoT sensors
- [ ] Multi-farm management
- [ ] Advanced analytics dashboard
- [ ] WhatsApp bot integration

---

## 📊 Stats

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/krishisevak-app?style=social)
![GitHub forks](https://img.shields.io/github/forks/YOUR_USERNAME/krishisevak-app?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/YOUR_USERNAME/krishisevak-app?style=social)

</div>

---

<div align="center">

**Made with ❤️ for farmers 🌾**

*Empowering agriculture through technology*

[Website](https://your-app.vercel.app) • [Documentation](./docs) • [Report Bug](https://github.com/YOUR_USERNAME/krishisevak-app/issues) • [Request Feature](https://github.com/YOUR_USERNAME/krishisevak-app/issues)

</div>