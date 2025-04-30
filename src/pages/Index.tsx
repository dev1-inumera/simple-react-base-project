
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
    <div className="fixed inset-0 flex w-full h-full">
      {/* Colonne gauche: Connexion avec fond sombre */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 relative bg-[#111]">
        <div className="absolute top-8 left-8 z-10">
          <h1 className="text-2xl font-bold">
            <span className="text-[#bb0c19]">i</span>
            <span className="text-white">-numa</span>
          </h1>
        </div>

        {/* Footer with logo - moved to the left column left side */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center">
          <span className="text-gray-400 text-sm mr-2">Développé par</span>
          <img src="/lovable-uploads/bd88a5bf-3502-442c-bfda-cab3f421f25e.png" alt="i-numera logo" className="h-6" />
        </div>

        <div className="w-full max-w-md z-10">
          <div className="text-left mb-8">
            <h1 className="text-4xl font-bold text-white">
              <span className="text-[#bb0c19]">i</span>
              <span className="text-white">-numa</span>
            </h1>
            <p className="text-xl text-gray-400 mt-4 mb-10">Solutions innovantes pour votre transformation digitale</p>
          </div>
          <div className="flex flex-col gap-4">
            <Button 
              onClick={() => navigate('/login')} 
              className="px-8 bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              Se connecter
            </Button>
          </div>
        </div>
      </div>
      
      {/* Colonne droite: Publicité avec image en fond */}
      <div className="hidden md:flex w-1/2 h-full overflow-hidden">
        {/* Carousel display */}
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
                  className="absolute inset-0 bg-black"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-black/60" />
                </div>
                
                {/* Texte superposé */}
                <div className="absolute inset-0 flex flex-col items-start justify-center p-16 text-white">
                  <h2 className="text-3xl font-bold mb-2">Solutions digitales</h2>
                  <p className="text-xl mb-6">Transformation digitale sur mesure pour votre entreprise.</p>
                  <button className="px-4 py-2 border border-white/40 text-sm hover:bg-white/10 transition-colors">
                    EN SAVOIR PLUS
                  </button>
                </div>
              </div>
            </CarouselItem>
            
            <CarouselItem className="h-full">
              <div className="relative w-full h-full">
                {/* Image en fond */}
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1920&q=80')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-black/60" />
                </div>
                
                {/* Texte superposé */}
                <div className="absolute inset-0 flex flex-col items-start justify-center p-16 text-white">
                  <h2 className="text-3xl font-bold mb-2">Expertise technologique</h2>
                  <p className="text-xl mb-6">Des experts à votre service pour vous accompagner.</p>
                  <button className="px-4 py-2 border border-white/40 text-sm hover:bg-white/10 transition-colors">
                    NOTRE ÉQUIPE
                  </button>
                </div>
              </div>
            </CarouselItem>
            
            <CarouselItem className="h-full">
              <div className="relative w-full h-full">
                {/* Image en fond */}
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1920&q=80')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-black/60" />
                </div>
                
                {/* Texte superposé */}
                <div className="absolute inset-0 flex flex-col items-start justify-center p-16 text-white">
                  <h2 className="text-3xl font-bold mb-2">Support continu</h2>
                  <p className="text-xl mb-6">Un accompagnement personnalisé pour votre succès.</p>
                  <button className="px-4 py-2 border border-white/40 text-sm hover:bg-white/10 transition-colors">
                    NOS SERVICES
                  </button>
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
