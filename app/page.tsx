import { NewsSection } from "../components/news";
import { PageHeader } from "../components/layout";
import { newsArticles } from "../data/newsArticles";

export default function Home() {
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
