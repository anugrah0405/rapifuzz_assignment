'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { decodeToken, isTokenExpired } from '@/utils/jwt';
import { useIdle } from '@/hooks/useIdle';
import ImageList from '@/components/ImageList';
import Input from '@/components/Input';

interface ImageItem {
  id: number;
  title: string;
}

export default function HomePage() {
  const router = useRouter();
  const [images, setImages] = useState<ImageItem[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | undefined>();

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('token');
      router.replace('/login?loggedout=1');
    }
  }, [router]);

  // Idle logout
  useIdle(2 * 60 * 1000, () => {
    localStorage.removeItem('token');
    router.replace('/login?loggedout=1');
  });

  // Fetch images
  useEffect(() => {
    axios
      .get('https://jsonplaceholder.typicode.com/photos?_limit=100')
      .then(res => setImages(res.data.map((img: any) => ({ id: img.id, title: img.title }))))
      .catch(() => setError('Failed to fetch images'));
  }, []);

  const filtered = images.filter(img => img.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Image List</h2>
      <Input
        label="Search by title"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Type to search..."
      />
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <ImageList images={filtered} />
    </div>
  );
}
