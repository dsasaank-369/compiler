import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import NavBar from "../components/NavBar";
import "../pages/css/homepage.css";
import { message } from "antd";

function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(false);

  useEffect(() => {
    const userDetails = localStorage.getItem("userId");
    setUser(userDetails);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
    message.success("Logged out successfully!")
  };

  return (
    <div className="bg-gradient-to-tr from-zinc-900 to-slate-900 text-gray-200">
      {user != null ? 
        <NavBar className="">
          <div className="header">
            <Link to="/problems" className="primary">
              Problems
            </Link>
            <Link to="/login" onClick={handleLogout} className="secondary">
              Log out
            </Link>
          </div>
        </NavBar>
       : 
        <NavBar className="">
          <div className="header">
            <Link to="/register" className="primary">
              Register
            </Link>
            <Link to="/login" className="secondary">
              Log in
            </Link>
          </div>
        </NavBar>
      }
    </div>
  );
}

export default HomePage;
