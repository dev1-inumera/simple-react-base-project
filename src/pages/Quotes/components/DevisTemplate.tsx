import React from "react";
import { formatDistanceToNow, format } from "date-fns";
import { fr } from "date-fns/locale";
import { Quote, CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FileText } from "lucide-react";
import QuotePDF from "./QuotePDF";
import CustomQuotesHeader from "./CustomQuotesHeader";

interface DevisTemplateProps {
  quote: Quote;
  items: CartItem[];
  clientName?: string;
  paymentInfo?: {
    bankName: string;
    iban: string;
    bic: string;
  };
}

const DevisTemplate: React.FC<DevisTemplateProps> = ({ quote, items, clientName, paymentInfo }) => {
  // Calcul du total HT
  const totalHT = items.reduce((acc, item) => acc + (item.offer.priceMonthly * item.quantity), 0);
  const tva = totalHT * 0.2;
  const totalTTC = totalHT + tva;
  
  const formattedDate = quote.createdAt ? format(new Date(quote.createdAt), 'dd/MM/yyyy', { locale: fr }) : '';
  const quoteNumber = quote.id ? `${quote.id.substring(0, 8)}` : '';
  console.log(quote.client?.phone)

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-lg print:shadow-none">
        <div className="flex justify-end p-4">
          <PDFDownloadLink
            document={
              <QuotePDF 
                quote={quote} 
                items={items} 
                clientName={clientName}
                paymentInfo={paymentInfo}
              />
            }
            fileName={`devis-${quote.id.substring(0, 8)}.pdf`}
          >
            {({ loading }) => (
              <Button disabled={loading} variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                {loading ? "Génération..." : "Exporter en PDF"}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
        
        <CustomQuotesHeader />
        <div className="left-[100px] top-[-180px]  p-4 rounded-t-md relative items-center" style={{zIndex:999}}>
              <h1 className="text-xl text-white z-10 font-bold text-[25px]">Devis n° {quoteNumber}</h1>
            </div>
        <div className="top-[-100px] relative p-8 print:p-0">
          {/* Header Section */}
          
          <div className="top-[-150px] relative h-[20px] bg-no-repeat bg-cover bg-top" 
        >
            
            
            <div className="relative mt-[200px] left-[430px] justify-between pt-2 ">
              <div className="w-1/2"></div>
              <div className="w-1/2 text-right z-10 relative pr-4 pt-2">
                <p className="text-xs">131, continental Dr, Suite 305 Newark, DE 19713</p>
                <p className="text-xs">United States</p>
                <p className="text-xs">+1(833) 856 3018</p>
                
                <p className="text-xs">+33 9 86 40 63</p>
                <p className="text-xs">www.i-numera.com</p>
              </div>
            </div>
          </div>

          {/* Client Info Section */}
          <div className="mb-6">
            <div className="flex flex-col">
              <h2 className="font-bold text-base">{clientName || "Client"}</h2>
              <p className="text-[17px] text-black">{quote.client?.address || ""}</p>
              <p className="text-xs text-blue-600 underline">{quote.client?.email || ""}</p>
            </div>
          </div>

          {/* Line Items Cards */}
          <div className="mb-6 space-y-4">
            {/* Header */}
            <div className="flex items-center mb-4 rounded-xl border-[2px] border-red-400">
              <div className="w-1/6 py-7 px-4 text-left text-xs font-bold">Offre</div>
              <div className="w-2/6 py-7 px-4 text-left text-xs font-bold">Description de l'offre</div>
              <div className="w-1/6 py-7 px-4 text-xs font-bold">Frais de création</div>
              <div className="w-1/6 py-5 px-4 text-right text-xs font-bold">Abonnements par mois</div>
              <div className="w-1/6 py-7 px-4 text-right text-xs font-bold">Quantité</div>
            </div>

            {/* Body */}
            {items.map((item, index) => (
              <div key={index} className="flex items-center border-[2px] border-gray-400 rounded-md">
                <div className="w-1/6 py-2 px-4 text-xs">{item.offer.name}</div>
                <div className="w-2/6 py-2 px-4 text-xs">{item.offer.description}</div>
                <div className="w-1/6 py-2 px-4 text-right text-xs">{item.offer.setupFee > 0 ? `${item.offer.setupFee.toFixed(2)}€` : "-"}</div>
                <div className="w-1/6 py-2 px-4 text-right text-xs">{item.offer.priceMonthly > 0 ? `${item.offer.priceMonthly.toFixed(2)}€` : "-"}</div>
                <div className="w-1/6 py-2 px-4 text-right text-xs">{item.quantity}</div>
              </div>
            ))}

            {/* Footer */}
            <div className="flex items-center border border-gray-400 rounded-md">
              <div className="w-5/6 py-2 px-4 text-right text-xs font-bold border-r border-gray-400">Total HT</div>
              <div className="w-1/6 py-2 px-4 text-right text-xs font-bold">{totalHT.toFixed(2)}€ HT</div>
            </div>
          </div>

          {/* Total Section */}
          <div className="mb-6 mt-[100px]">
            <div className="flex flex-col items-end">
              <div className="w-1/3">
                <div className="flex justify-between py-1">
                  <span className="text-sm">Subtotal</span>
                  <span className="text-sm font-semibold">{totalHT.toFixed(2)}€ HT</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-sm">TVA (20%)</span>
                  <span className="text-sm font-semibold">{tva.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between py-2 mt-1 bg-[#c41c28] text-white font-bold rounded">
                  <span className="text-sm ml-2">Total</span>
                  <span className="text-sm mr-2">{totalTTC.toFixed(2)}€ TTC</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info and Signature Section */}
          <div className="flex justify-between">
            <div className="w-1/2">
              <div className="mb-6">
                <h3 className="text-sm font-bold text-[#2B3266] mb-1">Informations de paiement</h3>
                <p className="text-xs">Paiement par virement bancaire</p>
                {paymentInfo && (
                  <>
                    <p className="text-xs">Banque : {paymentInfo.bankName}</p>
                    <p className="text-xs">IBAN : {paymentInfo.iban}</p>
                    <p className="text-xs">BIC : {paymentInfo.bic}</p>
                  </>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-bold text-[#2B3266] mb-1">Termes & conditions</h3>
                <p className="text-xs">Ce devis est valable 7 jours à compter de sa date d'émission</p>
              </div>
            </div>
            
            <div className="w-1/3 border border-red-400 rounded-md p-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Date: {formattedDate}</span>
              </div>
              <div className="border-b pb-20 border-gray-400 pt-2">
                <span className="text-sm text-gray-600">Signature:</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevisTemplate;
