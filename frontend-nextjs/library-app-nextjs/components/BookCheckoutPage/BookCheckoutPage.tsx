'use client';

import { useEffect, useState } from "react";
import BookModel from "@/models/BookModel";
import ReviewModel from "@/models/ReviewModel";
import { SpinnerLoading } from "@/components/Utils/SpinnerLoading";
import { StarsReview } from "@/components/Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import { LatestReviews } from "./LatestReviews";
import { useUser } from "@/lib/localAuth";
import ReviewRequestModel from "@/models/ReviewRequestModel";
import { API_CONFIG } from "@/config/apiConfig";
import { OutOfStockModal } from "@/components/Utils/OutOfStockModal";

export default function BookCheckoutPage({ bookId: bookIdProp }: { bookId?: string | number }) {
    const { user, isLoading: authLoading } = useUser();

    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState<string | null>(null);
    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);
    const [isReviewLeft, setIsReviewLeft] = useState(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);
    const [isCheckedOut, setIsCheckedOut] = useState(false);
    const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true);
    const [displayError, setDisplayError] = useState(false);
    const [showOutOfStockModal, setShowOutOfStockModal] = useState(false);
    const [checkedOutLoaded, setCheckedOutLoaded] = useState(false); // mới thêm

    const bookId = String(bookIdProp ?? (typeof window !== 'undefined' ? window.location.pathname.split('/')[2] : ''));

    const getIdToken = async () => {
        const res = await fetch('/api/auth/token');
        if (!res.ok) return '';
        const data = await res.json();
        return (data.accessToken || data.idToken || '');
    };

    useEffect(() => {
        setCheckedOutLoaded(false); // luôn reset loading mỗi lần vào trang/đổi sách
        const fetchBook = async () => {
            try {
                const baseUrl = `${API_CONFIG.BOOK_SERVICE}/books/${bookId}`;
                const response = await fetch(baseUrl);
                if (!response.ok) throw new Error("Something went wrong!");
                const data = await response.json();
                const loadedBook: BookModel = {
                    id: data.id,
                    title: data.title,
                    author: data.author,
                    description: data.description,
                    copies: data.copies,
                    copiesAvailable: data.copiesAvailable,
                    category: data.category,
                    img: data.img,
                };

                setBook(loadedBook);
            } catch (error: any) {
                setHttpError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (bookId) {
            fetchBook();
        }
    }, [isCheckedOut, bookId]);

    useEffect(() => {
        const fetchBookReviews = async () => {
            try {
                const reviewUrl = `${API_CONFIG.REVIEW_SERVICE}/reviews/search/findByBookId?bookId=${bookId}`;
                const response = await fetch(reviewUrl);
                if (!response.ok) throw new Error("Something went wrong!");
                const data = await response.json();
                const reviewsData = data._embedded?.reviews ?? [];
                const loadedReviews: ReviewModel[] = [];
                let weightedStars = 0;

                for (const key in reviewsData) {
                    loadedReviews.push({
                        id: reviewsData[key].id,
                        userEmail: reviewsData[key].userEmail,
                        date: reviewsData[key].date,
                        rating: reviewsData[key].rating,
                        book_id: reviewsData[key].bookId,
                        reviewDescription: reviewsData[key].reviewDescription,
                    });
                    weightedStars += reviewsData[key].rating;
                }

                if (loadedReviews.length > 0) {
                    const avg = Math.round((weightedStars / loadedReviews.length) * 2) / 2;
                    setTotalStars(avg);
                }

                setReviews(loadedReviews);
            } catch (error: any) {
                setHttpError(error.message);
            } finally {
                setIsLoadingReview(false);
            }
        };

        if (bookId) {
            fetchBookReviews();
        }
    }, [bookId, isReviewLeft]);

    useEffect(() => {
        const handleRefreshReviews = () => {
            const fetchBookReviews = async () => {
                try {
                    const reviewUrl = `${API_CONFIG.REVIEW_SERVICE}/reviews/search/findByBookId?bookId=${bookId}`;
                    const response = await fetch(reviewUrl);
                    if (!response.ok) return;
                    const data = await response.json();
                    const reviewsData = data._embedded?.reviews ?? [];
                    const loadedReviews: ReviewModel[] = [];
                    let weightedStars = 0;
                    for (const key in reviewsData) {
                        loadedReviews.push({
                            id: reviewsData[key].id,
                            userEmail: reviewsData[key].userEmail,
                            date: reviewsData[key].date,
                            rating: reviewsData[key].rating,
                            book_id: reviewsData[key].bookId,
                            reviewDescription: reviewsData[key].reviewDescription,
                        });
                        weightedStars += reviewsData[key].rating;
                    }
                    if (loadedReviews.length > 0) {
                        const avg = Math.round((weightedStars / loadedReviews.length) * 2) / 2;
                        setTotalStars(avg);
                    } else {
                        setTotalStars(0);
                    }
                    setReviews(loadedReviews);
                } catch {
                }
            };
            fetchBookReviews();
        };
        if (typeof window !== 'undefined') {
            window.addEventListener('refreshReviews', handleRefreshReviews);
            return () => window.removeEventListener('refreshReviews', handleRefreshReviews);
        }
    }, [bookId]);

    useEffect(() => {
        const fetchUserReviewBook = async () => {
            try {
                if (user && bookId) {
                    const token = await getIdToken();
                    if (!token) { setIsReviewLeft(false); return; }
                    const url = `${API_CONFIG.REVIEW_SERVICE}/reviews/secure/user/book?bookId=${bookId}`;
                    const response = await fetch(url, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                    if (!response.ok) throw new Error("Something went wrong");
                    const data = await response.json();
                    setIsReviewLeft(data);
                }
            } catch (error: any) {
                setHttpError(error.message);
            } finally {
                setIsLoadingUserReview(false);
            }
        };
        fetchUserReviewBook();
    }, [user, bookId]);

    useEffect(() => {
        const fetchUserCurrentLoansCount = async () => {
            try {
                if (user) {
                    const token = await getIdToken();
                    if (!token) { setCurrentLoansCount(0); return; }
                    const url = `${API_CONFIG.BOOK_SERVICE}/books/secure/currentloans/count`;
                    const response = await fetch(url, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                    if (!response.ok) throw new Error("Something went wrong!");
                    const data = await response.json();
                    setCurrentLoansCount(data);
                }
            } catch (error: any) {
                setHttpError(error.message);
            } finally {
                setIsLoadingCurrentLoansCount(false);
            }
        };
        fetchUserCurrentLoansCount();
    }, [user, isCheckedOut]);

    useEffect(() => {
        setCheckedOutLoaded(false); // luôn reset loading mỗi lần vào trang/đổi sách
        const fetchUserCheckedOutBook = async () => {
            try {
                console.log("Bắt đầu fetch isCheckedOut", user, bookId);
                if (user) {
                    const token = await getIdToken();
                    if (!token) {
                        setIsCheckedOut(false);
                        setCheckedOutLoaded(true);
                        return;
                    }
                    const url = `${API_CONFIG.BOOK_SERVICE}/books/secure/ischeckedout/byuser?bookId=${bookId}`;
                    const response = await fetch(url, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                    if (!response.ok) {
                        setIsCheckedOut(false);
                        setCheckedOutLoaded(true);
                        console.log("API không ok", response.status, response.statusText); // Debug
                        return;
                    }
                    const data = await response.json();
                    setIsCheckedOut(data);
                    setCheckedOutLoaded(true);
                    console.log("Đã fetch xong isCheckedOut:", data);
                } else {
                    setIsCheckedOut(false);
                    setCheckedOutLoaded(true);
                    console.log("Không có user, reset isCheckedOut false");
                }
            } catch (e) {
                setIsCheckedOut(false);
                setCheckedOutLoaded(true);
                console.log("Lỗi fetch isCheckedOut:", e);
            }
        };
        fetchUserCheckedOutBook();
    }, [user, bookId]);

    if (
        isLoading ||
        isLoadingReview ||
        isLoadingCurrentLoansCount ||
        isLoadingBookCheckedOut ||
        isLoadingUserReview ||
        authLoading ||
        !checkedOutLoaded // render đúng sau khi checked xong
    ) {
        return <SpinnerLoading />;
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    async function checkoutBook() {
        try {
            const token = await getIdToken();
            const url = `${API_CONFIG.BOOK_SERVICE}/books/secure/checkout?bookId=${book?.id}`;
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                if (response.status === 400) {
                    setShowOutOfStockModal(true);
                    return;
                } else {
                    setDisplayError(true);
                }
                throw new Error("Something went wrong!");
            }
            setDisplayError(false);
            setIsCheckedOut(true);
        } catch (error: any) {
            if (!showOutOfStockModal) setHttpError(error.message);
        }
    }

    async function submitReview(starInput: number, reviewDescription: string) {
        try {

            if (!book?.id) return;
            const token = await getIdToken();
            if (!token) {
                setHttpError('Your session has expired. Please log in again to submit a review.');
                return;
            }

            const reviewRequestModel = new ReviewRequestModel(starInput, book.id, reviewDescription);
            const url = `${API_CONFIG.REVIEW_SERVICE}/reviews/secure`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reviewRequestModel),
            });
            if (!response.ok) throw new Error("Something went wrong!");
            setIsReviewLeft(true);
        } catch (error: any) {
            setHttpError(error.message);
        }
    }

    return (
        <div>
            <OutOfStockModal
                show={showOutOfStockModal}
                onClose={() => setShowOutOfStockModal(false)}
                bookTitle={book?.title}
            />

            <div className="container d-none d-lg-block">
                {displayError && (
                    <div className="alert alert-danger mt-3" role="alert">
                        Please return late book(s).
                    </div>
                )}
                <div className="row mt-5">
                    <div className="col-sm-2 col-md-2">
                        {book?.img ? (
                            <img src={book?.img} width="226" height="349" alt="Book"
                                onError={(e) => { const t = e.currentTarget; if (!t.src.includes('/Images/BookImages/book-luv2code-1000.png')) t.src = '/Images/BookImages/book-luv2code-1000.png'; }} />
                        ) : (
                            <img
                                src={'/Images/BookImages/book-luv2code-1000.png'}
                                width="226"
                                height="349"
                                alt="Book"
                            />
                        )}
                    </div>
                    <div className="col-4 col-md-4 container">
                        <div className="ml-2">
                            <h2>{book?.title}</h2>
                            <h5 className="text-primary">{book?.author}</h5>
                            <p className="lead">{book?.description}</p>
                            <StarsReview rating={totalStars} size={32} />
                        </div>
                    </div>
                    <CheckoutAndReviewBox
                        book={book}
                        mobile={false}
                        currentLoansCount={currentLoansCount}
                        isAuthenticated={!!user}
                        isCheckedOut={isCheckedOut}
                        checkoutBook={checkoutBook}
                        isReviewLeft={isReviewLeft}
                        submitReview={submitReview}
                    />
                </div>
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
            </div>

            <div className="container d-lg-none mt-5">
                {displayError && (
                    <div className="alert alert-danger mt-3" role="alert">
                        Please return late book(s).
                    </div>
                )}
                <div className="d-flex justify-content-center alighn-items-center">
                    {book?.img ? (
                        <img src={book?.img} width="226" height="349" alt="Book"
                            onError={(e) => { const t = e.currentTarget; if (!t.src.includes('/Images/BookImages/book-luv2code-1000.png')) t.src = '/Images/BookImages/book-luv2code-1000.png'; }} />
                    ) : (
                        <img
                            src={'/Images/BookImages/book-luv2code-1000.png'}
                            width="226"
                            height="349"
                            alt="Book"
                        />
                    )}
                </div>
                <div className="mt-4">
                    <div className="ml-2">
                        <h2>{book?.title}</h2>
                        <h5 className="text-primary">{book?.author}</h5>
                        <p className="lead">{book?.description}</p>
                        <StarsReview rating={totalStars} size={32} />
                    </div>
                </div>
                <CheckoutAndReviewBox
                    book={book}
                    mobile={true}
                    currentLoansCount={currentLoansCount}
                    isAuthenticated={!!user}
                    isCheckedOut={isCheckedOut}
                    checkoutBook={checkoutBook}
                    isReviewLeft={isReviewLeft}
                    submitReview={submitReview}
                />
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
            </div>
        </div>
    );
}


