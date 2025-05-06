
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Quote, CartItem } from "@/types";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    height: 200,
    position: 'relative',
  },
  headerOverlay: {
    position: 'absolute',
    top: 100,
    left: 50,
    
  },
  title: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  companyInfo: {
    position: 'absolute',
    top: 200,
    right: 0,
    width: '40%',
    fontSize: 10,
    textAlign: 'right',
  },
  infoText: {
    marginBottom: 2,
    color: '#555',
  },
  clientSection: {
    marginTop: 100,
    marginBottom: 20,
  },
  clientTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  clientId: {
    fontSize: 10,
    textTransform: 'uppercase',
    color: '#777',
  },
  clientEmail: {
    fontSize: 10,
    color: '#3366cc',
  },
  clientAddress: {
    paddingBottom:'6px',
    paddingTop: '6px',
    fontSize: 10,
    color: 'rgb(20, 28, 44)',
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#c41c28',
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderRadius: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#ddd',
    marginTop: 5,
    padding: 8,
    borderRadius: 5,
  },
  tableFooter: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#ddd',
    marginTop: 5,
    padding: 8,
    borderRadius: 5,
  },
  tableCol1: {
    width: '16%',
    fontSize: 9,
  },
  tableCol2: {
    width: '33%',
    fontSize: 9,
  },
  tableCol3: {
    width: '17%',
    fontSize: 9,
    textAlign: 'right',
  },
  tableCol4: {
    width: '17%',
    fontSize: 9,
    textAlign: 'right',
  },
  tableCol5: {
    width: '17%',
    fontSize: 9,
    textAlign: 'right',
  },
  tableFooterCol1: {
    width: '83%',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  tableFooterCol2: {
    width: '17%',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  totalSection: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalContainer: {
    width: '33%',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    padding: 4,
  },
  totalFinalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#c41c28',
    color: 'white',
    padding: 5,
    borderRadius: 3,
  },
  totalLabel: {
    fontSize: 10,
  },
  totalValue: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  paymentSection: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentInfo: {
    width: '45%',
  },
  signatureBox: {
    width: '35%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#c41c28',
    borderRadius: 5,
  },
  paymentTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2B3266',
    marginBottom: 5,
  },
  paymentText: {
    fontSize: 9,
    marginBottom: 3,
  },
  signatureDate: {
    fontSize: 10,
    color: '#666',
    marginBottom: 10,
  },
  signatureLine: {
    fontSize: 10,
    color: '#666',
    marginBottom: 60,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1, // pour simuler l’arrière-plan
  },
});

interface QuotePDFProps {
  quote: Quote;
  items: CartItem[];
  clientName?: string;
  paymentInfo?: {
    bankName: string;
    iban: string;
    bic: string;
  };
}

const QuotePDF: React.FC<QuotePDFProps> = ({ quote, items, clientName, paymentInfo }) => {
  const totalHT = items.reduce((acc, item) => acc + (item.offer.priceMonthly * item.quantity), 0);
  const tva = totalHT * 0.2;
  const totalTTC = totalHT + tva;
  
  const formattedDate = quote.createdAt ? format(new Date(quote.createdAt), 'dd/MM/yyyy', { locale: fr }) : '';
  const quoteNumber = quote.id ? `${quote.id.substring(0, 8)}` : '';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
        <Image
  style={styles.background}
  src="/images/inuma.png"
/>

          <View style={styles.headerOverlay}>
            <Text style={styles.title}>Devis n° {quoteNumber}</Text>
          </View>
          <View style={styles.companyInfo}>
            <Text style={styles.infoText}>131, continental Dr, Suite 305 Newark, DE 19713</Text>
            <Text style={styles.infoText}>United States</Text>
            <Text style={styles.infoText}>+1(833) 856 3018</Text>
           
            <Text style={styles.infoText}>+33 9 85 40 63</Text>
            <Text style={styles.infoText}>www.i-numera.com</Text>
          </View>
        </View>

        <View style={styles.clientSection}>
          <Text style={styles.clientTitle}>{clientName || "Client"}</Text>
          <Text style={styles.clientAddress}>{quote.client?.address || ""}</Text>
          <Text style={styles.clientEmail}>{quote.client?.email || ""}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCol1}>Offre</Text>
            <Text style={styles.tableCol2}>Description de l'offre</Text>
            <Text style={styles.tableCol3}>Frais de création</Text>
            <Text style={styles.tableCol4}>Abonnements par mois</Text>
            <Text style={styles.tableCol5}>Quantité</Text>
          </View>

          {items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCol1}>{item.offer.name}</Text>
              <Text style={styles.tableCol2}>{item.offer.description}</Text>
              <Text style={styles.tableCol3}>{item.offer.setupFee > 0 ? `${item.offer.setupFee.toFixed(2)}€` : "-"}</Text>
              <Text style={styles.tableCol4}>{item.offer.priceMonthly > 0 ? `${item.offer.priceMonthly.toFixed(2)}€` : "-"}</Text>
              <Text style={styles.tableCol5}>{item.quantity}</Text>
            </View>
          ))}

          <View style={styles.tableFooter}>
            <Text style={styles.tableFooterCol1}>Total HT</Text>
            <Text style={styles.tableFooterCol2}>{totalHT.toFixed(2)}€ HT</Text>
          </View>
        </View>

        <View style={styles.totalSection}>
          <View style={styles.totalContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>{totalHT.toFixed(2)}€ HT</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TVA (20%)</Text>
              <Text style={styles.totalValue}>{tva.toFixed(2)}€</Text>
            </View>
            <View style={styles.totalFinalRow}>
              <Text style={[styles.totalLabel, { color: 'white' }]}>Total</Text>
              <Text style={[styles.totalValue, { color: 'white' }]}>{totalTTC.toFixed(2)}€ TTC</Text>
            </View>
          </View>
        </View>

        <View style={styles.paymentSection}>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>Informations de paiement</Text>
            <Text style={styles.paymentText}>Paiement par virement bancaire</Text>
            {paymentInfo && (
              <>
                <Text style={styles.paymentText}>Banque : {paymentInfo.bankName}</Text>
                <Text style={styles.paymentText}>IBAN : {paymentInfo.iban}</Text>
                <Text style={styles.paymentText}>BIC : {paymentInfo.bic}</Text>
              </>
            )}
            
            <Text style={[styles.paymentTitle, { marginTop: 15 }]}>Termes & conditions</Text>
            <Text style={styles.paymentText}>Ce devis est valable 7 jours à compter de sa date d'émission</Text>
          </View>
          
          <View style={styles.signatureBox}>
            <Text style={styles.signatureDate}>Date: {formattedDate}</Text>
            <Text style={styles.signatureLine}>Signature:</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>i-numa.com</Text>
          <Text>contact@i-numa.com | +33 9 86 40 63</Text>
          <Text>Ce devis est valable 7 jours à compter de sa date d'émission</Text>
        </View>
      </Page>
    </Document>
  );
};

export default QuotePDF;
