import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { AddNewBook } from "./components/AddNewBook";
import { AdminMessages } from "./components/AdminMessages";
import { ChangeQuantityOfBooks } from "./components/ChangeQuantityOfBooks";

export const ManageLibraryPage = () => {
  const { isAuthenticated, isLoading, loginWithRedirect, getIdTokenClaims } = useAuth0();

  const [changeQuantityOfBooksClick, setChangeQuantityOfBooksClick] = useState(false);
  const [messagesClick, setMessagesClick] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  function addBookClickFunction() {
    setChangeQuantityOfBooksClick(false);
    setMessagesClick(false);
  }

  function changeQuantityOfBooksClickFunction() {
    setChangeQuantityOfBooksClick(true);
    setMessagesClick(false);
  }

  function messagesClickFunction() {
    setChangeQuantityOfBooksClick(false);
    setMessagesClick(true);
  }

  useEffect(() => {
    const checkRole = async () => {
      if (isLoading) return;
      if (!isAuthenticated) {
        await loginWithRedirect();
        return;
      }
      const claims = await getIdTokenClaims();
  
      const userType =
        (claims && (claims as any)["userType"]) ||
        (claims && (claims as any)["https://your-namespace.com/userType"]) ||
        null;
  
      const roles: string[] =
        ((claims as any)?.["https://example.com/roles"] as string[]) ||
        ((claims as any)?.["roles"] as string[]) || [];
  
      setIsAdmin(userType === "admin" || roles?.includes("admin"));
    };
    checkRole();
  }, [isAuthenticated, isLoading, getIdTokenClaims, loginWithRedirect]);

  if (isLoading || isAdmin === null) return <SpinnerLoading />;

  if (!isAdmin) return <Redirect to="/home" />;

  return (
    <div className="container">
      <h3>Manage Library</h3>
      <nav>
        <div className="nav nav-tabs" id="nav-tab" role="tablist">
          <button
            onClick={addBookClickFunction}
            className="nav-link active"
            id="nav-add-book-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-add-book"
            type="button"
            role="tab"
            aria-controls="nav-add-book"
            aria-selected="false"
          >
            Add new book
          </button>
          <button
            onClick={changeQuantityOfBooksClickFunction}
            className="nav-link"
            id="nav-quantity-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-quantity"
            type="button"
            role="tab"
            aria-controls="nav-quantity"
            aria-selected="true"
          >
            Change quantity
          </button>
          <button
            onClick={messagesClickFunction}
            className="nav-link"
            id="nav-messages-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-messages"
            type="button"
            role="tab"
            aria-controls="nav-messages"
            aria-selected="false"
          >
            Messages
          </button>
        </div>
      </nav>

      <div className="tab-content" id="nav-tabContent">
        <div className="tab-pane fade show active" id="nav-add-book" role="tabpanel" aria-labelledby="nav-add-book-tab">
          <AddNewBook />
        </div>

        <div className="tab-pane fade" id="nav-quantity" role="tabpanel" aria-labelledby="nav-quantity-tab">
          {changeQuantityOfBooksClick ? <ChangeQuantityOfBooks /> : <></>}
        </div>

        <div className="tab-pane fade" id="nav-messages" role="tabpanel" aria-labelledby="nav-messages-tab">
          {messagesClick ? <AdminMessages /> : <></>}
        </div>
      </div>
    </div>
  );
};