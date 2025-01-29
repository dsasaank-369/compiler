import { useState, useEffect } from "react";
import axios from "axios";
import API_URI from "../config";

function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

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
          // Log the received data to verify
          console.log("Received submissions:", submissionData);
          const submissionsWithTitles = submissionData.map((submission) => ({
            ...submission,
            problemTitle: submission.problemId?.title || "Unknown Problem",
          }));

          setSubmissions(submissionsWithTitles);
        } else {
          setErrorMessage("Failed to fetch submissions.");
        }
      } catch (error) {
        console.error("Error fetching submissions:", error);
        setErrorMessage("Failed to fetch submissions. Please try again later.");
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div className="mx-auto w-10/12 max-w-[1200px] pt-10">
      <h1 className="mb-6 text-center text-4xl font-bold">Submissions</h1>
      {errorMessage && (
        <p className="mb-4 text-center text-red-500">{errorMessage}</p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border text-center">
          <thead>
            <tr className="">
              <th className="border px-4 py-2">Verdict</th>
              <th className="border px-4 py-2">Language</th>
              <th className="border px-4 py-2">Problem Title</th>
              <th className="border px-4 py-2">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission, index) => (
              <tr key={index}>
                <td
                  className={`border px-4 py-2 ${
                    submission.verdict === "wrong answer" ||
                    submission.verdict === "compilation error"
                      ? "text-red-500"
                      : "text-green-500"
                  } font-semibold`}
                >
                  {submission.verdict}
                </td>
                <td className="border px-4 py-2">{submission.language}</td>
                <td className="border px-4 py-2">
                  {submission.problemTitle || "Unknown Problem"}
                </td>
                <td className="border px-4 py-2">
                  {formatDate(submission.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Submissions;
