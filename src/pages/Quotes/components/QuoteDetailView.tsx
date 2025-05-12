import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Quote, CartItem, UserRole } from "@/types";
import { 
  fetchQuoteDetails, 
  fetchQuoteItems, 
  updateQuoteStatus, 
  fetchPaymentInfoByQuoteId, 
  fetchClientByQuoteId,
  createPaymentLink
} from "../QuotesService";
import { useAuth } from "@/lib/auth";
import { ArrowLeft, File, Send, Check, X, Printer, SendToBack, CreditCard, Link } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { fr } from "date-fns/locale";
import DevisTemplate from "./DevisTemplate";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface QuoteDetailViewProps {
  quote: Quote;
  onBack: () => void;
  onUpdate: () => void;
  onStatusUpdate?: (status: string) => Promise<void>;
  processingAction?: boolean;
}

const QuoteDetailView: React.FC<QuoteDetailViewProps> = ({ 
  quote, 
  onBack, 
  onUpdate,
  onStatusUpdate,
  processingAction = false
}) => {
  const { toast } = useToast();
  const { auth, hasRole } = useAuth();
  
  const [quoteDetails, setQuoteDetails] = useState<any>(null);
  const [quoteItems, setQuoteItems] = useState<CartItem[]>([]);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const isAdmin = hasRole(UserRole.ADMIN);
  const isAgent = hasRole(UserRole.AGENT) && !isAdmin;
  const isClient = hasRole(UserRole.CLIENT);

  const loadQuoteDetails = async () => {
    try {
      setLoading(true);
      
      const [details, items, payment, clientData] = await Promise.all([
        fetchQuoteDetails(quote.id),
        fetchQuoteItems(quote.offerPlateId),
        fetchPaymentInfoByQuoteId(quote.id).catch(() => null),
        fetchClientByQuoteId(quote.id).catch(() => null)
      ]);
      
      setQuoteDetails(details);
      setQuoteItems(items);
      setPaymentInfo(payment);
      setClient(clientData);
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
    loadQuoteDetails();
  }, [quote]);

  const handleStatusUpdate = async (status: string) => {
    if (onStatusUpdate) {
      await onStatusUpdate(status);
    } else {
      try {
        await updateQuoteStatus(quote.id, status);
        
        toast({
          title: "Statut mis à jour",
          description: "Le statut du devis a été mis à jour.",
        });
        
        onUpdate();
        onBack();
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handlePrint = () => {
    setShowPreview(true);
  };

  const handlePayment = async () => {
    if (!client) {
      toast({
        title: "Erreur",
        description: "Les informations du client sont requises pour le paiement.",
        variant: "destructive",
      });
      return;
    }

    try {
      setProcessingPayment(true);
      setPaymentLink(null); // Reset payment link when generating a new one
      
      // Construction du nom complet du client
      const clientFullName = `${client.first_name || ""} ${client.last_name || ""}`.trim() || "Client";
      
      const response = await createPaymentLink(
        totalAmount,
        clientFullName,
        {
          clientEmail: client.email,
          failureUrl: `${window.location.origin}/payment/failure?quoteId=${quote.id}`,
          successUrl: `${window.location.origin}/payment/success?quoteId=${quote.id}`,
          callbackUrl: `${window.location.origin}/payment/callback/${quote.id}`,
          description: "Devis i-numera #" + quote.id.substring(0, 8),
          message: "Paiement du devis i-numera",
          reference: `quote-${quote.id}`
        }
      );
      
      if (response?.data?.paymentLink) {
        setPaymentLink(response.data.paymentLink);
        toast({
          title: "Lien de paiement généré",
          description: "Vous pouvez maintenant copier ce lien.",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de générer le lien de paiement.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erreur de paiement",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessingPayment(false);
    }
  };

  const copyPaymentLink = async () => {
    if (!paymentLink) return;

    try {
      await navigator.clipboard.writeText(paymentLink);
      setLinkCopied(true);
      toast({
        title: "Copié!",
        description: "Le lien de paiement a été copié dans le presse-papier.",
      });
      
      // Reset copied state after 3 seconds
      setTimeout(() => {
        setLinkCopied(false);
      }, 3000);
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien.",
        variant: "destructive",
      });
    }
  };

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

  const getPaymentStatusStyle = (status: string) => {
    return status === "Payé" 
      ? "bg-green-100 text-green-800" 
      : "bg-gray-100 text-gray-800";
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

  const renderStatusActions = () => {
    const buttonProcessing = processingAction || processingPayment;
    
    if (isAdmin && quote.status === "pending") {
      return (
        <div className="flex gap-2">
          <Button
            onClick={() => handleStatusUpdate("approved")}
            disabled={buttonProcessing}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="h-4 w-4 mr-2" />
            Approuver
          </Button>
          <Button
            onClick={() => handleStatusUpdate("rejected")}
            disabled={buttonProcessing}
            variant="destructive"
          >
            <X className="h-4 w-4 mr-2" />
            Rejeter
          </Button>
        </div>
      );
    }

    if (isAgent && quote.status === "pending") {
      return (
        <Button
          onClick={() => handleStatusUpdate("pending")}
          disabled={processingAction}
        >
          <SendToBack className="h-4 w-4 mr-2" />
          Envoyer à l'admin pour validation
        </Button>
      );
    }

    if (!isAdmin && !isClient && quote.status === "approved") {
      return (
        <Button
          onClick={() => handleStatusUpdate("sent")}
          disabled={processingAction}
        >
          <Send className="h-4 w-4 mr-2" />
          Envoyer au client
        </Button>
      );
    }

    if (isClient && quote.status === "sent") {
      return (
        <div className="flex gap-2">
          <Button
            onClick={() => handleStatusUpdate("accepted")}
            disabled={processingAction}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="h-4 w-4 mr-2" />
            Accepter
          </Button>
          <Button
            onClick={() => handleStatusUpdate("rejected")}
            disabled={processingAction}
            variant="destructive"
          >
            <X className="h-4 w-4 mr-2" />
            Rejeter
          </Button>
        </div>
      );
    }

    return null;
  };

  const totalAmount = quoteItems.reduce((acc, item) => {
    const monthlyTotal = item.offer.priceMonthly * item.quantity;
    const setupTotal = item.offer.setupFee * item.quantity;
    return acc + monthlyTotal + setupTotal;
  }, 0);

  // Get client name from the client data that was fetched
  const clientName = client ? 
    `${client.first_name || ""} ${client.last_name || ""}`.trim() : 
    quoteDetails?.client ? 
      `${quoteDetails.client.first_name || ""} ${quoteDetails.client.last_name || ""}`.trim() : 
      "Client";

  // Affichage du bouton de paiement uniquement pour les clients et si le devis est accepté et non payé
  const showPaymentButton = isClient && 
    quote.status === "accepted" && 
    quote.paymentStatus === "Non Payé";

  return (
    <div className="text-left">
      <div className="flex items-center mb-4">
        <Button variant="ghost" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h2 className="text-2xl font-bold">Devis #{quote.id.substring(0, 8)}</h2>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>Détails du devis</CardTitle>
            <div className="flex gap-2">
              <span
                className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(quote.status)}`}
              >
                {getStatusText(quote.status)}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${getPaymentStatusStyle(quote.paymentStatus)}`}
              >
                {quote.paymentStatus}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Client</h3>
                  <p>{clientName}</p>
                  {client?.email && (
                    <p className="text-sm text-muted-foreground">{client.email}</p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Plaquette d'offres</h3>
                  <p>{quoteDetails?.offer_plates?.name || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Date de création</h3>
                  <p>{format(new Date(quote.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Montant total</h3>
                  <p className="text-xl font-bold">{Number(totalAmount).toFixed(2)} €</p>
                </div>
              </div>

              {/* Payment link section */}
              {paymentLink && (
                <div className="mt-4 p-4 border rounded-md bg-muted/30">
                  <div className="flex flex-col space-y-2">
                    <h3 className="font-medium">Lien de paiement</h3>
                    <div className="flex items-center">
                      <div className="bg-white border rounded-l-md px-3 py-2 flex-1 truncate">
                        {paymentLink}
                      </div>
                      <Button 
                        onClick={copyPaymentLink} 
                        className={`rounded-l-none ${linkCopied ? 'bg-green-600' : ''}`}
                      >
                        {linkCopied ? (
                          <Check className="h-4 w-4 mr-2" />
                        ) : (
                          <Link className="h-4 w-4 mr-2" />
                        )}
                        {linkCopied ? 'Copié' : 'Copier'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <h3 className="font-medium mb-2">Détails des articles</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Article</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Prix unitaire</TableHead>
                      <TableHead className="text-right">Quantité</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quoteItems.map((item) => (
                      <TableRow key={`${item.offerId}-${item.quantity}`}>
                        <TableCell className="font-medium">{item.offer.name}</TableCell>
                        <TableCell className="max-w-xs truncate">{item.offer.description}</TableCell>
                        <TableCell className="text-right">{Number(item.offer.priceMonthly).toFixed(2)} €</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          {(Number(item.offer.priceMonthly) * item.quantity).toFixed(2)} €
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Aperçu Devis
                </Button>
                <div className="flex gap-2">
                  {showPaymentButton && (
                    <Button 
                      onClick={handlePayment}
                      disabled={processingPayment}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      {processingPayment ? "Traitement..." : "Générer lien de paiement"}
                    </Button>
                  )}
                  {renderStatusActions()}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {!loading && quote.status === 'draft' && !isClient && !isAdmin && (
        <div className="mt-8 flex justify-center">
          <Button 
            onClick={() => handleStatusUpdate('pending')}
            disabled={processingAction}
            size="lg"
            className="w-full max-w-md bg-primary hover:bg-primary/90"
          >
            <SendToBack className="h-4 w-4 mr-2" />
            Envoyer à l'administrateur pour validation
          </Button>
        </div>
      )}
      
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto text-left">
          {!loading && (
            <>
              <DevisTemplate 
                quote={{...quote, client}} 
                items={quoteItems} 
                clientName={clientName}
                paymentInfo={paymentInfo ? {
                  bankName: paymentInfo.bank_name,
                  iban: paymentInfo.iban,
                  bic: paymentInfo.bic
                } : undefined}
              />
              {quote.status === '' && !isClient && !isAdmin && (
                <div className="mt-6 flex justify-center">
                  <Button 
                    onClick={() => {
                      setShowPreview(false);
                      handleStatusUpdate('pending');
                    }}
                    disabled={processingAction}
                    size="lg"
                    className="w-full max-w-md bg-primary hover:bg-primary/90"
                  >
                    <SendToBack className="h-4 w-4 mr-2" />
                    Envoyer à l'administrateur pour validation
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuoteDetailView;
