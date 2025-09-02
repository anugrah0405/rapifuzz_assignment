'use client';
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { isTokenExpired } from '@/utils/jwt';
import { useIdle } from '@/hooks/useIdle';
import ImageList from '@/components/ImageList';
import Modal from '@/components/Modal';
import Input from '@/components/Input';

import Button from '@/components/Button';
import '../../styles/hoverClass.css';

const ITEMS_PER_PAGE = 10;

export default function HomePage() {
  const router = useRouter();
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Auth check and fetch images for current page and search (server-side pagination)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('token');
      router.replace('/login?loggedout=1');
      return;
    }
    setLoading(true);
    setError('');
    // Build API URL with pagination and search
    let url = `https://jsonplaceholder.typicode.com/photos?_limit=${ITEMS_PER_PAGE}&_page=${page}`;
    if (search.trim()) {
      // JSONPlaceholder does not support search, so we fetch all and filter client-side for demo
      url = `https://jsonplaceholder.typicode.com/photos?title_like=${encodeURIComponent(search)}&_limit=${ITEMS_PER_PAGE}&_page=${page}`;
    }
    axios
      .get(url, { validateStatus: () => true })
      .then(res => {
        if (res.status !== 200) throw new Error('Failed to fetch images');
        setImages(res.data.map((img: any) => ({
          id: img.id,
          title: img.title,
          albumId: img.albumId,
          url: img.url,
          thumbnailUrl: img.thumbnailUrl,
        })));
        // x-total-count header gives total items for pagination
        const total = parseInt(res.headers['x-total-count'] || '0', 10);
        setTotalCount(total);
      })
      .catch(() => setError('Failed to fetch images'))
      .finally(() => setLoading(false));
  }, [router, page, search]);

  // Idle logout
  useIdle(2 * 60 * 1000, () => {
    localStorage.removeItem('token');
    router.replace('/login?loggedout=1');
  });

  // Server-side pagination: totalPages from totalCount
  const totalPages = totalCount ? Math.ceil(totalCount / ITEMS_PER_PAGE) : 1;

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
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-gray-500 font-medium text-lg">No image names found for your search.</div>
          </div>
        ) : (
          <ImageList images={images} onSelect={id => {
            const img = images.find(i => i.id === id);
            if (img) setSelectedImage(img);
          }} />
        )}

        {/* Modal for image details */}
        <Modal open={!!selectedImage} onClose={() => setSelectedImage(null)}>
          {selectedImage && (
            <div className="flex flex-col gap-4 items-center">
              <img src={selectedImage.url} alt={selectedImage.title} className="rounded-lg shadow-md w-48 h-48 object-cover" />
              <a href={selectedImage.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View Full Image</a>
              <div className="text-lg font-semibold text-blue-700">{selectedImage.title}</div>
              <div className="text-gray-500 text-sm">Album ID: {selectedImage.albumId}</div>
              <img src={selectedImage.thumbnailUrl} alt="Thumbnail" className="rounded shadow-md w-16 h-16 object-cover mt-2" />
            </div>
          )}
        </Modal>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
            <button
              className="px-3 py-1 rounded-lg bg-blue-100 text-blue-600 font-semibold paginationButton transition-all disabled:opacity-50 flex items-center justify-center"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              aria-label="Previous page"
            >
              <ChevronLeft size={20} />
            </button>
            {/* Smart pagination logic */}
            {(() => {
              const btns = [];
              const maxButtons = 7; // Adjust for more/less neighbors
              const neighbors = 2;
              let start = Math.max(2, page - neighbors);
              let end = Math.min(totalPages - 1, page + neighbors);
              if (page <= 3) {
                start = 2;
                end = Math.min(totalPages - 1, 2 + 2 * neighbors);
              }
              if (page >= totalPages - 2) {
                start = Math.max(2, totalPages - 2 * neighbors - 1);
                end = totalPages - 1;
              }
              // First page
              btns.push(
                <button
                  key={1}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors duration-150 ${page === 1 ? 'bg-blue-500 text-white shadow-md' : 'bg-blue-50 text-blue-700 paginationButton'}`}
                  onClick={() => setPage(1)}
                  aria-current={page === 1 ? 'page' : undefined}
                >
                  1
                </button>
              );
              // Ellipsis before
              if (start > 2) {
                btns.push(<span key="start-ellipsis" className="px-2">...</span>);
              }
              // Middle page buttons
              for (let i = start; i <= end; i++) {
                btns.push(
                  <button
                    key={i}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors duration-150 ${page === i ? 'bg-blue-500 text-white shadow-md' : 'bg-blue-50 text-blue-700 paginationButton'}`}
                    onClick={() => setPage(i)}
                    aria-current={page === i ? 'page' : undefined}
                  >
                    {i}
                  </button>
                );
              }
              // Ellipsis after
              if (end < totalPages - 1) {
                btns.push(<span key="end-ellipsis" className="px-2">...</span>);
              }
              // Last page
              if (totalPages > 1) {
                btns.push(
                  <button
                    key={totalPages}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors duration-150 ${page === totalPages ? 'bg-blue-500 text-white shadow-md' : 'bg-blue-50 text-blue-700 paginationButton'}`}
                    onClick={() => setPage(totalPages)}
                    aria-current={page === totalPages ? 'page' : undefined}
                  >
                    {totalPages}
                  </button>
                );
              }
              return btns;
            })()}
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
