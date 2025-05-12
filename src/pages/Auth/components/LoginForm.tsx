
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { seedOffers, seedAdminUser, seedAgentUser } from "@/lib/seed-data";

interface LoginFormProps {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  entranceAnimation: boolean;
  onSuccess: () => void;
}

const LoginForm = ({ loading, setLoading, entranceAnimation, onSuccess }: LoginFormProps) => {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      
      // Succès de connexion, appeler le callback pour redirection
      onSuccess();
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur la plateforme!",
      });
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div 
        className="space-y-2 transition-all duration-500 delay-200" 
        style={{
          transform: entranceAnimation ? 'translateY(0)' : 'translateY(20px)',
          opacity: entranceAnimation ? 1 : 0,
        }}
      >
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
      <div 
        className="space-y-2 transition-all duration-500 delay-300"
        style={{
          transform: entranceAnimation ? 'translateY(0)' : 'translateY(20px)',
          opacity: entranceAnimation ? 1 : 0,
        }}
      >
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
        style={{
          transform: entranceAnimation ? 'translateY(0)' : 'translateY(20px)',
          opacity: entranceAnimation ? 1 : 0,
          transition: 'all 0.5s ease',
          transitionDelay: '400ms'
        }}
      >
        {loading ? "Connexion en cours..." : "Se connecter"}
      </Button>
    </form>
  );
};

export default LoginForm;
