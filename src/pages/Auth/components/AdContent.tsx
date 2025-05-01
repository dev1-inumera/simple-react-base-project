
import React from "react";

interface AdContentProps {
  title: string;
  description: string;
  icon: React.ElementType;
  visible: boolean;
}

const AdContent = ({ title, description, icon: Icon, visible }: AdContentProps) => (
  <div className={`absolute inset-0 flex flex-col items-center justify-center p-12 text-white transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
    <div className="flex items-center gap-2 mb-6">
      <Icon size={28} className="text-[#bb0c19]" />
      <h2 className="text-5xl font-bold tracking-tight text-gradient">{title}</h2>
    </div>
    <p className="text-xl text-center max-w-lg leading-relaxed mb-8">
      {description}
    </p>
    
    {/* Visual accent element */}
    <div className="w-24 h-1 bg-gradient-to-r from-[#bb0c19] to-[#6e5494] rounded-full my-4"></div>
    
    {/* Stats section */}
    <div className="grid grid-cols-3 gap-6 mt-6 w-full max-w-md">
      <div className="text-center">
        <p className="text-3xl font-bold text-[#bb0c19]">99%</p>
        <p className="text-sm text-white/80">Satisfaction client</p>
      </div>
      <div className="text-center">
        <p className="text-3xl font-bold text-[#bb0c19]">24/7</p>
        <p className="text-sm text-white/80">Support technique</p>
      </div>
      <div className="text-center">
        <p className="text-3xl font-bold text-[#bb0c19]">500+</p>
        <p className="text-sm text-white/80">Projets réalisés</p>
      </div>
    </div>
  </div>
);

export default AdContent;
