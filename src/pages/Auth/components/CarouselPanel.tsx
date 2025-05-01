
import React, { useState, useEffect } from "react";
import { Star, Users, Code, BarChart4, Layers } from 'lucide-react';
import AdContent from "./AdContent";

const CarouselPanel = ({ entranceAnimation, exitAnimation }: { entranceAnimation: boolean; exitAnimation: boolean }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  
  // Slides content for the carousel
  const slides = [
    {
      title: "Solutions digitales",
      description: "Découvrez nos solutions innovantes pour votre transformation digitale, adaptées à vos besoins spécifiques. Notre équipe d'experts vous accompagne dans votre évolution technologique.",
      icon: Star
    },
    {
      title: "Sécurité avancée",
      description: "Protégez vos données avec nos systèmes de sécurité de pointe. Notre approche proactive vous garantit une tranquillité d'esprit et une conformité aux normes les plus strictes.",
      icon: Code
    },
    {
      title: "Intelligence d'affaires",
      description: "Exploitez la puissance de vos données grâce à nos outils d'analyse avancée qui transforment les informations brutes en insights stratégiques pour votre entreprise.",
      icon: BarChart4
    },
    {
      title: "Intégration complète",
      description: "Harmonisez tous vos systèmes avec nos solutions d'intégration complète. Éliminez les silos d'information et créez un écosystème technologique fluide et efficace.",
      icon: Layers
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className={`hidden md:flex w-1/2 h-full bg-gradient-to-br from-[#272C57] to-[#1a1f3e] overflow-hidden relative transition-transform duration-700
                      ${entranceAnimation ? 'translate-x-0' : 'translate-x-[100%]'} 
                      ${exitAnimation ? 'translate-x-[100%]' : 'translate-x-0'}`}>
      {/* Carousel content */}
      {slides.map((slide, index) => (
        <AdContent 
          key={index}
          title={slide.title}
          description={slide.description}
          icon={slide.icon}
          visible={activeSlide === index}
        />
      ))}
      
      {/* Navigation dots for the carousel */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${activeSlide === index ? 'bg-[#bb0c19] scale-125' : 'bg-white/30'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Enhanced background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#bb0c19]/30 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-1/3 left-1/3 w-52 h-52 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl" />
      
      {/* Enhanced floating elements */}
      <div className="absolute top-20 left-20 text-white/20 animate-pulse z-10">
        <Star size={40} />
      </div>
      <div className="absolute bottom-20 right-20 text-white/20 animate-pulse z-10" style={{ animationDelay: '1s' }}>
        <Star size={24} />
      </div>
      <div className="absolute top-1/3 right-1/4 text-white/10 animate-pulse z-10" style={{ animationDelay: '1.5s' }}>
        <Users size={32} />
      </div>
      
      {/* Add more decorative elements */}
      <div className="absolute bottom-1/4 left-1/3 w-32 h-32 border border-white/10 rounded-full" />
      <div className="absolute top-1/4 right-1/3 w-20 h-20 border border-white/5 rounded-full" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-white/10 rounded-full" />
      
      {/* Additional decorative elements */}
      <div className="absolute bottom-10 left-10 h-20 w-20 border border-white/5 rounded-md rotate-12" />
      <div className="absolute top-10 right-10 h-16 w-16 border border-white/5 rounded-md -rotate-12" />
    </div>
  );
};

export default CarouselPanel;
