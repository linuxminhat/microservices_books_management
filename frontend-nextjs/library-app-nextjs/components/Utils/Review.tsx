import { useState } from 'react';
import ReviewModel from "@/models/ReviewModel";
import { StarsReview } from "./StarsReview";
import { useUser } from "@/lib/localAuth";
import { API_CONFIG } from "@/config/apiConfig";

export const Review: React.FC<{
    review: ReviewModel,
    isUserReview?: boolean,
    bookId?: number,
    onReviewUpdate?: () => void
}> = (props) => {
    const { user } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [editRating, setEditRating] = useState(props.review.rating);
    const [editDescription, setEditDescription] = useState(props.review.reviewDescription || '');
    const [isLoading, setIsLoading] = useState(false);

    const getIdToken = async () => {
        const res = await fetch('/api/auth/token');
        if (!res.ok) return '';
        const data = await res.json();
        return (data.accessToken || data.idToken || '');
    };

    const date = new Date(props.review.date);
    const longMonth = date.toLocaleString('en-us', { month: 'long' });
    const dateDay = date.getDate();
    const dateYear = date.getFullYear();
    const dateRender = longMonth + ' ' + dateDay + ', ' + dateYear;

    const handleEdit = () => {
        setIsEditing(true);
        setEditRating(props.review.rating);
        setEditDescription(props.review.reviewDescription || '');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditRating(props.review.rating);
        setEditDescription(props.review.reviewDescription || '');
    };

    const handleSave = async () => {
        if (!props.bookId) return;
        setIsLoading(true);
        try {
            const token = await getIdToken();
            const url = `${API_CONFIG.REVIEW_SERVICE}/reviews/secure`;
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    bookId: props.bookId,
                    rating: editRating,
                    reviewDescription: editDescription
                }),
            });
            if (response.ok) {
                setIsEditing(false);
                if (props.onReviewUpdate) props.onReviewUpdate();
            } else {
                const errorText = await response.text();
                console.error("Update failed:", errorText);
                throw new Error("Failed to update review");
            }
        } catch (error) {
            console.error("Error updating review:", error);
            alert("Failed to update review");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!props.bookId || !(window as any).confirm("Are you sure you want to delete this review?")) return;
        setIsLoading(true);
        try {
            const token = await getIdToken();
            const url = `${API_CONFIG.REVIEW_SERVICE}/reviews/secure?bookId=${props.bookId}`;
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                if (props.onReviewUpdate) props.onReviewUpdate();
            } else {
                const errorText = await response.text();
                console.error("Delete failed:", errorText);
                throw new Error("Failed to delete review");
            }
        } catch (error) {
            console.error("Error deleting review:", error);
            alert("Failed to delete review");
        } finally {
            setIsLoading(false);
        }
    };

    const starValue = (value: number) => setEditRating(value);

    return (
        <div className={props.isUserReview ? "user-review-highlight" : ""}>
            {props.isUserReview && user && (
                <div className="d-flex align-items-center mb-2">
                    <span className="badge bg-primary me-2">
                        <i className="fas fa-user-check me-1"></i>
                        Your Review
                    </span>
                    <span className="text-muted small">
                        <i className="fas fa-pin me-1"></i>
                        Pinned
                    </span>
                </div>
            )}

            <div className={`col-sm-8 col-md-8 ${props.isUserReview ? 'user-review-content' : ''}`}>
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className={props.isUserReview ? 'text-primary fw-bold' : ''}>
                        {props.isUserReview && user && (
                            <i className="fas fa-user-circle me-2 text-primary"></i>
                        )}
                        {props.review.userEmail}
                    </h5>
                    {props.isUserReview && user && (
                        <div>
                            {!isEditing ? (
                                <>
                                    <button className="btn btn-sm btn-outline-primary me-2" onClick={handleEdit} disabled={isLoading}>Edit</button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={handleDelete} disabled={isLoading}>Delete</button>
                                </>
                            ) : (
                                <>
                                    <button className="btn btn-sm btn-success me-2" onClick={handleSave} disabled={isLoading}>Save</button>
                                    <button className="btn btn-sm btn-secondary" onClick={handleCancel} disabled={isLoading}>Cancel</button>
                                </>
                            )}
                        </div>
                    )}
                </div>
                <div className='row'>
                    <div className='col'>
                        {dateRender}
                    </div>
                    <div className='col'>
                        {!isEditing ? (
                            <StarsReview rating={props.review.rating} size={16} />
                        ) : (
                            <div className="dropdown">
                                <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                    {editRating} stars
                                </button>
                                <ul className="dropdown-menu">
                                    <li><button className="dropdown-item" onClick={() => starValue(0)}>0 star</button></li>
                                    <li><button className="dropdown-item" onClick={() => starValue(0.5)}>0.5 star</button></li>
                                    <li><button className="dropdown-item" onClick={() => starValue(1)}>1 star</button></li>
                                    <li><button className="dropdown-item" onClick={() => starValue(1.5)}>1.5 star</button></li>
                                    <li><button className="dropdown-item" onClick={() => starValue(2)}>2 star</button></li>
                                    <li><button className="dropdown-item" onClick={() => starValue(2.5)}>2.5 star</button></li>
                                    <li><button className="dropdown-item" onClick={() => starValue(3)}>3 star</button></li>
                                    <li><button className="dropdown-item" onClick={() => starValue(3.5)}>3.5 star</button></li>
                                    <li><button className="dropdown-item" onClick={() => starValue(4)}>4 star</button></li>
                                    <li><button className="dropdown-item" onClick={() => starValue(4.5)}>4.5 star</button></li>
                                    <li><button className="dropdown-item" onClick={() => starValue(5)}>5 star</button></li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
                <div className='mt-2'>
                    {!isEditing ? (
                        <p className={props.isUserReview ? 'fw-medium' : ''}>{props.review.reviewDescription}</p>
                    ) : (
                        <textarea className="form-control" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={3} placeholder="Enter your review description..." />
                    )}
                </div>
            </div>
            <hr />
        </div>
    );
}


