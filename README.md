# 🎨 Cultura: The AI Taste & Travel Assistant

> *Your Vibe. Your Guide.*

Cultura is an AI-powered web app that understands your personal **taste** in music, movies, places, and more — and gives you curated recommendations.  
Whether you're planning a trip or looking for something new to explore, Cultura blends the power of **Qloo’s Taste AI** and **Gemini Flash 2.5** to help you discover things you’ll actually love.

---

## ✨ Features

### 🎧 Taste Chat
- Ask natural questions like:  
  _“I’m going to Italy and love Wes Anderson films — where should I go?”_
- Cultura extracts your preferences using Gemini + Qloo, and recommends:
  - Destinations
  - Local experiences
  - Music, films, and cultural picks tailored to your vibe

### 🌍 Trip Planner
- Fill out a quick form (location, budget, days)
- Get a full travel itinerary:
  - Flights, hotels, visa tips
  - Daily activity breakdowns
- Chat to modify your trip:  
  _“I want to spend Day 3 in Shibuya instead”_ → updated instantly

---

## 🧠 How It Works

- **Gemini Flash 2.5** interprets natural user input and extracts key tags, entities, and locations
- **Qloo API** is used to infer cultural tastes and provide domain-specific recommendations
- All results are processed and served via a simple **Next.js + TypeScript** backend

---

## 🧰 Tech Stack

- **Frontend**: Next.js 14 (App Router), TailwindCSS, TypeScript, React
- **Backend**: API Routes (`/api/taste`, `/api/trip`, `/api/chat`)
- **AI**: Gemini Flash 2.5 for language understanding  
- **Taste Engine**: Qloo Hackathon API for recommendation logic

---



