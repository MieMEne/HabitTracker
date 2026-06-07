import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-title">
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