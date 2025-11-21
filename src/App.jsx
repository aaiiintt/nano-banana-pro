import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Plane, Calendar, Info, Coffee, Utensils, Map, Ticket, Smile, Loader2, Settings, X, RefreshCcw, Shirt, AlertCircle, Luggage, Sparkles, Camera } from 'lucide-react';

// --- Configuration & Data ---

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""; // Load from environment variables

// Default Master Style (The "Recipe")
const DEFAULT_MASTER_STYLE = `A vintage Air France travel poster from the 1960s, designed in a high-quality lithograph style.
Subject: {subject}
Color Palette: {colors}
Typography: The text "{text}" is boldly and elegantly integrated into the composition.
Artistic Style: Flat vector art, visible paper grain texture, screen print aesthetic, elegant and sophisticated, golden age of travel.`;

// Data: Content (Subject/Text) separated from Style
const PROMPTS_DATA = {
  "CPH": {
    city: "Copenhagen",
    country: "Denmark",
    code: "CPH",
    prompts: [
      {
        day: "Day 5",
        title: "Exchange Rate",
        icon: <Coffee className="w-5 h-5" />,
        subject: "A high-angle close-up of a wooden café table with a porcelain coffee cup, a Danish pastry, and a folded newspaper.",
        copy: "Picture yourself at a sun-drenched café in Nyhavn, where morning light dances across cobblestones and the aroma of freshly baked wienerbrød fills the air. Your Danish adventure is just beginning, and every krone spent is an investment in memories that will last a lifetime.",
        text: "1 EURO = 7.46 DKK",
        colors: "Emerald Green, Deep Navy Blue, Off-White"
      },
      {
        day: "Day 4",
        title: "What to Wear",
        icon: <Shirt className="w-5 h-5" />,
        subject: "A fashion illustration of a traveler in a beige trench coat and wool scarf walking along Nyhavn waterfront.",
        copy: "Copenhagen's beauty shines brightest in the rain. Layer up in elegant Scandinavian style—think tailored coats and soft wool scarves—as you explore fairy-tale streets where hygge meets haute couture. The weather may be crisp, but your spirit will be warm.",
        text: "12°C / RAINY",
        colors: "Autumnal Rust, Navy Blue, Grey"
      },
      {
        day: "Day 3",
        title: "Gastronomy",
        icon: <Utensils className="w-5 h-5" />,
        subject: "A top-down view of a premium lobster salad served on a crisp white tablecloth with silver cutlery. The food looks artful and delicious.",
        copy: "Your journey begins at 35,000 feet, where Air France transforms travel into an art form. Savor exquisitely crafted cuisine as clouds drift below and anticipation builds above. This is more than a flight—it's the elegant prelude to your Nordic adventure.",
        text: "SERVING ONBOARD",
        colors: "Air France Navy, White, Silver"
      },
      {
        day: "Day 2",
        title: "Events",
        icon: <Ticket className="w-5 h-5" />,
        subject: "A glowing lantern and an old-fashioned ticket stub floating in a magical void, representing Tivoli Gardens.",
        copy: "Step into a world where Victorian romance meets modern enchantment. Tivoli Gardens awaits with twinkling lights, carousel music, and the kind of magic that made Hans Christian Andersen fall in love with this city. Some places are pure poetry in motion.",
        text: "TIVOLI GARDENS",
        colors: "Vibrant Yellow, Midnight Blue"
      },
      {
        day: "Day 1",
        title: "Don't Forget",
        icon: <Luggage className="w-5 h-5" />,
        subject: "A minimalist arrangement of packing essentials: A passport, a travel adapter, and a camera on a sleek surface.",
        copy: "The essentials for the perfect Danish escape: your passport (gateway to adventure), a travel adapter (because European outlets have their own charm), and a camera (though no lens can truly capture the magic you're about to experience). Pack light, dream big.",
        text: "DON'T FORGET...",
        colors: "Navy Blue, White, Sand"
      }
    ]
  },
  "LAX": {
    city: "Los Angeles",
    country: "USA",
    code: "LAX",
    prompts: [
      {
        day: "Day 5",
        title: "Exchange Rate",
        icon: <Coffee className="w-5 h-5" />,
        subject: "A sun-drenched outdoor table with a takeaway coffee cup and a currency receipt under the shadow of a palm tree.",
        copy: "Golden California sunshine comes with golden opportunities. From beachfront brunches to Beverly Hills boutiques, your euros go far in the City of Angels. This is where dreams are currency, and every dollar spent brings you closer to the Hollywood ending of your perfect vacation.",
        text: "1 EURO = 1.08 USD",
        colors: "Palm Green, Sunny Yellow, White"
      },
      {
        day: "Day 4",
        title: "What to Wear",
        icon: <Shirt className="w-5 h-5" />,
        subject: "A stylish figure on a balcony wearing sunglasses and a linen shirt, with the LA skyline in the background.",
        copy: "Dress for perpetual summer in LA's effortless cool. Think breezy linens, designer sunglasses, and that California confidence that comes naturally under endless blue skies. The temperature is perfect, the vibe is eternal, and you're about to look absolutely golden.",
        text: "24°C / SUNNY",
        colors: "Azure Blue, Pink, Gold"
      },
      {
        day: "Day 3",
        title: "Gastronomy",
        icon: <Utensils className="w-5 h-5" />,
        subject: "Seared Scallops arranged geometrically on a rectangular plate, sitting on an airplane tray table against a sunset window view.",
        copy: "Before you touch down in Los Angeles, indulge in the kind of elevated cuisine that makes the journey as memorable as the destination. Air France brings Michelin-starred inspiration to the skies, turning your transatlantic flight into a preview of the extraordinary experiences awaiting you.",
        text: "SERVING ONBOARD",
        colors: "Sunset Orange, Navy, White"
      },
      {
        day: "Day 2",
        title: "Events",
        icon: <Ticket className="w-5 h-5" />,
        subject: "A chrome car hood ornament gleaming under a single spotlight beam.",
        copy: "In a city built on wheels and dreams, the LA Auto Show celebrates both. Witness tomorrow's automotive masterpieces today, where sleek design meets cutting-edge innovation under the California sun. This is where horsepower meets Hollywood glamour, and you have a front-row seat.",
        text: "LA AUTO SHOW",
        colors: "Pale Yellow, Midnight Black"
      },
      {
        day: "Day 1",
        title: "Don't Forget",
        icon: <Luggage className="w-5 h-5" />,
        subject: "A flat-lay illustration of packing items: Sunglasses, a driving license, and sunscreen.",
        copy: "Pack your essentials for the West Coast dream: statement sunglasses to shield your eyes from that famous California glare, your driver's license for cruising PCH, and plenty of sunscreen (the sun here doesn't play favorites). Adventure awaits, and you're dressed for the part.",
        text: "DON'T FORGET...",
        colors: "Ocean Blue, White, Red Accent"
      }
    ]
  },
  "DXB": {
    city: "Dubai",
    country: "UAE",
    code: "DXB",
    prompts: [
      {
        day: "Day 5",
        title: "Exchange Rate",
        icon: <Coffee className="w-5 h-5" />,
        subject: "A traditional Arabic tea set on a table with the Burj Khalifa silhouette in the distance.",
        copy: "In a city where ambition reaches the clouds and luxury knows no limits, your currency opens doors to experiences beyond imagination. From gold-dusted cappuccinos to sky-high adventures, Dubai transforms every dirham into a moment of pure extravagance. Welcome to where the future lives.",
        text: "1 EURO = 3.95 AED",
        colors: "Emerald Green, Sandy Gold"
      },
      {
        day: "Day 4",
        title: "What to Wear",
        icon: <Shirt className="w-5 h-5" />,
        subject: "An elegant figure wearing a loose silk tunic and linen trousers against a geometric Islamic archway.",
        copy: "Embrace the desert heat with flowing fabrics and refined elegance. Dubai's style is all about luxurious comfort—silk that breathes, linen that flows, and an air of sophistication that's perfectly at home among gleaming skyscrapers and ancient souks. Dress for opulence, stay cool under the Arabian sun.",
        text: "32°C / HOT",
        colors: "Sand, White, Azure Blue"
      },
      {
        day: "Day 3",
        title: "Gastronomy",
        icon: <Utensils className="w-5 h-5" />,
        subject: "A close-up of a glossy chocolate entremet dessert on a white porcelain plate with the Air France logo.",
        copy: "As you soar toward the Arabian Peninsula, Air France ensures your arrival is preceded by culinary artistry. Each course is a celebration, each flavor a promise of the extraordinary fusion of cultures awaiting you. The journey to Dubai begins with decadence at altitude.",
        text: "SERVING ONBOARD",
        colors: "Twilight Blue, Chocolate Brown, Gold"
      },
      {
        day: "Day 2",
        title: "Events",
        icon: <Ticket className="w-5 h-5" />,
        subject: "Abstract macro details of watch gears and springs arranged geometrically.",
        copy: "Where precision meets prestige, Dubai Watch Week showcases horological masterpieces in the city that never stops reaching for tomorrow. Marvel at timepieces worth fortunes, where every tick is testimony to human craftsmanship. In Dubai, even time itself is luxurious.",
        text: "DUBAI WATCH WEEK",
        colors: "Gold, Black, Navy"
      },
      {
        day: "Day 1",
        title: "Don't Forget",
        icon: <Luggage className="w-5 h-5" />,
        subject: "A graphic arrangement of packing items: A silk scarf, sunglasses, and a passport.",
        copy: "Your passport to paradise, designer sunglasses for those impossibly bright desert days, and a silk scarf for evenings when air-conditioning meets elegance. Dubai demands you arrive prepared for a thousand-and-one nights of modern Arabian luxury. Pack smart, live lavishly.",
        text: "DON'T FORGET...",
        colors: "Sand, Navy, White"
      }
    ]
  }
};

// --- API Utilities ---

async function generateImage(finalPrompt) {
  // Using the new Gemini 3 Pro Image Preview model
  const modelName = "gemini-3-pro-image-preview";

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  try {
    const requestBody = {
      contents: [{
        parts: [{ text: finalPrompt + " Aspect ratio: 4:5. Do not include any logos, text, or watermarks." }]
      }]
    };
    console.log("DEBUG: Sending request body:", JSON.stringify(requestBody));
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("API Error details:", errText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Handle Gemini 3 response structure
    const candidate = data.candidates?.[0];
    const part = candidate?.content?.parts?.[0];

    if (part?.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    } else if (part?.text) {
      // Fallback if it returns a text description or URL (unlikely for image model but good to handle)
      console.warn("Received text instead of image data:", part.text);
      throw new Error("Model returned text instead of image.");
    }

    throw new Error("No image generated in response");
  } catch (error) {
    console.error("Generation failed:", error);
    return null;
  }
}

// --- Components ---

const AdminPanel = ({ isOpen, onClose, masterStyle, setMasterStyle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-100">
        <div className="bg-[#051039] text-white p-5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-white/80" />
            <h3 className="font-serif text-xl tracking-wide">Style Director</h3>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto bg-gray-50/50">
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-3 font-bold">
            Master Style Template
          </label>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Define the visual language for the campaign.
            Use <span className="font-mono bg-white border border-gray-200 px-1.5 py-0.5 rounded text-[#FF0000] text-xs">{`{subject}`}</span>,
            <span className="font-mono bg-white border border-gray-200 px-1.5 py-0.5 rounded text-[#FF0000] text-xs">{`{text}`}</span>, and
            <span className="font-mono bg-white border border-gray-200 px-1.5 py-0.5 rounded text-[#FF0000] text-xs">{`{colors}`}</span> as placeholders.
          </p>
          <textarea
            value={masterStyle}
            onChange={(e) => setMasterStyle(e.target.value)}
            className="w-full h-64 p-4 border border-gray-200 rounded-lg font-mono text-sm focus:ring-2 focus:ring-[#051039]/20 focus:border-[#051039] outline-none leading-relaxed shadow-sm resize-none bg-white"
          />
        </div>
        <div className="p-5 border-t border-gray-100 bg-white flex justify-end items-center gap-4">
          <button
            onClick={() => setMasterStyle(DEFAULT_MASTER_STYLE)}
            className="text-xs text-gray-500 underline hover:text-[#FF0000] mr-auto transition-colors"
          >
            Reset to Default
          </button>
          <button
            onClick={onClose}
            className="bg-[#051039] text-white px-6 py-2.5 rounded-lg hover:bg-blue-900 transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest text-xs font-bold shadow-lg shadow-blue-900/20"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center h-full w-full text-[#051039]">
    <div className="relative">
      <div className="absolute inset-0 bg-[#FF0000]/20 rounded-full animate-ping"></div>
      <Loader2 className="w-12 h-12 animate-spin relative z-10" />
    </div>
    <span className="mt-6 text-xs tracking-[0.2em] uppercase font-medium animate-pulse">Creating Masterpiece...</span>
  </div>
);

const PosterFrame = ({ children, className = "" }) => (
  <div className={`bg-white p-4 sm:p-6 shadow-2xl relative ${className} group overflow-hidden aspect-[4/5]`}>
    {/* The Marie-Louise Border Effect */}
    <div className="bg-[#F9F9F9] h-full w-full shadow-[inset_0_2px_15px_rgba(0,0,0,0.05)] flex items-center justify-center overflow-hidden relative border border-gray-100">
      {children}
    </div>

    {/* Air France Brand Accent - Corner */}
    <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-4 bg-[#FF0000] transform rotate-45 translate-x-8 -translate-y-2 shadow-md"></div>
    </div>

    {/* Subtle Texture Overlay */}
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")' }}></div>
  </div>
);

const DestinationCard = ({ code, city, country, onClick, index }) => (
  <button
    onClick={onClick}
    className="group relative bg-white overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 w-full h-64 sm:h-80 text-left border border-gray-100 flex flex-col"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    {/* Background Image Placeholder or Gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 group-hover:scale-105 transition-transform duration-700"></div>

    {/* Hover Overlay */}
    <div className="absolute inset-0 bg-[#051039] opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>

    {/* Content */}
    <div className="p-8 h-full flex flex-col justify-between relative z-10">
      <div>
        <div className="w-12 h-1 bg-[#FF0000] mb-6 transform origin-left group-hover:scale-x-150 transition-transform duration-500"></div>
        <h3 className="text-5xl font-serif text-[#051039] leading-none mb-2 tracking-tighter">{code}</h3>
        <p className="text-sm tracking-[0.25em] uppercase text-gray-500 font-medium">{city}</p>
      </div>

      <div className="flex justify-between items-end border-t border-gray-200 pt-6 group-hover:border-gray-300 transition-colors">
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{country}</span>
        <div className="bg-white p-2 rounded-full shadow-sm group-hover:shadow-md transition-all group-hover:bg-[#051039] group-hover:text-white">
          <Plane className="w-5 h-5 transform group-hover:rotate-45 transition-transform duration-500" />
        </div>
      </div>
    </div>
  </button>
);

const CountdownDay = ({ data, isActive, onGenerate, imageUrl, isGenerating, onRegenerate }) => {
  // Images are now preloaded when destination is selected, no need to generate on active

  if (!isActive) return null;

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in flex flex-col md:flex-row gap-8 items-center md:items-start">

      {/* Left Column: Context & Info */}
      <div className="w-full md:w-1/3 space-y-8 pt-4 md:text-right order-2 md:order-1">
        <div className="space-y-2">
          <h2 className="text-4xl md:text-6xl font-serif text-[#051039]">{data.day}</h2>
          <div className="h-1 w-12 bg-[#FF0000] md:ml-auto"></div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 md:justify-end text-[#051039]">
            {data.icon}
            <span className="uppercase tracking-[0.2em] text-sm font-bold">{data.title}</span>
          </div>
          <p className="text-gray-600 font-light leading-relaxed text-[15px]">
            {data.copy}
          </p>
        </div>

        <div className="pt-8 border-t border-gray-100">
          <div className="inline-flex flex-col items-start md:items-end">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Key Information</span>
            <span className="font-mono text-lg text-[#051039]">{data.text}</span>
          </div>
        </div>

        {imageUrl && (
          <div className="pt-4 flex md:justify-end gap-4">
            <button
              onClick={async () => {
                try {
                  const response = await fetch(imageUrl);
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `nano-banana-${data.city}-${data.day}.jpg`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(url);
                } catch (e) {
                  console.error("Download failed:", e);
                }
              }}
              className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 hover:text-[#051039] transition-colors group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-500"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
              Download
            </button>
            <button
              onClick={onRegenerate}
              className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 hover:text-[#051039] transition-colors group"
            >
              <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              Regenerate Art
            </button>
          </div>
        )}
      </div>

      {/* Right Column: The Artwork */}
      <div className="w-full md:w-2/3 order-1 md:order-2">
        <PosterFrame className="aspect-[3/4] shadow-2xl transform transition-all duration-700 hover:scale-[1.01] hover:shadow-3xl">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={data.title}
              className="w-full h-full object-cover animate-scale-in"
            />
          ) : (
            <LoadingSpinner />
          )}
        </PosterFrame>
      </div>

    </div>
  );
};

const App = () => {
  const [selectedDest, setSelectedDest] = useState(null);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  // Image State
  const [generatedImages, setGeneratedImages] = useState({}); // Key: "DEST-DAYINDEX"
  const [generatingState, setGeneratingState] = useState({}); // Key: "DEST-DAYINDEX"

  // Admin & Style State
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [masterStyle, setMasterStyle] = useState(DEFAULT_MASTER_STYLE);

  const handleDestSelect = (code) => {
    setSelectedDest(code);
    setCurrentDayIndex(0);
  };

  // Preload all images when destination is selected
  useEffect(() => {
    if (selectedDest) {
      const totalDays = PROMPTS_DATA[selectedDest].prompts.length;

      // Start generating all images sequentially
      // We do this sequentially to avoid hitting rate limits
      const preloadImages = async () => {
        for (let i = 0; i < totalDays; i++) {
          await generateForDay(selectedDest, i);
          // Small delay between requests to be respectful of API limits
          if (i < totalDays - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
      };

      preloadImages();
    }
  }, [selectedDest]); // Only run when destination changes

  const handleBack = () => {
    setSelectedDest(null);
  };

  const handleNext = () => {
    if (selectedDest && currentDayIndex < PROMPTS_DATA[selectedDest].prompts.length - 1) {
      setCurrentDayIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentDayIndex > 0) {
      setCurrentDayIndex(prev => prev - 1);
    }
  };

  const constructPrompt = (promptData) => {
    let finalPrompt = masterStyle;
    finalPrompt = finalPrompt.replace('{subject}', promptData.subject);
    finalPrompt = finalPrompt.replace('{text}', promptData.text);
    finalPrompt = finalPrompt.replace('{colors}', promptData.colors);
    return finalPrompt;
  };

  const generateForDay = async (destCode, index, force = false) => {
    const key = `${destCode}-${index}`;

    if ((generatedImages[key] && !force) || generatingState[key]) return;

    setGeneratingState(prev => ({ ...prev, [key]: true }));
    if (force) {
      setGeneratedImages(prev => ({ ...prev, [key]: null }));
    }

    const promptData = PROMPTS_DATA[destCode].prompts[index];
    const finalPrompt = constructPrompt(promptData);

    console.log("Generating with Gemini 3...", finalPrompt);

    const image = await generateImage(finalPrompt);

    if (image) {
      setGeneratedImages(prev => ({ ...prev, [key]: image }));
    }

    setGeneratingState(prev => ({ ...prev, [key]: false }));
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#051039] font-sans selection:bg-[#051039] selection:text-white flex flex-col overflow-x-hidden">

      {/* --- Header --- */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-40 h-20 flex items-center justify-between px-6 sm:px-12 transition-all duration-300">
        <div className="flex items-center gap-6">
          {selectedDest ? (
            <button onClick={handleBack} className="group flex items-center gap-2 text-sm uppercase tracking-widest text-gray-500 hover:text-[#051039] transition-colors">
              <div className="p-2 bg-gray-100 rounded-full group-hover:bg-[#051039] group-hover:text-white transition-all">
                <ChevronLeft className="w-4 h-4" />
              </div>
              <span className="hidden sm:inline">Back</span>
            </button>
          ) : (
            <div className="w-8"></div> // Spacer
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsAdminOpen(true)}
            className="p-2 text-gray-400 hover:text-[#051039] transition-colors"
            title="Style Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="pt-32 pb-12 px-4 sm:px-6 max-w-7xl mx-auto flex-grow flex flex-col justify-center w-full relative">

        {!selectedDest ? (
          // DESTINATION SELECTOR
          <div className="w-full max-w-6xl mx-auto animate-fade-in">
            <div className="text-center mb-20 space-y-6">
              <h1 className="text-4xl sm:text-6xl font-serif tracking-tight text-[#051039]">
                <span className="font-bold">L'ART</span> <span className="italic text-gray-400 font-light mx-2">du</span> VOYAGE
              </h1>
              <p className="text-gray-500 font-light text-lg max-w-xl mx-auto leading-relaxed">
                Select your destination to simulate a personalized, countdown experience powered by Gemini 3.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 px-4">
              {Object.entries(PROMPTS_DATA).map(([code, data], idx) => (
                <DestinationCard
                  key={code}
                  index={idx}
                  code={code}
                  city={data.city}
                  country={data.country}
                  onClick={() => handleDestSelect(code)}
                />
              ))}
            </div>
          </div>
        ) : (
          // COUNTDOWN CAROUSEL
          <div className="relative w-full flex flex-col items-center">

            {/* Navigation Controls */}
            <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-8 z-30 pointer-events-none">
              <button
                onClick={handlePrev}
                disabled={currentDayIndex === 0}
                className={`pointer-events-auto p-4 rounded-full bg-white shadow-xl border border-gray-100 text-[#051039] transition-all hover:scale-110 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentDayIndex === PROMPTS_DATA[selectedDest].prompts.length - 1}
                className={`pointer-events-auto p-4 rounded-full bg-[#051039] shadow-xl border border-[#051039] text-white transition-all hover:scale-110 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0`}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Indicators */}
            <div className="flex gap-3 mb-12">
              {PROMPTS_DATA[selectedDest].prompts.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentDayIndex(idx)}
                  className={`h-1 rounded-full transition-all duration-500 ${idx === currentDayIndex ? "bg-[#FF0000] w-12" : "bg-gray-200 w-4 hover:bg-gray-300"
                    }`}
                />
              ))}
            </div>

            {/* Slides Container */}
            <div className="w-full relative min-h-[700px]">
              {PROMPTS_DATA[selectedDest].prompts.map((item, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-700 ease-out transform ${index === currentDayIndex
                    ? "opacity-100 translate-x-0 scale-100 pointer-events-auto z-10 blur-0"
                    : index < currentDayIndex
                      ? "opacity-0 -translate-x-24 scale-95 pointer-events-none z-0 blur-sm"
                      : "opacity-0 translate-x-24 scale-95 pointer-events-none z-0 blur-sm"
                    }`}
                >
                  <CountdownDay
                    data={item}
                    isActive={index === currentDayIndex}
                    onGenerate={() => generateForDay(selectedDest, index)}
                    onRegenerate={() => generateForDay(selectedDest, index, true)}
                    imageUrl={generatedImages[`${selectedDest}-${index}`]}
                    isGenerating={generatingState[`${selectedDest}-${index}`]}
                  />
                </div>
              ))}
            </div>

          </div>
        )}
      </main>

      {/* Admin Modal */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        masterStyle={masterStyle}
        setMasterStyle={setMasterStyle}
      />

      {/* Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&family=Caveat:wght@400;700&display=swap');
        
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        .font-handwriting { font-family: 'Caveat', cursive; }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }

        @keyframes scale-in {
          from { transform: scale(1.1); opacity: 0; filter: blur(10px); }
          to { transform: scale(1); opacity: 1; filter: blur(0); }
        }
        .animate-scale-in { animation: scale-in 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
      `}</style>
    </div>
  );
};

export default App;
