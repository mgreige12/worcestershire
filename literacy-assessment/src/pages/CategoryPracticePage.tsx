import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useAssessment } from "../features/assessment/assessmentProvider";
import brownGrid from "../../public/brownGrid.png";
import { practiceCategories } from "../data/practiceCategories";
import type { SoundSystemId } from "../features/soundSystems/soundSystems";

function ModuleBox({
    grapheme,
    example,
    ipa,
    onClick,
}: {
    grapheme: string;
    example: string;
    ipa?: string;
    onClick?: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group flex flex-col items-center gap-2 w-full cursor-pointer"
        >
            <div
                className="
                    w-full
                    h-24
                    border-2
                    border-[#333333]
                    rounded-md
                    bg-white
                    transition-colors
                    group-hover:bg-[#F2F5E9]
                    group-hover:border-[#7BAA3C]
                    flex
                    items-center
                    justify-center
                    text-4xl
                    font-semibold
                "
            >
                {grapheme}
            </div>

            <p className="text-lg font-medium text-center">
                “{example}”
                {ipa ? (
                    <span className="block text-2xl text-[#7BAA3C] font-semibold mt-0.5 font-serif">
                        {ipa}
                    </span>
                ) : null}
            </p>
        </button>
    );
}

function CategoryPracticePage() {
    const { category } = useParams();
    const navigate = useNavigate();
    const { startGraphemeAssessment } = useAssessment();
    const categoryData = category ? practiceCategories[category] : undefined;

    if (!categoryData) {
        return <Navigate to="/practice" replace />;
    }

    const startTargetedPractice = (grapheme: string) => {
        startGraphemeAssessment(category as SoundSystemId, grapheme);
        navigate("/assessment");
    };

    return (
        <main
            className={`min-h-screen flex justify-center text-[#333333] px-6 ${
                categoryData.layout === "vowels"
                    ? "items-center"
                    : "items-start py-12"
            }`}
            style={{ backgroundImage: `url(${brownGrid})` }}
        >
            <div
                className="
                    bg-stone-50
                    w-full
                    max-w-[980px]
                    min-h-[520px]
                    rounded-[35px]
                    px-8
                    md:px-16
                    py-14
                    shadow-md
                    flex
                    flex-col
                "
            >
                <button
                    onClick={() => navigate("/practice")}
                    className="self-start text-2xl text-[#7BAA3C] font-semibold cursor-pointer hover:opacity-50 mb-4"
                >
                    ← Practice
                </button>

                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-[#7BAA3C]">
                        {categoryData.title}
                    </h1>

                    <p className="text-lg mt-3 font-medium max-w-3xl">
                        {categoryData.definition}
                    </p>
                </div>

                {categoryData.layout === "vowels" ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 justify-items-center flex-1 content-center">
                        {categoryData.modules.map((module) => (
                            <div key={module.id} className="w-full max-w-[160px]">
                                <ModuleBox
                                    grapheme={module.grapheme}
                                    example={module.example}
                                    ipa={module.ipa}
                                    onClick={() => startTargetedPractice(module.grapheme)}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-10">
                        {categoryData.groups.map((group) => (
                            <section key={group.id}>
                                <h2 className="text-2xl font-semibold mb-5">
                                    <span className="text-[#7BAA3C] mr-2 font-serif">
                                        {group.ipa}
                                    </span>
                                    {group.name}
                                </h2>

                                <div className="flex flex-wrap items-start gap-6">
                                    {group.modules.map((module) => (
                                        <div key={module.id} className="w-[160px]">
                                            <ModuleBox
                                                grapheme={module.grapheme}
                                                example={module.example}
                                                onClick={() => startTargetedPractice(module.grapheme)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default CategoryPracticePage;