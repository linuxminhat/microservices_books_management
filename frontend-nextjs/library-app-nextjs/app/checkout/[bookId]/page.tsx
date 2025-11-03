'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useParams } from 'next/navigation';
import BookCheckoutPage from '@/components/BookCheckoutPage/BookCheckoutPage';

export default function CheckoutPage() {
    const params = useParams() as { bookId: string };
    //extract from url
    const bookId = params.bookId;

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="flex-grow-1">
                <BookCheckoutPage bookId={bookId} />
            </div>
            <Footer />
        </div>
    );
}

