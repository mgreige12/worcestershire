import { useState, useEffect } from "react";
import { useAssessment } from "../features/assessment/assessmentProvider";
import { averageScore } from "../features/soundSystems/scoring";
import Confetti from "react-confetti";
import {
    SOUND_SYSTEMS,
    type GraphemePhonemeScores,
} from "../features/soundSystems/soundSystems";
import brownGrid from "../../public/brownGrid.png";
import smiski from "../../public/smiskiGarden.png";




function combineScores(
    generalScores: GraphemePhonemeScores,
    targetedScores: GraphemePhonemeScores
): GraphemePhonemeScores {
    const combinedScores = generalScores.map((score) => ({ ...score }));

    for (const targetedScore of targetedScores) {
        const matchingScore = combinedScores.find(
            (score) =>
                score.grapheme === targetedScore.grapheme &&
                score.phoneme === targetedScore.phoneme
        );

        if (matchingScore) {
            matchingScore.score += targetedScore.score;
            matchingScore.count += targetedScore.count;
        } else {
            combinedScores.push({ ...targetedScore });
        }
    }

    return combinedScores;
}

function formatPercentage(percent: number | null): string {
    return percent === null ? "—" : `${percent.toFixed(2)}%`;
}

function ResultsPage() {
    const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    const [openCategory, setOpenCategory] = useState<number | null>(null);
    const { scoresBySystem, scoresByGrapheme } = useAssessment();

    const results = SOUND_SYSTEMS.map((system) => {
        const targetedScores = Object.entries(scoresByGrapheme)
            .filter(([key]) => key.startsWith(`${system.id}:`))
            .flatMap(([, scores]) => scores);
        const scores = combineScores(scoresBySystem[system.id], targetedScores);
        const detectedScores = scores.filter((score) => score.count > 0);
        const totalScore = detectedScores.reduce(
            (sum, score) => sum + (averageScore(score) ?? 0),
            0
        );

        return {
            category: system.label,
            percent: detectedScores.length
                ? totalScore / detectedScores.length
                : null,
            details: scores.map((score) => ({
                name: `${score.grapheme} /${score.phoneme}/`,
                percent: averageScore(score),
            })),
        };
    });

    const sortedResults = [...results].sort(
        (a, b) => (a.percent ?? -1) - (b.percent ?? -1)
    );

    const toggleCategory = (index: number) => {
        setOpenCategory(openCategory === index ? null : index);
    };

    return (
        <main
            className="relative min-h-screen flex items-center justify-center px-6 py-10 text-[#333333]"
            style={{ backgroundImage: `url(${brownGrid})` }}
        >
           <Confetti
            width={windowSize.width}
            height={windowSize.height}
            numberOfPieces={300}
            recycle={false}
        />

            {/* Results Paper */}
            <div className="w-[90%] max-w-6xl min-h-[75vh] bg-white rounded-lg shadow-lg px-12 py-10">

                <div className="mb-10">
                    <p className="text-sm text-[#7aa94c] font-semibold tracking-wide">
                        ASSESSMENT COMPLETE
                    </p>

                    <h1 className="text-5xl font-semibold mt-2">
                        The Results !
                    </h1>

                    
                </div>

                <div className="flex flex-col">
                    {sortedResults.map((result, index) => (
                        <div
                            key={result.category}
                            className="border-b-2 border-dashed border-[#d8d1c5]"
                        >

                            {/* Main clickable category */}
                            <button
                                onClick={() => toggleCategory(index)}
                                className="w-full flex items-center justify-between py-6 cursor-pointer group"
                            >
                                <div className="flex items-center gap-5">

                                    <span className="text-2xl font-semibold text-[#7aa94c]">
                                        {index + 1})
                                    </span>

                                    <span className="text-3xl font-semibold group-hover:text-[#7aa94c] transition">
                                        {result.category}
                                    </span>

                                </div>

                                <div className="flex items-center gap-4">

                                    {/* Percent pill */}
                                    <span className="bg-[#e8efd9] text-[#5f7f38] px-4 py-2 rounded-full text-xl font-semibold">
                                        {formatPercentage(result.percent)}
                                    </span>

                                    <span
                                        className={`text-xl transition-transform ${
                                            openCategory === index
                                                ? "rotate-180"
                                                : ""
                                        }`}
                                    >
                                       ⌄
                                    </span>

                                </div>
                            </button>

                            {/* Dropdown */}
                            {openCategory === index && (
                                <div className="pb-7 ml-12">

                                    {/* Regular categories */}
                                    {result.details && (
                                        <ul className="flex flex-col gap-3">
                                            {[...result.details]
                                                .sort(
                                                    (a, b) =>
                                                        (a.percent ?? -1) - (b.percent ?? -1)
                                                )
                                                .map((detail) => (
                                                    <li
                                                        key={detail.name}
                                                        className="flex items-center justify-between max-w-2xl text-lg"
                                                    >
                                                        <div className="flex items-center gap-3 text-gray-600">

                                                            <span className="text-[#7aa94c]">
                                                                •
                                                            </span>

                                                            <span>
                                                                {detail.name}
                                                            </span>

                                                        </div>

                                                        <span className="text-gray-500 font-medium">
                                                            {formatPercentage(detail.percent)}
                                                        </span>
                                                    </li>
                                                ))}
                                        </ul>
                                    )}

                                </div>
                            )}

                        </div>
                    ))}
                </div>

            </div>

            {/* Smiski */}
            <img
                src={smiski}
                className="absolute right-[2vw] bottom-[1vh] w-[clamp(200px,15vw,300px)]"
            />

        </main>
    );
}

export default ResultsPage;