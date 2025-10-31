import React, { useEffect, useState } from "react";
import { BookModel } from "@/models/BookModel";
// Bạn tự tạo hàm này cho localAuth
import { getToken } from "@/lib/localAuth"; // sửa đường dẫn phù hợp nếu cần

interface Props {
    book: BookModel;
    deleteBook: () => void;
}

const API_BOOK = process.env.NEXT_PUBLIC_BOOK_SERVICE;

export default function ChangeQuantityOfBook({ book, deleteBook }: Props) {
    const [quantity, setQuantity] = useState<number>(0);
    const [remaining, setRemaining] = useState<number>(0);

    useEffect(() => {
        setQuantity(book.copies ?? 0);
        setRemaining(book.copiesAvailable ?? 0);
    }, [book]);

    async function increaseQuantity() {
        try {
            const url = `${API_BOOK}/books/internal/${book.id}/quantity/increase?amount=1`;
            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`
                },
                credentials: "include"
            });
            if (!response.ok) throw new Error(await response.text());
            setQuantity(quantity + 1);
            setRemaining(remaining + 1);
        } catch (error) {
            console.error(error);
        }
    }

    async function decreaseQuantity() {
        try {
            const url = `${API_BOOK}/books/internal/${book.id}/quantity/decrease?amount=1`;
            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`
                },
                credentials: "include"
            });
            if (!response.ok) throw new Error(await response.text());
            setQuantity(quantity - 1);
            setRemaining(remaining - 1);
        } catch (error) {
            console.error(error);
        }
    }

    async function handleDeleteBook() {
        try {
            const url = `${API_BOOK}/books/internal/${book.id}`;
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`
                },
                credentials: "include"
            });
            if (!response.ok) throw new Error(await response.text());
            deleteBook();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
            <div className="row g-0">
                <div className="col-md-2">
                    <img
                        src={book.img || "/book-default.png"}
                        width="123"
                        height="196"
                        alt="Book"
                    />
                </div>
                <div className="col-md-6">
                    <div className="card-body">
                        <h5 className="card-title">{book.author}</h5>
                        <h4>{book.title}</h4>
                        <p className="card-text">{book.description}</p>
                    </div>
                </div>
                <div className="mt-3 col-md-4">
                    <div className="d-flex justify-content-center align-items-center">
                        <p>Total Quantity: <b>{quantity}</b></p>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                        <p>Books Remaining: <b>{remaining}</b></p>
                    </div>
                    <button className="m1 btn btn-md main-color text-white" onClick={increaseQuantity}>
                        Add Quantity
                    </button>
                    <button className="m1 btn btn-md btn-warning" onClick={decreaseQuantity}>
                        Decrease Quantity
                    </button>
                    <button className="m-1 btn btn-md btn-danger" onClick={handleDeleteBook}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}