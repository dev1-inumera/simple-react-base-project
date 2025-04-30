
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { seedOffers, seedAdminUser, seedAgentUser } from "@/lib/seed-data";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#1A1F2C] text-white">
      {/* Left column with form */}
      <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-20 flex flex-col justify-center">
        <div className="flex items-center mb-10">
          <div className="bg-blue-500 rounded-full w-10 h-10 flex items-center justify-center mr-4">
            <span className="text-white font-semibold">i</span>
          </div>
          <h1 className="text-xl font-medium">i-numa app.</h1>
        </div>

        <div className="mb-12">
          <p className="text-blue-400 uppercase text-sm font-semibold tracking-wider">BIENVENUE</p>
          <h1 className="text-4xl font-bold my-2">Connectez-vous<span className="text-blue-400">.</span></h1>
          <p className="text-gray-400">Entrez vos identifiants pour vous connecter à votre compte</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email</label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="bg-[#2A303C] border-gray-700 focus:border-blue-400 focus:ring-blue-400 text-white rounded-md w-full py-3 px-4"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-400">Mot de passe</label>
                <Link to="#" className="text-sm text-blue-400 hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="bg-[#2A303C] border-gray-700 focus:border-blue-400 focus:ring-blue-400 text-white rounded-md w-full py-3 px-4 pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Button 
              type="submit" 
              disabled={loading} 
              className="bg-blue-500 hover:bg-blue-600 text-white py-6"
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </Button>
            
            <div className="flex justify-center">
              <p className="text-gray-400 text-sm">
                Vous n'avez pas de compte ?{" "}
                <Link to="/register" className="text-blue-400 hover:underline">
                  S'inscrire
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>

      {/* Right column with background image */}
      <div className="hidden md:block w-1/2 relative">
        <div className="h-full w-full opacity-30 bg-cover bg-center absolute" 
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

export default Login;
