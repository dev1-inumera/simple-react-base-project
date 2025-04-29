
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { Offer } from "@/types";
import { fetchOffers, fetchCategories } from "./MarketplaceService";
import OfferCard from "./components/OfferCard";
import OfferDetailDialog from "./components/OfferDetailDialog";
import SearchBar from "./components/SearchBar";
import { UserRole } from "@/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Marketplace: React.FC = () => {
  const { toast } = useToast();
  const { auth, hasRole } = useAuth();
  
  const [offers, setOffers] = useState<Offer[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  
  const isAdmin = hasRole(UserRole.ADMIN);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const data = await fetchOffers(searchTerm, selectedCategory || undefined);
      setOffers(data);
    } catch (error: any) {
      toast({
        title: "Erreur de chargement",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error: any) {
      console.error("Error loading categories:", error);
    }
  };

  useEffect(() => {
    loadCategories();
    loadOffers();
  }, []);

  const handleSearch = () => {
    loadOffers();
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    loadOffers();
  };

  const handleViewDetails = (offer: Offer) => {
    setSelectedOffer(offer);
    setDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Marketplace</h1>
        {isAdmin && (
          <Button>
            Ajouter une offre
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onSearch={handleSearch}
        />
        
        <Tabs defaultValue={selectedCategory || "all"} onValueChange={(value) => handleCategorySelect(value === "all" ? null : value)} className="w-full">
          <TabsList className="w-full overflow-x-auto flex flex-nowrap py-1 justify-start">
            <TabsTrigger value="all" className="whitespace-nowrap">
              Toutes les catégories
            </TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="whitespace-nowrap">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[300px] bg-muted animate-pulse rounded-md" />
            ))}
          </div>
        ) : offers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-md">
            <p className="text-muted-foreground">Aucune offre trouvée</p>
          </div>
        )}
      </div>

      {selectedOffer && (
        <OfferDetailDialog
          offer={selectedOffer}
          open={detailDialogOpen}
          onClose={() => {
            setDetailDialogOpen(false);
            setSelectedOffer(null);
          }}
        />
      )}
    </div>
  );
};

export default Marketplace;
