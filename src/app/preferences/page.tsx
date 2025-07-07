"use client";

import React, { useState } from 'react';
import { Dancing_Script } from 'next/font/google';
import { Checkbox } from '@/components/animate-ui/base/checkbox';
// Types
interface PreferenceCategory {
  id: string;
  title: string;
  icon: string;
  maxSelections: number;
  options: string[];
  gradient: string;
}

interface PreferenceCardProps {
  category: PreferenceCategory;
  selections: Record<string, string[]>;
  onSelectionChange: (categoryId: string, selections: string[]) => void;
  isHovered: boolean;
  onHover: (categoryId: string | null) => void;
}

interface PreferenceSelectionProps {
  categories: PreferenceCategory[];
}

// Dancing Script font
const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['700'],
});

// Individual Card Component
const PreferenceCard: React.FC<PreferenceCardProps> = ({
  category,
  selections,
  onSelectionChange,
  isHovered,
  onHover
}) => {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  const currentSelections = selections[category.id] || [];

  const isSelected = (option: string) => currentSelections.includes(option);

  const canSelect = () => currentSelections.length < category.maxSelections;

  const getSelectionCount = () => currentSelections.length;

  const handleOptionToggle = (option: string) => {
    if (isSelected(option)) {
      // Remove selection
      const newSelections = currentSelections.filter(s => s !== option);
      onSelectionChange(category.id, newSelections);
    } else if (canSelect()) {
      // Add selection
      const newSelections = [...currentSelections, option];
      onSelectionChange(category.id, newSelections);
    }
  };

  const handleSingleSelect = (option: string) => {
    onSelectionChange(category.id, [option]);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-slate-50/80 to-white/80 backdrop-blur-sm group cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1`}
      onMouseEnter={() => onHover(category.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      {/* Card Header */}
      <div className="pb-4 p-6 relative z-10">
        <div className="flex items-center gap-3 text-xl">
          <span
            className={`text-3xl transition-transform duration-300 ${
              isHovered ? "scale-110 rotate-12" : ""
            }`}
          >
            {category.icon}
          </span>
          <div className="flex-1">
            <div className="font-bold text-slate-800">{category.title}</div>
            <div className="text-sm font-normal text-slate-600 mt-1">
              Pick {category.maxSelections} {category.maxSelections === 1 ? "option" : "options"}
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all duration-300 ${
              getSelectionCount() === category.maxSelections
                ? "bg-green-100 text-green-700 animate-pulse"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {getSelectionCount()}/{category.maxSelections}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="space-y-4 px-6 pb-6 relative z-10">
        {category.maxSelections === 1 ? (
          // Radio button style for single selection
          <div className="space-y-3">
            {category.options.map((option) => (
              <div
                key={option}
                className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 hover:bg-white/50 hover:shadow-md group/option cursor-pointer ${
                  isSelected(option) ? "bg-white/70 shadow-sm" : ""
                }`}
                onClick={() => handleSingleSelect(option)}
                onMouseEnter={() => setHoveredOption(option)}
                onMouseLeave={() => setHoveredOption(null)}
              >
                <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                  isSelected(option)
                    ? "border-purple-500 bg-purple-500"
                    : "border-slate-300 group-hover/option:border-purple-400"
                }`}>
                  {isSelected(option) && (
                    <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                  )}
                </div>
                <span
                  className={`text-sm font-medium leading-none cursor-pointer transition-all duration-300 ${
                    isSelected(option)
                      ? "text-purple-700 font-semibold"
                      : hoveredOption === option
                        ? "text-purple-700"
                        : "text-slate-700"
                  }`}
                >
                  {option}
                </span>
              </div>
            ))}
          </div>
        ) : (
          // Checkbox style for multiple selection
          <div className="space-y-3">
            {category.options.map((option) => (
              <div
                key={option}
                className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 hover:bg-white/50 hover:shadow-md group/option cursor-pointer ${
                  !isSelected(option) && !canSelect() ? "opacity-50 cursor-not-allowed" : ""
                } ${isSelected(option) ? "bg-white/70 shadow-sm" : ""}`}
                onClick={() => handleOptionToggle(option)}
                onMouseEnter={() => setHoveredOption(option)}
                onMouseLeave={() => setHoveredOption(null)}
              >
                <div className={`w-4 h-4 rounded border-2 transition-all duration-300 flex items-center justify-center ${
                  isSelected(option)
                    ? "border-purple-500 bg-purple-500"
                    : "border-slate-300 group-hover/option:border-purple-400"
                }`}>
                  {isSelected(option) && (
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-sm font-medium leading-none cursor-pointer transition-all duration-300 ${
                    isSelected(option)
                      ? "text-purple-700 font-semibold"
                      : hoveredOption === option
                        ? "text-purple-700"
                        : "text-slate-700"
                  } ${!isSelected(option) && !canSelect() ? "cursor-not-allowed" : ""}`}
                >
                  {option}
                </span>
                {isSelected(option) && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Main Component
const PreferenceSelection: React.FC<PreferenceSelectionProps> = ({ categories }) => {
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showCustom, setShowCustom] = useState(false);
  const [custom1, setCustom1] = useState("");
  const [custom2, setCustom2] = useState("");

  const handleSelectionChange = (categoryId: string, newSelections: string[]) => {
    setSelections(prev => ({
      ...prev,
      [categoryId]: newSelections
    }));
  };

  const handleSavePreferences = () => {
    console.log('Saved preferences:', selections);
    // Handle save logic here
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4 mb-8">
        
        <p className="text-lg text-slate-600">
          Select your preferences to help us personalize your experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <PreferenceCard
            key={category.id}
            category={category}
            selections={selections}
            onSelectionChange={handleSelectionChange}
            isHovered={hoveredCard === category.id}
            onHover={setHoveredCard}
          />
        ))}
      </div>

      <div className="flex items-center gap-2 pt-4">
        <Checkbox checked={showCustom} onCheckedChange={setShowCustom} />
        <span
          className="text-lg  cursor-pointer select-none"
          onClick={() => setShowCustom((v) => !v)}
        >
          Custom preferences
        </span>
      </div>

      {showCustom && (
        <div className="mt-6 bg-white/80 rounded-2xl shadow p-6">
          <div className="flex flex-col md:flex-row md:gap-8 gap-4 items-start">
            <div className="flex-1">
              <label className="block text-slate-700 font-semibold mb-2">
                Custom Interest 1
              </label>
              <input
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                placeholder="Enter your interest..."
                value={custom1}
                onChange={e => setCustom1(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-slate-700 font-semibold mb-2">
                Custom Interest 2
              </label>
              <input
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                placeholder="Enter your interest..."
                value={custom2}
                onChange={e => setCustom2(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center pt-8">
        <button
          onClick={handleSavePreferences}
          className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center gap-2"
        >
          <span>Save Preferences</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Demo with sample data
const App: React.FC = () => {
  const categories: PreferenceCategory[] = [
    {
      id: "music",
      title: "Music",
      icon: "🎧",
      maxSelections: 2,
      options: ["Indie Rock", "K-pop", "Jazz", "Techno", "Lo-fi", "Classical", "Trap"],
      gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
      id: "food",
      title: "Food",
      icon: "🍱",
      maxSelections: 2,
      options: ["Vegan", "Korean BBQ", "Fine Dining", "Street Food", "Ramen"],
      gradient: "from-orange-500/20 to-red-500/20",
    },
    {
      id: "movies",
      title: "Movies & Shows",
      icon: "🎬",
      maxSelections: 2,
      options: ["Anime", "Noir Films", "K-Drama", "Arthouse", "Sci-fi Classics"],
      gradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
      id: "fashion",
      title: "Fashion",
      icon: "👗",
      maxSelections: 2, // changed from 1 to 2 for checkbox
      options: ["Streetwear", "Minimalism", "Vintage", "Eco-Fashion"],
      gradient: "from-emerald-500/20 to-teal-500/20",
    },
    {
      id: "art",
      title: "Art & Design",
      icon: "🎨",
      maxSelections: 2, // changed from 1 to 2 for checkbox
      options: ["Brutalism", "Vaporwave", "Scandinavian", "Bauhaus"],
      gradient: "from-violet-500/20 to-purple-500/20",
    },
  ];

  return <PreferenceSelection categories={categories} />;
};

export default function PreferencesPage() {
  return (
    <div className="min-h-screen w-full bg-[#f9fafb] relative">
      {/* Diagonal Fade Grid Background - Top Left */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #d1d5db 1px, transparent 1px),
            linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
        }}
      />
      {/* Dancing Script Title */}
      <h1 className={`${dancingScript.className} text-5xl font-bold text-gray-800 text-center pt-12 relative z-10`}>
        Preferences
      </h1>
      {/* Preferences Content */}
      <div className="relative z-10 pt-8">
        <App />
      </div>
    </div>
  );
}