'use client';
import { redirect } from 'next/navigation';

//default home redirect
export default function RootPage() {
    redirect('/home');
}
