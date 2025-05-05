import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import LoginForm from "./components/LoginForm";
import CarouselPanel from "./components/CarouselPanel";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(false);
  const [entranceAnimation, setEntranceAnimation] = useState(false);
  const [exitAnimation, setExitAnimation] = useState(false);
  
  // Apply entrance animation
  useEffect(() => {
    // Set a small delay to trigger the animation after component mount
    const timer = setTimeout(() => {
      setEntranceAnimation(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = () => {
    navigate("/dashboard");
  };

  const handleBackToHome = () => {
    setExitAnimation(true);
    setTimeout(() => {
      navigate('/');
    }, 600);
  };

  return (
    <div className={`fixed inset-0 flex w-full h-full bg-white transition-opacity duration-500 ${entranceAnimation ? 'opacity-100' : 'opacity-0'} ${exitAnimation ? 'opacity-0' : 'opacity-100'}`}>
      {/* Left column: Login form with background image */}
      <div 
        className={`w-full md:w-1/2 flex items-center justify-center p-8 relative transition-transform duration-700
                   ${entranceAnimation ? 'translate-x-0' : 'translate-x-[-100%]'} 
                   ${exitAnimation ? 'translate-x-[-100%]' : 'translate-x-0'}`}
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />
        
        <div className="absolute top-8 left-8 z-10">
          <img src="/lovable-uploads/7250faee-48f7-4ce0-ad3e-ce5cbf2f4084.png" alt="i-numa logo" className="h-10" />
        </div>

        {/* Back button */}
        <div className="absolute top-8 right-8 z-10">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBackToHome}
            className="group flex items-center gap-1 hover:gap-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:translate-x-[-2px]" />
            <span>Retour</span>
          </Button>
        </div>

        {/* Footer with logo - moved to the left column left side */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center">
          <span className="text-gray-600 text-sm mr-2">Développé par</span>
          <img src="https://i-numera.com/lovable-uploads/b24ee520-7478-4b85-b844-07dbec409cf5.png" alt="i-numera logo" className="h-7" />
        </div>

        <div className="w-full max-w-md z-10">
          <div className="text-center mb-8 transform transition-all duration-500 delay-100 translate-y-0 opacity-100" style={{
            transform: entranceAnimation ? 'translateY(0)' : 'translateY(20px)',
            opacity: entranceAnimation ? 1 : 0,
          }}>
            <h1 className="text-3xl font-bold">Connexion</h1>
            <p className="text-gray-600 mt-2">Entrez vos identifiants pour vous connecter</p>
          </div>
          
          <LoginForm 
            loading={loading}
            setLoading={setLoading}
            entranceAnimation={entranceAnimation}
            onSuccess={handleLoginSuccess}
          />
        </div>
      </div>
      
      {/* Right column: Advertising content with animated carousel */}
      <CarouselPanel entranceAnimation={entranceAnimation} exitAnimation={exitAnimation} />
    </div>
  );
};

export default Login;
