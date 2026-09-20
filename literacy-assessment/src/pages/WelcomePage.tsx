import { useNavigate } from "react-router-dom";
import brownGrid from "../../public/brownGrid.png";
import apple from "../../public/appleAsset.png";
import greenTape from "../../public/greenTape.png";
import brownTape from "../../public/brownTape.png";
import smiski from "../../public/smiskiReading.png";

function WelcomePage() {
    const navigate = useNavigate();

    return (
        <main
            className="min-h-screen flex flex-col items-center justify-center text-[#333333] px-6"
            style={{ backgroundImage: `url(${brownGrid})` }}
        >
            <div
                className="
                    relative
                    bg-stone-50
                    w-[90vw]
                    max-w-225
                    h-120
                    flex
                    flex-col
                    justify-center
                    items-center
                "
            >

                {/* Green Tape */}
                <img
                    src={greenTape}
                    className="absolute -left-10 -top-18 rotate-[45deg] w-40 z-10"
                />

                {/* Apple */}
                <img
                    src={apple}
                    className="absolute -left-23 -top-20 -rotate-[30deg] w-58 z-20"
                />

                {/* Brown Tape */}
                <img
                    src={brownTape}
                    className="absolute -right-10 -bottom-10 rotate-[40deg] w-30 z-10"
                />

                {/* Smiski */}
                <img
                    src={smiski}
                    className="absolute -right-20 -bottom-13 w-50 z-20"
                />

                <div className="flex bg-[#fffdf8] items-center justify-center flex-col gap-4 text-center">
                    <h1 className="text-7xl font-semibold">
                        Welcome to
                    </h1>

                    <p className="text-7xl font-semibold">
                        Worcestershire!
                    </p>

                    <p className="text-4xl">
                        "Wuh-Stuh-Shr"
                    </p>
                </div>

                <div className="flex items-center justify-center flex-row gap-8 pt-10">
                    <button
                        type="button"
                        onClick={() => navigate("/assessment")}
                        className="cursor-pointer border rounded-3xl p-2 w-40 text-2xl hover:opacity-50"
                    >
                        Assessment
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/practice")}
                        className="cursor-pointer border rounded-3xl p-2 w-40 text-2xl hover:opacity-50"
                    >
                        Practice
                    </button>
                </div>

            </div>
        </main>
    );
}

export default WelcomePage;