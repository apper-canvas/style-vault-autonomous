/**
 * Product service for handling product-related operations
 */

// Fetch all products with optional filtering
export const fetchProducts = async (filters = {}) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Construct where conditions based on filters
    const whereConditions = [];
    
    if (filters.category) {
      whereConditions.push({
        fieldName: 'category',
        operator: 'ExactMatch',
        values: [filters.category]
      });
    }
    
    if (filters.featured) {
      whereConditions.push({
        fieldName: 'featured',
        operator: 'ExactMatch',
        values: [true]
      });
    }
    
    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      whereConditions.push({
        fieldName: 'price',
        operator: 'Between',
        values: [filters.minPrice.toString(), filters.maxPrice.toString()]
      });
    }

    if (filters.query) {
      whereConditions.push({
        fieldName: 'Name',
        operator: 'Contains',
        values: [filters.query]
      });
    }

    // Set up ordering
    const orderBy = [];
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-low':
          orderBy.push({ field: 'price', direction: 'Asc' });
          break;
        case 'price-high':
          orderBy.push({ field: 'price', direction: 'Desc' });
          break;
        case 'rating':
          orderBy.push({ field: 'averageRating', direction: 'Desc' });
          break;
        case 'latest':
          orderBy.push({ field: 'CreatedOn', direction: 'Desc' });
          break;
        default:
          break;
      }
    }

    // Set up pagination
    const pagingInfo = {
      limit: filters.limit || 20,
      offset: filters.offset || 0
    };

    const params = {
      where: whereConditions.length > 0 ? whereConditions : undefined,
      orderBy: orderBy.length > 0 ? orderBy : undefined,
      pagingInfo: pagingInfo
    };

    const response = await apperClient.fetchRecords('product1', params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Get a single product by ID
export const getProductById = async (productId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.getRecordById('product1', productId);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error);
    throw error;
  }
};

// Search products by query string
export const searchProducts = async (query, limit = 10) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      where: [{ fieldName: 'Name', operator: 'Contains', values: [query] }],
      pagingInfo: { limit }
    };

    const response = await apperClient.fetchRecords('product1', params);
    return response.data || [];
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

export default { fetchProducts, getProductById, searchProducts };