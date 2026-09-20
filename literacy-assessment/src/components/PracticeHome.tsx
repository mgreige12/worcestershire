import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { images } from "../assets/images";

function PracticeHome() {
    const [category, setCategory] = useState("cvc");
    const navigate = useNavigate();

    const startPractice = () => {
        navigate(`/practice/${category}`);
    };

    return (
        <main
            className="min-h-screen flex items-center justify-center text-[#333333] px-6"
            style={{ backgroundImage: `url(${images.brownGrid})` }}
        >
            {/* White paper */}
            <div
                className="
                    bg-stone-50
                    w-full
                    max-w-[900px]
                    min-h-[520px]
                    rounded-[35px]
                    px-16
                    py-14
                    shadow-md
                    flex
                    flex-col
                "
            >
                {/* Heading */}
                <div>
                    <h1 className="text-5xl font-bold text-[#7BAA3C]">
                        Practice
                    </h1>

                    <p className="text-xl mt-2 font-medium">
                        Pick a category to practice
                    </p>
                </div>

                {/* Main content */}
                <div className="flex flex-col items-center justify-center flex-1 gap-12">

                    {/* Dropdown */}
                    <div className="relative w-full max-w-[500px]">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="
                                appearance-none
                                w-full
                                bg-[#F8F7F2]
                                border-2
                                border-[#7BAA3C]
                                rounded-[25px]
                                px-7
                                py-5
                                pr-16
                                text-2xl
                                font-semibold
                                text-[#333333]
                                cursor-pointer
                                outline-none
                                transition
                                hover:bg-[#F2F5E9]
                                focus:ring-4
                                focus:ring-[#7BAA3C]/20
                            "
                        >
                            <option value="cvc">
                                CVC
                            </option>

                            <option value="silent-e">
                                Silent E
                            </option>

                            <option value="vowel-teams">
                                Vowel Teams
                            </option>
                        </select>

                        {/* Dropdown arrow */}
                        <div
                            className="
                                pointer-events-none
                                absolute
                                right-6
                                top-1/2
                                -translate-y-1/2
                                text-[#7BAA3C]
                                text-2xl
                            "
                        >
                            ▼
                        </div>
                    </div>

                    {/* Start button */}
                    <button
                        onClick={startPractice}
                        className="
                            bg-[#7BAA3C]
                            text-white
                            rounded-full
                            px-16
                            py-4
                            text-2xl
                            font-semibold
                            cursor-pointer
                            transition
                            
                            hover:opacity-50
                            active:scale-95
                        "
                    >
                        Start
                    </button>

                </div>
            </div>
        </main>
    );
}

export default PracticeHome;