'use client';

import React from 'react';
import BlogCard from './BlogCard';



const BlogList: React.FC<any> = ({ posts }) => {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post: any) => (
        <BlogCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default BlogList;
