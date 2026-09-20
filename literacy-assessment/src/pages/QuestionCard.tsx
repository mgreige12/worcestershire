import { useAssessment } from "../features/assessment/assessmentProvider";
import brownGrid from "../../public/brownGrid.png";
import smiski from "../../public/smiskiTeaching.png";
import apple from "../../public/appleAsset.png";

function QuestionCard() {
    const {
        currentPassage,
        isRecording,
        progressPercent,
        questionNumber,
        totalQuestions,
        assessmentMode,
        selectedSystemId,
        startGeneralAssessment,
        startRecording,
        stopRecording,
    } = useAssessment();

    return (
        <main
            className="relative min-h-screen flex items-center justify-center bg-stone-100 text-[#333333] overflow-hidden"
            style={{ backgroundImage: `url(${brownGrid})` }}
        >

            {/* Apple - stays near top left of screen */}
            <img
                src={apple}
                alt=""
                className="
                    absolute
                    left-[10vw]
                    top-[1vh]
                    -rotate-[20deg]
                    w-[clamp(120px,15vw,232px)]
                    z-20
                "
            />

            {/* White Assessment Box */}
            <div className="w-[65%] bg-white rounded-2xl shadow-lg p-10">

                <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-medium text-gray-500">
                        Question {questionNumber} of {totalQuestions}
                    </p>

                    <p className="text-sm text-gray-400">
                        Assessment
                    </p>
                </div>

                <div className="w-full h-2 bg-gray-200 rounded-full mb-10">
                    <div
                        className="h-full bg-[#7aa94c] rounded-full transition-[width] duration-500"
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>

                <div className="text-left mb-10">
                    <p className="text-base text-gray-500 mb-3">
                        Read the following:
                    </p>

                    <h1 className="text-3xl">
                        {currentPassage}
                    </h1>
                </div>

                {/* <div className="mb-8">
                    <p className="text-base font-medium text-gray-500 mb-2">
                        Your Answer
                    </p>

                    <div className="w-full min-h-28 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer">
                        <p className={latestSpokenSentence ? "text-gray-700" : "text-gray-400"}>
                            {latestSpokenSentence ?? "Your spoken answer will appear here"}
                        </p>
                    </div>
                    {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
                </div> */}

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={isRecording ? stopRecording : startRecording}
                        className="cursor-pointer px-6 py-3 bg-[#7aa94c] text-white rounded-lg font-medium hover:opacity-50"
                    >
                        {isRecording ? "Stop recording" : "Start recording"}
                    </button>
                </div>

                {assessmentMode.type === "grapheme" && (
                    <button
                        type="button"
                        onClick={() => startGeneralAssessment(selectedSystemId)}
                        disabled={isRecording}
                        className="mt-4 text-sm text-gray-500 underline hover:text-[#7aa94c] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Return to general assessment
                    </button>
                )}

            </div>

            {/* Smiski - stays near bottom right of screen */}
            <img
                src={smiski}
                alt=""
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