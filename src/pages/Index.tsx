import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Star, Users, ArrowRight, BarChart4, Code, Layers } from 'lucide-react';

const AdContent = ({ title, description, icon: Icon, visible }: { title: string; description: string; icon: React.ElementType; visible: boolean }) => (
  <div className={`absolute inset-0 flex flex-col items-center justify-center p-12 text-white transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
    <div className="flex items-center gap-2 mb-6">
      <Icon size={28} className="text-[#bb0c19]" />
      <h2 className="text-5xl font-bold tracking-tight text-gradient">{title}</h2>
    </div>
    <p className="text-xl text-center max-w-lg leading-relaxed">
      {description}
    </p>
    
    {/* Visual accent element */}
    <div className="w-24 h-1 bg-gradient-to-r from-[#bb0c19] to-[#6e5494] rounded-full my-8"></div>
    
    {/* Stats section */}
    <div className="grid grid-cols-3 gap-6 mt-2 w-full max-w-md">
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

const Index = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Slides content for the carousel
  const slides = [
    {
      title: "Innovation digitale",
      description: "Transformez votre entreprise avec nos solutions technologiques avancées. Notre expertise vous permet d'optimiser vos processus et d'améliorer votre compétitivité.",
      icon: Star
    },
    {
      title: "Expertise technique",
      description: "Nos équipes d'experts vous accompagnent dans tous vos projets numériques, du développement à la maintenance en passant par la sécurisation de vos données.",
      icon: Code
    },
    {
      title: "Analyse avancée",
      description: "Prenez les meilleures décisions grâce à nos outils d'analyse de données qui transforment vos informations en insights stratégiques et actionnables.",
      icon: BarChart4
    },
    {
      title: "Solutions évolutives",
      description: "Nos architectures modulaires s'adaptent à la croissance de votre entreprise, permettant une expansion fluide sans compromettre la performance.",
      icon: Layers
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (auth.user && !auth.isLoading) {
      navigate('/dashboard');
    }
  }, [auth.user, auth.isLoading, navigate]);

  const handleLoginClick = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate('/login');
    }, 600); // Delay navigation to allow animation to complete
  };

  return (
    <div className={`fixed inset-0 flex w-full h-full bg-white transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      {/* Left column: Login with background image */}
      <div 
        className={`w-full md:w-1/2 flex items-center justify-center p-8 relative transition-transform duration-700 ${isTransitioning ? 'translate-x-[-100%]' : 'translate-x-0'}`}
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=1920&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />
        
        <div className="absolute top-8 left-8 z-10">
          <img src="/lovable-uploads/7250faee-48f7-4ce0-ad3e-ce5cbf2f4084.png" alt="i-numa logo" className="h-10" />
        </div>

        {/* Footer with logo - moved to the left column left side */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center">
          <span className="text-gray-600 text-sm mr-2">Développé par</span>
          <img src="https://i-numera.com/lovable-uploads/b24ee520-7478-4b85-b844-07dbec409cf5.png" alt="i-numera logo" className="h-6" />
        </div>

        <div className="w-full max-w-md z-10">
          <div className="text-center mb-8">
            <img src="/lovable-uploads/7250faee-48f7-4ce0-ad3e-ce5cbf2f4084.png" alt="i-numa logo" className="h-16 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-8">Solutions innovantes pour votre transformation digitale</p>
          </div>
          <div className="flex flex-col gap-4">
            <Button 
              onClick={handleLoginClick} 
              className="px-8 shadow-md hover:shadow-lg transition-all relative group overflow-hidden"
            >
              <span className="relative z-10 group-hover:translate-x-[-8px] transition-transform duration-300">Se connecter</span>
              <ArrowRight className="absolute right-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all duration-300" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Right column: Advertising content with animated carousel */}
      <div className={`hidden md:flex w-1/2 h-full bg-gradient-to-br from-[#272C57] to-[#1a1f3e] overflow-hidden relative transition-transform duration-700 ${isTransitioning ? 'translate-x-[100%]' : 'translate-x-0'}`}>
        {/* Carousel content */}
        {slides.map((slide, index) => (
          <AdContent 
            key={index}
            title={slide.title}
            description={slide.description}
            icon={slide.icon}
            visible={activeSlide === index}
          />
        ))}
        
        {/* Navigation dots for the carousel */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${activeSlide === index ? 'bg-[#bb0c19] scale-125' : 'bg-white/30'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Enhanced background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#bb0c19]/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/3 w-52 h-52 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl" />
        
        {/* Enhanced floating elements */}
        <div className="absolute top-20 left-20 text-white/20 animate-pulse z-10">
          <Star size={40} />
        </div>
        <div className="absolute bottom-20 right-20 text-white/20 animate-pulse z-10" style={{ animationDelay: '1s' }}>
          <Star size={24} />
        </div>
        <div className="absolute top-1/3 right-1/4 text-white/10 animate-pulse z-10" style={{ animationDelay: '1.5s' }}>
          <Users size={32} />
        </div>
        
        {/* Add more decorative elements */}
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 border border-white/10 rounded-full" />
        <div className="absolute top-1/4 right-1/3 w-20 h-20 border border-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-white/10 rounded-full" />
      </div>
    </div>
  );
};

export default Index;
