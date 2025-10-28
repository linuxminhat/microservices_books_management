'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const MessagesComp = dynamic(() => import('@/components/MessagesPage/Messages'), { ssr: false });
const PostNewMessage = dynamic(() => import('@/components/MessagesPage/PostNewMessage'), { ssr: false });
const AdminMessages = dynamic(() => import('@/components/ManageLibraryPage/AdminMessages'), { ssr: false });

export default function MessagesPage() {
    const [messagesClick, setMessagesClick] = useState(false);
    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="flex-grow-1">
                <div className='container'>
                    <div className='mt-3 mb-2'>
                        <nav>
                            <div className='nav nav-tabs' id='nav-tab' role='tablist'>
                                <button onClick={() => setMessagesClick(false)} className='nav-link active' 
                                    id='nav-send-message-tab' data-bs-toggle='tab' data-bs-target='#nav-send-message' 
                                    type='button' role='tab' aria-controls='nav-send-message' aria-selected='true'>
                                        Submit Question
                                </button>
                                <button onClick={() => setMessagesClick(true)} className='nav-link' 
                                    id='nav-message-tab' data-bs-toggle='tab' data-bs-target='#nav-message' 
                                    type='button' role='tab' aria-controls='nav-message' aria-selected='false'>
                                        Q/A Response/Pending
                                </button>
                            </div>
                        </nav>
                        <div className='tab-content' id='nav-tabContent'>
                            <div className='tab-pane fade show active' id='nav-send-message' role='tabpanel' 
                                aria-labelledby='nav-send-message-tab'>
                               <PostNewMessage />
                            </div>
                            <div className='tab-pane fade' id='nav-message' role='tabpanel' aria-labelledby='nav-message-tab'>
                                {messagesClick ? (
                                    <MessagesComp />
                                ) : <></>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

