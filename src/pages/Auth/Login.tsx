
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { seedOffers, seedAdminUser, seedAgentUser } from "@/lib/seed-data";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Star, Users } from 'lucide-react';

const Login = () => {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);

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
      {/* Colonne gauche: Connexion avec image en fond et transparence */}
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
      
      {/* Colonne droite: Contenu publicitaire avec style amélioré */}
      <div className="hidden md:flex w-1/2 h-full bg-gradient-to-br from-[#272C57] to-[#1a1f3e] overflow-hidden relative">
        {/* Enhanced content section */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white z-10">
          <div className="relative mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#bb0c19] to-[#6e5494] opacity-30 blur rounded-lg"></div>
            <div className="relative px-2 py-1 bg-[#272C57] rounded-lg">
              <h2 className="text-5xl font-bold tracking-tight">Solutions digitales</h2>
            </div>
          </div>
          
          <p className="text-xl text-center max-w-lg leading-relaxed mb-8">
            Découvrez nos solutions innovantes pour votre transformation digitale, 
            adaptées à vos besoins spécifiques. Notre équipe d'experts vous accompagne 
            dans votre évolution technologique.
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
