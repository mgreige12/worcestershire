import { Routes, Route } from "react-router-dom";
import WelcomePage from "../pages/WelcomePage";
import QuestionCard from "../pages/QuestionCard";
import ResultsPage from "../pages/ResultsPage";
import PracticeHome from "../pages/PracticeHome";
import CategoryPracticePage from "../pages/CategoryPracticePage";
import Sidebar from "../components/Sidebar";

function App() {
  return (
    <>
      <Sidebar />

      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/assessment" element={<QuestionCard />} />
        <Route path="/practice" element={<PracticeHome />} />
        <Route path="/practice/:category" element={<CategoryPracticePage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </>
  );
}

export default App;