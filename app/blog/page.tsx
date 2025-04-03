'use client';

import React, { useState, useEffect } from 'react';
import { getAllPosts, getAllCategories, countPosts, Post } from '../../lib/api';
import BlogList from '../../components/blog/BlogList';
import CategoryFilters from '../../components/news/CategoryFilters';
import { useInView } from 'react-intersection-observer';

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const postsPerPage = 10;

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  // Initial load of posts and categories
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [initialPosts, categoriesData, totalPosts] = await Promise.all([
          getAllPosts(0, postsPerPage),
          getAllCategories(),
          countPosts(),
        ]);

        setPosts(initialPosts);
        setCategories(['All', ...categoriesData.map(cat => cat.title)]);
        setHasMore(initialPosts.length < totalPosts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Load more posts when scrolling to the bottom
  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMorePosts();
    }
  }, [inView, hasMore, loading]);

  const loadMorePosts = async () => {
    try {
      setLoading(true);
      const nextPage = page + 1;
      const start = nextPage * postsPerPage;
      const end = start + postsPerPage;
      
      const morePosts = await getAllPosts(start, end);
      
      if (morePosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prevPosts => [...prevPosts, ...morePosts]);
        setPage(nextPage);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading more posts:', error);
      setLoading(false);
    }
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setPosts([]);
    setPage(0);
    setHasMore(true);
    
    // Reset and fetch posts for the selected category
    const fetchPostsByCategory = async () => {
      try {
        setLoading(true);
        const newPosts = await getAllPosts(0, postsPerPage);
        setPosts(newPosts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts by category:', error);
        setLoading(false);
      }
    };
    
    fetchPostsByCategory();
  };

  // Filter posts by category if needed
  const filteredPosts = activeCategory === 'All' 
    ? posts 
    : posts.filter(post => 
        post.categories && 
        post.categories.some(cat => cat.title === activeCategory)
      );

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 pattern-overlay">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Blog</h1>
        
        <div className="mb-8">
          <CategoryFilters
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
        
        <BlogList posts={filteredPosts} />
        
        {/* Loading indicator and intersection observer target */}
        {hasMore && (
          <div ref={ref} className="flex justify-center my-8">
            {loading && (
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            )}
          </div>
        )}
        
        {!hasMore && posts.length > 0 && (
          <p className="text-center text-gray-500 my-8">No more posts to load</p>
        )}
        
        {posts.length === 0 && !loading && (
          <p className="text-center text-gray-500 my-8">No posts found</p>
        )}
      </div>
    </div>
  );
}
