import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import API_URI from "../config";
import "../pages/css/problemsPage.css";
import NavBar from "../components/NavBar";
import { Tag } from "antd";


function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const handleTitleClick = (problem) => {
    navigate(`/problem/${problem._id}`);
  };

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get(`${API_URI}/problems`);
        console.log(response);
        setProblems(response.data.data.problems);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch problems." + err.message);
        setLoading(false);
      }
    };

    fetchProblems();
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
    return <div className="mt-10 text-center text-red-500">{error}</div>;
  }

  return (
    user != null ? <div>
      <NavBar className="">
        <div className="header">
          <Link to="/" className="primary">
            Home
          </Link>
        </div>
      </NavBar>
      <div className="table-container">
        <div className="table-header">
          <h1>Problems</h1>
          <Link to="/submissions" className="primary">
            Submissions
          </Link>
        </div>
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Difficulty</th>
                <th>Topics</th>
                <th>Companies</th>
              </tr>
            </thead>
            <tbody>
              {problems?.map((problem) => (
                <tr key={problem._id}>
                  <td onClick={() => handleTitleClick(problem)} style={{ cursor: "pointer" }}>
                    {problem.title}
                  </td>
                  <td>
                    <span>
                      <Tag color={getDifficultyColor(problem.difficulty)}>
                        {problem.difficulty}
                      </Tag>
                    </span>
                  </td>
                  <td>{problem.topics.join(", ")}</td>
                  <td>{problem.companies.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>:<NavBar className="">
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

export default ProblemsPage;
