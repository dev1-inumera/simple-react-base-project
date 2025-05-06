
const generateHTMLContent = (quote, items, clientName, paymentInfo) => {
    const totalHT = items.reduce((acc, item) => acc + (item.offer.priceMonthly * item.quantity), 0);
    const tva = totalHT * 0.2;
    const totalTTC = totalHT + tva;
    
    const formattedDate = quote.createdAt ? new Date(quote.createdAt).toLocaleDateString('fr-FR') : '';
    const quoteNumber = quote.id ? `${quote.id.substring(0, 8)}` : '';
  
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; font-size: 14px; color: #333; }
            .header { text-align: center; padding: 20px; background-color: #f4f4f4; }
            .footer { text-align: center; padding: 10px; background-color: #f4f4f4; font-size: 12px; }
            .company-info, .client-info { text-align: right; font-size: 12px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .table th { background-color: #f2f2f2; }
            .total { text-align: right; font-weight: bold; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Devis n° ${quoteNumber}</h1>
          </div>
          <div class="company-info">
            <p>131, Continental Dr, Suite 305, Newark, DE 19713, United States</p>
            <p>+1(833) 856 3018</p>
            <p>www.i-numera.com</p>
          </div>
  
          <div class="client-info">
            <h3>${clientName || "Client"}</h3>
            <p>${quote.client?.address || ""}</p>
            <p>Email: <a href="mailto:${quote.client?.email}">${quote.client?.email}</a></p>
          </div>
  
          <table class="table">
            <thead>
              <tr>
                <th>Offre</th>
                <th>Description</th>
                <th>Frais de création</th>
                <th>Abonnement par mois</th>
                <th>Quantité</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td>${item.offer.name}</td>
                  <td>${item.offer.description}</td>
                  <td>${item.offer.setupFee > 0 ? item.offer.setupFee.toFixed(2) + "€" : "-"}</td>
                  <td>${item.offer.priceMonthly > 0 ? item.offer.priceMonthly.toFixed(2) + "€" : "-"}</td>
                  <td>${item.quantity}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
  
          <div class="total">
            <p>Total HT: ${totalHT.toFixed(2)}€</p>
            <p>TVA (20%): ${tva.toFixed(2)}€</p>
            <p><strong>Total TTC: ${totalTTC.toFixed(2)}€</strong></p>
          </div>
  
          <div class="footer">
            <p>Ce devis est valable 7 jours à compter de sa date d'émission</p>
            <p>i-numa.com | contact@i-numa.com | +33 9 86 40 63</p>
          </div>
        </body>
      </html>
    `;
  };
  
export default generateHTMLContent;
