"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const LoadingState = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // 200ms: blank
    // 600ms: show text
    // 1000ms: fade out text
    // 1200ms: complete
    
    const timers = [
      setTimeout(() => setStep(1), 400),   // Text in
      setTimeout(() => setStep(2), 1000),  // Text out
      setTimeout(() => onComplete(), 1300) // Finish
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[100000] bg-background flex items-center justify-center overflow-hidden"
    >

      
      <AnimatePresence>
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3 font-mono text-[11px] tracking-[0.5em] text-muted uppercase"
          >
            <span className="text-accent">◼</span> vértice
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LoadingState;
