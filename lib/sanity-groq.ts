// Direct GROQ API client for Sanity

// Use a public dataset that doesn't require authentication
const SANITY_PROJECT_ID = '3do82whm'; // Public Movies dataset
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2023-05-03';
// No token needed for public datasets
const SANITY_API_TOKEN = null;

// Function to fetch data using the GROQ API directly
export async function fetchSanityData(query: string, params: Record<string, any> = {}) {
  try {
    // Build the URL for the GROQ API
    const url = new URL(`https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`);

    // Add the query and parameters
    url.searchParams.append('query', query);

    if (Object.keys(params).length > 0) {
      url.searchParams.append('$params', JSON.stringify(params));
    }

    // Don't add a cache-busting parameter as it's not supported by the API

    console.log('Fetching from GROQ API:', url.toString());

    // Make the request
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };

    // Add authorization header if token exists
    if (SANITY_API_TOKEN) {
      headers['Authorization'] = `Bearer ${SANITY_API_TOKEN}`;
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Sanity API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error fetching from Sanity GROQ API:', error);
    throw error;
  }
}

// Function to test the connection
export async function testGroqConnection() {
  try {
    // Use a query that works with the public movies dataset
    const result = await fetchSanityData('*[_type == "movie"][0...5]');
    return {
      success: true,
      result,
    };
  } catch (error) {
    console.error('Error testing GROQ API connection:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
