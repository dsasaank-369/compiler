import "./css/navbar.css"

function NavBar({ children }) {
  return (
    <div className="navbar">
      {children}
    </div>
  );
}

export default NavBar;
