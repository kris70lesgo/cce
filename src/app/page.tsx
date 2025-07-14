// app/page.tsx (App Router) or pages/index.tsx (Pages Router)
"use client";
import  DashboardPage  from '@/components/canvas';
/*
export default function Home() {
  return <DashboardPage />;
}
*/


import { motion } from "motion/react";
import React from "react";

import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { TextFade } from "@/components/your-textfade-path"; // update if needed
import { AnimatedShinyTextDemo } from "@/components/your-animated-shiny-path"; // update if needed

export default function FlickeringGridDemo() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Background */}
      <FlickeringGrid
        className="absolute inset-0 z-0 size-full"
        squareSize={4}
        gridGap={6}
        color="#6B7280"
        maxOpacity={0.5}
        flickerChance={0.1}
      />

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-screen w-screen space-y-4">
        {/* Shiny Text */}
        <AnimatedShinyTextDemo />

        {/* Fading Text */}
        <TextFade
          direction="up"
          className="flex flex-col justify-center items-center space-y-0"
        >
          <h2 className="text-xl text-center sm:text-4xl font-bold tracking-tighter md:text-6xl md:leading-[0rem] prose-h2:my-0">
            Fade Up
          </h2>
          <div className="prose-p:my-1 text-center md:text-lg max-w-lg mx-auto text-balance dark:text-zinc-300">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit amet.
          </div>
        </TextFade>
      </div>
    </div>
  );
}

