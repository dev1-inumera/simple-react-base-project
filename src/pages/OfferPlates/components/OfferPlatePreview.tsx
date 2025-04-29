import React from "react";
import { CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FileText } from "lucide-react";
import OfferPlatePDF from "./OfferPlatePDF";

interface OfferPlatePreviewProps {
  items: CartItem[];
  offerPlate: any;
}

const OfferPlatePreview: React.FC<OfferPlatePreviewProps> = ({ items, offerPlate }) => {
  return (
    <div className="mx-auto max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex justify-end p-4">
        <PDFDownloadLink
          document={<OfferPlatePDF items={items} offerPlate={offerPlate} />}
          fileName={`plaquette-${offerPlate.name.toLowerCase().replace(/\s+/g, '-')}.pdf`}
        >
          {({ loading }) => (
            <Button disabled={loading} variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              {loading ? "Génération..." : "Exporter en PDF"}
            </Button>
          )}
        </PDFDownloadLink>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white p-6">
        <h2 className="text-2xl font-bold">Plaquette d'offres</h2>
        <p className="opacity-80">{offerPlate.name}</p>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid gap-6">
          {/* Description */}
          <div className="pb-4 border-b border-gray-200">
            <p className="text-gray-600">
              Nous sommes ravis de vous présenter notre sélection d'offres parfaitement adaptées à vos besoins.
              Chaque service a été soigneusement choisi pour vous offrir la meilleure solution possible.
            </p>
          </div>

          {/* Offers */}
          <div className="space-y-8">
            {items.map((item, index) => (
              <div 
                key={index}
                className="bg-white border border-gray-200 rounded-md p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#1A1F2C]">{item.offer.name}</h3>
                    <p className="text-gray-600 mt-1">{item.offer.description}</p>
                    
                    {item.offer.features && item.offer.features.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Fonctionnalités:</h4>
                        <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                          {item.offer.features.map((feature, idx) => (
                            <li key={idx}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="mt-4 text-sm space-y-1">
                      <div className="flex items-center">
                        <span className="font-medium">Catégorie:</span>
                        <span className="ml-2 text-gray-600 capitalize">{item.offer.category}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">Quantité:</span>
                        <span className="ml-2 text-gray-600">{item.quantity}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 md:ml-6 md:text-right">
                    <div className="space-y-1">
                      {item.offer.setupFee > 0 && (
                        <div>
                          <span className="text-sm text-gray-500">Frais initiaux</span>
                          <p className="font-semibold text-[#6E59A5]">{item.offer.setupFee} €</p>
                        </div>
                      )}
                      {item.offer.priceMonthly > 0 && (
                        <div>
                          <span className="text-sm text-gray-500">Abonnement mensuel</span>
                          <p className="font-semibold text-[#6E59A5]">{item.offer.priceMonthly} €</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Cette plaquette d'offres est une proposition personnalisée. Pour toute question ou pour obtenir un devis détaillé,
              n'hésitez pas à nous contacter.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row sm:justify-between items-center">
              <div className="text-[#9b87f5] font-semibold">www.i-numa.com</div>
              <div className="mt-2 sm:mt-0 text-gray-600 text-sm">contact@i-numa.com | +33 9 86 40 63</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferPlatePreview;
