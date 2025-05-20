/**
 * Newsletter service for handling newsletter subscription operations
 */

// Subscribe to newsletter
export const subscribeToNewsletter = async (email) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Check if email already exists
    const existingResponse = await apperClient.fetchRecords('newsletter_subscription', {
      where: [{ fieldName: 'email', operator: 'ExactMatch', values: [email] }]
    });

    if (existingResponse.data && existingResponse.data.length > 0) {
      // If email is already subscribed but inactive, update it to active
      const existingSubscription = existingResponse.data[0];
      if (!existingSubscription.active) {
        const updateParams = {
          records: [{
            Id: existingSubscription.Id,
            active: true,
            subscriptionDate: new Date().toISOString()
          }]
        };
        
        const updateResponse = await apperClient.updateRecord('newsletter_subscription', updateParams);
        return updateResponse.results[0].data;
      }
      
      // Email already exists and is active
      return existingSubscription;
    }

    // Create new subscription
    const subscriptionData = {
      Name: `Newsletter Subscription for ${email}`,
      email: email,
      subscriptionDate: new Date().toISOString(),
      active: true
    };

    const params = {
      records: [subscriptionData]
    };

    const response = await apperClient.createRecord('newsletter_subscription', params);
    return response.results[0].data;
  } catch (error) {
    console.error(`Error subscribing email ${email} to newsletter:`, error);
    throw error;
  }
};

// Unsubscribe from newsletter
export const unsubscribeFromNewsletter = async (email) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Find subscription by email
    const response = await apperClient.fetchRecords('newsletter_subscription', {
      where: [{ fieldName: 'email', operator: 'ExactMatch', values: [email] }]
    });

    if (!response.data || response.data.length === 0) {
      // Email not subscribed
      return false;
    }

    // Update subscription to inactive
    const subscription = response.data[0];
    const updateParams = {
      records: [{
        Id: subscription.Id,
        active: false
      }]
    };
    
    await apperClient.updateRecord('newsletter_subscription', updateParams);
    return true;
  } catch (error) {
    console.error(`Error unsubscribing email ${email} from newsletter:`, error);
    throw error;
  }
};

export default { subscribeToNewsletter, unsubscribeFromNewsletter };