
import { NewsArticle } from '../data/newsArticles';
import { urlFor } from './sanity';
import { format } from 'date-fns';

/**
 * Maps Sanity posts to the NewsArticle format expected by the NewsSection component
 */
export function mapSanityPostsToNewsArticles(posts: any[]): NewsArticle[] {
  return posts.map(post => {
    // Format the date
    const formattedDate = post.publishedAt
      ? format(new Date(post.publishedAt), 'MMMM dd, yyyy')
      : '';

    // Get the first category if available
    const category = post.categories && post.categories.length > 0
      ? post.categories[0].title
      : 'Uncategorized';

    return {
      id: post._id,
      title: post.title,
      summary: post.summary,
      content: '', // Content is not needed for the card view
      date: formattedDate,
      author: post.author ? post.author.name : 'Unknown Author',
      authorImageUrl: post.author && post.author.image ? urlFor(post.author.image).url() : undefined,
      imageUrl: post.mainImage ? urlFor(post.mainImage).width(800).height(500).url() : '',
      sourceUrl: post.slug && post.slug.current ? `/blog/${post.slug.current}` : '#',
      source: 'Blog',
      category: category,
      readTime: post.readTime || `${post.estimatedReadingTime || 3} min read`,
    };
  });
}
