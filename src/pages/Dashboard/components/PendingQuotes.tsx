
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";

interface PendingQuote {
  id: string;
  total_amount: number;
  profiles: {
    first_name: string;
    last_name: string;
  } | null;
}

interface PendingQuotesProps {
  quotes: PendingQuote[];
  loading: boolean;
  onStatusUpdate: (quoteId: string, status: string) => Promise<void>;
}

export const PendingQuotes: React.FC<PendingQuotesProps> = ({
  quotes,
  loading,
  onStatusUpdate,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Devis en attente d'approbation</CardTitle>
        <CardDescription>
          Devis qui nécessitent votre validation
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center justify-between p-2 border-b">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-36"></div>
                  <div className="h-3 bg-muted rounded w-24"></div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-8 bg-muted rounded w-20"></div>
                  <div className="h-8 bg-muted rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : quotes.length > 0 ? (
          <div className="space-y-4">
            {quotes.map((quote) => (
              <div key={quote.id} className="flex items-center justify-between p-2 border-b">
                <div>
                  <p className="font-medium">Devis #{quote.id.substring(0, 8)}</p>
                  <p className="text-sm text-muted-foreground">
                    {quote.profiles?.first_name || "Agent"} {quote.profiles?.last_name || ""} - {Number(quote.total_amount).toFixed(2)} €
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm"
                    onClick={() => onStatusUpdate(quote.id, "approved")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm"
                    variant="destructive"
                    onClick={() => onStatusUpdate(quote.id, "rejected")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Aucun devis en attente d'approbation</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
