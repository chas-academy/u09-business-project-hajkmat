import React, { useState, useEffect } from 'react';
import { ImageProps } from '../../types/formtypes';

const Image = ({
  src,
  alt,
  width,
  height,
  className = '',
  objectFit = 'cover',
  rounded = false,
  aspectRatio = 'auto',
  fallbackSrc = '/placeholder-image.jpg',
  lazy = true,
}: ImageProps) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(src);
  const [isLoading, setIsLoading] = useState<boolean>(!!src);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    setImageSrc(src);
    setIsLoading(!!src);
    setHasError(false);
  }, [src]);

  // Handle image loading error
  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    if (fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
  };

  // Handle successful image load
  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // Set object-fit style
  const objectFitClass = `object-${objectFit}`;

  // Set rounded corners
  let roundedClass = '';
  if (rounded === true) {
    roundedClass = 'rounded-lg';
  } else if (rounded === 'sm') {
    roundedClass = 'rounded-md';
  } else if (rounded === 'md') {
    roundedClass = 'rounded-lg';
  } else if (rounded === 'lg') {
    roundedClass = 'rounded-xl';
  } else if (rounded === 'xl') {
    roundedClass = 'rounded-2xl';
  } else if (rounded === 'full') {
    roundedClass = 'rounded-full';
  }

  // Set aspect ratio
  let aspectRatioClass = '';
  if (aspectRatio === '1/1') {
    aspectRatioClass = 'aspect-square';
  } else if (aspectRatio === '16/9') {
    aspectRatioClass = 'aspect-video';
  } else if (aspectRatio === '4/3') {
    aspectRatioClass = 'aspect-[4/3]';
  } else if (aspectRatio === '3/2') {
    aspectRatioClass = 'aspect-[3/2]';
  }

  // Set width and height styles
  const styles: React.CSSProperties = {};
  if (width) {
    styles.width = typeof width === 'number' ? `${width}px` : width;
  }
  if (height) {
    styles.height = typeof height === 'number' ? `${height}px` : height;
  }

  // Render placeholder when no image is available
  const renderPlaceholder = () => {
    if (!src && !fallbackSrc) {
      return (
        <div
          className="flex items-center justify-center bg-gray-200 text-gray-500 h-full w-full"
          aria-label={alt}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-1/3 h-1/3 opacity-60"
          >
            <path
              fillRule="evenodd"
              d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`relative overflow-hidden ${aspectRatioClass} ${roundedClass} ${className}`}
      style={styles}
    >
      {/* Show placeholder when no source is provided */}
      {renderPlaceholder()}

      {/* Loading indicator */}
      {src && isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Image */}
      {src && (
        <img
          src={imageSrc}
          alt={alt}
          className={`w-full h-full ${objectFitClass} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={handleLoad}
          onError={handleError}
          loading={lazy ? 'lazy' : 'eager'}
        />
      )}
    </div>
  );
};

export default Image;
