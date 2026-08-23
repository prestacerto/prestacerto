'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PropertyImagesProps {
  propertyId: string;
}

// Mock images
const mockImages = [
  'https://images.unsplash.com/photo-1570129477492-45ac003d2e0b?w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1552072092-74b88589dc25?w=1200&h=600&fit=crop',
];

export default function PropertyImages({ propertyId }: PropertyImagesProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = mockImages; // Replace with actual API call

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div>
      {/* Main image */}
      <div className="relative bg-gray-200 rounded-lg overflow-hidden mb-4">
        <div className="relative w-full h-96">
          <Image
            src={images[currentImageIndex]}
            alt={`Property image ${currentImageIndex + 1}`}
            fill
            className="object-cover"
          />
        </div>

        {/* Navigation buttons */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition"
        >
          <ChevronRight size={24} />
        </button>

        {/* Image counter */}
        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail gallery */}
      <div className="grid grid-cols-5 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`relative h-24 rounded-lg overflow-hidden transition-all ${
              currentImageIndex === index ? 'ring-2 ring-blue-600' : 'hover:opacity-80'
            }`}
          >
            <Image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
