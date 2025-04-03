import { sanityClient } from './sanity';

// Type definitions for our blog posts
export interface Post {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  summary: string;
  readTime?: string;
  author: {
    name: string;
    image: any;
  };
  mainImage: any;
  categories: Array<{
    title: string;
  }>;
  publishedAt: string;
  body: any;
}

// Fetch all posts with pagination
export async function getAllPosts(start = 0, end = 10): Promise<Post[]> {
  try {
    const posts = await sanityClient.fetch(
      `*[_type == "post"] | order(publishedAt desc) [${start}...${end}] {
        _id,
        title,
        slug,
        summary,
        readTime,
        publishedAt,
        mainImage,
        categories[]->{title},
        author->{name, image},
        "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180)
      }`
    );
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

// Fetch a single post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const post = await sanityClient.fetch(
      `*[_type == "post" && slug.current == $slug][0]{
        _id,
        title,
        slug,
        summary,
        readTime,
        publishedAt,
        mainImage,
        body,
        categories[]->{title},
        author->{name, image, bio},
        "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180)
      }`,
      { slug }
    );
    return post;
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return null;
  }
}

// Fetch all post slugs (for static generation)
export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
  try {
    const slugs = await sanityClient.fetch(
      `*[_type == "post"] {
        "slug": slug.current
      }`
    );
    return slugs;
  } catch (error) {
    console.error('Error fetching post slugs:', error);
    return [];
  }
}

// Count total posts
export async function countPosts(): Promise<number> {
  try {
    const count = await sanityClient.fetch(
      `count(*[_type == "post"])`
    );
    return count;
  } catch (error) {
    console.error('Error counting posts:', error);
    return 0;
  }
}

// Fetch posts by category
export async function getPostsByCategory(category: string, start = 0, end = 10): Promise<Post[]> {
  try {
    const posts = await sanityClient.fetch(
      `*[_type == "post" && $category in categories[]->title] | order(publishedAt desc) [${start}...${end}] {
        _id,
        title,
        slug,
        summary,
        readTime,
        publishedAt,
        mainImage,
        categories[]->{title},
        author->{name, image},
        "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180)
      }`,
      { category }
    );
    return posts;
  } catch (error) {
    console.error(`Error fetching posts for category ${category}:`, error);
    return [];
  }
}

// Get all categories
export async function getAllCategories(): Promise<{ title: string }[]> {
  try {
    const categories = await sanityClient.fetch(
      `*[_type == "category"] {
        title
      }`
    );
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
