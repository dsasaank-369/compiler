import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {Input, Button, message, Popover, Checkbox} from 'antd';
import { Link } from 'react-router-dom';


import API_URI from "../config";
import { color } from "@uiw/react-codemirror";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const[loading, setLoading]=useState(false);
  const [role, setRole]=useState("user");

  const navigate = useNavigate();

  const onChecked=(e)=>{
    message.error("Sorry you don't have access to enable!");
    setRole("admin");

    setTimeout(() => {
      setRole("user");
    }, 1000);

  }

  const handleSignUp = async (e) => {

    const userData = { name, email, password, passwordConfirm, role };

    console.log(userData);

    try {
      const response = await axios.post(`${API_URI}/users/signup`, userData);

      if (response.status === 201) {
        navigate("/login");
        message.success("Registered successfully!");
      } else {
        message.error(response.data.ValidationError);
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        
        message.error(`Error: ${error.response.statusText || "Signup failed"}`);
      } else if (error.request) {
        message.error("Error: No response from server.");
      } else {
        message.error(`Error: ${error.message}`);
      }
      
    }finally{
      setLoading(false);
      }
  };

  return (
      <div>
        <div className='login_content'>
            <h4>Register</h4>
            <div>
                <div>
                  <Input placeholder="Name" value={name} style={{marginBottom:`20px`}} onChange={(e) => setName(e.target.value)}/>
                  <Input placeholder="Email" value={email} style={{marginBottom:`20px`}} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                
                <Input placeholder="Password" value={password}  style={{marginBottom:`20px`}} onChange={(e) => setPassword(e.target.value)}/>
                <Input.Password placeholder="Confirm Password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)}/>
            </div>
            <div>Existing User? <Link to="/login">Login</Link></div>
            <Checkbox onChange={onChecked} style={{color:"white"}} checked={role === "admin"} >Admin access?</Checkbox>

            <Popover content={(!name || !email || !passwordConfirm || !password)?<>Please fill all the fields</>:<>Good to click!</>}>
                <Button loading={loading} type="primary" size="large" style={{ color: "white" }} disabled={!name || !email || !passwordConfirm || !password} onClick={handleSignUp}>Register</Button>
            </Popover>
        </div>
    </div>
  );
}

export default SignUp;
