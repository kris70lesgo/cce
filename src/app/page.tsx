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
 
export default function FlickeringGridDemo() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <FlickeringGrid
        className="absolute inset-0 z-0 size-full"
        squareSize={4}
        gridGap={6}
        color="#6B7280"
        maxOpacity={0.5}
        flickerChance={0.1}
       
      />
    </div>
  );
}
