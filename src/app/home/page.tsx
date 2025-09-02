'use client';
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { isTokenExpired } from '@/utils/jwt';
import { useIdle } from '@/hooks/useIdle';
import ImageList from '@/components/ImageList';
import Input from '@/components/Input';
import Button from '@/components/Button';
import '../../styles/hoverClass.css';

interface ImageItem {
  id: number;
  title: string;
}

export default function HomePage() {
  const router = useRouter();
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | undefined>();

  // Pagination state
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

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
    setLoading(true);
    axios
      .get('https://jsonplaceholder.typicode.com/photos?_limit=100')
      .then(res => setImages(res.data.map((img: any) => ({ id: img.id, title: img.title }))))
      .catch(() => setError('Failed to fetch images'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = images.filter(img => img.title.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
      <div className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-lg border border-gray-100 relative">
        {/* Logout button at top right */}
        <form
          onSubmit={e => {
            e.preventDefault();
            localStorage.removeItem('token');
            router.replace('/login?loggedout=1');
          }}
          className="absolute right-8 top-8"
        >
          <Button type="submit" className="!w-auto !px-4 !py-1 !text-sm !rounded-md text-white bg-red-500 logout transition-all">Logout</Button>
        </form>
        <h2 className="text-3xl font-bold mb-6 text-blue-600 text-center">Image List</h2>
        <Input
          label="Search by title"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Type to search..."
        />
        {error && <div className="text-red-600 mb-4 text-center font-medium">{error}</div>}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-300 border-t-blue-600 mb-4"></div>
            <div className="text-blue-600 font-semibold text-lg">Loading images...</div>
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-gray-500 font-medium text-lg">No image names found for your search.</div>
          </div>
        ) : (
          <ImageList images={paginated} />
        )}
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              className="px-3 py-1 rounded-lg bg-blue-100 text-blue-600 font-semibold paginationButton transition-all disabled:opacity-50 flex items-center justify-center"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              aria-label="Previous page"
            >
              <ChevronLeft size={20} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors duration-150 ${
                  num === page
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-blue-50 text-blue-700 paginationButton'
                }`}
                onClick={() => setPage(num)}
                aria-current={num === page ? 'page' : undefined}
              >
                {num}
              </button>
            ))}
            <button
              className="px-3 py-1 rounded-lg bg-blue-100 text-blue-600 font-semibold paginationButton transition-all disabled:opacity-50 flex items-center justify-center"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              aria-label="Next page"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
