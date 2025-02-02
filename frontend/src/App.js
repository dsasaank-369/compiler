import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import ProblemsPage from "./pages/ProblemsPage.jsx"
import SubmissonsPage from "./pages/SubmissonsPage.jsx";
import ProblemDetailsPage from "./pages/ProblemDetailsPage.jsx";
import Compiler from "./pages/Compiler.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/problems" element={<ProblemsPage />} />
        <Route path="/problem/:id" element={<ProblemDetailsPage />} />
        <Route path="/submissions" element={<SubmissonsPage />} />
        <Route path="/compiler" element={<Compiler/>} />

      </Routes>
    </Router>
  );
}

export default App;