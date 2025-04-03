import { NewsSection } from "../components/news";
import { PageHeader } from "../components/layout";
import { getAllPosts } from "../lib/api";
import { mapSanityPostsToNewsArticles } from "../lib/utils";

export default async function Home() {
  // Fetch posts from Sanity
  const posts = await getAllPosts(0, 6); // Get first 6 posts for the homepage
  const newsArticles = mapSanityPostsToNewsArticles(posts);
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-[family-name:var(--font-geist-sans)] pattern-overlay">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Welcome to Kingston Anash"
          subtitle="Your community resource for news, minyanim, and events"
        />

        {/* News Articles Section */}
        <NewsSection articles={newsArticles} />
      </div>
    </div>
  );
}
