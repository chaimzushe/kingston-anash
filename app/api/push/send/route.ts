import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity';
import { sendPushNotification } from '@/lib/push-notifications';

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
      `*[_type == "post" && _id == $postIdParam][0]{
        _id,
        title,
        slug,
        "categories": categories[]->._id
      }`,
      { postIdParam: postId }
    );

    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    // Find push subscribers who are interested in the post's categories
    const subscribers = await sanityClient.fetch(
      `*[_type == "pushSubscription" && status == "active" && references(*[_type=="category" && _id in $categoriesParam]._id)]{
        endpoint,
        keys
      }`,
      { categoriesParam: post.categories }
    );

    console.log(`Found ${subscribers.length} push subscribers for post: ${post.title}`);

    // Send push notifications
    const notificationPayload = {
      title: `New Post: ${post.title}`,
      body: 'A new post has been published in a category you follow',
      url: `/blog/${post.slug.current}`
    };

    const notificationPromises = subscribers.map((subscriber: any) => {
      const pushSubscription = {
        endpoint: subscriber.endpoint,
        keys: {
          p256dh: subscriber.keys.p256dh,
          auth: subscriber.keys.auth
        }
      };

      return sendPushNotification(pushSubscription as any, notificationPayload);
    });

    await Promise.all(notificationPromises);

    return NextResponse.json({
      message: 'Push notifications sent successfully',
      notifiedCount: subscribers.length,
    });
  } catch (error) {
    console.error('Push notification error:', error);
    return NextResponse.json(
      { message: 'Failed to send push notifications' },
      { status: 500 }
    );
  }
}
