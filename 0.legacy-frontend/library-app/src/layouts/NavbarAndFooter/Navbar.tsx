import { Link, NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { useEffect } from "react";

export const Navbar = () => {
  const { isLoading, isAuthenticated, user, loginWithRedirect, logout } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("=== AUTH0 DEBUG ===");
      console.log("Full user object:", user);
      console.log("User email:", user.email);
      console.log("Roles from custom claim:", user?.["https://example.com/roles"]);
      console.log("All user keys:", Object.keys(user));
      console.log("==================");
    }
  }, [isAuthenticated, user]);

  if (isLoading) {
    return <SpinnerLoading />;
  }

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  const isAdmin =
    (user?.["userType"] === "admin") ||
    (user?.["https://your-namespace.com/userType"] === "admin") ||
    ((user?.["https://example.com/roles"] as string[])?.includes?.("admin") ?? false);

  return (
    <nav className='navbar navbar-expand-lg navbar-dark main-color py-3'>
      <div className='container-fluid'>
        <Link className='navbar-brand' to='/home'>
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
              <NavLink className='nav-link' to='/home'>Home</NavLink>
            </li>
            <li className='nav-item'>
              <NavLink className='nav-link' to='/search'>Search Books</NavLink>
            </li>
            {isAuthenticated &&
              <li className='nav-item'>
                <NavLink className='nav-link' to='/shelf'>Shelf</NavLink>
              </li>
            }
            {isAuthenticated &&
  <li className='nav-item'>
    <NavLink className='nav-link' to='/messages'>Messages</NavLink>
  </li>
}
            {isAuthenticated && isAdmin &&
              <li className='nav-item'>
                <NavLink className='nav-link' to='/admin'>Admin</NavLink>
              </li>
            }
            
          </ul>
          <ul className='navbar-nav ms-auto'>
            {!isAuthenticated ?
              <li className='nav-item m-1'>
                <button
                  type='button'
                  className='btn btn-outline-light'
                  onClick={() => loginWithRedirect()}
                >
                  Sign in
                </button>
              </li>
              :
              <li>
                <button className='btn btn-outline-light' onClick={handleLogout}>
                  Logout
                </button>
              </li>
            }
          </ul>
        </div>
      </div>
    </nav>
  );
};