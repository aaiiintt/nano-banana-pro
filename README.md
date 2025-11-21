# Nano Banana Pro 🍌✈️

**L'Art du Voyage** - An AI-powered travel poster generator built with React and Gemini 3.

## Overview

Nano Banana Pro creates beautiful vintage-style Air France travel posters for your upcoming trips. Select your destination and explore a 5-day countdown with AI-generated artwork for essential travel information like weather, exchange rates, gastronomy highlights, and more.

## Features

- 🎨 **AI-Generated Vintage Posters** - Powered by Google's Gemini 3 Pro Image Preview model
- 🌍 **Multiple Destinations** - Copenhagen (CPH), Los Angeles (LAX), and Dubai (DXB)
- 📅 **5-Day Countdown** - Each day reveals unique travel insights
- 🎭 **Customizable Style** - Adjust the master prompt to match your artistic vision
- 📥 **Download Images** - Save generated posters in 4:5 aspect ratio (Instagram-ready)
- ♻️ **Regenerate** - Don't like a design? Generate a new one instantly

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool with Rolldown
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icons
- **Google Gemini 3** - AI image generation

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google AI Studio API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/nano-banana-pro.git
cd nano-banana-pro
```

2. Install dependencies:
```bash
npm install
```

3. Set up your API key:
   - Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Add it to `src/App.jsx` (line 6) or use environment variables

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Building for Production

Build the optimized production bundle:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Deployment

### Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase (select Hosting):
```bash
firebase init
```

4. Deploy:
```bash
npm run build
firebase deploy
```

## Project Structure

```
nano-banana-pro/
├── src/
│   ├── App.jsx          # Main application component
│   ├── App.css          # Styles
│   └── main.jsx         # Entry point
├── public/              # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── README.md            # This file
```

## Customization

### Adding New Destinations

Edit the `PROMPTS_DATA` object in `src/App.jsx` to add new destinations with custom prompts.

### Modifying the Master Style

Click the **Settings** icon in the header to open the Style Director and customize the visual language of your posters.

## API Usage

This app uses the Gemini 3 Pro Image Preview model. Be aware of:
- Rate limits (15 requests per minute for free tier)
- Generation time (~3-5 seconds per image)
- API key security (use environment variables in production)

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Inspired by vintage Air France travel posters
- Powered by Google's Gemini AI
- Built with modern web technologies

---

**Made with ❤️ and AI**
