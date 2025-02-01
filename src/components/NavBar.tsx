import "../styles/NavBar.css";
import { FaPlus, FaReddit, FaUser } from "react-icons/fa";
import { SignIn, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated } from "convex/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import CreateDropDown from "./CreateDropDown";

const NavBar = () => {
  const [showDropDown, setShowDropDown] = useState(false);

  // Clerk hook
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="logo-link">
          <div className="logo-container">
            <FaReddit className="reddit-icon" />
            <span className="site-name">reddit</span>
          </div>
        </Link>

        <div>Search Bar</div>

        <div className="nav-actions">
          <Unauthenticated>
            <SignInButton mode="modal">
              <button className="sign-in-button"> Sign In</button>
            </SignInButton>
          </Unauthenticated>

          <Authenticated>
            <div className="dropdown-container">
              <button className="icon-button" onClick={() => {setShowDropDown(!showDropDown)}}>
                <FaPlus />
              </button>
              {showDropDown && (
                <CreateDropDown
                  isOpen={showDropDown}
                  onClose={() => setShowDropDown(false)}
                />
              )}
            </div>

            <button
              className="icon-button"
              onClick={() => user?.username && navigate(`/u/${user.username}`)}
              title="View Profile"
            >
              <FaUser />
            </button>

            <UserButton />
          </Authenticated>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
