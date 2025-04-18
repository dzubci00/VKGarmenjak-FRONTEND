import React, { useContext, useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import "./NavLinks.css";

const NavLinks = () => {
  const auth = useContext(AuthContext);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = (e) => {
    e.stopPropagation(); // Sprječava zatvaranje kada klikneš na Admin
    setDropdownOpen((prev) => !prev);
  };

  // Zatvori dropdown ako klikneš bilo gdje izvan njega
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact={true}>
          Naslovnica
        </NavLink>
      </li>
      <li>
        <NavLink to="/players">Igrači</NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/trainings">Trening</NavLink>
        </li>
      )}
      <li>
        <NavLink to="/league">VAL liga</NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/profile/${auth.userId}`}>Profil</NavLink>
        </li>
      )}

      {auth.isLoggedIn && auth.isAdmin && (
        <li
          className={`dropdown ${isDropdownOpen ? "open" : ""}`}
          ref={dropdownRef}
        >
          <span to="#" className="dropdown-toggle" onClick={toggleDropdown}>
            Admin <span className="caret"></span>
          </span>
          {isDropdownOpen && (
            <ul className="dropdown-menu">
              <li onClick={() => setDropdownOpen(false)}>
                <NavLink to="/admin/trainings">🏊 Treninzi</NavLink>
              </li>

              <li onClick={() => setDropdownOpen(false)}>
                <NavLink to="/admin/membership">💳 Članarine</NavLink>
              </li>
              <li onClick={() => setDropdownOpen(false)}>
                <NavLink to="/admin/tournaments">🏆 Turniri</NavLink>
              </li>
              <li onClick={() => setDropdownOpen(false)}>
                <NavLink to="/admin/matches">⚽ Utakmice</NavLink>
              </li>
              <li onClick={() => setDropdownOpen(false)}>
                <NavLink to="/admin/players">👤 Korisnici</NavLink>
              </li>
              {/*  <li onClick={() => setDropdownOpen(false)}>
                <NavLink to="/admin/statistics">📊 Statistika</NavLink>
              </li> */}
              {/* <li onClick={() => setDropdownOpen(false)}>
                <NavLink to="/admin/settings">⚙️ Postavke</NavLink>
              </li> */}
            </ul>
          )}
        </li>
      )}

      {!auth.isLoggedIn && (
        <li className="icon">
          <NavLink to="/auth">
            <svg
              className="feather feather-user"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </NavLink>
        </li>
      )}

      {auth.isLoggedIn && (
        <li className="icon">
          <svg
            onClick={auth.logout}
            className="feather feather-log-out"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
          </svg>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
