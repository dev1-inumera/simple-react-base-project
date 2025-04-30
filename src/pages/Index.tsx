
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Star, Users } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const Index = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  useEffect(() => {
    if (auth.user && !auth.isLoading) {
      navigate('/dashboard');
    }
  }, [auth.user, auth.isLoading, navigate]);

  return (
    <div className="fixed inset-0 flex w-full h-full bg-white">
      {/* Colonne gauche: Connexion */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute top-8 left-8 z-10">
          <h1 className="text-2xl font-bold">
            <span className="text-[#bb0c19]">i</span>
            <span className="text-[#272C57]">-numa</span>
          </h1>
        </div>

        <div className="w-full max-w-md">
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
      
      {/* Colonne droite: Publicité avec animation */}
      <div 
        className="hidden md:block w-1/2 relative bg-[#272C57] overflow-hidden"
      >
        {/* Floating elements */}
        <div className="absolute top-20 left-20 text-white/20 animate-pulse">
          <Star size={40} />
        </div>
        <div className="absolute bottom-20 right-20 text-white/20 animate-pulse" style={{ animationDelay: '1s' }}>
          <Star size={24} />
        </div>
        <div className="absolute top-1/3 right-1/4 text-white/10 animate-pulse" style={{ animationDelay: '1.5s' }}>
          <Users size={32} />
        </div>
        
        {/* Footer with logo */}
        <div className="absolute bottom-4 right-4 z-10 flex items-center">
          <span className="text-white text-sm mr-2">Développé par</span>
          <img src="/lovable-uploads/bd88a5bf-3502-442c-bfda-cab3f421f25e.png" alt="i-numera logo" className="h-6" />
        </div>

        <div className="h-full flex items-center justify-center p-8">
          <Carousel className="w-full max-w-xl">
            <CarouselContent>
              <CarouselItem className="flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg text-white">
                  <h2 className="text-3xl font-bold mb-4">Solutions digitales</h2>
                  <p className="text-lg">Transformation digitale sur mesure pour votre entreprise</p>
                </div>
              </CarouselItem>
              <CarouselItem className="flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg text-white">
                  <h2 className="text-3xl font-bold mb-4">Expertise technologique</h2>
                  <p className="text-lg">Des solutions innovantes adaptées à vos besoins</p>
                </div>
              </CarouselItem>
              <CarouselItem className="flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg text-white">
                  <h2 className="text-3xl font-bold mb-4">Support continu</h2>
                  <p className="text-lg">Un accompagnement personnalisé pour votre réussite</p>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Index;
