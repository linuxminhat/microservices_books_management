import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import { BrowserRouter } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Auth0Provider } from '@auth0/auth0-react';

const stripePromise = loadStripe('<STRIPE PROMISE>');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter>
    <Auth0Provider
      domain="dev-duedowvrhmjgcagi.jp.auth0.com"
      clientId="pqpr0xwrGMnEyTu0fXpBUv2Ns4l39Jvb"
      authorizationParams={{
        redirect_uri: window.location.origin + '/callback'
        // ❌ XÓA dòng audience!
      }}
      cacheLocation="localstorage"
    >
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </Auth0Provider>
  </BrowserRouter>
);