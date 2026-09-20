import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import WelcomePage from "./components/WelcomePage";
import QuestionCard from "./components/QuestionCard";
import ResultsPage from "./components/ResultsPage";
import PracticeHome from "./components/PracticeHome";
import CategoryPracticePage from "./components/CategoryPracticePage";
import Sidebar from "./components/Sidebar";
import { preloadImages } from "./assets/images";

function App() {
    const [imagesReady, setImagesReady] = useState(false);

    useEffect(() => {
        let cancelled = false;

        preloadImages().then(() => {
            if (!cancelled) {
                setImagesReady(true);
            }
        });

        return () => {
            cancelled = true;
        };
    }, []);

    if (!imagesReady) {
        return (
            <main className="min-h-screen flex items-center justify-center text-[#333333] text-2xl">
                Loading...
            </main>
        );
    }

    return (
        <>
            <Sidebar />

            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/assessment" element={<QuestionCard />} />
                <Route path="/practice" element={<PracticeHome />} />
                <Route
                    path="/practice/:category"
                    element={<CategoryPracticePage />}
                />
                <Route path="/results" element={<ResultsPage />} />
            </Routes>
        </>
    );
}

export default App;
