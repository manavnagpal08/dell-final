'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const STORIES = [
  { text: "Cooling Unit F12 intervention prevented $12,400 loss", highlight: "$12,400", type: "Cooling" },
  { text: "Server Rack A maintenance avoided motherboard replacement", highlight: "replacement", type: "Compute" },
  { text: "Network optimization reduced energy cost by 18%", highlight: "18%", type: "Network" },
  { text: "Predictive shutdown of Storage Node C saved $8,200 in data recovery", highlight: "$8,200", type: "Storage" }
];

export function ValueStoriesCarousel() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % STORIES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const story = STORIES[idx];
  
  // Highlight the keyword
  const parts = story.text.split(story.highlight);

  return (
    <div className="bg-indigo-600/5 border border-indigo-500/20 rounded-xl p-4 flex items-center gap-4 h-[70px] overflow-hidden relative group shadow-sm">
      <div className="shrink-0 p-1.5 bg-indigo-100 rounded-full">
        <Sparkles className="w-4 h-4 text-indigo-600" />
      </div>
      
      <div className="flex-1 relative h-full flex items-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-sm font-semibold text-slate-700 m-0 leading-tight"
          >
            {parts[0]}
            <span className="text-indigo-600 font-black">{story.highlight}</span>
            {parts[1]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="shrink-0 flex gap-1">
        {STORIES.map((_, i) => (
          <div key={i} className={cn("h-1.5 rounded-full transition-all duration-300", i === idx ? "w-4 bg-indigo-500" : "w-1.5 bg-indigo-200")} />
        ))}
      </div>
    </div>
  );
}
