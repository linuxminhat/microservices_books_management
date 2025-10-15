import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import ReviewModel from "../../models/ReviewModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import { LatestReviews } from "./LatestReviews";
import { useAuth0 } from "@auth0/auth0-react";
import ReviewRequestModel from "../../models/ReviewRequestModel";
import { API_CONFIG } from "../../config/apiConfig";

export const BookCheckoutPage = () => {

    // const { authState } = useOktaAuth();
    const {
        user,
        loginWithRedirect,
        isAuthenticated,
        getAccessTokenSilently,
        isLoading: authLoading,
    } = useAuth0();

    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [reviews, setReviews] = useState<ReviewModel[]>([])
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    const [isReviewLeft, setIsReviewLeft] = useState(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);
    const [isCheckedOut, setIsCheckedOut] = useState(false);
    const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true);
    const [displayError, setDisplayError] = useState(false);

    const bookId = (window.location.pathname).split('/')[2];
    //fetch book 
    useEffect(() => {
        const fetchBook = async () => {
            try {
                const baseUrl = `${process.env.REACT_APP_API}/books/${bookId}`;
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

        fetchBook();
    }, [isCheckedOut, bookId]);

    //fet revuews 
    useEffect(() => {
        const fetchBookReviews = async () => {
            try {
                const reviewUrl = `${API_CONFIG.REVIEW_SERVICE}/reviews/search/findByBookId?bookId=${bookId}`;
                const response = await fetch(reviewUrl);
                if (!response.ok) throw new Error("Something went wrong!");
                const data = await response.json();
                const reviewsData = data._embedded.reviews;
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

        fetchBookReviews();
    }, [bookId, isReviewLeft]);

    //fetch UserReview 
    useEffect(() => {
        const fetchUserReviewBook = async () => {
            try {
                if (isAuthenticated) {
                    const token = await getAccessTokenSilently();
                    const url = `${process.env.REACT_APP_API}/reviews/secure/user/book/?bookId=${bookId}`;
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
    }, [isAuthenticated, getAccessTokenSilently, bookId]);

    useEffect(() => {
        const fetchUserCurrentLoansCount = async () => {
            try {
                if (isAuthenticated) {
                    const token = await getAccessTokenSilently();
                    const url = `${process.env.REACT_APP_API}/books/secure/currentloans/count`;
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
    }, [isAuthenticated, getAccessTokenSilently, isCheckedOut]);

    useEffect(() => {
        const fetchUserCheckedOutBook = async () => {
            try {
                if (isAuthenticated) {
                    const token = await getAccessTokenSilently();
                    const url = `${process.env.REACT_APP_API}/books/secure/ischeckedout/byuser/?bookId=${bookId}`;
                    const response = await fetch(url, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });

                    if (!response.ok) throw new Error("Something went wrong!");
                    const data = await response.json();
                    setIsCheckedOut(data);
                }
            } catch (error: any) {
                setHttpError(error.message);
            } finally {
                setIsLoadingBookCheckedOut(false);
            }
        };

        fetchUserCheckedOutBook();
    }, [isAuthenticated, getAccessTokenSilently, bookId]);


    if (
        isLoading ||
        isLoadingReview ||
        isLoadingCurrentLoansCount ||
        isLoadingBookCheckedOut ||
        isLoadingUserReview ||
        authLoading
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
            const token = await getAccessTokenSilently();
            const url = `${process.env.REACT_APP_API}/books/secure/checkout/?bookId=${book?.id}`;
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                setDisplayError(true);
                throw new Error("Something went wrong!");
            }
            setDisplayError(false);
            setIsCheckedOut(true);
        } catch (error: any) {
            setHttpError(error.message);
        }
    }
    async function submitReview(starInput: number, reviewDescription: string) {
        try {
            if (!book?.id) return;
            const token = await getAccessTokenSilently();

            const reviewRequestModel = new ReviewRequestModel(starInput, book.id, reviewDescription);
            const url = `${process.env.REACT_APP_API}/reviews/secure`;
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
            <div className="container d-none d-lg-block">
                {displayError && (
                    <div className="alert alert-danger mt-3" role="alert">
                        Please pay outstanding fees and/or return late book(s).
                    </div>
                )}
                <div className="row mt-5">
                    <div className="col-sm-2 col-md-2">
                        {book?.img ? (
                            <img src={book?.img} width="226" height="349" alt="Book" />
                        ) : (
                            <img
                                src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
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
                        isAuthenticated={isAuthenticated}
                        isCheckedOut={isCheckedOut}
                        checkoutBook={checkoutBook}
                        isReviewLeft={isReviewLeft}
                        submitReview={submitReview}
                    />
                </div>
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
            </div>

            {/* Mobile view */}
            <div className="container d-lg-none mt-5">
                {displayError && (
                    <div className="alert alert-danger mt-3" role="alert">
                        Please pay outstanding fees and/or return late book(s).
                    </div>
                )}
                <div className="d-flex justify-content-center alighn-items-center">
                    {book?.img ? (
                        <img src={book?.img} width="226" height="349" alt="Book" />
                    ) : (
                        <img
                            src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
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
                    isAuthenticated={isAuthenticated}
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