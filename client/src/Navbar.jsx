import { useNavigate } from "react-router-dom";
import todoLogo from "./assets/todoLogo.png";
import userIcon from "./assets/user-icon.svg";
import { useState, useEffect, useRef } from "react";
import {Link} from 'react-router-dom';
export default function Navbar() {
    const [open, setOpen] = useState(false);
     const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const username = sessionStorage.getItem("username")
   const isLoggedIn = !!username;
    useEffect(() => {
    
  }, []);
  const handleLogout = () => {
    console.log("Hai hi hu");
    sessionStorage.clear(); // remove token/username
    setOpen(false);
    navigate("/login"); // redirect to login page
  };

  return (
    <div className="navbar">
      <div className="logo">
         <img className="title-logo" src={todoLogo}></img>TaskFlow
      </div>
      <div className="nav-right" ref={dropdownRef}>
        {isLoggedIn && <span className="username">{username || null}</span>}
        <div className="dropdown">
        <button className="userBtn" type="button" aria-expanded="false" onClick={() => setOpen(!open)}>
          <img src={userIcon}></img>
        </button>
        {open && (
          <ul className="dropdown-menu show">
            {isLoggedIn ? (
              <li className="dropdown-item" onClick={handleLogout}>
                Logout
              </li>
            ) : (
              <li><Link to="/login" className="dropdown-item" onClick={() => setOpen(false)}>
                Login
              </Link></li>
            )}
          </ul>
        )}
      </div>
      </div>

    </div>
  );
}