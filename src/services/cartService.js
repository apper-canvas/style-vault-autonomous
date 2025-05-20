/**
 * Cart service for handling cart-related operations
 */

// Get cart for a user
export const getUserCart = async (userId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Find cart for the user
    const cartResponse = await apperClient.fetchRecords('cart', {
      where: [{ fieldName: 'user', operator: 'ExactMatch', values: [userId] }]
    });

    // If no cart exists, return null
    if (!cartResponse.data || cartResponse.data.length === 0) {
      return null;
    }

    const cart = cartResponse.data[0];
    
    // Get cart items
    const cartItemsResponse = await apperClient.fetchRecords('cart_item1', {
      where: [{ fieldName: 'cart', operator: 'ExactMatch', values: [cart.Id] }]
    });

    // For each cart item, get the related product
    const cartItems = cartItemsResponse.data || [];
    const cartItemsWithProducts = await Promise.all(
      cartItems.map(async (item) => {
        try {
          const productResponse = await apperClient.getRecordById('product1', item.product);
          return {
            ...item,
            productDetails: productResponse.data
          };
        } catch (error) {
          console.error(`Error fetching product details for cart item: ${item.Id}`, error);
          return item;
        }
      })
    );

    return {
      ...cart,
      items: cartItemsWithProducts
    };
  } catch (error) {
    console.error(`Error fetching cart for user ${userId}:`, error);
    throw error;
  }
};

// Create a new cart for a user
export const createCart = async (userId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const cartData = {
      Name: `Cart for user ${userId}`,
      user: userId
    };

    const params = {
      records: [cartData]
    };

    const response = await apperClient.createRecord('cart', params);
    return response.results[0].data;
  } catch (error) {
    console.error(`Error creating cart for user ${userId}:`, error);
    throw error;
  }
};

// Add item to cart
export const addToCart = async (userId, productId, quantity = 1, size = null, color = null) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Find or create cart for the user
    let cartResponse = await apperClient.fetchRecords('cart', {
      where: [{ fieldName: 'user', operator: 'ExactMatch', values: [userId] }]
    });

    let cartId;
    if (!cartResponse.data || cartResponse.data.length === 0) {
      // Create new cart if none exists
      const newCart = await createCart(userId);
      cartId = newCart.Id;
    } else {
      cartId = cartResponse.data[0].Id;
    }

    // Check if product already exists in cart
    const existingItemResponse = await apperClient.fetchRecords('cart_item1', {
      where: [
        { fieldName: 'cart', operator: 'ExactMatch', values: [cartId] },
        { fieldName: 'product', operator: 'ExactMatch', values: [productId] },
        // If size is specified, match by size
        ...(size ? [{ fieldName: 'size', operator: 'ExactMatch', values: [size] }] : []),
        // If color is specified, match by color
        ...(color ? [{ fieldName: 'color', operator: 'ExactMatch', values: [color] }] : [])
      ]
    });

    if (existingItemResponse.data && existingItemResponse.data.length > 0) {
      // Update quantity if item already exists
      const existingItem = existingItemResponse.data[0];
      const updatedQuantity = existingItem.quantity + quantity;
      
      const updateParams = {
        records: [{
          Id: existingItem.Id,
          quantity: updatedQuantity
        }]
      };
      
      const updateResponse = await apperClient.updateRecord('cart_item1', updateParams);
      return updateResponse.results[0].data;
    } else {
      // Add new item to cart
      const cartItemData = {
        Name: `Cart Item for product ${productId}`,
        cart: cartId,
        product: productId,
        quantity: quantity,
        size: size || '',
        color: color || ''
      };

      const params = {
        records: [cartItemData]
      };

      const response = await apperClient.createRecord('cart_item1', params);
      return response.results[0].data;
    }
  } catch (error) {
    console.error(`Error adding product ${productId} to cart for user ${userId}:`, error);
    throw error;
  }
};

// Remove item from cart
export const removeFromCart = async (cartItemId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      RecordIds: [cartItemId]
    };

    await apperClient.deleteRecord('cart_item1', params);
    return true;
  } catch (error) {
    console.error(`Error removing cart item ${cartItemId}:`, error);
    throw error;
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (cartItemId, quantity) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Id: cartItemId,
        quantity: quantity
      }]
    };

    const response = await apperClient.updateRecord('cart_item1', params);
    return response.results[0].data;
  } catch (error) {
    console.error(`Error updating quantity for cart item ${cartItemId}:`, error);
    throw error;
  }
};

export default { getUserCart, createCart, addToCart, removeFromCart, updateCartItemQuantity };