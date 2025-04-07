"use client";

import React from 'react';
import Image, { ImageProps } from 'next/image';
import { versionedImage } from '@/lib/cacheUtils';

// Extend the Next.js Image props
interface CacheBustedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  cacheBust?: boolean;
}

/**
 * A wrapper around Next.js Image component that adds cache busting
 */
const CacheBustedImage: React.FC<CacheBustedImageProps> = ({
  src,
  cacheBust = true,
  ...props
}) => {
  // Only apply cache busting to local images, not external ones
  const isLocalImage = typeof src === 'string' && 
    !src.startsWith('http') && 
    !src.startsWith('data:');
  
  // Apply cache busting if enabled and it's a local image
  const finalSrc = (cacheBust && isLocalImage) ? versionedImage(src) : src;
  
  return <Image src={finalSrc} {...props} />;
};

export default CacheBustedImage;
