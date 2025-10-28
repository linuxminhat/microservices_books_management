'use client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/components/HomePage/HomePage';

export default function Home() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="flex-grow-1">
                <HomePage />
            </div>
            <Footer />
        </div>
    );
}

