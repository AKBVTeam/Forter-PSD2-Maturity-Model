import { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { questions, type QuizQuestion } from "../data/questions";
import { motion, AnimatePresence } from "framer-motion";

interface QuizProps {
  onComplete: (answers: number[]) => void;
}

export default function Quiz({ onComplete }: QuizProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );
  const [direction, setDirection] = useState(1);

  const q: QuizQuestion = questions[current];
  const progress = ((current + 1) / questions.length) * 100;
  const allAnswered = answers.every((a) => a !== null);

  function selectOption(level: number) {
    const next = [...answers];
    next[current] = level;
    setAnswers(next);

    if (current < questions.length - 1) {
      setTimeout(() => {
        setDirection(1);
        setCurrent((c) => c + 1);
      }, 300);
    }
  }

  function goBack() {
    if (current > 0) {
      setDirection(-1);
      setCurrent((c) => c - 1);
    }
  }

  function goForward() {
    if (current < questions.length - 1 && answers[current] !== null) {
      setDirection(1);
      setCurrent((c) => c + 1);
    }
  }

  function handleSubmit() {
    if (allAnswered) {
      onComplete(answers as number[]);
    }
  }

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <section
      id="assessment"
      className="min-h-screen bg-forter-dark flex items-center justify-center px-4 py-20"
    >
      <div className="w-full max-w-2xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-forter-muted mb-3">
            <span>
              Question {current + 1} of {questions.length}
            </span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-1.5 bg-forter-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-forter-purple to-forter-purple-light rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="bg-forter-navy border border-forter-border rounded-2xl p-8 md:p-10 min-h-[480px] flex flex-col">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={q.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex-1"
            >
              <p className="text-forter-purple-light text-sm font-medium mb-3">
                {q.subtitle}
              </p>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-8 leading-snug">
                {q.question}
              </h2>

              <div className="space-y-3">
                {q.options.map((opt, idx) => {
                  const selected = answers[current] === opt.level;
                  return (
                    <button
                      key={idx}
                      onClick={() => selectOption(opt.level)}
                      className={`w-full text-left px-5 py-4 rounded-xl border transition-all cursor-pointer group ${
                        selected
                          ? "bg-forter-purple/15 border-forter-purple text-white"
                          : "bg-forter-surface/40 border-forter-border text-forter-muted hover:border-forter-purple/40 hover:text-white"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                            selected
                              ? "border-forter-purple bg-forter-purple"
                              : "border-forter-border group-hover:border-forter-purple/50"
                          }`}
                        >
                          {selected && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          )}
                        </div>
                        <span className="text-sm md:text-base leading-relaxed">
                          {opt.text}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-forter-border">
            <button
              onClick={goBack}
              disabled={current === 0}
              className="flex items-center gap-2 text-sm text-forter-muted hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            {current < questions.length - 1 ? (
              <button
                onClick={goForward}
                disabled={answers[current] === null}
                className="flex items-center gap-2 text-sm text-forter-muted hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-forter-purple to-forter-purple-light text-white font-semibold px-6 py-2.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-forter-purple/25 transition-all cursor-pointer"
              >
                See My Results
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
