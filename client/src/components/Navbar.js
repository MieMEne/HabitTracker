import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h1>Habit Tracker</h1>
      <div>
        <Link to="/">Today</Link>
        <Link to="/overview">Overview</Link>
      </div>
    </nav>
  );
}

export default Navbar;