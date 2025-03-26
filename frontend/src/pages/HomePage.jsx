import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "../pages/css/homepage.css";
import compilerImg from "../pages/compiler.png";
import { message } from "antd";

function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(false);

  useEffect(() => {
    const userDetails = localStorage.getItem("userId");
    setUser(!!userDetails); // Converts to true/false
  }, [user]); // ✅ Re-run when `user` state changes

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setUser(false); // ✅ Update state immediately
    message.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="homepage-container">
      {user ? ( // ✅ Use `user` instead of `user != null`
        <>
          <NavBar>
            <div className="header">
              <Link to="/problems" className="primary">
                Problems
              </Link>
              <Link to="/compiler" className="primary">
                Compiler
              </Link>
              <Link to="/login" onClick={handleLogout} className="secondary">
                Log out
              </Link>
            </div>
          </NavBar>
          <div className="content-home">
            <div className="text-content">
              <h1>Online Compiler</h1>
              <p>
                Our online compiler allows you to write, run, and debug code directly from your browser.
                Solve programming problems effortlessly and get instant feedback on your solutions.
                You can also track your previous submissions and performance on the <strong>Submissions</strong> page.
              </p>
              <div className="button-group">
                <Link to="/compiler" className="primary-btn">
                  Try Compiler
                </Link>
                <Link to="/problems" className="secondary-btn">
                  View Problems
                </Link>
              </div>
            </div>
            <div className="image-content">
              <img src={compilerImg} alt="Online Compiler" />
            </div>
          </div>
        </>
      ) : (
        <>
          <NavBar>
            <div className="header">
              <Link to="/signup" className="primary">
                Register
              </Link>
              <Link to="/login" className="secondary">
                Log in
              </Link>
            </div>
          </NavBar>
          <div className="content-wrapper">
            <div className="text-content">
              <h1>Online Compiler</h1>
              <p>
                Our online compiler allows you to write, run, and debug code directly from your browser.
                Solve programming problems effortlessly and get instant feedback on your solutions.
                You can also track your previous submissions and performance on the <strong>Submissions</strong> page.
              </p>
              <div className="button-group">
                <Link to="/compiler" className="primary-btn">
                  Try Compiler
                </Link>
                <Link to="/problems" className="secondary-btn">
                  View Problems
                </Link>
              </div>
            </div>
            <div className="image-content">
              <img src={compilerImg} alt="Online Compiler" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default HomePage;
