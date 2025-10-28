'use client';

import { useUser } from "@auth0/nextjs-auth0/client";
import { useState } from "react";

export default function PostNewMessage() {
    const { user } = useUser();
    const [title, setTitle] = useState("");
    const [question, setQuestion] = useState("");
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    const getAccessTokenSilently = async () => {
        const res = await fetch('/api/auth/token');
        if (!res.ok) return '';
        const data = await res.json();
        return data.accessToken || data.idToken || '';
    };

    async function submitNewQuestion() {
        try {
            if (!user) return;
            if (title.trim() === "" || question.trim() === "") {
                setDisplayWarning(true);
                setDisplaySuccess(false);
                return;
            }
            const token = await getAccessTokenSilently();
            let userEmail: string | undefined = (user as any)?.email || (user as any)?.['https://example.com/email'] || (user as any)?.sub;
            const base = process.env.NEXT_PUBLIC_MESSAGE_SERVICE || 'http://localhost:8085/api';
            const url = `${base}/messages/secure/add/message`;
            const messageRequestModel = { title, question, userEmail };
            const requestOptions: RequestInit = { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(messageRequestModel) };
            const response = await fetch(url, requestOptions);
            if (!response.ok) throw new Error("Something went wrong!");
            setTitle("");
            setQuestion("");
            setDisplayWarning(false);
            setDisplaySuccess(true);
        } catch (error) {
            setDisplayWarning(true);
            setDisplaySuccess(false);
        }
    }

    return (
        <div className="card mt-3">
            <div className="card-header">Ask a question to Luv 2 Read Admin</div>
            <div className="card-body">
                <form method="POST">
                    {displayWarning && (
                        <div className="alert alert-danger" role="alert">
                            All fields must be filled out
                        </div>
                    )}
                    {displaySuccess && (
                        <div className="alert alert-success" role="alert">
                            Question added successfully
                        </div>
                    )}
                    <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input type="text" className="form-control" placeholder="Title" onChange={(e) => setTitle(e.target.value)} value={title} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Question</label>
                        <textarea className="form-control" rows={3} onChange={(e) => setQuestion(e.target.value)} value={question}></textarea>
                    </div>
                    <div>
                        <button type="button" className="btn btn-primary mt-3" onClick={submitNewQuestion}>
                            Submit Question
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


