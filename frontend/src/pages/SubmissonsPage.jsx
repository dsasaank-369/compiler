import { useState, useEffect } from "react";
import axios from "axios";
import API_URI from "../config";
import "./css/submissionsPage.css"; // Import the custom CSS file

function SubmissonsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };

  useEffect(() => {
    const fetchSubmissions = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setErrorMessage("User ID not found in localStorage.");
        return;
      }

      try {

        const response = await axios.get(`${API_URI}/submissions/${userId}`);
        if (response.status === 200) {
          const submissionData = response.data.data.submissions;
          const submissionsWithTitles = submissionData.map((submission) => ({
            ...submission,
            problemTitle: submission.problemId?.title || "Unknown Problem",
          }));
          setSubmissions(submissionsWithTitles);

        } else {
          setErrorMessage("Failed to fetch submissions.");
        }
      } catch (error) {
        setErrorMessage("Failed to fetch submissions. Please try again later.");
      }finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="submissions-container">
      <div className="content-wrapper">
        <h1 className="page-title">Submissions</h1>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="table-wrapper">
          <table className="submissions-table">
            <thead>
              <tr>
                <th>Verdict</th>
                <th>Language</th>
                <th>Problem Title</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission, index) => (
                <tr key={index}>
                  <td
                    className={`verdict ${
                      submission.verdict === "Rejected" 
                        ? "verdict-error"
                        : "verdict-success"
                    }`}
                  >
                    {submission.verdict}
                  </td>
                  <td>{submission.language}</td>
                  <td>{submission.problemTitle || "Unknown Problem"}</td>
                  <td>{formatDate(submission.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SubmissonsPage;
