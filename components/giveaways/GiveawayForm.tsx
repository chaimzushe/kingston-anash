"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { Giveaway } from '@/types/giveaways';

interface GiveawayFormProps {
  initialData?: Partial<Giveaway>;
  isEditing?: boolean;
  onSuccess?: () => void;
}

const GiveawayForm: React.FC<GiveawayFormProps> = ({
  initialData = {},
  isEditing = false,
  onSuccess
}) => {
  const { user } = useUser();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [title, setTitle] = useState(initialData.title || '');
  const [location, setLocation] = useState(initialData.location || '');
  const [contactPhone, setContactPhone] = useState(initialData.contactPhone || '');
  const [price, setPrice] = useState(initialData.price || 0);
  const [isFree, setIsFree] = useState(initialData.isFree !== false);
  const [description, setDescription] = useState(initialData.description || '');

  // Image handling
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(
    initialData.images?.map(img => typeof img === 'string' ? img : img.url) || []
  );
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Categories removed as requested

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      // Limit to 3 images total
      if (imageFiles.length + files.length > 3) {
        setError('Maximum 3 images allowed');
        return;
      }

      setImageFiles(prev => [...prev, ...files]);

      // Create preview URLs
      const newImageUrls = files.map(file => URL.createObjectURL(file));
      setImageUrls(prev => [...prev, ...newImageUrls]);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));

    // Revoke object URL to avoid memory leaks
    if (imageUrls[index] && imageUrls[index].startsWith('blob:')) {
      URL.revokeObjectURL(imageUrls[index]);
    }

    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Tag-related functions removed as requested

  // Upload images to Sanity
  const uploadImagesToSanity = async (): Promise<any[]> => {
    if (imageFiles.length === 0) return [];

    const imageAssets = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];

      // Create a FormData object
      const formData = new FormData();
      formData.append('file', file);

      try {
        // This is a placeholder - you'll need to implement the actual image upload endpoint
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const data = await response.json();
        imageAssets.push({
          assetId: data.assetId
        });

        // Update progress
        setUploadProgress(((i + 1) / imageFiles.length) * 100);
      } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
      }
    }

    return imageAssets;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in to post an item');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      setSuccess('');

      // Validate form
      if (!title || !location) {
        setError('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      // Upload images first
      let imageAssets: any[] = [];
      if (imageFiles.length > 0) {
        try {
          imageAssets = await uploadImagesToSanity();
        } catch (error) {
          setError('Failed to upload images. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }

      // Prepare the data
      const giveawayData = {
        id: initialData.id,
        title,
        description,
        location,
        contactName: user?.fullName || '',
        contactEmail: user?.primaryEmailAddress?.emailAddress || '',
        contactPhone,
        price: isFree ? 0 : price,
        isFree,
        images: imageAssets,
        userEmail: user?.primaryEmailAddress?.emailAddress || '',
      };

      // Submit to API
      const endpoint = isEditing
        ? '/api/community/giveaways/update'
        : '/api/community/giveaways/create';

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(giveawayData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save giveaway');
      }

      const result = await response.json();

      setSuccess(isEditing ? 'Item updated successfully!' : 'Item posted successfully!');

      // Reset form if not editing
      if (!isEditing) {
        setTitle('');
        setDescription('');
        setLocation('');
        setContactPhone('');
        setPrice(0);
        setIsFree(true);
        setImageFiles([]);
        setImageUrls([]);
      }

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Redirect to the giveaway page after a short delay
      setTimeout(() => {
        router.push(`/community/giveaways/${result.id}`);
      }, 1500);

    } catch (error: any) {
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        {isEditing ? 'Edit Item' : 'Post New Item'}
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            placeholder="What are you giving away?"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            placeholder="Describe your item in detail"
          />
        </div>

        {/* Category removed as requested */}

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location *
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            placeholder="Where is the item located?"
            required
          />
        </div>

        {/* Price */}
        <div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="isFree"
              checked={isFree}
              onChange={(e) => setIsFree(e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="isFree" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              This item is free
            </label>
          </div>

          {!isFree && (
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                placeholder="Enter price"
              />
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Contact Information
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-md p-3 bg-white dark:bg-gray-800">
              <div className="flex-shrink-0 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">Your Name</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.fullName || 'Not available'}</p>
              </div>
            </div>

            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-md p-3 bg-white dark:bg-gray-800">
              <div className="flex-shrink-0 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">Your Email</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.primaryEmailAddress?.emailAddress || 'Not available'}</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <input
                type="tel"
                id="contactPhone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full pl-10 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                placeholder="Your phone number"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Your name and email will be automatically included with your listing.
            </p>
          </div>
        </div>

        {/* Tags removed as requested */}

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Images (Max 3)
          </label>

          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600 dark:text-gray-400">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                >
                  <span className="px-2">Upload images</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    ref={fileInputRef}
                    disabled={imageUrls.length >= 3}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>

          {/* Image Previews */}
          {imageUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative">
                  <div className="relative h-24 w-full overflow-hidden rounded-md">
                    <Image
                      src={url}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Progress */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Uploading: {uploadProgress.toFixed(0)}%
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-gradient-primary text-white rounded-md font-medium shadow-sm hover:opacity-90 hover:shadow-md transition-all duration-200 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isEditing ? 'Updating...' : 'Posting...'}
              </span>
            ) : (
              <span>{isEditing ? 'Update Item' : 'Post Item'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GiveawayForm;
