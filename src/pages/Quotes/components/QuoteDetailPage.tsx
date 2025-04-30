
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QuoteDetailView from "./QuoteDetailView";
import { fetchQuoteById } from "../services/QuoteService";
import { useToast } from "@/hooks/use-toast";

const QuoteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const loadQuote = async () => {
      try {
        setLoading(true);
        const data = await fetchQuoteById(id);
        setQuote(data);
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
    
    loadQuote();
  }, [id]);

  const handleBack = () => {
    navigate("/quotes");
  };

  const handleUpdate = () => {
    if (id) {
      // Reload the quote data
      fetchQuoteById(id).then(data => setQuote(data));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Devis introuvable</p>
      </div>
    );
  }

  return (
    <QuoteDetailView
      quote={quote}
      onBack={handleBack}
      onUpdate={handleUpdate}
    />
  );
};

export default QuoteDetailPage;
