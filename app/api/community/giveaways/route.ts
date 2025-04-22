import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity';
import { groq } from 'next-sanity';

// GET all giveaways
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const category = url.searchParams.get('category');
    const isAvailable = url.searchParams.get('isAvailable');
    const isFree = url.searchParams.get('isFree');
    const search = url.searchParams.get('search');

    let query = groq`*[_type == "giveaway"`;
    const filters = [];

    if (userId) {
      filters.push(`userId == "${userId}"`);
    }

    if (category) {
      filters.push(`category == "${category}"`);
    }

    if (isAvailable) {
      filters.push(`isAvailable == ${isAvailable === 'true'}`);
    }

    if (isFree) {
      filters.push(`isFree == ${isFree === 'true'}`);
    }

    if (search) {
      filters.push(`(title match "*${search}*" || description match "*${search}*")`);
    }

    if (filters.length > 0) {
      query += ` && ${filters.join(' && ')}`;
    }

    query += `] | order(postedDate desc) {
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

    const giveaways = await sanityClient.fetch(query);

    return NextResponse.json(giveaways);
  } catch (error) {
    console.error('Error fetching giveaways:', error);
    return NextResponse.json({ error: 'Failed to fetch giveaways' }, { status: 500 });
  }
}
