
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface ClientQuotesProps {
  quotes: any[];
  loading: boolean;
}

const ClientQuotes: React.FC<ClientQuotesProps> = ({ quotes, loading }) => {
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-md" />
        ))}
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="text-center py-12 border rounded-md">
        <p className="text-muted-foreground">Aucun devis trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {quotes.map((quote) => (
        <Card key={quote.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Devis #{quote.id.substring(0, 8)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium">{Number(quote.total_amount).toFixed(2)} €</p>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(quote.status)}`}>
                {getStatusText(quote.status)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Créé {formatDistanceToNow(new Date(quote.created_at), { addSuffix: true, locale: fr })}
            </p>
            <p className="text-sm mb-3">
              Agent: {quote.profiles.first_name} {quote.profiles.last_name}
            </p>
            <Button size="sm">Voir détails</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ClientQuotes;
