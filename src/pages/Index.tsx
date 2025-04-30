
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-soft-purple to-soft-blue">
      <div className="text-center bg-white p-10 rounded-xl shadow-lg">
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
