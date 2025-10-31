import React, { useEffect, useState } from "react";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { Pagination } from "../Utils/Pagination";
import ChangeQuantityOfBook from "./ChangeQuantityOfBook";
import { BookModel } from "@/models/BookModel";

export default function ChangeQuantityOfBooks() {
    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(5);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [bookDelete, setBookDelete] = useState(false);

    useEffect(() => {
        const fetchBooks = async () => {
            const API_BOOKS = process.env.NEXT_PUBLIC_BOOK_SERVICE;
            const baseUrl = `${API_BOOKS}/books?page=${currentPage - 1}&size=${booksPerPage}`;
            const response = await fetch(baseUrl);
            if (!response.ok) throw new Error("Something went wrong!");

            const responseJson = await response.json();
            const responseData = responseJson.content || responseJson._embedded?.books || responseJson;

            setTotalAmountOfBooks(responseJson.totalElements || responseJson.page?.totalElements || 0);
            setTotalPages(responseJson.totalPages || responseJson.page?.totalPages || 1);

            const loadedBooks: BookModel[] = [];
            for (const key in responseData) {
                loadedBooks.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    author: responseData[key].author,
                    description: responseData[key].description,
                    copies: responseData[key].copies,
                    copiesAvailable: responseData[key].copiesAvailable,
                    category: responseData[key].category,
                    img: responseData[key].img,
                });
            }
            setBooks(loadedBooks);
            setIsLoading(false);
        };
        fetchBooks().catch((error) => {
            setIsLoading(false);
            setHttpError(error.message);
        });
    }, [currentPage, bookDelete]);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const deleteBook = () => setBookDelete(!bookDelete);

    if (isLoading) return <SpinnerLoading />;
    if (httpError) return (
        <div className='container m-5'>
            <p>{httpError}</p>
        </div>
    );

    return (
        <div className='container mt-5'>
            {totalAmountOfBooks > 0 ? (
                <>
                    <div className='mt-3'>
                        <h3>Number of results: ({totalAmountOfBooks})</h3>
                    </div>
                    <p>
                        {(currentPage - 1) * booksPerPage + 1} to {Math.min(currentPage * booksPerPage, totalAmountOfBooks)} of {totalAmountOfBooks} items:
                    </p>
                    {books.map(book => (
                        <ChangeQuantityOfBook book={book} key={book.id} deleteBook={deleteBook} />
                    ))}
                </>
            ) : (
                <h5>Add a book before changing quantity</h5>
            )}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    paginate={paginate}
                />
            )}
        </div>
    );
}


