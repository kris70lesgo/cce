"use client"

import { motion } from "framer-motion"
import { Upload, Zap } from "lucide-react"

export default function Component() {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white">
      <div className="relative">
        {/* Animated red line */}
        <div className="absolute left-[27px] top-[60px] w-[2px] h-[200px] bg-gray-200">
          <motion.div
            className="w-full bg-red-500"
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              repeatType: "loop",
            }}
          />
        </div>

        {/* Step 1 */}
        <div className="flex items-start gap-6 mb-12">
          <motion.div
            className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0"
            animate={{
              backgroundColor: ["#fef2f2", "#fee2e2", "#fef2f2"],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              times: [0, 0.3, 1],
              repeatType: "loop",
            }}
          >
            <Upload className="w-6 h-6 text-red-500" />
          </motion.div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Fill Out Your Trip Details</h2>
            <p className="text-gray-600 leading-relaxed">
              Just tell Cultura where you're going, for how long, and what vibes you’re into.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start gap-6 mb-12">
          <motion.div
            className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0"
            animate={{
              backgroundColor: ["#fef2f2", "#fef2f2", "#fee2e2"],
              scale: [1, 1, 1.05],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              times: [0, 0.6, 1],
              repeatType: "loop",
            }}
          >
            <Zap className="w-6 h-6 text-red-500" />
          </motion.div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Get Your AI-Powered Itinerary</h2>
            <p className="text-gray-600 leading-relaxed">
                Cultura instantly builds a personalized trip plan and opens a chat where you can tweak, swap, or explore more with your assistant.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
