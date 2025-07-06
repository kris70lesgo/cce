"use client";
import React, { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconPlus,
  IconSearch,
  IconCannabis,
  IconMicrophone,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import SendButton from "@/components/button";


// MAIN COMPONENT
export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const links = [
    {
      label: "Dashboard",
      href: "/preferences",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-200" />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-200" />
      ),
    },
  ];

  return (
    <div className="min-h-screen w-full relative text-white">
      {/* Dark Horizon Glow Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, #000000 40%, #0d1a36 100%)",
        }}
      />

      {/* Foreground Layout */}
      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10 bg-[#101624] border-r border-neutral-800">
            <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center mt-4"
              >
                <button
                  onClick={() => setOpen(!open)}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  {open ? (
                    <IconArrowLeft className="h-5 w-5" />
                  ) : (
                    <IconBrandTabler className="h-5 w-5" />
                  )}
                </button>
              </motion.div>
            </div>
          </SidebarBody>
        </Sidebar>

        {/* Main Dashboard Content */}
        <div className="flex flex-1 flex-col justify-center items-center p-6 overflow-y-auto">
          {/* Centered Content */}
          <div className="flex flex-col items-center justify-center flex-1 max-w-4xl w-full">
            {/* Main Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-6xl font-normal bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent leading-tight">
                Hello, user
              </h1>
            </motion.div>
          </div>

          {/* Search Input Section moved to bottom */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-4xl mt-auto" // Increased max width
          >
            {/* Search Input */}
            <div className="relative mb-4">
              {/* Removed the glowing gradient background */}
              <div className="relative bg-[#111827] border border-neutral-700 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-start space-x-2">
                  
                  <textarea
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ask anything"
                    className="flex-1 bg-transparent text-white placeholder-neutral-400 focus:outline-none text-base resize-none pt-1"
                    style={{
                      fontFamily: "Inter, Arial, sans-serif",
                      minWidth: "0",
                      height: "4.5rem", // or your preferred height
                      lineHeight: "1.5rem", // normal line height
                    }}
                  />
                  {/* Up Arrow Button */}
                  <SendButton />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Logo Component
const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-white"
      >
        Ctura
      </motion.span>
    </a>
  );
};

// LogoIcon Component
const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-white" />
    </a>
  );
};