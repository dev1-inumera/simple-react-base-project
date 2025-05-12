
# Documentation des Structures de Données Supabase

Ce document présente une vue d'ensemble complète de tous les schémas, tables, fonctions, et autres composants de la base de données Supabase utilisée dans ce projet.

## Tables de la Base de Données

### Table: profiles

Cette table stocke les informations des utilisateurs (clients, agents, administrateurs).

| Colonne | Type | Nullable | Défaut | Description |
|---------|------|---------|--------|-------------|
| id | uuid | Non | None | Clé primaire, référence à auth.users |
| first_name | text | Oui | None | Prénom de l'utilisateur |
| last_name | text | Oui | None | Nom de l'utilisateur |
| phone | text | Oui | None | Numéro de téléphone |
| address | text | Oui | None | Adresse postale |
| birth_date | date | Oui | None | Date de naissance |
| role | user_role | Non | 'client' | Rôle (client, agent, admin) |
| created_at | timestamp with time zone | Oui | now() | Date de création |
| updated_at | timestamp with time zone | Oui | now() | Date de mise à jour |
| business_sector | text | Oui | None | Secteur d'activité |
| company_name | text | Oui | None | Nom de l'entreprise |
| manager_name | text | Oui | None | Nom du responsable |
| company_role | text | Oui | None | Rôle dans l'entreprise |
| email | text | Oui | None | Email de l'utilisateur |
| email_notifications | boolean | Oui | true | Préférence pour les notifications par email |
| language | text | Oui | 'fr' | Langue préférée |
| theme | text | Oui | 'light' | Thème préféré |
| timezone | text | Oui | 'Europe/Paris' | Fuseau horaire |

### Table: folders

Cette table stocke les dossiers clients créés par les agents.

| Colonne | Type | Nullable | Défaut | Description |
|---------|------|---------|--------|-------------|
| id | uuid | Non | gen_random_uuid() | Clé primaire |
| name | text | Non | None | Nom du dossier |
| client_id | uuid | Non | None | Référence à l'ID du client |
| agent_id | uuid | Non | None | Référence à l'ID de l'agent |
| quote_id | uuid | Oui | None | Référence à l'ID du devis |
| created_at | timestamp with time zone | Oui | now() | Date de création |
| updated_at | timestamp with time zone | Oui | now() | Date de mise à jour |

### Table: offers

Cette table stocke les offres disponibles dans le catalogue.

| Colonne | Type | Nullable | Défaut | Description |
|---------|------|---------|--------|-------------|
| id | uuid | Non | gen_random_uuid() | Clé primaire |
| name | text | Non | None | Nom de l'offre |
| description | text | Non | None | Description de l'offre |
| category | text | Non | None | Catégorie de l'offre |
| price_monthly | numeric | Non | 0 | Prix mensuel |
| setup_fee | numeric | Non | 0 | Frais d'installation |
| is_active | boolean | Non | true | Indique si l'offre est active |
| image_url | text | Oui | None | URL de l'image |
| created_at | timestamp with time zone | Oui | now() | Date de création |
| updated_at | timestamp with time zone | Oui | now() | Date de mise à jour |

### Table: offer_features

Cette table stocke les caractéristiques des offres.

| Colonne | Type | Nullable | Défaut | Description |
|---------|------|---------|--------|-------------|
| id | uuid | Non | gen_random_uuid() | Clé primaire |
| offer_id | uuid | Oui | None | Référence à l'ID de l'offre |
| feature | text | Non | None | Description de la caractéristique |
| created_at | timestamp with time zone | Oui | now() | Date de création |

### Table: offer_extras

Cette table stocke les extras optionnels des offres.

| Colonne | Type | Nullable | Défaut | Description |
|---------|------|---------|--------|-------------|
| id | uuid | Non | gen_random_uuid() | Clé primaire |
| offer_id | uuid | Non | None | Référence à l'ID de l'offre |
| name | text | Non | None | Nom de l'extra |
| description | text | Oui | None | Description de l'extra |
| unit_price | numeric | Non | 0 | Prix unitaire |
| created_at | timestamp with time zone | Oui | now() | Date de création |

### Table: offer_plates

Cette table stocke les plaquettes d'offres créées pour les clients.

| Colonne | Type | Nullable | Défaut | Description |
|---------|------|---------|--------|-------------|
| id | uuid | Non | gen_random_uuid() | Clé primaire |
| name | text | Non | None | Nom de la plaquette |
| client_id | uuid | Oui | None | Référence à l'ID du client |
| agent_id | uuid | Non | None | Référence à l'ID de l'agent |
| status | text | Non | 'draft' | Statut (draft, sent, etc.) |
| folder_id | uuid | Oui | None | Référence à l'ID du dossier |
| created_at | timestamp with time zone | Oui | now() | Date de création |
| updated_at | timestamp with time zone | Oui | now() | Date de mise à jour |
| sent_at | timestamp with time zone | Oui | None | Date d'envoi |
| sent_method | text | Oui | None | Méthode d'envoi |

### Table: offer_plate_items

Cette table stocke les éléments inclus dans les plaquettes d'offres.

| Colonne | Type | Nullable | Défaut | Description |
|---------|------|---------|--------|-------------|
| id | uuid | Non | gen_random_uuid() | Clé primaire |
| offer_plate_id | uuid | Non | None | Référence à l'ID de la plaquette |
| offer_id | uuid | Non | None | Référence à l'ID de l'offre |
| quantity | integer | Non | 1 | Quantité |
| created_at | timestamp with time zone | Oui | now() | Date de création |

### Table: quotes

Cette table stocke les devis créés à partir des plaquettes d'offres.

| Colonne | Type | Nullable | Défaut | Description |
|---------|------|---------|--------|-------------|
| id | uuid | Non | gen_random_uuid() | Clé primaire |
| offer_plate_id | uuid | Non | None | Référence à l'ID de la plaquette |
| client_id | uuid | Oui | None | Référence à l'ID du client |
| agent_id | uuid | Non | None | Référence à l'ID de l'agent |
| status | text | Non | 'pending' | Statut (pending, approved, etc.) |
| payment_status | text | Non | 'Non Payé' | Statut du paiement |
| total_amount | numeric | Non | None | Montant total |
| created_at | timestamp with time zone | Oui | now() | Date de création |
| updated_at | timestamp with time zone | Oui | now() | Date de mise à jour |

### Table: payment_info

Cette table stocke les informations de paiement pour les devis.

| Colonne | Type | Nullable | Défaut | Description |
|---------|------|---------|--------|-------------|
| id | uuid | Non | gen_random_uuid() | Clé primaire |
| quote_id | uuid | Non | None | Référence à l'ID du devis |
| bank_name | text | Non | None | Nom de la banque |
| iban | text | Non | None | IBAN |
| bic | text | Non | None | BIC |
| created_at | timestamp with time zone | Non | now() | Date de création |
| updated_at | timestamp with time zone | Non | now() | Date de mise à jour |

### Table: payment_notifications

Cette table stocke les notifications de paiement.

| Colonne | Type | Nullable | Défaut | Description |
|---------|------|---------|--------|-------------|
| id | uuid | Non | gen_random_uuid() | Clé primaire |
| quote_id | uuid | Oui | None | Référence à l'ID du devis |
| client_name | text | Non | None | Nom du client |
| amount | numeric | Non | None | Montant |
| fee | numeric | Non | None | Frais |
| description | text | Non | None | Description |
| payment_method | text | Non | None | Méthode de paiement |
| payment_status | text | Non | None | Statut du paiement |
| payment_reference | text | Non | None | Référence du paiement |
| merchant_payment_reference | text | Non | None | Référence du commerçant |
| notification_token | text | Non | None | Token de notification |
| created_at | timestamp with time zone | Non | now() | Date de création |
| processed | boolean | Oui | false | Indique si traité |

### Table: notifications

Cette table stocke les notifications système pour les utilisateurs.

| Colonne | Type | Nullable | Défaut | Description |
|---------|------|---------|--------|-------------|
| id | uuid | Non | gen_random_uuid() | Clé primaire |
| user_id | uuid | Non | None | Référence à l'ID de l'utilisateur |
| title | text | Non | None | Titre de la notification |
| content | text | Non | None | Contenu de la notification |
| type | text | Non | None | Type de notification |
| link | text | Oui | None | Lien associé |
| read | boolean | Oui | false | Indique si lu |
| created_at | timestamp with time zone | Non | now() | Date de création |

## Énumérations

### Énumération: user_role

Cette énumération définit les rôles d'utilisateur possibles.

Valeurs:
- client: utilisateur client standard
- agent: utilisateur avec rôle d'agent commercial
- admin: utilisateur administrateur avec tous les droits

## Fonctions de Base de Données

### Fonction: handle_updated_at()

Cette fonction est utilisée comme déclencheur pour mettre à jour le champ `updated_at` automatiquement.

```sql
CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
```

### Fonction: handle_new_user()

Cette fonction est utilisée comme déclencheur pour créer automatiquement un profil lorsqu'un nouvel utilisateur s'inscrit.

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'client')
  );
  RETURN NEW;
END;
$function$
```

## Edge Functions

Le projet utilise plusieurs Edge Functions Supabase pour exécuter des opérations côté serveur:

### stripe-payment

Traite les paiements via Stripe Checkout.
- Entrées: données du client, montant, URLs de succès/échec
- Sorties: URL de paiement Stripe, ID de session

### payment-notification

Gère les notifications de paiement reçues des passerelles de paiement.

### send-offer-plate-email

Envoie des emails avec les plaquettes d'offres aux clients.
- Utilise SendGrid pour l'envoi d'emails

### send-quote-email

Envoie des emails avec les devis et liens de paiement aux clients.
- Utilise SendGrid pour l'envoi d'emails

### sendgrid-stats

Récupère les statistiques d'email depuis SendGrid API.

### sendgrid-activity

Récupère les données d'activité d'email depuis SendGrid API.

### sendgrid-send

Service général d'envoi d'emails via SendGrid.

## Relations entre les Tables

1. **profiles** ↔ **folders**: 
   - Un client peut avoir plusieurs dossiers (client_id)
   - Un agent peut gérer plusieurs dossiers (agent_id)

2. **folders** ↔ **offer_plates**:
   - Un dossier peut contenir plusieurs plaquettes d'offres (folder_id)

3. **offer_plates** ↔ **offer_plate_items**:
   - Une plaquette d'offres contient plusieurs éléments (offer_plate_id)

4. **offers** ↔ **offer_plate_items**:
   - Une offre peut apparaître dans plusieurs éléments de plaquette (offer_id)

5. **offers** ↔ **offer_features**:
   - Une offre peut avoir plusieurs caractéristiques (offer_id)

6. **offers** ↔ **offer_extras**:
   - Une offre peut avoir plusieurs extras optionnels (offer_id)

7. **offer_plates** ↔ **quotes**:
   - Une plaquette d'offres peut générer un devis (offer_plate_id)

8. **quotes** ↔ **payment_info**:
   - Un devis peut avoir des informations de paiement associées (quote_id)

9. **quotes** ↔ **payment_notifications**:
   - Un devis peut avoir plusieurs notifications de paiement (quote_id)

## Flux de Travail Principal

1. Un agent crée un dossier pour un client (`folders`)
2. L'agent crée une plaquette d'offres (`offer_plates`) dans ce dossier
3. L'agent ajoute des offres à la plaquette (`offer_plate_items`)
4. L'agent envoie la plaquette au client (via `send-offer-plate-email`)
5. Un devis est créé à partir de la plaquette (`quotes`)
6. Le devis est approuvé et envoyé au client avec un lien de paiement (via `send-quote-email`)
7. Le client paie le devis via Stripe (`stripe-payment`)
8. La notification de paiement est traitée (`payment-notification`)

## Secrets Configurés

Le projet utilise les secrets suivants pour les Edge Functions:

- **STRIPE_API_KEY**: Clé API Stripe pour le traitement des paiements
- **SENDGRID_API_KEY**: Clé API SendGrid pour l'envoi d'emails
- **RESEND_API_KEY**: Clé API Resend pour l'envoi d'emails alternatif
