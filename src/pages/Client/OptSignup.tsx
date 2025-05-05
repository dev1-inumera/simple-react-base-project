import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@supabase/supabase-js";
import { Eye, EyeOff } from "lucide-react";

// Create a public client specifically for signup that doesn't require authentication
const SUPABASE_URL = "https://wprlkplzlhyrphbcaalc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwcmxrcGx6bGh5cnBoYmNhYWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2MTA5MjQsImV4cCI6MjA2MTE4NjkyNH0.BkmefUSRt048r0o8h4US_4ZUrEicJ2iDm94FTfPi7MQ";
const supabasePublic = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const BUSINESS_SECTORS = [
  "Commerce",
  "Services",
  "Industrie",
  "Construction",
  "Agriculture",
  "Transport",
  "Autre"
];

const ROLES = [
  "Directeur",
  "Gérant",
  "Responsable commercial",
  "Responsable technique",
  "Responsable administratif",
  "Autre"
];

const ClientOptSignup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    companyAddress: "",
    businessSector: "",
    customBusinessSector: "",
    role: "",
    customRole: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation checks
    if (!formData.businessSector) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un secteur d'activité.",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.businessSector === "Autre" && !formData.customBusinessSector) {
      toast({
        title: "Erreur",
        description: "Veuillez préciser votre secteur d'activité.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.role) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner votre fonction au sein de la société.",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.role === "Autre" && !formData.customRole) {
      toast({
        title: "Erreur",
        description: "Veuillez préciser votre fonction au sein de la société.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.password.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Extract the first name and last name from the full name
      const nameParts = formData.fullName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Determine the final business sector and role values
      const finalBusinessSector = formData.businessSector === "Autre" ? formData.customBusinessSector : formData.businessSector;
      const finalRole = formData.role === "Autre" ? formData.customRole : formData.role;
      
      // Sign up with Supabase's public auth API using the public client
      const { error } = await supabasePublic.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: formData.phone,
            address: formData.companyAddress,
            business_sector: finalBusinessSector,
            company_name: formData.companyName,
            role: 'client', // User role in the system (not job role)
            manager_name: formData.fullName,
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
      });
      
      // Redirect to login page
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'inscription.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center overflow-auto p-4"
      style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=80')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: '100vw',
        height: '100vh',
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      
      <div className="absolute top-0 left-0 p-4 z-10">
        <img src="/lovable-uploads/7250faee-48f7-4ce0-ad3e-ce5cbf2f4084.png" alt="i-numa logo" className="h-10" />
      </div>
      
      <Card className="w-full max-w-2xl z-10 bg-white/80 backdrop-blur-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Inscription client</CardTitle>
          <CardDescription>Complétez le formulaire ci-dessous pour vous inscrire</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nom complet</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={loading}
                required
                className="bg-white/80 backdrop-blur-sm border-input/60"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="companyName">Nom de la société</Label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                disabled={loading}
                required
                className="bg-white/80 backdrop-blur-sm border-input/60"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="companyAddress">Adresse de la société</Label>
              <Input
                id="companyAddress"
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleChange}
                disabled={loading}
                required
                className="bg-white/80 backdrop-blur-sm border-input/60"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessSector">Secteur d'activité</Label>
                <Select 
                  value={formData.businessSector} 
                  onValueChange={(value) => handleSelectChange("businessSector", value)}
                  required
                >
                  <SelectTrigger className="bg-white/80 backdrop-blur-sm border-input/60">
                    <SelectValue placeholder="Sélectionnez un secteur" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUSINESS_SECTORS.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {formData.businessSector === "Autre" && (
                  <div className="mt-2">
                    <Input
                      id="customBusinessSector"
                      name="customBusinessSector"
                      value={formData.customBusinessSector}
                      onChange={handleChange}
                      placeholder="Précisez votre secteur"
                      disabled={loading}
                      required
                      className="bg-white/80 backdrop-blur-sm border-input/60"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Fonction dans la société</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => handleSelectChange("role", value)}
                  required
                >
                  <SelectTrigger className="bg-white/80 backdrop-blur-sm border-input/60">
                    <SelectValue placeholder="Sélectionnez une fonction" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {formData.role === "Autre" && (
                  <div className="mt-2">
                    <Input
                      id="customRole"
                      name="customRole"
                      value={formData.customRole}
                      onChange={handleChange}
                      placeholder="Précisez votre fonction"
                      disabled={loading}
                      required
                      className="bg-white/80 backdrop-blur-sm border-input/60"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  className="bg-white/80 backdrop-blur-sm border-input/60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  className="bg-white/80 backdrop-blur-sm border-input/60"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    className="bg-white/80 backdrop-blur-sm border-input/60 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    className="bg-white/80 backdrop-blur-sm border-input/60 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full shadow-md hover:shadow-lg transition-all" 
              disabled={loading}
            >
              {loading ? "Traitement en cours..." : "S'inscrire"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground text-center">
            En vous inscrivant, vous acceptez nos conditions générales d'utilisation
          </p>
          <Button 
            variant="link" 
            className="text-sm"
            onClick={() => navigate('/login')}
            disabled={loading}
          >
            Déjà inscrit ? Connectez-vous
          </Button>
        </CardFooter>
      </Card>
      
      {/* Footer with logo */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center">
        <span className="text-white text-sm mr-2">Développé par</span>
        <img src="/lovable-uploads/7250faee-48f7-4ce0-ad3e-ce5cbf2f4084.png" alt="i-numa logo" className="h-6" />
      </div>
    </div>
  );
};

export default ClientOptSignup;
