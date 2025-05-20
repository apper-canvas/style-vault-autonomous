/**
 * User service for handling user-related operations
 */

// Get user profile by ID
export const getUserProfile = async (userId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.getRecordById('User1', userId);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Create user profile
export const createUserProfile = async (userData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Only include updateable fields
    const userRecord = {
      Name: userData.Name,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      darkModePreference: userData.darkModePreference || false,
    };

    const params = {
      records: [userRecord]
    };

    const response = await apperClient.createRecord('User1', params);
    return response.results[0].data;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId, userData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Only include updateable fields
    const userRecord = {
      Id: userId,
      Name: userData.Name,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      darkModePreference: userData.darkModePreference,
    };

    const params = {
      records: [userRecord]
    };

    const response = await apperClient.updateRecord('User1', params);
    return response.results[0].data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export default { getUserProfile, createUserProfile, updateUserProfile };