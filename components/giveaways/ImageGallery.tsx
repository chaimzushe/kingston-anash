"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import FallbackImage from './FallbackImage';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, alt }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  // Use only up to 3 images
  const displayImages = images.slice(0, 3);
  const currentImage = displayImages[currentImageIndex];

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % displayImages.length);
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <div className="relative">
      {/* Main Image */}
      <div
        className="relative h-48 w-full cursor-pointer"
        onClick={() => openModal(currentImageIndex)}
      >
        {!imageError[currentImageIndex] ? (
          <Image
            src={currentImage}
            alt={alt}
            fill
            className="object-cover"
            onError={() => setImageError(prev => ({ ...prev, [currentImageIndex]: true }))}
          />
        ) : (
          <FallbackImage title={alt} />
        )}
      </div>

      {/* Thumbnail Navigation (if more than 1 image) */}
      {displayImages.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
          {displayImages.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              } cursor-pointer`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(index);
              }}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {displayImages.length > 1 && (
        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
          {currentImageIndex + 1}/{displayImages.length}
        </div>
      )}

      {/* Modal for Full-Size View */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div className="relative w-full max-w-5xl max-h-[90vh] animate-fadeIn">
            {/* Main Image */}
            <div className="relative h-[70vh] w-full">
              {!imageError[currentImageIndex] ? (
                <Image
                  src={currentImage}
                  alt={alt}
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 100vw, 80vw"
                  onError={() => setImageError(prev => ({ ...prev, [currentImageIndex]: true }))}
                />
              ) : (
                <FallbackImage title={alt} />
              )}
            </div>

            {/* Navigation Buttons */}
            {displayImages.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-110"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevImage();
                  }}
                  aria-label="Previous image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-110"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNextImage();
                  }}
                  aria-label="Next image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Close Button */}
            <button
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 p-3 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Thumbnail Navigation */}
            {displayImages.length > 1 && (
              <div className="flex justify-center mt-4 gap-2">
                {displayImages.map((img, index) => (
                  <button
                    key={index}
                    className={`relative w-16 h-16 rounded-md overflow-hidden transition-all duration-300 ${index === currentImageIndex ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    aria-label={`View image ${index + 1}`}
                  >
                    {!imageError[index] ? (
                      <Image
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        onError={() => setImageError(prev => ({ ...prev, [index]: true }))}
                      />
                    ) : (
                      <FallbackImage />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Image Counter */}
            <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
              {currentImageIndex + 1}/{displayImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
