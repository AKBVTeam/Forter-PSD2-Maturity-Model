import { useState, useRef } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Quiz from "./components/Quiz";
import CTAForm, { type FormData } from "./components/CTAForm";
import Results from "./components/Results";

type Step = "hero" | "quiz" | "cta" | "results";

export default function App() {
  const [step, setStep] = useState<Step>("hero");
  const [answers, setAnswers] = useState<number[]>([]);
  const mainRef = useRef<HTMLDivElement>(null);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleStart() {
    setStep("quiz");
    setTimeout(scrollToTop, 50);
  }

  function handleQuizComplete(quizAnswers: number[]) {
    setAnswers(quizAnswers);
    setStep("cta");
    setTimeout(scrollToTop, 50);
  }

  function handleFormSubmit(_data: FormData) {
    setStep("results");
    setTimeout(scrollToTop, 50);
  }

  function handleRequestAudit() {
    window.open("https://www.forter.com/sales/", "_blank");
  }

  return (
    <div ref={mainRef} className="bg-forter-dark min-h-screen">
      <Header />

      {step === "hero" && <Hero onStart={handleStart} />}

      {step === "quiz" && <Quiz onComplete={handleQuizComplete} />}

      {step === "cta" && (
        <CTAForm
          level={Math.max(
            1,
            Math.min(
              5,
              Math.round(
                answers.reduce((a, b) => a + b, 0) / answers.length
              )
            )
          )}
          onSubmit={handleFormSubmit}
        />
      )}

      {step === "results" && (
        <Results answers={answers} onRequestAudit={handleRequestAudit} />
      )}
    </div>
  );
}
