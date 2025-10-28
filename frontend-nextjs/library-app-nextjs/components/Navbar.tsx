'use client';

import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { usePathname, useRouter } from 'next/navigation';
import { SpinnerLoading } from './Utils/SpinnerLoading';
import { useEffect, useState } from 'react';

export const Navbar = () => {
    const { user, error, isLoading } = useUser();
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout');
        router.push('/');
    };

    if (isLoading) {
        return <SpinnerLoading />;
    }

    const isAdmin = user?.["userType"] === "admin" ||
        user?.["https://your-namespace.com/userType"] === "admin" ||
        ((user?.["https://example.com/roles"] as string[])?.includes?.("admin") ?? false);

    const isActive = (path: string) => pathname === path ? 'active' : '';

    return (
        <nav className='navbar navbar-expand-lg navbar-dark main-color py-3'>
            <div className='container-fluid'>
                <Link className='navbar-brand' href='/home'>
                    CFC Books
                </Link>
                <button className='navbar-toggler' type='button'
                    data-bs-toggle='collapse' data-bs-target='#navbarNavDropdown'
                    aria-controls='navbarNavDropdown' aria-expanded='false'
                    aria-label='Toggle Navigation'
                >
                    <span className='navbar-toggler-icon'></span>
                </button>
                <div className='collapse navbar-collapse' id='navbarNavDropdown'>
                    <ul className='navbar-nav'>
                        <li className='nav-item'>
                            <Link className={`nav-link ${isActive('/home')}`} href='/home'>
                                Home
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link className={`nav-link ${isActive('/search')}`} href='/search'>
                                Search Books
                            </Link>
                        </li>
                        {user && (
                            <>
                                <li className='nav-item'>
                                    <Link className={`nav-link ${isActive('/shelf')}`} href='/shelf'>
                                        Shelf
                                    </Link>
                                </li>
                                <li className='nav-item'>
                                    <Link className={`nav-link ${isActive('/messages')}`} href='/messages'>
                                        Messages
                                    </Link>
                                </li>
                                {isAdmin && (
                                    <li className='nav-item'>
                                        <Link className={`nav-link ${isActive('/admin')}`} href='/admin'>
                                            Admin
                                        </Link>
                                    </li>
                                )}
                            </>
                        )}
                    </ul>
                    <ul className='navbar-nav ms-auto'>
                        {!user ? (
                            <li className='nav-item m-1'>
                                <a className='btn btn-outline-light' href='/api/auth/login'>
                                    Sign in
                                </a>
                            </li>
                        ) : (
                            <li>
                                <button className='btn btn-outline-light' onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};