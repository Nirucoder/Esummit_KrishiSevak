# KrishiSevak - Smart Farming Solutions 🌱

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0.0-blueviolet.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.39.0-green.svg)](https://supabase.com/)

KrishiSevak is a comprehensive AI-powered agricultural platform designed specifically for Indian farmers. It provides ML-powered crop yield predictions, satellite analysis, and actionable recommendations to help farmers optimize irrigation, fertilization, and pest control.

## 🌟 Features

### Core Features
- **🎯 Yield Prediction**: AI-powered crop yield forecasting
- **🛰️ Satellite Analysis**: Real-time satellite imagery analysis
- **📊 Comprehensive Monitoring**: Crop, soil, drought, and weather monitoring
- **📈 Analytics & Simulation**: Detailed analytics with scenario planning
- **🔍 Recommendations Engine**: Personalized farming recommendations
- **🏛️ Government Schemes**: Access to agricultural schemes and subsidies

### Farmer-Friendly Design
- **🎨 Visual Interface**: Icon-based navigation for low-literacy users
- **🌐 Multi-language Support**: Hindi, English, and 7 regional Indian languages
- **🗣️ Voice Support**: AI voice assistance in multiple languages
- **📱 Mobile-First**: Responsive design optimized for smartphones
- **🎨 Agriculture-Inspired Colors**: Intuitive color coding for different sections

### Technology Integration
- **🤖 AI Assistant**: Intelligent chatbot for farming queries
- **📧 WhatsApp Alerts**: Real-time notifications and alerts
- **🌍 Google Earth Engine**: Satellite data integration
- **☁️ Supabase Backend**: Secure user authentication and data storage
- **📊 Advanced Analytics**: Interactive charts and data visualization

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/krishisevak.git
   cd krishisevak
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   # Copy the environment template
   cp .env.example .env
   
   # Edit the .env file with your actual values
   nano .env
   ```

4. **Configure Environment Variables**

   Edit the `.env` file with your actual API keys:

   ```env
   # Supabase Configuration (Required for authentication)
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Optional API Keys
   VITE_GOOGLE_EARTH_ENGINE_API_KEY=your_gee_api_key
   VITE_WEATHER_API_KEY=your_weather_api_key
   VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key

   # Development Settings
   VITE_APP_ENV=development
   VITE_APP_VERSION=1.0.0
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000` to see the application.

## 🔧 Supabase Setup

To fully utilize KrishiSevak's features, you'll need to set up a Supabase project:

1. **Create a Supabase account** at [supabase.com](https://supabase.com)

2. **Create a new project**
   - Choose a project name (e.g., "krishisevak")
   - Select a region closest to your users
   - Set a strong database password

3. **Get your project credentials**
   - Go to Settings → API
   - Copy the `Project URL` and `anon public` key
   - Add these to your `.env` file

4. **Configure Authentication** (Optional)
   - Go to Authentication → Settings
   - Configure email/password authentication
   - Set up any social providers you want to use

5. **Database Setup** (Optional)
   - The app will work with basic authentication
   - You can extend the database schema as needed

## 📁 Project Structure

```
krishisevak/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components (shadcn/ui)
│   │   ├── figma/          # Figma-specific components
│   │   └── *.tsx           # Feature components
│   ├── services/           # API services and integrations
│   ├── utils/              # Utility functions and helpers
│   ├── styles/             # Global CSS and Tailwind config
│   └── supabase/           # Supabase configuration
├── public/                 # Static assets
├── guidelines/             # Development guidelines
└── Configuration files...
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Type checking
npm run type-check   # Run TypeScript compiler
```

## 🌐 Multi-language Support

KrishiSevak supports the following languages:
- **English** (en)
- **Hindi** (hi)
- **Bengali** (bn)
- **Telugu** (te)
- **Marathi** (mr)
- **Tamil** (ta)
- **Gujarati** (gu)
- **Kannada** (kn)
- **Malayalam** (ml)
- **Odia** (or)

Language files are located in `src/utils/languages.ts`.

## 🎨 Customization

### Theme Colors
The app uses agriculture-inspired colors defined in `src/styles/globals.css`:
- **Primary Green**: For main actions and navigation
- **Secondary Green**: For secondary actions
- **Earth Tones**: For soil and drought monitoring
- **Sky Blue**: For weather and water-related features
- **Wheat Gold**: For crop and yield information

### Farmer-Friendly Classes
Special CSS classes for enhanced farmer experience:
- `.btn-farmer`: Large, touch-friendly buttons
- `.card-farmer`: Enhanced visual cards
- `.text-farmer`: Large, readable text
- `.emoji-large/.emoji-xl`: Large emoji displays

## 🔌 API Integrations

### Google Earth Engine
- Satellite imagery analysis
- NDVI and crop health monitoring
- Environmental data processing

### Weather APIs
- Real-time weather data
- Forecast information
- Climate monitoring

### Government Schemes API
- All scheme links redirect to official government websites
- Real-time scheme information
- Application status tracking

## 📱 Mobile Optimization

KrishiSevak is designed mobile-first with:
- Touch-friendly buttons (minimum 44px height)
- Large text for readability
- Simplified navigation
- Offline-capable design
- Fast loading on slow networks

## 🚀 Deployment

### Using Vercel (Recommended)

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Configure Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Ensure VITE_ prefix for client-side variables

### Using Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `dist` folder to Netlify
   - Or connect your Git repository

### Using Traditional Hosting

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Upload the `dist` folder** to your web server

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. **Check the Issues** section on GitHub
2. **Create a new issue** with detailed information
3. **Contact Support** at support@krishisevak.com

## 🙏 Acknowledgments

- **Indian Farmers** - Our primary users and inspiration
- **Google Earth Engine** - Satellite data and analysis
- **Supabase** - Backend infrastructure
- **Shadcn/UI** - Component library
- **Tailwind CSS** - Styling framework
- **React Community** - Amazing ecosystem

## 🔮 Roadmap

- [ ] Offline functionality
- [ ] Advanced ML model integration
- [ ] Pest and disease detection
- [ ] Market price predictions
- [ ] Community features
- [ ] Mobile app (React Native)
- [ ] Regional language voice support
- [ ] IoT sensor integration

---

**Made with ❤️ for Indian Farmers**

*Empowering agriculture through technology*