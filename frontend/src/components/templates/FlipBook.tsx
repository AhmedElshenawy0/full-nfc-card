// components/FlipBook.tsx
import React, { useEffect, useRef } from "react";
import { PageFlip } from "page-flip";

interface FlipBookProps {
  images: string[];
  onImageClick?: (image: string) => void;
}

const FlipBook: React.FC<FlipBookProps> = ({ images, onImageClick }) => {
  const bookRef = useRef<HTMLDivElement>(null);
  const flipBookRef = useRef<any>(null);

  useEffect(() => {
    if (!bookRef.current || images.length === 0) return;

    const flipBook = new PageFlip(bookRef.current, {
      width: 300,
      height: 400,
      size: "stretch",
      minWidth: 315,
      maxWidth: 1000,
      minHeight: 400,
      maxHeight: 1536,
      maxShadowOpacity: 0.5,
      showCover: false,
      mobileScrollSupport: false,
    });

    // Destroy previous instance if exists
    if (flipBookRef.current) {
      flipBookRef.current.destroy();
    }

    flipBook.loadFromImages(images);

    flipBookRef.current = flipBook;

    return () => {
      flipBook.destroy();
    };
  }, [images]);

  return (
    <div className="flex justify-center">
      <div ref={bookRef} className="shadow-xl " />
    </div>
  );
};

export default FlipBook;
