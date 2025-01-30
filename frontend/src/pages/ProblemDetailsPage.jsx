import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import API_URI from "../config.js";
import CodeEditor from "../components/CodeEditor.jsx";
import TestCases from "../components/TestCases.jsx";
import "./css/ProblemDetailsPage.css";
import { Tag } from "antd";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import NavBar from "../components/NavBar";

function ProblemDetailsPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("java");
  const [value, setValue] = useState(`import java.util.*;

public class HelloWorld {
  public static void main(String[] args) {
    System.out.println("Hello World");
  }
}`);
  const [input, setInput] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const navigate = useNavigate();
  const [user, setUser] = useState(false);

  useEffect(() => {
    const userDetails = localStorage.getItem("userId");
    setUser(userDetails);
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "green";
      case "medium":
        return "orange";
      case "hard":
        return "red";
      default:
        return "gray";
    }
  };

  useEffect(() => {
    const fetchProblemDetails = async () => {
      try {
        const response = await axios.get(`${API_URI}/problems/${id}`);
        setProblem(response.data.data.problem);
      } catch (err) {
        console.error("Error fetching problem details:", err);
        setError("Failed to fetch problem details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProblemDetails();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return user != null ? (
    <>
      <NavBar className="">
        <div className="header">
          <Link to="/submissions" className="primary">
            Submissions
          </Link>
          <Link to="/" className="primary">
            Home
          </Link>
        </div>
      </NavBar>
      <div className="main-container">
        {problem && (
          <div id="problem-details">
            <h1>{problem.title}</h1>
            <p>{problem.description}</p>
            <div className="problem-metadata">
              <span>
                Difficulty:{" "}
                <Tag color={getDifficultyColor(problem.difficulty)}>
                  {problem.difficulty}
                </Tag>
              </span>
            </div>
            <div className="problem-topics">
              <h3>Topics:</h3>
              <div className="topics-container">
                {problem.topics.map((topic, index) => (
                  <span key={index} className="topic-badge">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
            <div className="problem-hints">
              <h3 onClick={toggleDropdown} className="dropdown-header">
                Hints{" "}
                {isOpen ? <FaCaretUp size={16} /> : <FaCaretDown size={16} />}
              </h3>
              {isOpen && (
                <ul className="hints-list">
                  {problem.hints.map((hint, index) => (
                    <li key={index} className="hint-item">
                      {hint}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="problem-examples">
              <h3 className="examples-header">Examples:</h3>
              {problem.examples.map((example) => (
                <div key={example._id} className="example-block">
                  <p className="example-input">
                    <strong>Input:</strong> {example.input}
                  </p>
                  <p className="example-output">
                    <strong>Output:</strong> {example.output}
                  </p>
                  {example.explanation && (
                    <p className="example-explanation">
                      <strong>Explanation:</strong> {example.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="problem-constraints">
              <h3>Constraints:</h3>
              <ul>
                {problem.constraints.map((constraint, index) => (
                  <li key={index}>{constraint}</li>
                ))}
              </ul>
            </div>

            <div className="problem-companies">
              <h3>Companies:</h3>
              <div className="companies-container">
                {problem.companies.map((company, index) => (
                  <span key={index} className="company-badge">
                    {company}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="code-test-section">
          <div className="code-editor-container">
            <CodeEditor
              language={language}
              onChangeLanguage={setLanguage}
              value={value}
              onChangeValue={setValue}
            />
          </div>
          <div className="test-cases-container">
            <TestCases
              id={id}
              value={value}
              language={language}
              input={input}
              onChangeInput={setInput}
            />
          </div>
        </div>
      </div>
    </>
  ) : (
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
  );
}

export default ProblemDetailsPage;
