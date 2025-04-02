import NewsArticle from "../components/NewsArticle";
import { newsArticles } from "../data/newsArticles";

export default function Home() {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center my-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            Welcome to Kingston Anash
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Your community resource for news, minyanim, and events
          </p>
        </div>



        {/* News Articles Section */}
        <div id="news" className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Latest News</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">All</button>
              <button className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-sm font-medium">Community</button>
              <button className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-sm font-medium">Events</button>
              <button className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-sm font-medium">Education</button>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {newsArticles.map((article) => (
              <NewsArticle
                key={article.id}
                title={article.title}
                summary={article.summary}
                date={article.date}
                author={article.author}
                imageUrl={article.imageUrl}
                sourceUrl={article.sourceUrl}
                source={article.source}
              />
            ))}
          </div>

          <div className="mt-10 text-center">
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors">
              Load More Articles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
