
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/types';

// Fetch cart items for a user
export const fetchCartItems = async (userId: string): Promise<CartItem[]> => {
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      offer:offer_id(
        *,
        features:offer_features(id, feature),
        extras:offer_extras(id, name, description, unit_price)
      )
    `)
    .eq('user_id', userId);

  if (error) throw error;

  return data.map(item => ({
    id: item.id,
    offerId: item.offer_id,
    quantity: item.quantity,
    userId: item.user_id,
    selectedExtras: item.selected_extras,
    offer: {
      id: item.offer.id,
      name: item.offer.name,
      description: item.offer.description,
      category: item.offer.category,
      imageUrl: item.offer.image_url,
      priceMonthly: item.offer.price_monthly,
      setupFee: item.offer.setup_fee,
      monthlyPayment: item.offer.price_monthly || 0,
      creationCost: item.offer.setup_fee || 0,
      type: item.offer.type || 'simple',
      price: item.offer.price || 0,
      extras: item.offer.extras?.map((extra: any) => ({
        id: extra.id,
        name: extra.name,
        description: extra.description,
        unitPrice: extra.unit_price,
        offerId: item.offer.id
      }))
    }
  }));
};

// Add item to cart
export const addToCart = async (userId: string, offerId: string, quantity = 1, selectedExtras?: Record<string, number>): Promise<void> => {
  // Check if item already exists in cart
  const { data: existingItems, error: checkError } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId)
    .eq('offer_id', offerId);

  if (checkError) throw checkError;

  if (existingItems.length > 0) {
    // Update quantity if item exists
    const { error: updateError } = await supabase
      .from('cart_items')
      .update({ 
        quantity: existingItems[0].quantity + quantity,
        selected_extras: selectedExtras || existingItems[0].selected_extras || {}
      })
      .eq('id', existingItems[0].id);

    if (updateError) throw updateError;
  } else {
    // Insert new item if it doesn't exist
    const { error: insertError } = await supabase
      .from('cart_items')
      .insert([
        { 
          user_id: userId, 
          offer_id: offerId, 
          quantity,
          selected_extras: selectedExtras || {}
        }
      ]);

    if (insertError) throw insertError;
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (cartItemId: string, quantity: number, selectedExtras?: Record<string, number>): Promise<void> => {
  const { error } = await supabase
    .from('cart_items')
    .update({ 
      quantity,
      selected_extras: selectedExtras
    })
    .eq('id', cartItemId);

  if (error) throw error;
};

// Remove item from cart
export const removeCartItem = async (cartItemId: string): Promise<void> => {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId);

  if (error) throw error;
};

// Clear cart
export const clearCart = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId);

  if (error) throw error;
};

// Calculate cart total
export const calculateCartTotal = (items: CartItem[]): { setupTotal: number, monthlyTotal: number, extrasTotal: number } => {
  return items.reduce(
    (acc, item) => {
      // Calculate setup fee
      const setupFee = (item.offer.setupFee || item.offer.creationCost || 0) * item.quantity;
      
      // Calculate monthly fee
      const monthlyFee = (item.offer.priceMonthly || item.offer.monthlyPayment || 0) * item.quantity;
      
      // Calculate extras
      let extrasTotal = 0;
      if (item.selectedExtras && item.offer.extras) {
        extrasTotal = Object.entries(item.selectedExtras).reduce((sum, [extraId, quantity]) => {
          const extra = item.offer.extras?.find(e => e.id === extraId);
          return sum + (extra ? extra.unitPrice * (quantity || 0) : 0);
        }, 0);
      }
      
      return {
        setupTotal: acc.setupTotal + setupFee,
        monthlyTotal: acc.monthlyTotal + monthlyFee,
        extrasTotal: acc.extrasTotal + extrasTotal
      };
    },
    { setupTotal: 0, monthlyTotal: 0, extrasTotal: 0 }
  );
};
