'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const AddNewBook = dynamic(() => import('@/components/ManageLibraryPage/AddNewBook'), { ssr: false });
const ChangeQuantityOfBooks = dynamic(() => import('@/components/ManageLibraryPage/ChangeQuantityOfBooks'), { ssr: false });
const AdminMessages = dynamic(() => import('@/components/ManageLibraryPage/AdminMessage'), { ssr: false });

export default function AdminPage() {
    const [changeQuantityOfBooksClick, setChangeQuantityOfBooksClick] = useState(false);
    const [messagesClick, setMessagesClick] = useState(false);

    function addBookClickFunction() {
        setChangeQuantityOfBooksClick(false);
        setMessagesClick(false);
    }
    function changeQuantityOfBooksClickFunction() {
        setChangeQuantityOfBooksClick(true);
        setMessagesClick(false);
    }
    function messagesClickFunction() {
        setChangeQuantityOfBooksClick(false);
        setMessagesClick(true);
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="flex-grow-1">
                <div className="container">
                    <h3>Manage Library</h3>
                    <nav>
                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                            <button onClick={addBookClickFunction} className="nav-link active" id="nav-add-book-tab" data-bs-toggle="tab" data-bs-target="#nav-add-book" type="button" role="tab" aria-controls="nav-add-book" aria-selected="false">Add new book</button>
                            <button onClick={changeQuantityOfBooksClickFunction} className="nav-link" id="nav-quantity-tab" data-bs-toggle="tab" data-bs-target="#nav-quantity" type="button" role="tab" aria-controls="nav-quantity" aria-selected="true">Change quantity</button>
                            <button onClick={messagesClickFunction} className="nav-link" id="nav-messages-tab" data-bs-toggle="tab" data-bs-target="#nav-messages" type="button" role="tab" aria-controls="nav-messages" aria-selected="false">Messages</button>
                        </div>
                    </nav>
                    <div className="tab-content" id="nav-tabContent">
                        <div className="tab-pane fade show active" id="nav-add-book" role="tabpanel" aria-labelledby="nav-add-book-tab">
                            <AddNewBook />
                        </div>
                        <div className="tab-pane fade" id="nav-quantity" role="tabpanel" aria-labelledby="nav-quantity-tab">
                            {changeQuantityOfBooksClick ? <ChangeQuantityOfBooks /> : <></>}
                        </div>
                        <div className="tab-pane fade" id="nav-messages" role="tabpanel" aria-labelledby="nav-messages-tab">
                            {messagesClick ? <AdminMessages /> : <></>}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

