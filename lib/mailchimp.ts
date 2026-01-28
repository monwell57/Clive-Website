// lib/mailchimp.ts
import mailchimp from '@mailchimp/mailchimp_marketing';

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY!,
  server: process.env.MAILCHIMP_SERVER_PREFIX! // e.g., 'us21'
});

export async function subscribeToNewsletter(
  email: string, 
  journey: string
) {
  try {
    const response = await mailchimp.lists.addListMember(
      process.env.MAILCHIMP_LIST_ID!, // This is your Audience ID
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          JOURNEY: journey // You'll need to add this custom field in Mailchimp
        },
        tags: ['website-signup']
      }
    );
    
    return { success: true, data: response };
  } catch (error: any) {
    // Handle duplicate email gracefully
    if (error.status === 400 && error.response.body.title === 'Member Exists') {
      return { success: true, message: 'Already subscribed!' };
    }
    
    return { 
      success: false, 
      error: error.response?.body || error.message 
    };
  }
}