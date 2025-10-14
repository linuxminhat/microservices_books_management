import React from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import "./App.css";
import { BookCheckoutPage } from "./layouts/BookCheckoutPage/BookCheckoutPage";
import { HomePage } from "./layouts/HomePage/HomePage";
import { Footer } from "./layouts/NavbarAndFooter/Footer";
import { Navbar } from "./layouts/NavbarAndFooter/Navbar";
import { SearchBooksPage } from "./layouts/SearchBooksPage/SearchBooksPage";
import { ShelfPage } from "./layouts/ShelfPage/ShelfPage";
import { MessagesPage } from "./layouts/MessagesPage/MessagesPage";
import { ManageLibraryPage } from "./layouts/ManageLibraryPage/ManageLibraryPage";
import { ReviewListPage } from "./layouts/BookCheckoutPage/ReviewListPage/ReviewListPage";
import { PaymentPage } from "./layouts/PaymentPage/PaymentPage";
import LoginWidget from "./Auth/LoginWidget";
import CallbackPage from "./Auth/CallbackPage";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { SpinnerLoading } from "./layouts/Utils/SpinnerLoading";

export const App = () => {
  const history = useHistory();
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <SpinnerLoading />;
  }

  // 👇 Same concept as Okta's customAuthHandler — if unauthenticated, redirect to /login
  const customAuthHandler = () => {
    history.push("/login");
  };

  // 👇 Equivalent of SecureRoute in Auth0
  const ProtectedRoute = ({ component, ...args }: any) => {
    const Component = withAuthenticationRequired(component, {
      onRedirecting: () => <SpinnerLoading />,
      loginOptions: { appState: { returnTo: window.location.pathname } },
    });
    return <Route component={Component} {...args} />;
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="flex-grow-1">
        <Switch>
          <Route path="/" exact>
            <Redirect to="/home" />
          </Route>

          <Route path="/home">
            <HomePage />
          </Route>

          <Route path="/search">
            <SearchBooksPage />
          </Route>

          <Route path="/reviewlist/:bookId">
            <ReviewListPage />
          </Route>

          <Route path="/checkout/:bookId">
            <BookCheckoutPage />
          </Route>

          {/* Equivalent of Okta’s /login and LoginWidget */}
          <Route path="/login" render={() => <LoginWidget />} />

          {/* Equivalent of Okta's /login/callback */}
          <Route path="/callback">
            <CallbackPage />
          </Route>

          {/* Protected routes (Auth0’s version of SecureRoute) */}
          <ProtectedRoute path="/shelf" component={ShelfPage} />
          <ProtectedRoute path="/messages" component={MessagesPage} />
          <ProtectedRoute path="/admin" component={ManageLibraryPage} />
          <ProtectedRoute path="/fees" component={PaymentPage} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
};
