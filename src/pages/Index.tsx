
import React, { useEffect } from 'react';
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
    <div 
      className="fixed inset-0 flex items-center justify-center"
      style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=80')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: '100vw',
        height: '100vh',
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      
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
      
      <div className="z-10 text-center bg-white/70 backdrop-blur-md p-8 md:p-10 rounded-xl shadow-xl w-11/12 max-w-md">
        <h1 className="text-5xl font-bold mb-4">
          <span className="text-[#bb0c19]">i</span>
          <span className="text-[#272C57]">-numa</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">Solutions innovantes pour votre transformation digitale</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate('/login')} className="px-8 shadow-md hover:shadow-lg transition-all">Se connecter</Button>
          <Button onClick={() => navigate('/register')} variant="outline" className="px-8 bg-white/80 backdrop-blur-sm border-[#272C57]/30 hover:bg-white/90 transition-all">S'inscrire</Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
