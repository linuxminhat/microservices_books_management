import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import BookModel from "../../../models/BookModel";
import { API_CONFIG } from '../../../config/apiConfig';

export const ChangeQuantityOfBook: React.FC<{ book: BookModel; deleteBook: any }> = (props) => {
    // THÊM DEBUG LOG
    console.log("=== RENDERING BOOK ===");
    console.log("Book props:", props.book);
    console.log("Book img:", props.book.img);
    console.log("Book img type:", typeof props.book.img);
    console.log("Book img starts with data:", props.book.img?.startsWith('data:image'));

    const { isAuthenticated, getIdTokenClaims, loginWithRedirect } = useAuth0();
    const getIdToken = async () => (await getIdTokenClaims())?.__raw || "";

    const [quantity, setQuantity] = useState<number>(0);
    const [remaining, setRemaining] = useState<number>(0);

    useEffect(() => {
        const fetchBookInState = () => {
            setQuantity(props.book.copies ?? 0);
            setRemaining(props.book.copiesAvailable ?? 0);
        };
        fetchBookInState();
    }, [props.book]);

    async function increaseQuantity() {
        if (!isAuthenticated) {
            await loginWithRedirect();
            return;
        }

        try {
            const token = await getIdToken();
            const url = `${API_CONFIG.ADMIN_SERVICE}/admin/secure/increase/book/quantity?bookId=${props.book?.id}`; const response = await fetch(url, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Something went wrong!");
            setQuantity(quantity + 1);
            setRemaining(remaining + 1);
        } catch (error) {
            console.error(error);
        }
    }

    async function decreaseQuantity() {
        if (!isAuthenticated) {
            await loginWithRedirect();
            return;
        }

        try {
            const token = await getIdToken();
            const url = `${API_CONFIG.ADMIN_SERVICE}/admin/secure/decrease/book/quantity?bookId=${props.book?.id}`; const response = await fetch(url, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Something went wrong!");
            setQuantity(quantity - 1);
            setRemaining(remaining - 1);
        } catch (error) {
            console.error(error);
        }
    }

    async function deleteBook() {
        if (!isAuthenticated) {
            await loginWithRedirect();
            return;
        }

        try {
            const token = await getIdToken();
            const url = `${API_CONFIG.ADMIN_SERVICE}/admin/secure/delete/book?bookId=${props.book?.id}`; const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Something went wrong!");
            props.deleteBook();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
            <div className="row g-0">
                <div className="col-md-2">
                    <div className="d-none d-lg-block">
                        {props.book.img ? (
                            <img src={props.book.img} width="123" height="196" alt="Book" />
                        ) : (
                            <img
                                src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
                                width="123"
                                height="196"
                                alt="Book"
                            />
                        )}
                    </div>
                    <div className="d-lg-none d-flex justify-content-center align-items-center">
                        {props.book.img ? (
                            <img src={props.book.img} width="123" height="196" alt="Book" />
                        ) : (
                            <img
                                src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
                                width="123"
                                height="196"
                                alt="Book"
                            />
                        )}
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card-body">
                        <h5 className="card-title">{props.book.author}</h5>
                        <h4>{props.book.title}</h4>
                        <p className="card-text">{props.book.description}</p>
                    </div>
                </div>

                <div className="mt-3 col-md-4">
                    <div className="d-flex justify-content-center align-items-center">
                        <p>Total Quantity: <b>{quantity}</b></p>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                        <p>Books Remaining: <b>{remaining}</b></p>
                    </div>
                </div>

                <div className="mt-3 col-md-1">
                    <div className="d-flex justify-content-start">
                        <button className="m-1 btn btn-md btn-danger" onClick={deleteBook}>
                            Delete
                        </button>
                    </div>
                </div>

                <button
                    className="m1 btn btn-md main-color text-white"
                    onClick={increaseQuantity}
                >
                    Add Quantity
                </button>
                <button
                    className="m1 btn btn-md btn-warning"
                    onClick={decreaseQuantity}
                >
                    Decrease Quantity
                </button>
            </div>
        </div>
    );
};