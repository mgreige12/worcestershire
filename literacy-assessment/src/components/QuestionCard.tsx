import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import { assessWord } from "../SpeechTest";
import { images } from "../assets/images";

function QuestionCard() {
    return (
        <main
            className="relative min-h-screen flex items-center justify-center bg-stone-100 text-[#333333] overflow-hidden"
            style={{ backgroundImage: `url(${images.brownGrid})` }}
        >

            {/* White Assessment Box */}
            <div className="w-[55%] bg-white rounded-2xl shadow-lg p-10">

                <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-medium text-gray-500">
                        Question 1 of 10
                    </p>

                    <p className="text-sm text-gray-400">
                        Assessment
                    </p>
                </div>

                <div className="w-full h-2 bg-gray-200 rounded-full mb-10">
                    <div className="w-[10%] h-full bg-[#7aa94c] rounded-full"></div>
                </div>

                <div className="text-left mb-10">
                    <p className="text-base text-gray-500 mb-3">
                        Read the following:
                    </p>

                    <h1 className="text-3xl">
                        Bobby Billy Joe
                    </h1>
                </div>

                <div className="mb-8">
                    <p className="text-base font-medium text-gray-500 mb-2">
                        Your Answer
                    </p>

                    <div className="w-full min-h-28 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer">
                        <p className="text-gray-400">
                            Your spoken answer will appear here
                        </p>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        className="cursor-pointer px-6 py-3 bg-[#7aa94c] text-white rounded-lg font-medium hover:opacity-50"
                    >
                        Next Question
                    </button>
                </div>

            </div>

            {/* Smiski - stays near bottom right of screen */}
            <img
                src={images.smiskiTeaching}
                className="
                    absolute
                    right-[8vw]
                    bottom-[5vh]
                    w-[clamp(140px,17vw,260px)]
                    z-10
                "
            />

        </main>
    );
}

export default QuestionCard;