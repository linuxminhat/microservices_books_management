'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SearchBooksPage } from '@/components/SearchBooksPage/SearchBooksPage';

export default function SearchPage() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="flex-grow-1">
        <SearchBooksPage />
      </div>
      <Footer />
    </div>
  );
}

