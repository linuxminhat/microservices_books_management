'use client';

import { useUser } from "@/lib/localAuth";
import { useEffect, useState } from "react";
import Link from "next/link";
import HistoryModel from "@/models/HistoryModel";
import { Pagination } from "@/components/Utils/Pagination";
import { SpinnerLoading } from "@/components/Utils/SpinnerLoading";

export default function HistoryPage() {
    const { user } = useUser();
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [httpError, setHttpError] = useState<string | null>(null);
    const [histories, setHistories] = useState<HistoryModel[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const getIdToken = async () => {
        const res = await fetch('/api/auth/token');
        if (!res.ok) return '';
        const data = await res.json();
        return (data.accessToken || data.idToken || '');
    };

    useEffect(() => {
        const fetchUserHistory = async () => {
            if (!user) {
                setIsLoadingHistory(false);
                return;
            }
            try {
                const token = await getIdToken();
                const email = (user as any)?.email || (user as any)?.['https://example.com/email'] || (user as any)?.sub || '';
                const url = `${process.env.NEXT_PUBLIC_BOOK_SERVICE || 'http://localhost:8082/api'}/histories/search/findBooksByUserEmail?email=${encodeURIComponent(email)}&page=${currentPage - 1}&size=5`;
                const requestOptions = { method: "GET", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } } as RequestInit;
                const historyResponse = await fetch(url, requestOptions);
                if (!historyResponse.ok) throw new Error("Something went wrong!");
                const historyResponseJson = await historyResponse.json();
                setHistories(historyResponseJson._embedded?.histories ?? []);
                setTotalPages(historyResponseJson.page?.totalPages ?? 0);
            } catch (error: any) {
                setHttpError(error.message);
            } finally {
                setIsLoadingHistory(false);
            }
        };
        fetchUserHistory();
    }, [user, currentPage]);

    if (isLoadingHistory) return <SpinnerLoading />;
    if (httpError) return (<div className="container m-5"><p>{httpError}</p></div>);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    return (
        <div className="mt-2">
            {histories.length > 0 ? (
                <>
                    <h5>Recent History:</h5>
                    {histories.map((history) => (
                        <div key={history.id}>
                            <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
                                <div className="row g-0">
                                    <div className="col-md-2">
                                        <div className="d-none d-lg-block">
                                            {history.img ? (
                                                <img src={history.img} width="123" height="196" alt="Book"
                                                    onError={(e) => { const t = e.currentTarget; if (!t.src.includes('/Images/BookImages/book-luv2code-1000.png')) t.src = '/Images/BookImages/book-luv2code-1000.png'; }} />
                                            ) : (
                                                <img src={'/Images/BookImages/book-luv2code-1000.png'} width="123" height="196" alt="Default" />
                                            )}
                                        </div>
                                        <div className="d-lg-none d-flex justify-content-center align-items-center">
                                            {history.img ? (
                                                <img src={history.img} width="123" height="196" alt="Book"
                                                    onError={(e) => { const t = e.currentTarget; if (!t.src.includes('/Images/BookImages/book-luv2code-1000.png')) t.src = '/Images/BookImages/book-luv2code-1000.png'; }} />
                                            ) : (
                                                <img src={'/Images/BookImages/book-luv2code-1000.png'} width="123" height="196" alt="Default" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="card-body">
                                            <h5 className="card-title">{history.author}</h5>
                                            <h4>{history.title}</h4>
                                            <p className="card-text">{history.description}</p>
                                            <hr />
                                            <p className="card-text">Checked out on: {history.checkoutDate}</p>
                                            <p className="card-text">Returned on: {history.returnedDate}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </div>
                    ))}
                </>
            ) : (
                <>
                    <h3 className="mt-3">Currently no history:</h3>
                    <Link className="btn btn-primary" href={'/search'}>
                        Search for new book
                    </Link>
                </>
            )}
            {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
            )}
        </div>
    );
}


