import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity';

// This would be triggered by a webhook from Sanity when a post is published
export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret (in a real app)
    // const secret = request.headers.get('x-webhook-secret');
    // if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    // }

    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { message: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Fetch the post with its categories
    const post = await sanityClient.fetch(
      `*[_type == "post" && _id == $postId][0]{
        _id,
        title,
        slug,
        "categories": categories[]->._id
      }`,
      { postId }
    );

    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    // Find subscribers who are interested in the post's categories
    const subscribers = await sanityClient.fetch(
      `*[_type == "subscription" && status == "active" && references(*[_type=="category" && _id in $categories]._id)]{
        _id,
        email,
        confirmationToken
      }`,
      { categories: post.categories }
    );

    // In a real application, you would send emails to subscribers here
    // For now, we'll just log the subscribers
    console.log(`Notifying ${subscribers.length} subscribers about post: ${post.title}`);
    
    subscribers.forEach((subscriber: any) => {
      console.log(`Would send email to: ${subscriber.email}`);
      // In a real app, you would use a service like SendGrid, Mailgun, etc.
      // sendEmail({
      //   to: subscriber.email,
      //   subject: `New Post: ${post.title}`,
      //   html: `
      //     <h1>New Post in Your Subscribed Categories</h1>
      //     <p>A new post titled "${post.title}" has been published.</p>
      //     <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug.current}">Read the post</a></p>
      //     <p>
      //       <a href="${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe/${subscriber.confirmationToken}">
      //         Unsubscribe from notifications
      //       </a>
      //     </p>
      //   `
      // });
    });

    return NextResponse.json({
      message: 'Notification process completed',
      notifiedCount: subscribers.length,
    });
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json(
      { message: 'Failed to process notification' },
      { status: 500 }
    );
  }
}
