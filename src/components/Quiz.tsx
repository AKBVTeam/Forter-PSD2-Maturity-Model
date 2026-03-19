import { useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { questions } from "../data/questions";
import { motion, AnimatePresence } from "framer-motion";

interface QuizProps {
  onComplete: (answers: number[]) => void;
  onBack: () => void;
}

export default function Quiz({ onComplete, onBack }: QuizProps) {
  const total = questions.length;
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [direction, setDirection] = useState(1);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const answersRef = useRef(answers);
  answersRef.current = answers;

  const q = questions[current];
  const progress = ((current + 1) / total) * 100;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === total;
  const currentAnswered = current in answers;

  const selectOption = useCallback(
    (level: number) => {
      setAnswers((prev) => ({ ...prev, [current]: level }));

      if (current < total - 1) {
        if (advanceTimer.current) clearTimeout(advanceTimer.current);
        advanceTimer.current = setTimeout(() => {
          advanceTimer.current = null;
          setDirection(1);
          setCurrent((c) => Math.min(c + 1, total - 1));
        }, 350);
      }
    },
    [current, total]
  );

  function goBack() {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    if (current > 0) {
      setDirection(-1);
      setCurrent((c) => c - 1);
    } else {
      onBack();
    }
  }

  function goForward() {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    if (current < total - 1 && currentAnswered) {
      setDirection(1);
      setCurrent((c) => c + 1);
    }
  }

  function handleSubmit() {
    const latest = answersRef.current;
    if (Object.keys(latest).length === total) {
      const ordered = questions.map((_, i) => latest[i]);
      onComplete(ordered);
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
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-forter-muted mb-3">
            <span>
              Question {current + 1} of {total}
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
              transition={{ duration: 0.25, ease: "easeInOut" }}
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
              className="flex items-center gap-2 text-sm text-forter-muted hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            {current < total - 1 ? (
              <button
                onClick={goForward}
                disabled={!currentAnswered}
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
