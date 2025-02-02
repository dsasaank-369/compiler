import { useState } from "react";
import axios from "axios";
import API_URI from "../config";
import { message } from "antd";
import "./css/testCases.css";

function TestCases({ id, value, language, input, onChangeInput }) {
  const [output, setOutput] = useState("Output:");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const runCode = async () => {
    setOutput("Running...")
    try {
      const response = await axios.post(`${API_URI}/users/run`, {
        code: value,
        problemId: id,
        input: input,
        language: language,
      });

      console.log(response.data.output);
      setOutput(response.data.output);

      console.log("Compilation result:", response.data);
    } catch (error) {
      console.error("Error during code execution:", error);
      setOutput( error.response.data.stack);
    }
  };

  const submitCode = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      let userId;
      if(localStorage.getItem("userId"))  userId = localStorage.getItem("userId");
      
      console.log(userId+"response");

      if (!userId) {
        setErrorMessage("User ID not found. Please log in again.");
        return;
      }

      const response = await axios.post(`${API_URI}/users/submitCode`, {
        code: value,
        problemId: id,
        language,
        userId,
        input
      });

      console.log(response+" Response");
      

      const verdict = response?.data?.data?.submission?.verdict;
      console.log(response.verdict+"Verdict");

      if (verdict) {
        setOutput(verdict);
      } else {
        setErrorMessage("Unexpected response structure.");
      }
    }
    catch (error) {
      console.error("Error during submission:", error);
      setOutput( "Error during submission");
      // return next(new AppError(`Submission failed: ${error.message}`, 500));
  }
     finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="test-cases-container">
      {output!=='Output:' ? (
        <div className="output-block">
          <strong>Output: </strong> <pre>{output}</pre>
        </div>
      ):
      <div className="output-block">
          <strong>Output: </strong> <pre>Output will display here</pre>
        </div>
      }
      <div className="buttons-section">
        <button
          onClick={runCode}
          className=""
        >
          Run
        </button>
        <button
          onClick={submitCode}
          className=""
          disabled={isLoading}
        >
          {isLoading ? "..." : "Submit"}
        </button>
      </div>
      {errorMessage && <p className="mt-2 text-red-500">{errorMessage}</p>}
      <div className="input-section">
        <input
          type="text"
          className=""
          value={input}
          placeholder="Input your test cases here"
          onChange={(e) => onChangeInput(e.target.value)}
        />
      </div>
    </div>
  );
}

export default TestCases;
