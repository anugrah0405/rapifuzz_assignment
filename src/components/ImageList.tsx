import React from 'react';

interface ImageListProps {
  images: { id: number; title: string }[];
  onSelect?: (id: number) => void;
}

const ImageList: React.FC<ImageListProps> = ({ images, onSelect }) => (
  <ul className="divide-y divide-gray-200">
    {images.map(img => (
      <li
        key={img.id}
        className="py-2 cursor-pointer hover:bg-gray-100"
        onClick={() => onSelect?.(img.id)}
      >
        {img.title}
      </li>
    ))}
  </ul>
);

export default ImageList;
