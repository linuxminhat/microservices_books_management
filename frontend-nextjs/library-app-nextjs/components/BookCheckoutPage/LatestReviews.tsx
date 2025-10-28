import Link from "next/link";
import ReviewModel from "@/models/ReviewModel";
import { Review } from "@/components/Utils/Review";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";
import { API_CONFIG } from "@/config/apiConfig";

export const LatestReviews: React.FC<{
    reviews: ReviewModel[], bookId: number | undefined, mobile: boolean
}> = (props) => {

    const { user } = useUser();
    const [userReview, setUserReview] = useState<ReviewModel | null>(null);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

    const getIdToken = async () => {
        const res = await fetch('/api/auth/token');
        if (!res.ok) return '';
        const data = await res.json();
        return data.idToken || '';
    };

    useEffect(() => {
        const fetchUserReview = async () => {
            if (user && props.bookId) {
                try {
                    const token = await getIdToken();
                    const url = `${API_CONFIG.REVIEW_SERVICE}/reviews/secure/user/review?bookId=${props.bookId}`;
                    const response = await fetch(url, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data) {
                            setUserReview({
                                id: data.id,
                                userEmail: data.userEmail,
                                date: data.date,
                                rating: data.rating,
                                book_id: data.bookId,
                                reviewDescription: data.reviewDescription,
                            });
                        }
                    } else if (response.status === 404) {
                        setUserReview(null);
                    }
                } catch (error) {
                    console.error("Error fetching user review:", error);
                } finally {
                    setIsLoadingUserReview(false);
                }
            } else {
                setIsLoadingUserReview(false);
            }
        };
        fetchUserReview();
    }, [user, props.bookId]);

    const isCurrentUserReview = (review: ReviewModel) => {
        if (!user) return false;
        const userEmail = (user as any)['https://example.com/email'] || (user as any).email;
        return review.userEmail === userEmail;
    };

    const getDisplayReviews = () => {
        return props.reviews.map(review => ({
            ...review,
            isUserReview: isCurrentUserReview(review),
            bookId: props.bookId
        })).sort((a, b) => {
            if ((a as any).isUserReview && !(b as any).isUserReview) return -1;
            if (!(a as any).isUserReview && (b as any).isUserReview) return 1;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
    };

    const handleReviewUpdate = async () => {
        if (user && props.bookId) {
            try {
                const token = await getIdToken();
                const url = `${API_CONFIG.REVIEW_SERVICE}/reviews/secure/user/review?bookId=${props.bookId}`;
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data) {
                        setUserReview({
                            id: data.id,
                            userEmail: data.userEmail,
                            date: data.date,
                            rating: data.rating,
                            book_id: data.bookId,
                            reviewDescription: data.reviewDescription,
                        });
                    } else {
                        setUserReview(null);
                    }
                } else if (response.status === 404) {
                    setUserReview(null);
                }
            } catch (error) {
                console.error("Error refreshing user review:", error);
            }
        }

        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('refreshReviews'));
        }
    };

    const displayReviews = getDisplayReviews();

    return (
        <div className={props.mobile ? 'mt-3' : 'row mt-5'}>
            <div className={props.mobile ? '' : 'col-sm-2 col-md-2'}>
                <h2>Latest Reviews: </h2>
            </div>
            <div className='col-sm-10 col-md-10'>
                {displayReviews.length > 0 ?
                    <>
                        {displayReviews.slice(0, 3).map((eachReview: any) => (
                            <Review
                                review={eachReview}
                                key={`review-${eachReview.id}`}
                                isUserReview={eachReview.isUserReview}
                                bookId={eachReview.bookId}
                                onReviewUpdate={handleReviewUpdate}
                            />
                        ))}

                        <div className='m-3'>
                            <Link className='btn main-color btn-md text-white' href={`/reviewlist/${props.bookId}`}>
                                Reach all reviews.
                            </Link>
                        </div>
                    </>
                    :
                    <div className='m-3'>
                        <p className='lead'>
                            Currently there are no reviews for this book
                        </p>
                    </div>
                }
            </div>
        </div>
    );
}


