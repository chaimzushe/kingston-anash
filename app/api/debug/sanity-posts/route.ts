import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity';

export async function GET(_request: NextRequest) {
  try {
    // Get the Sanity configuration
    const config = {
      projectId: sanityClient.config().projectId,
      dataset: sanityClient.config().dataset,
      apiVersion: sanityClient.config().apiVersion,
    };

    console.log('Sanity config in API:', config);

    // Try to fetch posts
    const query = `*[_type == "post"][0...5] {
      _id,
      title,
      slug,
      publishedAt
    }`;

    try {
      const posts = await sanityClient.fetch(query);

      return NextResponse.json({
        success: true,
        config,
        posts,
        count: posts.length,
        message: `Successfully connected to Sanity project '${config.projectId}' and found ${posts.length} posts`
      });
    } catch (error) {
      console.error('Error fetching from Sanity:', error);

      return NextResponse.json({
        success: false,
        config,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: `Failed to fetch posts from Sanity project '${config.projectId}'`
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in Sanity posts API:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'An error occurred while checking Sanity posts'
    }, { status: 500 });
  }
}
