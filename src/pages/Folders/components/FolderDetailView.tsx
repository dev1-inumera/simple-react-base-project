
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Folder, OfferPlate, Quote } from '@/types';

interface FolderDetailViewProps {
  folder: Folder;
  offerPlates: OfferPlate[];
  quotes: Quote[];
  onBackClick: () => void;
}

const FolderDetailView: React.FC<FolderDetailViewProps> = ({
  folder,
  offerPlates,
  quotes,
  onBackClick
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={onBackClick}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux dossiers
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{folder.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {offerPlates.length > 0 ? (
            <div>
              <h3 className="text-lg font-medium mb-2">Devis</h3>
              <div className="grid gap-4">
                {offerPlates.map(plate => (
                  <Card key={plate.id}>
                    <CardContent className="py-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{plate.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Status: {plate.status}
                          </div>
                        </div>
                        <Button size="sm" onClick={() => navigate(`/offer-plates/${plate.id}`)}>
                          Voir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Aucun devis pour ce dossier
            </div>
          )}

          <Separator />

          {quotes.length > 0 ? (
            <div>
              <h3 className="text-lg font-medium mb-2">Factures</h3>
              <div className="grid gap-4">
                {quotes.map(quote => (
                  <Card key={quote.id}>
                    <CardContent className="py-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Facture #{quote.id.slice(0, 8)}</div>
                          <div className="text-sm text-muted-foreground">
                            Status: {quote.status} | Paiement: {quote.paymentStatus}
                          </div>
                        </div>
                        <div className="text-lg font-bold">
                          {quote.totalAmount.toFixed(2)}€
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Aucune facture pour ce dossier
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FolderDetailView;
