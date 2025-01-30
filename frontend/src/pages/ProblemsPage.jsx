import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import API_URI from "../config";
import "../pages/css/problemsPage.css";
import NavBar from "../components/NavBar";
import { Tag, Modal, Input, Button, Select, Form } from "antd";

function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdding, setisAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [topics, setTopics] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [hints, setHints] = useState([]);
  const [constraints, setConstraints] = useState([]);
  const [timeLimit, setTimeLimit] = useState("");
  const [examples, setExamples] = useState([]);


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

  const handleAddExample = () => {
    setExamples([...examples, { input: "", output: "", explanation: "" }]);
  };

  const handleRemoveExample = (index) => {
    const updatedExamples = examples.filter((_, i) => i !== index);
    setExamples(updatedExamples);
  };

  const handleExampleChange = (index, field, value) => {
    const updatedExamples = [...examples];
    updatedExamples[index][field] = value;
    setExamples(updatedExamples);
  };

  const hanldeSubmitTask = async () => {
    try {
      const data = {
        title,
        description,
        difficulty,
        topics,
        companies,
        hints,
        examples,
        constraints,
        timeLimit,
      };
      const response = await axios.post(`${API_URI}/problems`, data);
      console.log(response);
      setProblems(response.data.data.problems);
      setisAdding(false);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch problems." + err.message);
      setLoading(false);
    }
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
  }, [problems]);

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

  return user != null ? (
    <div>
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
          <Button onClick={() => setisAdding(true)} type="primary" size="large">
            Add Problem
          </Button>
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
                  <td
                    onClick={() => handleTitleClick(problem)}
                    style={{ cursor: "pointer" }}
                  >
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

      <Modal
        confirmLoading={loading}
        title="Add New Problem"
        open={isAdding}
        onOk={hanldeSubmitTask}
        onCancel={() => setisAdding(false)}
      >
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></Input>
        <Input.TextArea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{ marginTop: 10 }}
        />

        <Select
          value={difficulty}
          onChange={setDifficulty}
          style={{ width: "100%", marginTop: 10 }}
        >
          <Select.Option value="easy">Easy</Select.Option>
          <Select.Option value="medium">Medium</Select.Option>
          <Select.Option value="hard">Hard</Select.Option>
        </Select>

        <Input
          placeholder="Topics (comma-separated)"
          value={topics.join(", ")}
          onChange={(e) =>
            setTopics(e.target.value.split(",").map((t) => t.trim()))
          }
          style={{ marginTop: 10 }}
        />

        <Input
          placeholder="Companies (comma-separated)"
          value={companies.join(", ")}
          onChange={(e) =>
            setCompanies(e.target.value.split(",").map((c) => c.trim()))
          }
          style={{ marginTop: 10 }}
        />

        <Input
          placeholder="Hints (comma-separated)"
          value={hints.join(", ")}
          onChange={(e) =>
            setHints(e.target.value.split(",").map((h) => h.trim()))
          }
          style={{ marginTop: 10 }}
        />

        <Input.TextArea
          placeholder="Constraints (comma-separated)"
          value={constraints.join(", ")}
          onChange={(e) =>
            setConstraints(e.target.value.split(",").map((c) => c.trim()))
          }
          rows={2}
          style={{ marginTop: 10 }}
        />
        <Form.Item label="Examples">
          {examples.map((example, index) => (
            <div
              key={index}
              style={{
                marginBottom: 10,
                padding: 10,
                border: "1px solid #ddd",
                borderRadius: 5,
              }}
            >
              <Input
                placeholder="Input"
                value={example.input}
                onChange={(e) =>
                  handleExampleChange(index, "input", e.target.value)
                }
                style={{ marginBottom: 5 }}
              />
              <Input
                placeholder="Output"
                value={example.output}
                onChange={(e) =>
                  handleExampleChange(index, "output", e.target.value)
                }
                style={{ marginBottom: 5 }}
              />
              <Input.TextArea
                placeholder="Explanation (optional)"
                value={example.explanation}
                onChange={(e) =>
                  handleExampleChange(index, "explanation", e.target.value)
                }
                rows={2}
              />
              {examples.length > 1 && (
                <Button
                  type="link"
                  danger
                  onClick={() => handleRemoveExample(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button
            type="dashed"
            onClick={handleAddExample}
            style={{ marginTop: 5, width: "100%" }}
          >
            + Add Example
          </Button>
        </Form.Item>

        <Input
          type="number"
          placeholder="Time Limit (ms)"
          value={timeLimit}
          onChange={(e) => setTimeLimit(Number(e.target.value))}
          style={{ marginTop: 10 }}
        />
      </Modal>
    </div>
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

export default ProblemsPage;
