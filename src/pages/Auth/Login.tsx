
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
    <div className="fixed inset-0 flex w-full h-full">
      {/* Colonne gauche: Connexion avec fond sombre */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 relative bg-[#111]">
        <div className="absolute top-8 left-8 z-10">
          <h1 className="text-2xl font-bold">
            <span className="text-[#bb0c19]">i</span>
            <span className="text-white">-numa</span>
          </h1>
        </div>

        {/* Footer with logo - moved to the left column left side */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center">
          <span className="text-gray-400 text-sm mr-2">Développé par</span>
          <img src="/lovable-uploads/bd88a5bf-3502-442c-bfda-cab3f421f25e.png" alt="i-numera logo" className="h-6" />
        </div>

        <div className="w-full max-w-md z-10">
          <div className="text-left mb-8">
            <h1 className="text-3xl font-bold text-white">Connexion</h1>
            <p className="text-gray-400 mt-2">Entrez vos identifiants pour vous connecter</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                className="bg-[#222] border-[#333] text-white"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password" className="text-gray-300">Mot de passe</Label>
                <Link to="#" className="text-sm text-blue-400 hover:underline">
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
                className="bg-[#222] border-[#333] text-white"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 transition-all" 
              disabled={loading}
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </Button>
            
            <p className="text-gray-400 text-center text-sm mt-4">
              Vous n'avez pas de compte ? <Link to="/register" className="text-blue-400 hover:underline">S'inscrire</Link>
            </p>
          </form>
        </div>
      </div>
      
      {/* Colonne droite: Publicité avec image en fond */}
      <div className="hidden md:flex w-1/2 h-full overflow-hidden">
        {/* Carousel display */}
        <Carousel 
          className="w-full h-full"
          opts={{
            align: "center",
            loop: true,
            skipSnaps: false,
            active: true,
            startIndex: activeSlide
          }}
        >
          <CarouselContent className="h-full">
            <CarouselItem className="h-full">
              <div className="relative w-full h-full">
                {/* Image en fond */}
                <div 
                  className="absolute inset-0 bg-black"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1920&q=80')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-black/60" />
                </div>
                
                {/* Texte superposé */}
                <div className="absolute inset-0 flex flex-col items-start justify-center p-16 text-white">
                  <h2 className="text-3xl font-bold mb-2">Une nouvelle façon</h2>
                  <p className="text-xl mb-6">d'expérimenter la transformation digitale.</p>
                  <button className="px-4 py-2 border border-white/40 text-sm hover:bg-white/10 transition-colors">
                    EN SAVOIR PLUS
                  </button>
                </div>
              </div>
            </CarouselItem>
            
            <CarouselItem className="h-full">
              <div className="relative w-full h-full">
                {/* Image en fond */}
                <div 
                  className="absolute inset-0 bg-black"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1920&q=80')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-black/60" />
                </div>
                
                {/* Texte superposé */}
                <div className="absolute inset-0 flex flex-col items-start justify-center p-16 text-white">
                  <h2 className="text-3xl font-bold mb-2">Solutions innovantes</h2>
                  <p className="text-xl mb-6">pour votre entreprise digitale.</p>
                  <button className="px-4 py-2 border border-white/40 text-sm hover:bg-white/10 transition-colors">
                    DÉCOUVRIR
                  </button>
                </div>
              </div>
            </CarouselItem>
            
            <CarouselItem className="h-full">
              <div className="relative w-full h-full">
                {/* Image en fond */}
                <div 
                  className="absolute inset-0 bg-black"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1920&q=80')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-black/60" />
                </div>
                
                {/* Texte superposé */}
                <div className="absolute inset-0 flex flex-col items-start justify-center p-16 text-white">
                  <h2 className="text-3xl font-bold mb-2">Expertise technique</h2>
                  <p className="text-xl mb-6">à votre service depuis plus de 10 ans.</p>
                  <button className="px-4 py-2 border border-white/40 text-sm hover:bg-white/10 transition-colors">
                    NOS SERVICES
                  </button>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default Login;
