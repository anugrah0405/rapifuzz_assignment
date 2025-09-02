import React from 'react';
import '../styles/hoverClass.css';

interface ImageListProps {
  images: { id: number; title: string }[];
  onSelect?: (id: number) => void;
}

const ImageList: React.FC<ImageListProps> = ({ images, onSelect }) => (
  <ul className="divide-y divide-gray-200 bg-gray-50 rounded-lg shadow-inner mt-4">
    {images.map(img => (
      <li
        key={img.id}
        className="row py-3 px-4 cursor-pointer hover:bg-blue-100 transition-colors duration-150 rounded-lg flex items-center gap-3"
        onClick={() => onSelect?.(img.id)}
      >
        <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full flex-shrink-0 text-xs font-bold text-blue-700">{img.id}</span>
        <span className="truncate text-gray-800">{img.title}</span>
      </li>
    ))}
  </ul>
);

export default ImageList;
