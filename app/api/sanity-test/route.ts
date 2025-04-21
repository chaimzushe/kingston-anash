import { NextRequest, NextResponse } from 'next/server';
import { sanityClient, config } from '@/lib/sanity';
import { directSanityClient, testSanityConnection } from '@/lib/sanity-direct';
import { fetchSanityData, testGroqConnection } from '@/lib/sanity-groq';

export async function GET(request: NextRequest) {
  try {
    // Log the Sanity configuration
    console.log('Sanity config:', {
      ...config,
      token: config.token ? 'Token exists (hidden)' : 'No token',
    });

    // Test both clients
    let nextSanityResult = null;
    let nextSanityError = null;

    try {
      // Try with next-sanity client
      // Use a query that works with the public movies dataset
      nextSanityResult = await sanityClient.fetch(`*[_type == "movie"][0...5]`);
      console.log('next-sanity client success');
    } catch (err) {
      nextSanityError = err instanceof Error ? err.message : String(err);
      console.error('next-sanity client error:', nextSanityError);
    }

    // Try with direct @sanity/client
    const directResult = await testSanityConnection();
    console.log('Direct Sanity client result:', directResult.success ? 'success' : 'failed');

    // Try a direct query with the @sanity/client
    let directQueryResult = null;
    let directQueryError = null;

    try {
      directQueryResult = await directSanityClient.fetch(`*[_type == "movie"][0...5]`);
      console.log('Direct query success');
    } catch (err) {
      directQueryError = err instanceof Error ? err.message : String(err);
      console.error('Direct query error:', directQueryError);
    }

    // Try with GROQ API client
    let groqResult = null;
    let groqError = null;

    try {
      const groqTestResult = await testGroqConnection();
      console.log('GROQ API client result:', groqTestResult.success ? 'success' : 'failed');
      groqResult = groqTestResult;
    } catch (err) {
      groqError = err instanceof Error ? err.message : String(err);
      console.error('GROQ API client error:', groqError);
    }

    // Try a direct GROQ API query
    let groqQueryResult = null;
    let groqQueryError = null;

    try {
      groqQueryResult = await fetchSanityData(`*[_type == "movie"][0...5]`);
      console.log('Direct GROQ API query success');
    } catch (err) {
      groqQueryError = err instanceof Error ? err.message : String(err);
      console.error('Direct GROQ API query error:', groqQueryError);
    }

    return NextResponse.json({
      success: directResult.success || !!nextSanityResult || !!groqResult?.success || !!groqQueryResult,
      message: groqQueryResult ? 'Successfully connected to Sanity with GROQ API' :
               groqResult?.success ? 'Successfully connected to Sanity with GROQ API client' :
               directResult.success ? 'Successfully connected to Sanity with direct client' :
               nextSanityResult ? 'Successfully connected to Sanity with next-sanity client' :
               'Failed to connect to Sanity with all clients',
      config: {
        ...config,
        token: config.token ? 'Token exists (hidden)' : 'No token',
      },
      nextSanityResult: nextSanityResult || null,
      nextSanityError,
      directResult,
      directQueryResult: directQueryResult || null,
      directQueryError,
      groqResult,
      groqError,
      groqQueryResult: groqQueryResult || null,
      groqQueryError,
      sanityApiToken: process.env.SANITY_API_TOKEN ? 'Token exists (hidden)' : 'No token in process.env',
    });
  } catch (error) {
    console.error('Error testing Sanity connection:', error);

    return NextResponse.json({
      success: false,
      message: 'Failed to connect to Sanity',
      error: error instanceof Error ? error.message : String(error),
      config: {
        ...config,
        token: config.token ? 'Token exists (hidden)' : 'No token',
      },
      sanityApiToken: process.env.SANITY_API_TOKEN ? 'Token exists (hidden)' : 'No token in process.env',
    }, { status: 500 });
  }
}
