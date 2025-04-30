
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

        {/* Footer with logo - moved to the left column */}
        <div className="absolute bottom-4 right-4 z-10 flex items-center">
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
      
      {/* Colonne droite: Publicité avec animation */}
      <div className="hidden md:block w-1/2 relative bg-[#272C57] overflow-hidden">
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

        <div className="h-full flex items-center justify-center p-8">
          <Carousel 
            className="w-full max-w-xl"
            opts={{
              align: "center",
              loop: true,
              skipSnaps: false,
              active: true,
              startIndex: activeSlide
            }}
          >
            <CarouselContent>
              <CarouselItem className="flex items-center justify-center">
                <div className="bg-gradient-to-br from-purple-500/80 to-blue-600/80 backdrop-blur-md p-8 rounded-lg text-white shadow-xl transform transition-all duration-500 hover:scale-105 w-full max-w-lg">
                  <div className="flex justify-center mb-6">
                    <img 
                      src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80" 
                      alt="Digital Transformation" 
                      className="rounded-lg h-40 w-full object-cover"
                    />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Solutions digitales</h2>
                  <p className="text-lg">Transformation digitale sur mesure pour votre entreprise avec des solutions innovantes adaptées à vos besoins spécifiques.</p>
                </div>
              </CarouselItem>
              <CarouselItem className="flex items-center justify-center">
                <div className="bg-gradient-to-br from-amber-500/80 to-red-500/80 backdrop-blur-md p-8 rounded-lg text-white shadow-xl transform transition-all duration-500 hover:scale-105 w-full max-w-lg">
                  <div className="flex justify-center mb-6">
                    <img 
                      src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=600&q=80" 
                      alt="Technology Expert" 
                      className="rounded-lg h-40 w-full object-cover"
                    />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Expertise technologique</h2>
                  <p className="text-lg">Nos experts vous accompagnent dans l'adoption des dernières technologies pour rester compétitif dans un monde en constante évolution.</p>
                </div>
              </CarouselItem>
              <CarouselItem className="flex items-center justify-center">
                <div className="bg-gradient-to-br from-emerald-500/80 to-teal-600/80 backdrop-blur-md p-8 rounded-lg text-white shadow-xl transform transition-all duration-500 hover:scale-105 w-full max-w-lg">
                  <div className="flex justify-center mb-6">
                    <img 
                      src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=600&q=80" 
                      alt="Support Continu" 
                      className="rounded-lg h-40 w-full object-cover"
                    />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Support continu</h2>
                  <p className="text-lg">Un accompagnement personnalisé et un support réactif pour garantir la réussite de vos projets numériques.</p>
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Login;
