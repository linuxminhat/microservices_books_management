import { handleAuth, handleLogin, handleLogout, handleCallback } from '@auth0/nextjs-auth0';

const authHandler = handleAuth({
    login: handleLogin({
        returnTo: '/home',
    }),
    logout: handleLogout({
        returnTo: '/',
    }),
    callback: handleCallback(),
});

export const GET = authHandler;
export const POST = authHandler;

