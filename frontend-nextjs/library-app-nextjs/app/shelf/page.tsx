'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const HistoryPage = dynamic(() => import('@/components/ShelfPage/HistoryPage'), { ssr: false });
const Loans = dynamic(() => import('@/components/ShelfPage/Loans'), { ssr: false });

export default function ShelfPage() {
    const { user } = useUser();
    const [historyClick, setHistoryClick] = useState(false);

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="flex-grow-1">
                <div className='container'>
                    <div className='mt-3'>
                        <nav>
                            <div className='nav nav-tabs' id='nav-tab' role='tablist'>
                                <button onClick={() => setHistoryClick(false)} className='nav-link active' id='nav-loans-tab' data-bs-toggle='tab'
                                    data-bs-target='#nav-loans' type='button' role='tab' aria-controls='nav-loans'
                                    aria-selected='true'>
                                        Loans
                                </button>
                                <button onClick={() => setHistoryClick(true)} className='nav-link' id='nav-history-tab' data-bs-toggle='tab' 
                                    data-bs-target='#nav-history' type='button' role='tab' aria-controls='nav-history'
                                    aria-selected='false'>
                                        Your History
                                </button>
                            </div>
                        </nav>
                        <div className='tab-content' id='nav-tabContent'>
                            <div className='tab-pane fade show active' id='nav-loans' role='tabpanel'
                                aria-labelledby='nav-loans-tab'>
                                    <Loans/>
                            </div>
                            <div className='tab-pane fade' id='nav-history' role='tabpanel'
                                aria-labelledby='nav-history-tab'>
                                    {historyClick ? <HistoryPage/> : <></>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

