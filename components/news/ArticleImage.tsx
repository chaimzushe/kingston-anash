"use client";

import React from 'react';
import Image from 'next/image';

interface ArticleImageProps {
  imageUrl: string;
  title: string;
}

const ArticleImage: React.FC<ArticleImageProps> = ({ imageUrl, title }) => {
  return (
    <div className="relative h-48 w-full">
      <Image
        src={imageUrl}
        alt={title}
        fill
        style={{ objectFit: 'cover' }}
        className="transition-transform duration-500 hover:scale-110"
      />
    </div>
  );
};

export default ArticleImage;
