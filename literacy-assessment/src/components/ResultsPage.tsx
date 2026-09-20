import { useState } from "react";
import { images } from "../assets/images";

function ResultsPage() {
    const [openCategory, setOpenCategory] = useState(null);

    const results = [
        {
            category: "CVC",
            percent: 42,
            details: [
                { name: "Short a", percent: 2 },
                { name: "Short e", percent: 15 },
                { name: "Short i", percent: 12 },
                { name: "Short o", percent: 90 },
                { name: "Short u", percent: 50 },
            ],
        },

        {
            category: "Silent e",
            percent: 58,
            details: [
                { name: "Long a", percent: 45 },
                { name: "Long e", percent: 70 },
                { name: "Long i", percent: 51 },
                { name: "Long o", percent: 64 },
                { name: "Long u", percent: 60 },
            ],
        },

        {
            category: "Vowel teams",
            percent: 65,
            groups: [
                {
                    name: "eɪ Long a vowel teams: general",
                    percent: 55,
                    details: [
                        { name: "Ai: targeted practice", percent: 42 },
                        { name: "Ay: targeted practice", percent: 68 },
                    ],
                },

                {
                    name: "i Long e vowel teams",
                    percent: 61,
                    details: [
                        { name: "Ea → ɛ and i", percent: 45 },
                        { name: "ee", percent: 72 },
                        { name: "ie", percent: 54 },
                        { name: "ei → eɪ", percent: 63 },
                        { name: "ey", percent: 71 },
                    ],
                },

                {
                    name: "oʊ Long o vowel teams",
                    percent: 73,
                    details: [
                        { name: "oa", percent: 69 },
                        { name: "ow", percent: 77 },
                    ],
                },

                {
                    name: "u Long oo vowel teams",
                    percent: 60,
                    details: [
                        { name: "oo", percent: 55 },
                        { name: "ue → ju and u", percent: 61 },
                        { name: "ui", percent: 58 },
                        { name: "ew", percent: 67 },
                    ],
                },

                {
                    name: "ʊ Short oo vowel teams",
                    percent: 79,
                    details: [
                        { name: "oo", percent: 79 },
                    ],
                },

                {
                    name: "ɛ Short e exception",
                    percent: 83,
                    details: [
                        { name: "ea", percent: 83 },
                    ],
                },
            ],
        },
    ];

    const sortedResults = [...results].sort(
        (a, b) => a.percent - b.percent
    );

    const toggleCategory = (index) => {
        setOpenCategory(openCategory === index ? null : index);
    };

    return (
        <main className="relative min-h-screen flex items-center justify-center px-6 py-10 text-[#333333]">
           

            {/* Results Paper */}
            <div className="w-[80%] max-w-5xl min-h-[70vh] bg-white rounded-lg shadow-lg px-12 py-10">

                <div className="mb-10">
                    <p className="text-sm text-[#7aa94c] font-semibold tracking-wide">
                        ASSESSMENT COMPLETE
                    </p>

                    <h1 className="text-4xl font-semibold mt-2">
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

                                    <span className="text-xl font-semibold text-[#7aa94c]">
                                        {index + 1})
                                    </span>

                                    <span className="text-2xl font-semibold group-hover:text-[#7aa94c] transition">
                                        {result.category}
                                    </span>

                                </div>

                                <div className="flex items-center gap-4">

                                    {/* Percent pill */}
                                    <span className="bg-[#e8efd9] text-[#5f7f38] px-4 py-2 rounded-full text-xl font-semibold">
                                        {result.percent}%
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
                                                        a.percent - b.percent
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
                                                            {detail.percent}%
                                                        </span>
                                                    </li>
                                                ))}
                                        </ul>
                                    )}

                                    {/* Vowel Teams */}
                                    {result.groups && (
                                        <div className="flex flex-col gap-7">

                                            {[...result.groups]
                                                .sort(
                                                    (a, b) =>
                                                        a.percent - b.percent
                                                )
                                                .map((group) => (
                                                    <div key={group.name}>

                                                        {/* Subcategory */}
                                                        <div className="flex items-center justify-between max-w-2xl mb-3">

                                                            <p className="text-xl font-semibold text-[#555]">
                                                                {group.name}
                                                            </p>

                                                            <span className="text-[#7aa94c] font-semibold">
                                                                {group.percent}%
                                                            </span>

                                                        </div>

                                                        {/* Subcategory bullets */}
                                                        <ul className="ml-6 flex flex-col gap-2">

                                                            {[...group.details]
                                                                .sort(
                                                                    (a, b) =>
                                                                        a.percent -
                                                                        b.percent
                                                                )
                                                                .map(
                                                                    (detail) => (
                                                                        <li
                                                                            key={
                                                                                detail.name
                                                                            }
                                                                            className="flex items-center justify-between max-w-xl text-gray-600"
                                                                        >

                                                                            <div className="flex items-center gap-3">

                                                                                <span className="text-[#7aa94c]">
                                                                                    •
                                                                                </span>

                                                                                <span>
                                                                                    {
                                                                                        detail.name
                                                                                    }
                                                                                </span>

                                                                            </div>

                                                                            <span>
                                                                                {
                                                                                    detail.percent
                                                                                }
                                                                                %
                                                                            </span>

                                                                        </li>
                                                                    )
                                                                )}

                                                        </ul>
                                                    </div>
                                                ))}

                                        </div>
                                    )}

                                </div>
                            )}

                        </div>
                    ))}
                </div>

            </div>

            {/* Smiski */}
            <img
                src={images.smiskiGarden}
                alt=""
                decoding="sync"
                className="absolute right-[2vw] bottom-[1vh] w-[clamp(200px,15vw,300px)]"
            />

        </main>
    );
}

export default ResultsPage;