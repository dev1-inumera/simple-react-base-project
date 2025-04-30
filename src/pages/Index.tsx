
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Star, Users } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const Index = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (auth.user && !auth.isLoading) {
      navigate('/dashboard');
    }
  }, [auth.user, auth.isLoading, navigate]);

  return (
    <div className="fixed inset-0 flex w-full h-full bg-white">
      {/* Colonne gauche: Connexion avec image en fond et transparence */}
      <div 
        className="w-full md:w-1/2 flex items-center justify-center p-8 relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=1920&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />
        
        <div className="absolute top-8 left-8 z-10">
          <h1 className="text-2xl font-bold">
            <span className="text-[#bb0c19]">i</span>
            <span className="text-[#272C57]">-numa</span>
          </h1>
        </div>

        {/* Footer with logo - moved to the left column left side */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center">
          <span className="text-gray-600 text-sm mr-2">Développé par</span>
          <img src="/lovable-uploads/bd88a5bf-3502-442c-bfda-cab3f421f25e.png" alt="i-numera logo" className="h-6" />
        </div>

        <div className="w-full max-w-md z-10">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4">
              <span className="text-[#bb0c19]">i</span>
              <span className="text-[#272C57]">-numa</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">Solutions innovantes pour votre transformation digitale</p>
          </div>
          <div className="flex flex-col gap-4">
            <Button onClick={() => navigate('/login')} className="px-8 shadow-md hover:shadow-lg transition-all">
              Se connecter
            </Button>
          </div>
        </div>
      </div>
      
      {/* Colonne droite: Publicité avec animation - fixed to display properly */}
      <div className="hidden md:flex w-1/2 h-full overflow-hidden">
        {/* Floating elements */}
        <div className="absolute top-20 left-20 text-white/20 animate-pulse z-10">
          <Star size={40} />
        </div>
        <div className="absolute bottom-20 right-20 text-white/20 animate-pulse z-10" style={{ animationDelay: '1s' }}>
          <Star size={24} />
        </div>
        <div className="absolute top-1/3 right-1/4 text-white/10 animate-pulse z-10" style={{ animationDelay: '1.5s' }}>
          <Users size={32} />
        </div>

        {/* Fixed carousel display */}
        <Carousel 
          className="w-full h-full"
          opts={{
            align: "center",
            loop: true,
            skipSnaps: false,
            active: true,
            startIndex: activeSlide
          }}
        >
          <CarouselContent className="h-full">
            <CarouselItem className="h-full">
              <div className="relative w-full h-full">
                {/* Image en fond */}
                <div 
                  className="absolute inset-0 bg-purple-500"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=80')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/80 to-blue-600/80 backdrop-blur-sm" />
                </div>
                
                {/* Texte superposé */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
                  <h2 className="text-4xl font-bold mb-4">Solutions digitales</h2>
                  <p className="text-xl text-center">Transformation digitale sur mesure pour votre entreprise avec des solutions innovantes adaptées à vos besoins spécifiques.</p>
                </div>
              </div>
            </CarouselItem>
            
            <CarouselItem className="h-full">
              <div className="relative w-full h-full">
                {/* Image en fond */}
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1920&q=80')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/80 to-red-500/80 backdrop-blur-sm" />
                </div>
                
                {/* Texte superposé */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
                  <h2 className="text-4xl font-bold mb-4">Expertise technologique</h2>
                  <p className="text-xl text-center">Nos experts vous accompagnent dans l'adoption des dernières technologies pour rester compétitif dans un monde en constante évolution.</p>
                </div>
              </div>
            </CarouselItem>
            
            <CarouselItem className="h-full">
              <div className="relative w-full h-full">
                {/* Image en fond */}
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1920&q=80')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/80 to-teal-600/80 backdrop-blur-sm" />
                </div>
                
                {/* Texte superposé */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
                  <h2 className="text-4xl font-bold mb-4">Support continu</h2>
                  <p className="text-xl text-center">Un accompagnement personnalisé et un support réactif pour garantir la réussite de vos projets numériques.</p>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default Index;
