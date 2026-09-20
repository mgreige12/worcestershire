import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const { pathname } = useLocation();

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <aside
            className={`fixed left-0 top-0 h-screen bg-[#81624f] shadow-lg z-50
            transition-all duration-300 text-amber-50
            ${isOpen ? "w-56" : "w-16"}`}
        >
            {/* Hamburger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 flex items-center justify-center text-3xl cursor-pointer hover:opacity-70 text-amber-50"
            >
                {isOpen ? "×" : "☰"}
            </button>

            {/* Show pages only when open */}
            {isOpen && (
                <nav className="flex flex-col gap-4 mt-6 px-4">

                    {/* Home */}
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-xl py-3 px-4 transition ${
                                isActive
                                    ? "bg-[#333333] text-white"
                                    : "hover:bg-stone-200"
                            }`
                        }
                    >
                        <span className="text-2xl">⌂</span>
                        <span>Home</span>
                    </NavLink>

                    {/* Assessment */}
                    <NavLink
                        to="/assessment"
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-xl py-3 px-4 transition ${
                                isActive
                                    ? "bg-[#333333] text-white"
                                    : "hover:bg-stone-200"
                            }`
                        }
                    >
                        <span className="text-2xl">✎</span>
                        <span>Assessment</span>
                    </NavLink>

                    {/* Results */}
                    <NavLink
                        to="/results"
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-xl py-3 px-4 transition ${
                                isActive
                                    ? "bg-[#333333] text-white"
                                    : "hover:bg-stone-200"
                            }`
                        }
                    >
                        <span className="text-2xl">▥</span>
                        <span>Results</span>
                    </NavLink>
                    <NavLink
                        to="/practice"
                        className={({ isActive }) =>
                            `flex items-center gap-3 w-full rounded-xl py-3 px-4 transition ${
                                isActive
                                    ? "bg-[#333333] text-white"
                                    : "hover:bg-stone-200"
                            }`
                        }
                    >
                        <span className="text-2xl">📚</span>
                        <span>Practice</span>
                    </NavLink>

                </nav>
            )}
        </aside>
    );
}

export default Sidebar;