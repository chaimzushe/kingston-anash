import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { EVENTS_TAG, POSTS_TAG, CONTENT_PATHS } from '@/lib/revalidate-tags';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    const tag = searchParams.get('tag');
    const secret = searchParams.get('secret');

    // Check for secret to prevent unauthorized revalidations
    // In production, you should use a proper secret from environment variables
    const expectedSecret = process.env.REVALIDATION_SECRET || 'kingston-anash-secret';
    if (secret !== expectedSecret) {
      console.error('Invalid revalidation secret');
      return NextResponse.json(
        { message: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Revalidate by path if provided
    if (path) {
      console.log(`Revalidating path: ${path}`);
      revalidatePath(path);
      return NextResponse.json({
        revalidated: true,
        path,
        now: Date.now()
      });
    }

    // Revalidate by tag if provided
    if (tag) {
      console.log(`Revalidating tag: ${tag}`);

      // Revalidate the tag
      revalidateTag(tag);

      // Also revalidate associated paths
      if (tag === EVENTS_TAG || tag === POSTS_TAG) {
        const paths = CONTENT_PATHS[tag] || [];
        paths.forEach(contentPath => {
          console.log(`Also revalidating path: ${contentPath}`);
          revalidatePath(contentPath);
        });
      }

      return NextResponse.json({
        revalidated: true,
        tag,
        paths: (tag === EVENTS_TAG || tag === POSTS_TAG) ? CONTENT_PATHS[tag] : [],
        now: Date.now()
      });
    }

    // If neither path nor tag is provided
    return NextResponse.json(
      { message: 'Either path or tag parameter is required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error revalidating:', error);
    return NextResponse.json(
      {
        message: 'Error revalidating',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST endpoint for webhook-based revalidation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, secret } = body;

    // Check for secret to prevent unauthorized revalidations
    const expectedSecret = process.env.REVALIDATION_SECRET || 'kingston-anash-secret';
    if (secret !== expectedSecret) {
      console.error('Invalid revalidation secret in webhook');
      return NextResponse.json(
        { message: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Determine which tag to revalidate based on the content type
    let tag = null;
    if (type === 'communityEvent') {
      tag = EVENTS_TAG;
    } else if (type === 'post') {
      tag = POSTS_TAG;
    }

    if (!tag) {
      return NextResponse.json(
        { message: 'Unknown content type' },
        { status: 400 }
      );
    }

    // Revalidate the tag
    console.log(`Webhook revalidating tag: ${tag}`);
    revalidateTag(tag);

    // Also revalidate associated paths
    if (tag === EVENTS_TAG || tag === POSTS_TAG) {
      const paths = CONTENT_PATHS[tag] || [];
      paths.forEach(path => {
        console.log(`Also revalidating path: ${path}`);
        revalidatePath(path);
      });
    }

    return NextResponse.json({
      revalidated: true,
      tag,
      paths: (tag === EVENTS_TAG || tag === POSTS_TAG) ? CONTENT_PATHS[tag] : [],
      now: Date.now()
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      {
        message: 'Error processing webhook',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
