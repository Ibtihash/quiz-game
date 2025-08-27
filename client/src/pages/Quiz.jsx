import { useEffect, useState } from "react";

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(false);

  const fetchQuestions = () => {
    setLoading(true);

    fetch("http://localhost:4000/api/questions")
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.results || !Array.isArray(data.results) || data.results.length === 0) {
          console.error("⚠️ API returned no questions", data);
          setQuestions([]);
        } else {
          const formatted = data.results.map((q) => {
            const options = [...q.incorrect_answers, q.correct_answer];
            for (let i = options.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [options[i], options[j]] = [options[j], options[i]];
            }
            return {
              question: q.question,
              correct: q.correct_answer,
              options,
            };
          });
          setQuestions(formatted);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch questions:", err);
        setQuestions([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAnswer = (option) => {
    if (option === questions[currentQ].correct) {
      setScore((prev) => prev + 1);
    }

    if (currentQ + 1 < questions.length) {
      setCurrentQ((prev) => prev + 1);
      setShowHint(false);
    } else {
      setFinished(true);
    }
  };

  if (loading) return <p>Loading questions…</p>;
  if (!questions.length) return <p>No questions found. Try again later.</p>;

  if (finished) {
    return (
      <div className="container-pro text-center">
        <h1 className="text-3xl font-bold mb-6">Quiz Finished 🎉</h1>
        <p className="text-xl mb-4">
          Your final score: {score} / {questions.length}
        </p>
        {score >= 7 ? (
          <p className="text-green-500 text-2xl font-bold">You Win! 🏆</p>
        ) : (
          <p className="text-red-500 text-2xl font-bold">You Lose 😢</p>
        )}
        <button
          className="btn btn-primary mt-6"
          onClick={() => {
            setScore(0);
            setCurrentQ(0);
            setFinished(false);
            setShowHint(false);
            fetchQuestions(); // Refetch new set
          }}
        >
          Play Again
        </button>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="container-pro">
      <h1 className="text-2xl font-bold mb-6">Quiz Game (Online)</h1>
      <p className="mb-4 text-lg font-medium">
        Score: {score} / {questions.length}
      </p>
      <p className="mb-2 text-sm text-slate-400">
        Question {currentQ + 1} of {questions.length}
      </p>

      <div className="card p-4">
        <h2
          className="text-lg font-semibold mb-4"
          dangerouslySetInnerHTML={{ __html: q.question }}
        />
        <ul className="space-y-2">
          {q.options.map((opt, i) => (
            <li key={i}>
              <button
                className="btn btn-secondary w-full text-left"
                onClick={() => handleAnswer(opt)}
                dangerouslySetInnerHTML={{ __html: opt }}
              />
            </li>
          ))}
        </ul>

        {!showHint ? (
          <button
            className="btn btn-primary mt-4"
            onClick={() => setShowHint(true)}
          >
            Show Hint 💡
          </button>
        ) : (
          <p className="mt-4 text-yellow-400 font-medium">
            Hint: The correct answer starts with "{q.correct.charAt(0)}..."
          </p>
        )}
      </div>
    </div>
  );
}
