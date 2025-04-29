
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { Quote, UserRole } from "@/types";
import { fetchQuotes } from "./QuotesService";
import QuoteCard from "./components/QuoteCard";
import QuoteDetailView from "./components/QuoteDetailView";
import CreateQuoteDialog from "./components/CreateQuoteDialog";
import { Search, Plus } from "lucide-react";

const QuotesPage: React.FC = () => {
  const { toast } = useToast();
  const { auth, hasRole } = useAuth();
  
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const isAgent = hasRole([UserRole.AGENT, UserRole.ADMIN]);
  const isAdmin = hasRole(UserRole.ADMIN);

  const loadQuotes = async () => {
    if (!auth.user) return;
    
    try {
      setLoading(true);
      const data = await fetchQuotes(auth.user.id, isAgent && !isAdmin, isAdmin);
      setQuotes(data);
      setFilteredQuotes(data);
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
    loadQuotes();
  }, [auth.user, isAgent, isAdmin]);

  useEffect(() => {
    // Simple search by ID (substring)
    if (searchTerm.trim() === "") {
      setFilteredQuotes(quotes);
    } else {
      const filtered = quotes.filter(quote => 
        quote.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredQuotes(filtered);
    }
  }, [searchTerm, quotes]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (selectedQuote) {
    return (
      <QuoteDetailView 
        quote={selectedQuote} 
        onBack={() => setSelectedQuote(null)} 
        onUpdate={loadQuotes}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">Devis</h1>
        {!isAdmin && (
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau devis
          </Button>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un devis..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-36 bg-muted animate-pulse rounded-md" />
          ))}
        </div>
      ) : filteredQuotes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredQuotes.map((quote) => (
            <QuoteCard
              key={quote.id}
              quote={quote}
              onSelect={setSelectedQuote}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-md">
          <p className="text-muted-foreground">Aucun devis trouvé</p>
          {!isAdmin && (
            <Button 
              variant="link" 
              className="mt-2" 
              onClick={() => setDialogOpen(true)}
            >
              Créer un nouveau devis
            </Button>
          )}
        </div>
      )}
      
      {!isAdmin && (
        <CreateQuoteDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSuccess={loadQuotes}
          isAgent={isAgent}
        />
      )}
    </div>
  );
};

export default QuotesPage;
