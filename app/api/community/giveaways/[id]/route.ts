import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity';
import { groq } from 'next-sanity';

export async function GET(request: NextRequest) {
  // Extract the id from the URL
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();
  try {

    if (!id) {
      return NextResponse.json({ error: 'Missing giveaway ID' }, { status: 400 });
    }

    const query = groq`*[_type == "giveaway" && _id == $id][0] {
      _id,
      title,
      description,
      condition,
      category,
      location,
      contactName,
      contactEmail,
      contactPhone,
      "images": images[] {
        "url": asset->url
      },
      postedDate,
      isAvailable,
      price,
      isFree,
      tags,
      userId,
      userEmail
    }`;

    const giveaway = await sanityClient.fetch(query, { id });

    if (!giveaway) {
      return NextResponse.json({ error: 'Giveaway not found' }, { status: 404 });
    }

    return NextResponse.json(giveaway);
  } catch (error) {
    console.error('Error fetching giveaway:', error);
    return NextResponse.json({ error: 'Failed to fetch giveaway' }, { status: 500 });
  }
}
