
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QuoteDetailView from "./QuoteDetailView";
import { fetchQuoteById, updateQuoteStatus, sendQuoteEmailWithPaymentLink } from "../QuotesService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { UserRole } from "@/types";

const QuoteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { auth, hasRole } = useAuth();
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState(false);

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

  const handleStatusUpdate = async (status: string) => {
    if (!id) return;
    
    try {
      setProcessingAction(true);
      await updateQuoteStatus(id, status);
      
      // If an admin approves the quote, send an automatic email with payment link
      if (status === "approved" && hasRole(UserRole.ADMIN)) {
        try {
          console.log("Envoi automatique d'email pour devis approuvé:", id);
          await sendQuoteEmailWithPaymentLink(id);
          toast({
            title: "E-mail envoyé",
            description: "Le devis a été envoyé au client avec un lien de paiement.",
          });
        } catch (emailError: any) {
          console.error("Erreur lors de l'envoi de l'email:", emailError);
          toast({
            title: "Erreur d'envoi d'e-mail",
            description: emailError.message,
            variant: "destructive",
          });
        }
      }
      
      toast({
        title: "Statut mis à jour",
        description: "Le statut du devis a été mis à jour avec succès.",
      });
      
      handleUpdate();
    } catch (error: any) {
      toast({
        title: "Erreur de mise à jour",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessingAction(false);
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
      onStatusUpdate={handleStatusUpdate}
      processingAction={processingAction}
    />
  );
};

export default QuoteDetailPage;
