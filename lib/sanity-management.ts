import { createClient } from '@sanity/client';

// Create a client specifically for the Management API
export const sanityManagementClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'yvp1jx5r',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  // Explicitly set the permission level to 'write'
  perspective: 'published',
  // No CORS or authentication settings needed
});

// Function to update a document
export async function updateDocument(id: string, data: any) {
  try {
    console.log(`Updating document ${id} with Management API`);
    const result = await sanityManagementClient
      .patch(id)
      .set(data)
      .commit();

    console.log(`Successfully updated document ${id} with Management API:`, result);
    return { success: true, result };
  } catch (error) {
    console.error(`Error updating document ${id} with Management API:`, error);
    return { success: false, error };
  }
}

// Function to create a document
export async function createDocument(type: string, data: any) {
  try {
    console.log(`Creating document of type ${type} with Management API`);
    const result = await sanityManagementClient.create({
      _type: type,
      ...data
    });

    console.log(`Successfully created document of type ${type} with Management API:`, result);
    return { success: true, result };
  } catch (error) {
    console.error(`Error creating document of type ${type} with Management API:`, error);
    return { success: false, error };
  }
}

// Function to delete a document
export async function deleteDocument(id: string) {
  try {
    console.log(`Deleting document ${id} with Management API`);
    const result = await sanityManagementClient.delete(id);

    console.log(`Successfully deleted document ${id} with Management API:`, result);
    return { success: true, result };
  } catch (error) {
    console.error(`Error deleting document ${id} with Management API:`, error);
    return { success: false, error };
  }
}
