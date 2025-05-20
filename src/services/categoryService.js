/**
 * Category service for handling category-related operations
 */

// Fetch all categories
export const fetchCategories = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.fetchRecords('category', {});
    return response.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Get category by ID
export const getCategoryById = async (categoryId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.getRecordById('category', categoryId);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category with ID ${categoryId}:`, error);
    throw error;
  }
};

// Fetch categories with their subcategories
export const fetchCategoriesWithSubcategories = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Fetch main categories first
    const categories = await apperClient.fetchRecords('category', {});
    
    // For each category, fetch its subcategories
    const categoriesWithSubs = await Promise.all(categories.data.map(async (category) => {
      const subcategories = await apperClient.fetchRecords('subcategory', {
        where: [{ fieldName: 'category', operator: 'ExactMatch', values: [category.Id] }]
      });
      return { ...category, subcategories: subcategories.data || [] };
    }));
    
    return categoriesWithSubs;
  } catch (error) {
    console.error('Error fetching categories with subcategories:', error);
    throw error;
  }
};

export default { fetchCategories, getCategoryById, fetchCategoriesWithSubcategories };