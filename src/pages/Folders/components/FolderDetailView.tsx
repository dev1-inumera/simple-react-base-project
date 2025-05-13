
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Folder, OfferPlate, Quote } from "@/types";
import { fetchOfferPlatesForFolder, fetchQuotesForFolder } from "../FoldersService";
import { ArrowLeft, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface FolderDetailViewProps {
  folder: Folder;
  onBack: () => void;
}

const FolderDetailView: React.FC<FolderDetailViewProps> = ({ folder, onBack }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [offerPlates, setOfferPlates] = useState<OfferPlate[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [filteredOfferPlates, setFilteredOfferPlates] = useState<OfferPlate[]>([]);

  const loadFolderDetails = async () => {
    try {
      setLoading(true);
      
      const [plates, quotesList] = await Promise.all([
        fetchOfferPlatesForFolder(folder.id),
        fetchQuotesForFolder(folder.id)
      ]);
      
      setOfferPlates(plates);
      setQuotes(quotesList);
      setFilteredOfferPlates(plates);
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

  useEffect(() => {
    loadFolderDetails();

    // Subscribe to real-time updates for offer plates
    const channel = supabase
      .channel('offer-plates-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'offer_plates',
          filter: `folder_id=eq.${folder.id}`
        },
        () => {
          loadFolderDetails();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [folder]);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredOfferPlates(offerPlates);
    } else {
      setFilteredOfferPlates(offerPlates.filter(plate => plate.status === statusFilter));
    }
  }, [statusFilter, offerPlates]);

  const handleViewOfferPlateDetails = (plate: OfferPlate) => {
    navigate(`/offer-plates/${plate.id}`);
  };

  const handleViewQuoteDetails = (quote: Quote) => {
    navigate(`/quotes/${quote.id}`);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "sent":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "production":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string, isQuote: boolean = false) => {
    if (isQuote) {
      switch (status) {
        case "pending":
          return "En attente";
        case "approved":
          return "Approuvé";
        case "sent":
          return "Envoyé";
        case "accepted":
          return "Accepté";
        case "rejected":
          return "Rejeté";
        case "production":
          return "En production";
        default:
          return status;
      }
    } else {
      switch (status) {
        case "draft":
          return "Brouillon";
        case "sent":
          return "Envoyée";
        case "accepted":
          return "Acceptée";
        case "rejected":
          return "Rejetée";
        case "production":
          return "En production";
        default:
          return status;
      }
    }
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <Button variant="ghost" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h2 className="text-2xl font-bold">{folder.name}</h2>
      </div>

      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Créé {formatDistanceToNow(new Date(folder.createdAt), { addSuffix: true, locale: fr })}
        </p>
      </div>

      <Tabs defaultValue="offer-plates">
        <TabsList className="mb-4">
          <TabsTrigger value="offer-plates">Plaquettes d'offres</TabsTrigger>
          <TabsTrigger value="quotes">Devis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="offer-plates">
          <div className="mb-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="sent">Envoyé</SelectItem>
                <SelectItem value="accepted">Accepté</SelectItem>
                <SelectItem value="rejected">Rejeté</SelectItem>
                <SelectItem value="production">En production</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-32 bg-muted animate-pulse rounded-md" />
              ))}
            </div>
          ) : filteredOfferPlates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOfferPlates.map((plate) => (
                <Card key={plate.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{plate.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-2">
                      Créé {formatDistanceToNow(new Date(plate.createdAt), { addSuffix: true, locale: fr })}
                    </p>
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary" className={getStatusStyle(plate.status)}>
                        {getStatusText(plate.status)}
                      </Badge>
                      
                      <Button size="sm" onClick={() => handleViewOfferPlateDetails(plate)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Voir détails
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-md">
              <p className="text-muted-foreground">Aucune plaquette trouvée</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="quotes">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-32 bg-muted animate-pulse rounded-md" />
              ))}
            </div>
          ) : quotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quotes.map((quote) => (
                <Card key={quote.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Devis #{quote.id.substring(0, 8)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-2">
                      Créé {formatDistanceToNow(new Date(quote.createdAt), { addSuffix: true, locale: fr })}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col gap-1">
                        <p className="font-medium">{Number(quote.totalAmount).toFixed(2)} €</p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(quote.status)}`}
                        >
                          {getStatusText(quote.status, true)}
                        </span>
                      </div>
                      
                      <Button size="sm" onClick={() => handleViewQuoteDetails(quote)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Voir détails
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-md">
              <p className="text-muted-foreground">Aucun devis trouvé</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FolderDetailView;
