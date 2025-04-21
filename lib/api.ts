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
    // Add a timestamp to the query to bypass caching
    const timestamp = Date.now();
    console.log(`Adding timestamp ${timestamp} to query to bypass caching`);
    console.log('Fetching posts from Sanity');

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
        }`,
        { _timestamp: timestamp }, // Add timestamp to params
        {
          // Add cache tags for revalidation and force no caching
          next: {
            tags: ['posts'],
            revalidate: 0 // Force revalidation on every request
          }
        }
      );

      // If we got posts, return them
      if (posts && posts.length > 0) {
        console.log(`Found ${posts.length} posts from Sanity`);
        return posts;
      }

      // If no posts were found, throw an error to trigger the fallback
      throw new Error('No posts found in Sanity');
    } catch (sanityError) {
      console.error('Error fetching posts from Sanity:', sanityError);

      // Generate mock posts as a fallback
      console.log('Generating mock posts as fallback');
      return generateMockPosts(end - start);
    }
  } catch (error) {
    console.error('Error in getAllPosts:', error);
    return [];
  }
}

// Transform movies from the public dataset into posts
function transformMoviesToPosts(movies: any[]): Post[] {
  return movies.map((movie, index) => {
    // Create a slug from the movie title
    const slug = movie.title
      ? movie.title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')
      : `movie-${index}`;

    // Get categories or use default
    const categories = movie.categories && movie.categories.length > 0
      ? movie.categories.map((category: string) => ({ title: category }))
      : [{ title: 'Movies' }];

    // Create a post from the movie data
    return {
      _id: movie._id,
      title: movie.title || `Movie ${index + 1}`,
      slug: {
        current: slug
      },
      summary: movie.overview || 'No overview available',
      author: {
        name: movie.director || 'Unknown Director',
        image: null
      },
      mainImage: movie.poster,
      categories: categories,
      publishedAt: movie.releaseDate || new Date().toISOString(),
      body: null,
      readTime: '3 min read'
    };
  });
}

// Generate mock posts for testing
function generateMockPosts(count: number = 6): Post[] {
  const mockPosts: Post[] = [];

  for (let i = 0; i < count; i++) {
    mockPosts.push({
      _id: `mock-post-${i}`,
      title: `Mock Post ${i + 1}`,
      slug: {
        current: `mock-post-${i + 1}`
      },
      summary: `This is a mock post ${i + 1} created because the Sanity API is unavailable or returned no posts.`,
      author: {
        name: 'Mock Author',
        image: null
      },
      mainImage: null,
      categories: [
        { title: 'General' },
        { title: 'News' }
      ],
      publishedAt: new Date().toISOString(),
      body: null,
      readTime: '3 min read'
    });
  }

  return mockPosts;
}

// Fetch a single post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    // Check if this is a mock post slug
    if (slug.startsWith('mock-post-')) {
      const postNumber = parseInt(slug.replace('mock-post-', ''));
      if (!isNaN(postNumber)) {
        // Return a mock post
        return {
          _id: `mock-post-${postNumber - 1}`,
          title: `Mock Post ${postNumber}`,
          slug: {
            current: slug
          },
          summary: `This is a mock post ${postNumber} created because the Sanity API is unavailable or returned no posts.`,
          author: {
            name: 'Mock Author',
            image: null
          },
          mainImage: null,
          categories: [
            { title: 'General' },
            { title: 'News' }
          ],
          publishedAt: new Date().toISOString(),
          body: [
            {
              _type: 'block',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: `This is a mock post ${postNumber} created because the Sanity API is unavailable or returned no posts. This content is generated for testing purposes.`
                }
              ]
            }
          ],
          readTime: '3 min read'
        };
      }
    }

    // Try to fetch the post from Sanity
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

      if (post) {
        return post;
      }

      throw new Error(`Post with slug ${slug} not found`);
    } catch (sanityError) {
      console.error(`Error fetching post with slug ${slug} from Sanity:`, sanityError);

      // Generate a mock post as fallback
      console.log(`Generating mock post for slug ${slug} as fallback`);
      return {
        _id: `mock-${slug}`,
        title: `Post Not Found: ${slug}`,
        slug: {
          current: slug
        },
        summary: 'This post could not be found or the Sanity API is unavailable.',
        author: {
          name: 'System',
          image: null
        },
        mainImage: null,
        categories: [
          { title: 'General' }
        ],
        publishedAt: new Date().toISOString(),
        body: [
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: 'This post could not be found or the Sanity API is unavailable. Please try again later.'
              }
            ]
          }
        ],
        readTime: '1 min read'
      };
    }
  } catch (error) {
    console.error(`Error in getPostBySlug for slug ${slug}:`, error);
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
