"use client";

import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import WhatWeDoSection from "@/components/WhatWeDoSection";
import WhoWeWorkWithSection from "@/components/WhoWeWorkWithSection";
import ApplySection from "@/components/ApplySection";
import LoadingState from "@/components/LoadingState";


export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <LoadingState onComplete={() => setIsLoading(false)} />}
      
      <main className={`bg-background min-h-screen text-foreground font-sans w-full selection:bg-accent/30 selection:text-white transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Global Operational Elements */}
        <div className="cinematic-vinette" />

        {/* Narrative Flow v3.0 */}
        <HeroSection />
        
        <WhatWeDoSection />

        <WhoWeWorkWithSection />
        
        <ApplySection />
        
        {/* Global Ambient Glows for Continuity */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[1]">
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-accent/[0.015] blur-[150px] rounded-full" />
          <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-accent/[0.015] blur-[150px] rounded-full" />
        </div>
      </main>
    </>
  );
}
