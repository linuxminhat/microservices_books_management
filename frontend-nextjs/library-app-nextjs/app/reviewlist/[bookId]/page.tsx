'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useParams } from 'next/navigation';
import ReviewListPageComp from '@/components/ReviewListPage/ReviewListPage';

export default function ReviewListPage() {
    const params = useParams() as { bookId: string };
    const bookId = params.bookId;

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="flex-grow-1">
                <ReviewListPageComp bookId={bookId} />
            </div>
            <Footer />
        </div>
    );
}

