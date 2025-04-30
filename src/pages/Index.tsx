
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';

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
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="z-10 text-center bg-white/90 backdrop-blur-sm p-8 md:p-10 rounded-xl shadow-xl w-11/12 max-w-md">
        <h1 className="text-5xl font-bold mb-4 text-vivid-purple">i-numa</h1>
        <p className="text-xl text-gray-600 mb-6">Bienvenue sur votre application CRM</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate('/login')} className="px-8">Se connecter</Button>
          <Button onClick={() => navigate('/register')} variant="outline" className="px-8">S'inscrire</Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
