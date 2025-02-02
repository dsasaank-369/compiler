import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {Input } from "antd";
import API_URI from "../config";
import "../pages/css/compiler.css";
import CodeEditor from "../components/CodeEditor";
import NavBar from "../components/NavBar";

function Compiler() {
  const [language, setLanguage] = useState("java");
  const [input, setInput] = useState("");
  const [value, setValue] = useState(`import java.util.*;

        public class HelloWorld {
          public static void main(String[] args) {
            System.out.println("Hello World");
          }
        }`);
  const [output, setOutput] = useState("Output:");
  const [isLoading, setIsLoading] = useState(false);

  const runCode = async () => {
    try {
      const response = await axios.post(`${API_URI}/users/run`, {
        code: value,
        input: input,
        language: language,
      });

      console.log(response.data.output);
      setOutput(response.data.output);

      console.log("Compilation result:", response.data);
    } catch (error) {
      console.error("Error during code execution:", error);
      setOutput(error.response.data.stack);
    }
  };

  return (
    <>
    <NavBar>
        <div className="header">
          <Link to="/" className="primary">
            Home
          </Link>
        </div>
    </NavBar>
      <div className="compiler-body">
        <h1>Have fun!</h1>
        <div className="main-compiler">
          <CodeEditor
            language={language}
            onChangeLanguage={setLanguage}
            value={value}
            onChangeValue={setValue}
          />
          <div className="test-cases-container">
            {output !== "Output:" ? (
              <div className="output-block">
                <strong>Output: </strong> <pre>{output}</pre>
              </div>
            ) : (
              <div className="output-block">
                <strong>Output: </strong>{" "}
                <pre style={{ color: "gray" }}>// Output will display here</pre>
              </div>
            )}
            <div className="buttons-section">
              <button onClick={runCode} className="">
                {isLoading ? "Running..." : "Run"}
              </button>
            </div>
            <div className="input-section">
              <Input
                type="text"
                className=""
                value={input}
                placeholder="Input your test cases here"
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Compiler;
