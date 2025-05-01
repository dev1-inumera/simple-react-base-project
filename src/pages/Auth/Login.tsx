
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { seedOffers, seedAdminUser, seedAgentUser } from "@/lib/seed-data";
import { Star, Users, Code, BarChart4, Layers } from 'lucide-react';

// Ad content component for better organization
const AdContent = ({ title, description, icon: Icon, visible }: { title: string; description: string; icon: React.ElementType; visible: boolean }) => (
  <div className={`absolute inset-0 flex flex-col items-center justify-center p-12 text-white transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
    <div className="flex items-center gap-2 mb-6">
      <Icon size={28} className="text-[#bb0c19]" />
      <h2 className="text-5xl font-bold tracking-tight text-gradient">{title}</h2>
    </div>
    <p className="text-xl text-center max-w-lg leading-relaxed mb-8">
      {description}
    </p>
    
    {/* Visual accent element */}
    <div className="w-24 h-1 bg-gradient-to-r from-[#bb0c19] to-[#6e5494] rounded-full my-4"></div>
    
    {/* Stats section */}
    <div className="grid grid-cols-3 gap-6 mt-6 w-full max-w-md">
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

const Login = () => {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  
  // Slides content for the carousel
  const slides = [
    {
      title: "Solutions digitales",
      description: "Découvrez nos solutions innovantes pour votre transformation digitale, adaptées à vos besoins spécifiques. Notre équipe d'experts vous accompagne dans votre évolution technologique.",
      icon: Star
    },
    {
      title: "Sécurité avancée",
      description: "Protégez vos données avec nos systèmes de sécurité de pointe. Notre approche proactive vous garantit une tranquillité d'esprit et une conformité aux normes les plus strictes.",
      icon: Code
    },
    {
      title: "Intelligence d'affaires",
      description: "Exploitez la puissance de vos données grâce à nos outils d'analyse avancée qui transforment les informations brutes en insights stratégiques pour votre entreprise.",
      icon: BarChart4
    },
    {
      title: "Intégration complète",
      description: "Harmonisez tous vos systèmes avec nos solutions d'intégration complète. Éliminez les silos d'information et créez un écosystème technologique fluide et efficace.",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Seed data (for demo purposes)
      await seedOffers();
      await seedAdminUser();
      await seedAgentUser();
      
      const { error } = await signIn(email, password);
      
      if (error) {
        throw error;
      }
      
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex w-full h-full bg-white">
      {/* Left column: Login form with background image */}
      <div 
        className="w-full md:w-1/2 flex items-center justify-center p-8 relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80')",
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
            <h1 className="text-3xl font-bold">Connexion</h1>
            <p className="text-gray-600 mt-2">Entrez vos identifiants pour vous connecter</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                className="border-input/60 bg-white/80"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <Link to="#" className="text-sm text-primary hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                className="border-input/60 bg-white/80"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full shadow-md hover:shadow-lg transition-all" 
              disabled={loading}
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>
        </div>
      </div>
      
      {/* Right column: Advertising content with animated carousel */}
      <div className="hidden md:flex w-1/2 h-full bg-gradient-to-br from-[#272C57] to-[#1a1f3e] overflow-hidden relative">
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
        
        {/* Enhanced background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#bb0c19]/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/3 w-52 h-52 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl" />
        
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
        
        {/* Additional decorative elements */}
        <div className="absolute bottom-10 left-10 h-20 w-20 border border-white/5 rounded-md rotate-12" />
        <div className="absolute top-10 right-10 h-16 w-16 border border-white/5 rounded-md -rotate-12" />
      </div>
    </div>
  );
};

export default Login;
