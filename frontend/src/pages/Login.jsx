import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { message, Input, Button, Popover } from "antd";
import API_URI from "../config";
import  "../pages/css/login.css";

import "@ant-design/v5-patch-for-react-19";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const loginData = { email, password };
    console.log(loginData);

    try {
      const response = await axios.post(`${API_URI}/users/login`, loginData);

      if (response.status === 200) {
        console.log(response);
        const userId = response.data.data.user._id;
        localStorage.setItem("userId", userId);
        navigate("/problems");
        message.success("Login successful!");
      } else {
        setErrorMessage("Login failed. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || "Login failed");
        message.error(errorMessage);
      } else if (error.request) {
        setErrorMessage("No response from server.");
        message.error(errorMessage);
      } else {
        setErrorMessage(error.message);
        message.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="login_content">
        <h2>Login</h2>
        <div>
          <Input
            placeholder="Email"
            value={email}
            style={{ marginBottom: "20px" }}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input.Password
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          New User? <Link to="/signup">Sign up</Link>
        </div>
        <Popover
          content={
            !email || !password ? (
              <>Please fill all the fields</>
            ) : (
              <>Good to click!</>
            )
          }
        >
          <Button
            loading={loading}
            type="primary"
            size="large"
            disabled={!email || !password}
            onClick={handleLogin}
            style={{ color: "white" }}
          >
            Login
          </Button>
        </Popover>
      </div>
    </div>
  );
}

export default Login;
