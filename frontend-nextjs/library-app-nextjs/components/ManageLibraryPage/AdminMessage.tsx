'use client';

import { useUser } from "@/lib/localAuth";
import { useEffect, useState } from "react";
import AdminMessageRequest from "@/models/AdminMessageRequest";
import MessageModel from "@/models/MessageModel";
import { Pagination } from "@/components/Utils/Pagination";
import { SpinnerLoading } from "@/components/Utils/SpinnerLoading";
import AdminMessage from "./AdminMessage";

export default function AdminMessages() {
    const { user, getAccessToken } = useUser();
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [httpError, setHttpError] = useState<string | null>(null);
    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [messagesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [btnSubmit, setBtnSubmit] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAllPendingMessages = async () => {
            try {
                setIsLoadingMessages(true);
                setHttpError(null);

                // Must have admin user (tuỳ role bạn kiểm tra thêm nếu cần)
                if (!user) {
                    setIsLoadingMessages(false);
                    setHttpError("You must be signed in as admin to access this page.");
                    return;
                }

                const token = await getAccessToken?.();
                const base = process.env.NEXT_PUBLIC_MESSAGE_SERVICE || 'http://localhost:8085/api';
                const url = `${base}/messages/search/findByClosed?closed=false&page=${currentPage - 1}&size=${messagesPerPage}`;

                // Debug log
                // console.log('API URL:', url, 'TOKEN:', token);

                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    // Show response status & error string
                    const errText = await response.text();
                    throw new Error(`API Error: ${response.status} - ${errText}`);
                }

                const data = await response.json();
                if (data._embedded && data._embedded.messages) {
                    setMessages(data._embedded.messages);
                    setTotalPages(data.page.totalPages);
                } else {
                    setMessages([]);
                    setTotalPages(0);
                }
            } catch (error: any) {
                setHttpError(error.message || "Unknown error!");
                setMessages([]);
            } finally {
                setIsLoadingMessages(false);
            }
        };
        fetchAllPendingMessages();
        if (typeof window !== 'undefined') window.scrollTo(0, 0);
    }, [user, currentPage, btnSubmit, getAccessToken]);

    // Loading and error UI
    if (isLoadingMessages) return <SpinnerLoading />;
    if (httpError)
        return (
            <div className="container m-5">
                <div className="alert alert-danger">{httpError}</div>
            </div>
        );

    // Xử lý submit trả lời
    async function submitResponseToQuestion(id: number, response: string) {
        try {
            if (!user) {
                setSubmitSuccess(false);
                setSubmitError("You must be signed in as admin!");
                return;
            }
            const token = await getAccessToken?.();
            const base = process.env.NEXT_PUBLIC_MESSAGE_SERVICE || 'http://localhost:8085/api';
            const url = `${base}/messages/secure/admin/message`;

            if (id && response.trim() !== "") {
                const messageAdminRequestModel = new AdminMessageRequest(id, response);
                const requestOptions = {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(messageAdminRequestModel),
                };

                const responseApi = await fetch(url, requestOptions);
                if (!responseApi.ok) {
                    const errorText = await responseApi.text();
                    throw new Error(`Failed to submit admin response: ${responseApi.status} - ${errorText}`);
                }

                setSubmitSuccess(true);
                setSubmitError(null);
                setBtnSubmit(!btnSubmit);

                setTimeout(() => {
                    setSubmitSuccess(false);
                }, 3000);
            }
        } catch (error: any) {
            setSubmitError(error.message);
            setSubmitSuccess(false);
            setTimeout(() => {
                setSubmitError(null);
            }, 5000);
        }
    }
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    return (
        <div className="mt-3">
            {submitSuccess && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <strong>Success!</strong> Response submitted successfully.
                    <button type="button" className="btn-close" onClick={() => setSubmitSuccess(false)}></button>
                </div>
            )}
            {submitError && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Error!</strong> {submitError}
                    <button type="button" className="btn-close" onClick={() => setSubmitError(null)}></button>
                </div>
            )}
            {messages.length > 0 ? (
                <>
                    <h5>All Pending Q/A Messages ({messages.length}):</h5>
                    {messages.map((message) => (
                        <AdminMessage
                            message={message}
                            key={message.id || Math.random()}
                            submitResponseToQuestion={submitResponseToQuestion}
                        />
                    ))}
                </>
            ) : (
                <h5>No pending Q/A messages</h5>
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