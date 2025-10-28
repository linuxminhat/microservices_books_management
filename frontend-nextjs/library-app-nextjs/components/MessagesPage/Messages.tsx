'use client';

import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";
import MessageModel from "@/models/MessageModel";
import { SpinnerLoading } from "@/components/Utils/SpinnerLoading";
import { Pagination } from "@/components/Utils/Pagination";

export default function Messages() {
    const { user } = useUser();
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [httpError, setHttpError] = useState<string | null>(null);
    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [messagesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const getAccessTokenSilently = async () => {
        const res = await fetch('/api/auth/token');
        if (!res.ok) return '';
        const data = await res.json();
        return data.accessToken || data.idToken || '';
    };

    useEffect(() => {
        const fetchUserMessages = async () => {
            try {
                if (!user) {
                    setIsLoadingMessages(false);
                    return;
                }
                const token = await getAccessTokenSilently();
                let userEmail: string | undefined = (user as any)?.email || (user as any)?.['https://example.com/email'] || (user as any)?.sub;
                if (!userEmail) throw new Error("Cannot get user email from Auth0");

                const base = process.env.NEXT_PUBLIC_MESSAGE_SERVICE || 'http://localhost:8085/api';
                const url = `${base}/messages/search/findByUserEmail?user_email=${encodeURIComponent(userEmail)}&page=${currentPage - 1}&size=${messagesPerPage}`;
                const response = await fetch(url, { method: 'GET', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } });
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`API Error: ${response.status} - ${errorText}`);
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
                setHttpError(error.message);
            } finally {
                setIsLoadingMessages(false);
            }
        };
        fetchUserMessages();
        if (typeof window !== 'undefined') window.scrollTo(0, 0);
    }, [user, currentPage]);

    if (isLoadingMessages) return <SpinnerLoading />;
    if (httpError) return (<div className="container m-5"><p>Error: {httpError}</p></div>);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="mt-2">
            {messages.length > 0 ? (
                <>
                    <h5>Your Q/A Messages ({messages.length}):</h5>
                    {messages.map((message) => (
                        <div key={message.id}>
                            <div className="card mt-2 shadow p-3 bg-body rounded">
                                <h5>Case #{message.id}: {message.title}</h5>
                                <h6>From: {message.userEmail}</h6>
                                <p><strong>Question:</strong> {message.question}</p>
                                <hr />
                                <div>
                                    <h5>Response:</h5>
                                    {message.response && message.adminEmail ? (
                                        <>
                                            <h6>Admin: {message.adminEmail}</h6>
                                            <p>{message.response}</p>
                                        </>
                                    ) : (
                                        <p><i>Pending response from administration. Please be patient.</i></p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            ) : (
                <h5>No questions submitted yet. Submit a question to see it here.</h5>
            )}
            {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
            )}
        </div>
    );
}


