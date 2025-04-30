
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Star, Users } from 'lucide-react';

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
      
      {/* Colonne droite: Contenu publicitaire */}
      <div className="hidden md:flex w-1/2 h-full bg-[#272C57] overflow-hidden relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white z-10">
          <h2 className="text-4xl font-bold mb-4">Innovation digitale</h2>
          <p className="text-xl text-center max-w-lg">
            Transformez votre entreprise avec nos solutions technologiques avancées.
            Notre expertise vous permet d'optimiser vos processus et d'améliorer votre compétitivité.
          </p>
          <div className="mt-8 flex space-x-4">
            <Button variant="outline" className="text-white border-white hover:bg-white/10">
              Nos services
            </Button>
            <Button className="bg-[#bb0c19] hover:bg-[#a00914] text-white">
              Démarrer maintenant
            </Button>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#bb0c19]/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-3xl" />
        
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
      </div>
    </div>
  );
};

export default Index;
