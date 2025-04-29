
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { CartItem } from "@/types";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    backgroundColor: '#9b87f5',
    padding: 15,
    color: 'white',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 20,
    opacity: 0.8,
  },
  description: {
    fontSize: 12,
    marginBottom: 20,
    color: '#666',
  },
  offerSection: {
    marginBottom: 15,
    padding: 10,
    border: '1 solid #eee',
    borderRadius: 4,
  },
  offerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  offerDescription: {
    fontSize: 12,
    marginBottom: 10,
    color: '#666',
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10,
  },
  featureItem: {
    fontSize: 10,
    marginLeft: 10,
    marginBottom: 3,
  },
  metaSection: {
    marginTop: 5,
    fontSize: 10,
    color: '#666',
  },
  metaItem: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  metaLabel: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  priceSection: {
    marginTop: 10,
    borderTop: '1 solid #eee',
    paddingTop: 5,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  priceLabel: {
    fontSize: 11,
    color: '#666',
  },
  price: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6E59A5',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    borderTop: '1 solid #eee',
    paddingTop: 10,
  },
  footerText: {
    marginBottom: 3,
  },
  disclaimer: {
    marginTop: 20,
    fontSize: 10,
    color: '#666',
    fontStyle: 'italic',
  },
});

interface OfferPlatePDFProps {
  items: CartItem[];
  offerPlate: any;
}

const OfferPlatePDF: React.FC<OfferPlatePDFProps> = ({ items, offerPlate }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Plaquette d'offres</Text>
        <Text style={styles.subtitle}>{offerPlate.name}</Text>
      </View>

      <View>
        <Text style={styles.description}>
          Nous sommes ravis de vous présenter notre sélection d'offres parfaitement adaptées à vos besoins.
          Chaque service a été soigneusement choisi pour vous offrir la meilleure solution possible.
        </Text>
      </View>

      {items.map((item, index) => (
        <View key={index} style={styles.offerSection}>
          <Text style={styles.offerTitle}>{item.offer.name}</Text>
          <Text style={styles.offerDescription}>{item.offer.description}</Text>
          
          {item.offer.features && item.offer.features.length > 0 && (
            <View>
              <Text style={styles.featureTitle}>Fonctionnalités:</Text>
              {item.offer.features.map((feature, idx) => (
                <Text key={idx} style={styles.featureItem}>
                  • {feature}
                </Text>
              ))}
            </View>
          )}

          <View style={styles.metaSection}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Catégorie:</Text>
              <Text>{item.offer.category}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Quantité:</Text>
              <Text>{item.quantity}</Text>
            </View>
          </View>

          <View style={styles.priceSection}>
            {item.offer.setupFee > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Frais initiaux</Text>
                <Text style={styles.price}>{item.offer.setupFee} €</Text>
              </View>
            )}
            {item.offer.priceMonthly > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Abonnement mensuel</Text>
                <Text style={styles.price}>{item.offer.priceMonthly} €</Text>
              </View>
            )}
          </View>
        </View>
      ))}

      <View style={styles.disclaimer}>
        <Text>
          Cette plaquette d'offres est une proposition personnalisée. Pour toute question ou pour obtenir un devis détaillé,
          n'hésitez pas à nous contacter.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>www.i-numa.com</Text>
        <Text style={styles.footerText}>contact@i-numa.com | +33 9 86 40 63</Text>
      </View>
    </Page>
  </Document>
);

export default OfferPlatePDF;
