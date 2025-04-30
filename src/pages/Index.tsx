
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1F2C] text-white">
      <div className="w-full max-w-xl p-8">
        <div className="flex items-center mb-16">
          <div className="bg-blue-500 rounded-full w-10 h-10 flex items-center justify-center mr-4">
            <span className="text-white font-semibold">i</span>
          </div>
          <h1 className="text-xl font-medium">i-numa app.</h1>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-blue-400 uppercase text-sm font-semibold tracking-wider">Commencez gratuitement</p>
            <h2 className="text-4xl font-bold mt-2">Créez votre compte<span className="text-blue-400">.</span></h2>
            <p className="text-gray-400 mt-3">Vous avez déjà un compte? <span 
              className="text-blue-400 cursor-pointer hover:underline"
              onClick={() => navigate('/login')}
            >Se connecter</span></p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Button 
              onClick={() => navigate('/register')} 
              className="bg-blue-500 hover:bg-blue-600 text-white py-6"
            >
              Créer un compte
            </Button>
            <Button 
              onClick={() => navigate('/login')} 
              variant="outline" 
              className="border-gray-600 text-white hover:bg-gray-700 py-6"
            >
              Se connecter
            </Button>
          </div>
        </div>
      </div>
      
      {/* Right side decoration - just a hint of an image */}
      <div className="hidden lg:block fixed right-0 top-0 bottom-0 w-1/3 bg-[#1A1F2C]">
        <div className="h-full w-full opacity-10 bg-cover bg-center" 
             style={{backgroundImage: "url('/public/lovable-uploads/a5010d47-2fff-47c9-92a6-deba6b79fda5.png')"}} />
        <div className="absolute bottom-8 right-8">
          <div className="text-white font-bold text-4xl">
            .iN
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
