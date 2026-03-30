import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Trophy, Target } from "lucide-react";
import type { Quiz } from "@/types/firebase";

interface QuizViewProps {
  quiz: Quiz;
  onClose: () => void;
  onComplete?: (score: number) => void;
}

const QuizView = ({ quiz, onClose, onComplete }: QuizViewProps) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(quiz.questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);

  const question = quiz.questions[currentQ];
  const progress = ((currentQ + 1) / quiz.questions.length) * 100;
  const correctAnswers = answers.reduce((acc, ans, idx) => acc + (ans === quiz.questions[idx].correctAnswer ? 1 : 0), 0);
  const wrongAnswers = answers.filter(ans => ans !== null).length - correctAnswers;
  const score = Math.round((correctAnswers / quiz.questions.length) * 100);
  const passed = score >= 60;

  const selectAnswer = (optIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = optIdx;
    setAnswers(newAnswers);
  };

  if (showResult) {
    return (
      <div className="p-6 lg:p-8 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-2xl p-8 text-center space-y-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
            {passed ? (
              <div className="w-24 h-24 rounded-full gradient-bg flex items-center justify-center mx-auto">
                <Trophy className="w-12 h-12 text-primary-foreground" />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                <Target className="w-12 h-12 text-destructive" />
              </div>
            )}
          </motion.div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-display text-card-foreground">
              {passed ? "🎉 Congratulations!" : "📚 Keep Learning!"}
            </h2>
            <p className="text-muted-foreground">
              {passed 
                ? "You passed the final exam! Excellent work!" 
                : "You need 60% to pass. Review the material and try again."}
            </p>
          </div>

          {/* Score Display */}
          <div className="grid grid-cols-3 gap-4">
            <div className="glass-card rounded-xl p-4 space-y-2">
              <p className="text-xs text-muted-foreground font-medium">Score</p>
              <p className="text-3xl font-bold gradient-text">{score}%</p>
            </div>
            <div className="glass-card rounded-xl p-4 space-y-2 border-l-4 border-l-primary">
              <p className="text-xs text-muted-foreground font-medium">Correct ✓</p>
              <p className="text-3xl font-bold text-primary">{correctAnswers}</p>
            </div>
            <div className="glass-card rounded-xl p-4 space-y-2 border-l-4 border-l-destructive">
              <p className="text-xs text-muted-foreground font-medium">Wrong ✗</p>
              <p className="text-3xl font-bold text-destructive">{wrongAnswers}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>{correctAnswers}/{quiz.questions.length}</span>
            </div>
            <Progress value={(correctAnswers / quiz.questions.length) * 100} className="h-3" />
          </div>

          {/* Status Badge */}
          <div className={`p-4 rounded-xl ${passed ? 'bg-primary/10 border border-primary/20' : 'bg-destructive/10 border border-destructive/20'}`}>
            <p className={`font-semibold ${passed ? 'text-primary' : 'text-destructive'}`}>
              {passed ? '✓ PASSED' : '✗ NOT PASSED (Need 60%)'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center pt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                console.log("📤 QuizView: Calling onComplete with score:", score, "Quiz:", quiz.title);
                if (onComplete) {
                  console.log("✅ onComplete callback exists, invoking with:", score);
                  onComplete(score);
                } else {
                  console.warn("⚠️ onComplete callback not provided, closing quiz instead");
                  onClose();
                }
              }}
            >
              Back to Course
            </Button>
            {!passed && (
              <Button 
                className="gradient-bg text-primary-foreground" 
                onClick={() => { 
                  setCurrentQ(0); 
                  setAnswers(new Array(quiz.questions.length).fill(null)); 
                  setShowResult(false); 
                }}
              >
                Try Again
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-bold text-foreground truncate">{quiz.title}</h2>
            <p className="text-xs text-muted-foreground">Question {currentQ + 1} of {quiz.questions.length}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span>{currentQ + 1}/{quiz.questions.length}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentQ} 
          initial={{ opacity: 0, x: 30 }} 
          animate={{ opacity: 1, x: 0 }} 
          exit={{ opacity: 0, x: -30 }} 
          transition={{ duration: 0.25 }} 
          className="glass-card rounded-2xl p-6 space-y-6"
        >
          <h3 className="text-lg font-semibold text-card-foreground">{question.question}</h3>
          <div className="space-y-3">
            {question.options.map((opt, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => selectAnswer(idx)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  answers[currentQ] === idx
                    ? "border-primary bg-primary/5 text-card-foreground"
                    : "border-border hover:border-primary/30 text-card-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                      answers[currentQ] === idx 
                        ? "gradient-bg text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="flex-1">{opt}</span>
                  {answers[currentQ] === idx && <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-3">
        <Button 
          variant="outline" 
          onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} 
          disabled={currentQ === 0}
          className="gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Previous
        </Button>
        {currentQ < quiz.questions.length - 1 ? (
          <Button 
            onClick={() => setCurrentQ(currentQ + 1)} 
            disabled={answers[currentQ] === null} 
            className="gradient-bg text-primary-foreground gap-1"
          >
            Next <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button 
            onClick={() => setShowResult(true)} 
            disabled={answers.some((a) => a === null)} 
            className="gradient-bg text-primary-foreground gap-1"
          >
            Submit Quiz <CheckCircle2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizView;
