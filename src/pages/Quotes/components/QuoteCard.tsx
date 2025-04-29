
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Quote } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface QuoteCardProps {
  quote: Quote;
  onSelect: (quote: Quote) => void;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, onSelect }) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "sent":
        return "bg-purple-100 text-purple-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
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
      default:
        return status;
    }
  };

  return (
    <Card 
      className="elevated-card interactive-element" 
      onClick={() => onSelect(quote)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Devis #{quote.id.substring(0, 8)}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-start mb-3">
          <p className="font-medium text-lg">{Number(quote.totalAmount).toFixed(2)} €</p>
          <span
            className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(quote.status)}`}
          >
            {getStatusText(quote.status)}
          </span>
        </div>
        
        <p className="text-xs text-muted-foreground mb-3">
          Créé {formatDistanceToNow(new Date(quote.createdAt), { addSuffix: true, locale: fr })}
        </p>
        
        <Button className="modern-button" size="sm" onClick={() => onSelect(quote)}>
          Voir détails
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuoteCard;
