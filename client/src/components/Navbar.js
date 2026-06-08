import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-title">
        <img
          src="http://localhost:3001/logo/Logo.svg"
          alt="Habit Tracker Logo"
          className="navbar-logo"
        />
        Habit Tracker
      </NavLink>
      <div className="nav-links">
        <NavLink
          to="/"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          Today
        </NavLink>
        <NavLink
          to="/overview"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          Overview
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;