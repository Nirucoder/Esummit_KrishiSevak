# KrishiSevak - Quick Start Guide 🚀

Get KrishiSevak running locally in just a few minutes!

## 🎯 Prerequisites

- **Node.js 18+** ([Download here](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)

## ⚡ Quick Setup

1. **Clone and Install**
   ```bash
   git clone https://github.com/your-username/krishisevak.git
   cd krishisevak
   npm install
   ```

2. **Setup Project Structure**
   ```bash
   node setup-project.js
   ```

3. **Configure Environment (Optional)**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys (optional for basic functionality)
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open Your Browser**
   Visit `http://localhost:3000` 🎉

## 🔐 Authentication Setup (Optional)

For full functionality, set up Supabase:

1. **Create account** at [supabase.com](https://supabase.com)
2. **Create new project**
3. **Copy credentials** from Settings → API
4. **Add to .env file**:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

## 🎨 Demo Mode

Without Supabase, the app runs in demo mode with:
- ✅ Full UI functionality
- ✅ All farmer-friendly features
- ✅ Language switching
- ✅ Voice support simulation
- ✅ Sample data and analytics
- ❌ Real user authentication
- ❌ Data persistence

## 🆘 Need Help?

- **Issues?** Check the [README.md](./README.md)
- **Documentation:** Browse the `/guidelines` folder
- **Support:** Create an issue on GitHub

## 🎯 What's Next?

- Explore the farmer-friendly interface
- Test multi-language support
- Try the voice assistance
- Check out government schemes
- Simulate crop scenarios

**Happy farming! 🌱🚜**