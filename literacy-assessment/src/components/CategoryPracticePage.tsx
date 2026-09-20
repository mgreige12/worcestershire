import { useParams } from "react-router-dom";

function CategoryPracticePage() {
    const { category } = useParams();

    return (
        <main className="h-screen flex items-center justify-center">
            <h1 className="text-5xl">
                Practice: {category}
            </h1>
        </main>
    );
}

export default CategoryPracticePage;