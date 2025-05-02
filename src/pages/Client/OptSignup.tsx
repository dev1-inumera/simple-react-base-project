
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
    role: "",
    phone: "",
    email: ""
  });
  
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
    
    if (!formData.businessSector) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un secteur d'activité.",
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
    
    setLoading(true);
    
    try {
      // TODO: Implement actual submission logic
      
      // For now, just show success and redirect
      toast({
        title: "Inscription réussie",
        description: "Votre demande d'inscription a été enregistrée avec succès.",
      });
      
      // Redirect to homepage after success
      setTimeout(() => {
        navigate("/");
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
        <h1 className="text-2xl font-bold">
          <span className="text-[#bb0c19]">i</span>
          <span className="text-white">-numa</span>
        </h1>
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
            
            <Button 
              type="submit" 
              className="w-full shadow-md hover:shadow-lg transition-all" 
              disabled={loading}
            >
              {loading ? "Traitement en cours..." : "S'inscrire"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            En vous inscrivant, vous acceptez nos conditions générales d'utilisation
          </p>
        </CardFooter>
      </Card>
      
      {/* Footer with logo */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center">
        <span className="text-white text-sm mr-2">Développé par</span>
        <img src="/lovable-uploads/bd88a5bf-3502-442c-bfda-cab3f421f25e.png" alt="i-numera logo" className="h-6" />
      </div>
    </div>
  );
};

export default ClientOptSignup;
