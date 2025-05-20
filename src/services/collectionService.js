/**
 * Collection service for handling collection-related operations
 */

// Fetch all collections
export const fetchCollections = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.fetchRecords('collection', {});
    return response.data || [];
  } catch (error) {
    console.error('Error fetching collections:', error);
    throw error;
  }
};

// Get collection by ID
export const getCollectionById = async (collectionId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.getRecordById('collection', collectionId);
    return response.data;
  } catch (error) {
    console.error(`Error fetching collection with ID ${collectionId}:`, error);
    throw error;
  }
};

// Get products in a collection
export const getProductsInCollection = async (collectionId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // First, get all product_collection junction records for this collection
    const junctionResponse = await apperClient.fetchRecords('product_collection', {
      where: [{ fieldName: 'collection', operator: 'ExactMatch', values: [collectionId] }]
    });

    if (!junctionResponse.data || junctionResponse.data.length === 0) {
      return [];
    }

    // Extract product IDs from junction records
    const productIds = junctionResponse.data.map(junction => junction.product);
    
    // If no products in collection, return empty array
    if (productIds.length === 0) {
      return [];
    }
    
    // Fetch all products by IDs
    const productsResponse = await Promise.all(
      productIds.map(productId => 
        apperClient.getRecordById('product1', productId)
      )
    );
    
    // Extract data from responses and filter out any null results
    return productsResponse
      .filter(response => response && response.data)
      .map(response => response.data);
  } catch (error) {
    console.error(`Error fetching products in collection with ID ${collectionId}:`, error);
    throw error;
  }
};

export default { fetchCollections, getCollectionById, getProductsInCollection };