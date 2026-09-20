import { Routes, Route } from "react-router-dom";

import WelcomePage from "./components/WelcomePage";
import QuestionCard from "./components/QuestionCard";
import ResultsPage from "./components/ResultsPage";
import PracticeHome from "./components/PracticeHome";
import CategoryPracticePage from "./components/CategoryPracticePage";
import Sidebar from "./components/Sidebar";

function App() {
    return (
        <>
            {/* Sidebar stays visible on every page */}
            <Sidebar />

            <Routes>
                {/* Home */}
                <Route
                    path="/"
                    element={<WelcomePage />}
                />

                {/* Assessment */}
                <Route
                    path="/assessment"
                    element={<QuestionCard />}
                />

                {/* Practice Home */}
                <Route
                    path="/practice"
                    element={<PracticeHome />}
                />

                {/* Specific Practice Category */}
                <Route
                    path="/practice/:category"
                    element={<CategoryPracticePage />}
                />

                {/* Results */}
                <Route
                    path="/results"
                    element={<ResultsPage />}
                />
            </Routes>
        </>
    );
}

export default App;