import { useState } from "react";
import { assessWord } from "./SpeechTest";

function App() {
  const [result, setResult] = useState<string>("");

  const handleAssess = async () => {
    try {
      const assessment = await assessWord("cat");

      const json = assessment.properties.getProperty(
        "SpeechServiceResponse_JsonResult"
      );

      setResult(json);
    } catch (error) {
      console.error(error);
      setResult("Something went wrong.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-5xl font-bold">Say the word:</h1>

      <p className="text-6xl font-bold">cat</p>

      <button
        onClick={handleAssess}
        className="rounded-lg bg-blue-600 px-6 py-3 text-white"
      >
        🎤 Say "cat"
      </button>

      <pre className="max-w-3xl overflow-auto whitespace-pre-wrap">
        {result}
      </pre>
    </main>
  );
}

export default App;