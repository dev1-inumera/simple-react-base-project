
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
      
      {/* Colonne droite: Contenu publicitaire */}
      <div className="hidden md:flex w-1/2 h-full bg-[#272C57] overflow-hidden relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white z-10">
          <h2 className="text-4xl font-bold mb-4">Solutions digitales</h2>
          <p className="text-xl text-center max-w-lg">
            Découvrez nos solutions innovantes pour votre transformation digitale, 
            adaptées à vos besoins spécifiques. Notre équipe d'experts vous accompagne 
            dans votre évolution technologique.
          </p>
          <div className="mt-8 flex space-x-4">
            <Button variant="outline" className="text-white border-white hover:bg-white/10">
              En savoir plus
            </Button>
            <Button className="bg-[#bb0c19] hover:bg-[#a00914] text-white">
              Contactez-nous
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

export default Login;
