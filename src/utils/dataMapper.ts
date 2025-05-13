
// Utility functions for mapping database fields to TypeScript interfaces

/**
 * Maps database fields (snake_case) to TypeScript interface properties (camelCase)
 * @param data - The raw data from the database
 * @returns Mapped data with camelCase properties
 */
export const mapOffer = (data: any) => {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    category: data.category,
    imageUrl: data.image_url,
    priceMonthly: data.price_monthly,
    setupFee: data.setup_fee,
    isActive: data.is_active,
    createdAt: data.created_at,
    features: data.offer_features?.map((f: any) => f.feature) || [],
    hasExtras: data.offer_extras?.length > 0 || false
  };
};

export const mapOffers = (data: any[]) => {
  return data.map(mapOffer);
};

export const mapFolder = (data: any) => {
  return {
    id: data.id,
    name: data.name,
    clientId: data.client_id,
    agentId: data.agent_id,
    createdAt: data.created_at
  };
};

export const mapFolders = (data: any[]) => {
  return data.map(mapFolder);
};

export const mapQuote = (data: any) => {
  return {
    id: data.id,
    offerPlateId: data.offer_plate_id,
    clientId: data.client_id,
    agentId: data.agent_id,
    totalAmount: data.total_amount,
    status: data.status,
    paymentStatus: data.payment_status || "Non Payé",
    createdAt: data.created_at
  };
};

export const mapQuotes = (data: any[]) => {
  return data.map(mapQuote);
};

export const mapOfferPlate = (data: any) => {
  return {
    id: data.id,
    name: data.name,
    clientId: data.client_id,
    agentId: data.agent_id,
    status: data.status,
    createdAt: data.created_at,
    items: data.items || []
  };
};

export const mapOfferPlates = (data: any[]) => {
  return data.map(mapOfferPlate);
};

export const mapUser = (data: any) => {
  return {
    id: data.id,
    email: data.email || "",
    firstName: data.first_name,
    lastName: data.last_name,
    phone: data.phone,
    address: data.address,
    birthDate: data.birth_date,
    role: data.role,
    createdAt: data.created_at
  };
};

export const mapUsers = (data: any[]) => {
  return data.map(mapUser);
};

export const mapCartItem = (data: any) => {
  return {
    id: data.id,
    offerId: data.offer_id,
    offer: mapOffer(data.offers),
    quantity: data.quantity,
    selectedExtras: data.selected_extras || {}
  };
};

export const mapCartItems = (data: any[]) => {
  return data.map(mapCartItem);
};

export const mapCampaign = (data: any) => {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    startDate: data.start_date,
    endDate: data.end_date,
    objectives: data.objectives,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    createdBy: data.created_by
  };
};

export const mapCampaigns = (data: any[]) => {
  return data.map(mapCampaign);
};

export const mapLead = (data: any) => {
  return {
    id: data.id,
    campaignId: data.campaign_id,
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    phone: data.phone,
    company: data.company,
    position: data.position,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const mapLeads = (data: any[]) => {
  return data.map(mapLead);
};
