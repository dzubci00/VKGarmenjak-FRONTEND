import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import "./Footer.css";
import FacebookIcon from "@mui/icons-material/Facebook";
import { AuthContext } from "../../context/auth-context";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Footer = () => {
  const auth = useContext(AuthContext);
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Info o klubu */}
        <div className="footer-section">
          <h3>VK Garmenjak</h3>
          <p>Obala tamarisa 6, 23262 Pašman</p>
          <p>Email: info@garmenjak.hr</p>
          <p>Telefon: +385 XX XXX XXXX</p>
        </div>

        {/* Brzi linkovi */}
        <div className="footer-section">
          <h3>Brzi linkovi</h3>
          <ul>
            <li>
              <NavLink to="/" exact>
                Naslovnica
              </NavLink>
            </li>
            <li>
              <NavLink to="/players">Igrači</NavLink>
            </li>
            {auth.isLoggedIn && (
              <li>
                <NavLink to={`/trainings`}>Trening</NavLink>
              </li>
            )}

            <li>
              <NavLink to={`/league`}>VAL liga</NavLink>
            </li>

            {auth.isLoggedIn && (
              <li>
                <NavLink to={`/profile/${auth.userId}`}>Profil</NavLink>
              </li>
            )}
            {auth.isLoggedIn && auth.isAdmin && (
              <li>
                <NavLink to="/places/new">Admin</NavLink>
              </li>
            )}
          </ul>
        </div>

        {/* Društvene mreže */}
        <div className="footer-section">
          <h3>Pratite nas</h3>
          <div className="social-icons">
            <a
              href="https://www.facebook.com/vkgarmenjak"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookIcon style={{ fontSize: 30 }} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>
          © 2025 VK Garmenjak. Sva prava pridržana.
          {/* <a href="/privacy">Politika privatnosti</a> */}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
