'use client';

import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ShelfCurrentLoans from "@/models/ShelfCurrentLoans";
import { SpinnerLoading } from "@/components/Utils/SpinnerLoading";
import LoansModal from "@/components/ShelfPage/LoansModal";

export default function Loans() {
    const { user } = useUser();
    const [httpError, setHttpError] = useState<string | null>(null);
    const [shelfCurrentLoans, setShelfCurrentLoans] = useState<ShelfCurrentLoans[]>([]);
    const [isLoadingUserLoans, setIsLoadingUserLoans] = useState(true);
    const [checkout, setCheckout] = useState(false);

    const getIdToken = async () => {
        const res = await fetch('/api/auth/token');
        if (!res.ok) return '';
        const data = await res.json();
        return data.idToken || '';
    };

    useEffect(() => {
        const fetchUserCurrentLoans = async () => {
            if (!user) {
                setIsLoadingUserLoans(false);
                return;
            }
            try {
                const token = await getIdToken();
                const url = `${process.env.NEXT_PUBLIC_BOOK_SERVICE || 'http://localhost:8082/api'}/books/secure/currentloans`;
                const requestOptions: RequestInit = { method: "GET", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } };
                const response = await fetch(url, requestOptions);
                if (!response.ok) throw new Error("Something went wrong!");
                const jsonResponse = await response.json();
                setShelfCurrentLoans(jsonResponse);
            } catch (error: any) {
                setHttpError(error.message);
            } finally {
                setIsLoadingUserLoans(false);
            }
        };
        fetchUserCurrentLoans();
        if (typeof window !== 'undefined') window.scrollTo(0, 0);
    }, [user, checkout]);

    if (isLoadingUserLoans) return <SpinnerLoading />;
    if (httpError) return (<div className="container m-5"><p>{httpError}</p></div>);

    async function returnBook(bookId: number) {
        try {
            const token = await getIdToken();
            const url = `${process.env.NEXT_PUBLIC_BOOK_SERVICE || 'http://localhost:8082/api'}/books/secure/return?bookId=${bookId}`;
            const requestOptions: RequestInit = { method: "PUT", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } };
            const returnResponse = await fetch(url, requestOptions);
            if (!returnResponse.ok) throw new Error("Something went wrong!");
            setCheckout(!checkout);
        } catch (error: any) {
            setHttpError(error.message);
        }
    }

    async function renewLoan(bookId: number) {
        try {
            const token = await getIdToken();
            const url = `${process.env.NEXT_PUBLIC_BOOK_SERVICE || 'http://localhost:8082/api'}/books/secure/renew/loan?bookId=${bookId}`;
            const requestOptions: RequestInit = { method: "PUT", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } };
            const renewResponse = await fetch(url, requestOptions);
            if (!renewResponse.ok) throw new Error("Something went wrong!");
            setCheckout(!checkout);
        } catch (error: any) {
            setHttpError(error.message);
        }
    }

    return (
        <div>
            <div className="d-none d-lg-block mt-2">
                {shelfCurrentLoans.length > 0 ? (
                    <>
                        <h5>Current Loans:</h5>
                        {shelfCurrentLoans.map((shelfCurrentLoan) => (
                            <div key={shelfCurrentLoan.book.id}>
                                <div className="row mt-3 mb-3">
                                    <div className="col-4 col-md-4 container">
                                        {shelfCurrentLoan.book?.img ? (
                                            <img src={shelfCurrentLoan.book?.img} width="226" height="349" alt="Book" />
                                        ) : (
                                            <img src={'/Images/BookImages/book-luv2code-1000.png'} width="226" height="349" alt="Book" />
                                        )}
                                    </div>
                                    <div className="card col-3 col-md-3 container d-flex">
                                        <div className="card-body">
                                            <div className="mt-3">
                                                <h4>Loan Options</h4>
                                                {shelfCurrentLoan.daysLeft > 0 && (<p className="text-secondary">Due in {shelfCurrentLoan.daysLeft} days.</p>)}
                                                {shelfCurrentLoan.daysLeft === 0 && (<p className="text-success">Due Today.</p>)}
                                                {shelfCurrentLoan.daysLeft < 0 && (<p className="text-danger">Past due by {Math.abs(shelfCurrentLoan.daysLeft)} days.</p>)}
                                                <div className="list-group mt-3">
                                                    <button className="list-group-item list-group-item-action" aria-current="true" data-bs-toggle="modal" data-bs-target={`#modal${shelfCurrentLoan.book.id}`}>
                                                        Manage Loan
                                                    </button>
                                                    <Link href={'/search'} className="list-group-item list-group-item-action">Search more books?</Link>
                                                </div>
                                            </div>
                                            <hr />
                                            <p className="mt-3">Help others find their adventure by reviewing your loan.</p>
                                            <Link className="btn btn-primary" href={`/checkout/${shelfCurrentLoan.book.id}`}>Leave a review</Link>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <LoansModal shelfCurrentLoan={shelfCurrentLoan} mobile={false} returnBook={returnBook} renewLoan={renewLoan} />
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        <h3 className="mt-3">Currently no loans</h3>
                        <Link className="btn btn-primary" href={'/search'}>Search for a new book</Link>
                    </>
                )}
            </div>

            <div className="container d-lg-none mt-2">
                {shelfCurrentLoans.length > 0 ? (
                    <>
                        <h5 className="mb-3">Current Loans:</h5>
                        {shelfCurrentLoans.map((shelfCurrentLoan) => (
                            <div key={shelfCurrentLoan.book.id}>
                                <div className="d-flex justify-content-center align-items-center">
                                    {shelfCurrentLoan.book?.img ? (
                                        <img src={shelfCurrentLoan.book?.img} width="226" height="349" alt="Book" />
                                    ) : (
                                        <img src={'/Images/BookImages/book-luv2code-1000.png'} width="226" height="349" alt="Book" />
                                    )}
                                </div>
                                <div className="card d-flex mt-5 mb-3">
                                    <div className="card-body container">
                                        <div className="mt-3">
                                            <h4>Loan Options</h4>
                                            {shelfCurrentLoan.daysLeft > 0 && (<p className="text-secondary">Due in {shelfCurrentLoan.daysLeft} days.</p>)}
                                            {shelfCurrentLoan.daysLeft === 0 && (<p className="text-success">Due Today.</p>)}
                                            {shelfCurrentLoan.daysLeft < 0 && (<p className="text-danger">Past due by {Math.abs(shelfCurrentLoan.daysLeft)} days.</p>)}
                                            <div className="list-group mt-3">
                                                <button className="list-group-item list-group-item-action" aria-current="true" data-bs-toggle="modal" data-bs-target={`#mobilemodal${shelfCurrentLoan.book.id}`}>
                                                    Manage Loan
                                                </button>
                                                <Link href={'/search'} className="list-group-item list-group-item-action">Search more books?</Link>
                                            </div>
                                        </div>
                                        <hr />
                                        <p className="mt-3">Help others find their adventure by reviewing your loan.</p>
                                        <Link className="btn btn-primary" href={`/checkout/${shelfCurrentLoan.book.id}`}>Leave a review</Link>
                                    </div>
                                </div>
                                <hr />
                                <LoansModal shelfCurrentLoan={shelfCurrentLoan} mobile={true} returnBook={returnBook} renewLoan={renewLoan} />
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        <h3 className="mt-3">Currently no loans</h3>
                        <Link className="btn btn-primary" href={'/search'}>Search for a new book</Link>
                    </>
                )}
            </div>
        </div>
    );
}


