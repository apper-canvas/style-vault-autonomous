/**
 * Wishlist service for handling wishlist-related operations
 */

// Get wishlist items for a user
export const getWishlistItems = async (userId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Find wishlist items for the user
    const wishlistResponse = await apperClient.fetchRecords('wishlist', {
      where: [{ fieldName: 'user', operator: 'ExactMatch', values: [userId] }]
    });

    // If no wishlist items exist, return empty array
    if (!wishlistResponse.data || wishlistResponse.data.length === 0) {
      return [];
    }

    // For each wishlist item, get the related product
    const wishlistWithProducts = await Promise.all(
      wishlistResponse.data.map(async (item) => {
        try {
          const productResponse = await apperClient.getRecordById('product1', item.product);
          return {
            ...item,
            productDetails: productResponse.data
          };
        } catch (error) {
          console.error(`Error fetching product details for wishlist item: ${item.Id}`, error);
          return item;
        }
      })
    );

    return wishlistWithProducts;
  } catch (error) {
    console.error(`Error fetching wishlist for user ${userId}:`, error);
    throw error;
  }
};

// Add item to wishlist
export const addToWishlist = async (userId, productId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Check if product already exists in wishlist
    const existingItemResponse = await apperClient.fetchRecords('wishlist', {
      where: [
        { fieldName: 'user', operator: 'ExactMatch', values: [userId] },
        { fieldName: 'product', operator: 'ExactMatch', values: [productId] }
      ]
    });

    if (existingItemResponse.data && existingItemResponse.data.length > 0) {
      // Item already in wishlist, return existing item
      return existingItemResponse.data[0];
    }

    // Add new item to wishlist
    const wishlistData = {
      Name: `Wishlist Item for product ${productId}`,
      user: userId,
      product: productId
    };

    const params = {
      records: [wishlistData]
    };

    const response = await apperClient.createRecord('wishlist', params);
    return response.results[0].data;
  } catch (error) {
    console.error(`Error adding product ${productId} to wishlist for user ${userId}:`, error);
    throw error;
  }
};

// Remove item from wishlist
export const removeFromWishlist = async (wishlistItemId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      RecordIds: [wishlistItemId]
    };

    await apperClient.deleteRecord('wishlist', params);
    return true;
  } catch (error) {
    console.error(`Error removing wishlist item ${wishlistItemId}:`, error);
    throw error;
  }
};

// Check if a product is in user's wishlist
export const isInWishlist = async (userId, productId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.fetchRecords('wishlist', {
      where: [
        { fieldName: 'user', operator: 'ExactMatch', values: [userId] },
        { fieldName: 'product', operator: 'ExactMatch', values: [productId] }
      ]
    });

    return response.data && response.data.length > 0;
  } catch (error) {
    console.error(`Error checking if product ${productId} is in wishlist for user ${userId}:`, error);
    return false;
  }
};

export default { getWishlistItems, addToWishlist, removeFromWishlist, isInWishlist };