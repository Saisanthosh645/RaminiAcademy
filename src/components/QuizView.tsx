import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Trophy, Target, Play, RotateCcw, Loader2, Terminal as TerminalIcon } from "lucide-react";
import type { Quiz } from "@/types/firebase";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-python";

interface QuizViewProps {
  quiz: Quiz;
  onClose: () => void;
  onComplete?: (score: number) => void;
}

const QuizView = ({ quiz, onClose, onComplete }: QuizViewProps) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | string | null)[]>(new Array(quiz.questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [pyodide, setPyodide] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<{ input: string; expected: string; actual: string; passed: boolean }[]>([]);
  const [codingPassed, setCodingPassed] = useState<Record<number, boolean>>({});

  const question = quiz.questions[currentQ];
  const progress = ((currentQ + 1) / quiz.questions.length) * 100;
  
  const isQuestionCorrect = (idx: number) => {
    const q = quiz.questions[idx];
    const ans = answers[idx];
    if (q.type === "coding") {
      // For coding questions, we check if they've passed all tests
      // Since testResults is only for the current question, we need a way to persist this
      return codingPassed[idx] || false;
    }
    return ans === q.correctAnswer;
  };

  const correctAnswers = quiz.questions.reduce((acc: number, _: any, idx: number) => acc + (isQuestionCorrect(idx) ? 1 : 0), 0);
  const wrongAnswers = answers.filter(ans => ans !== null).length - correctAnswers;
  const score = Math.round((correctAnswers / quiz.questions.length) * 100);
  const passed = score >= 60;

  const selectAnswer = (answer: number | string) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = answer;
    setAnswers(newAnswers);
  };

  useEffect(() => {
    setTestResults([]); // Reset test results when question changes
    if (question.type === "coding" && !pyodide) {
      const loadPy = async () => {
        if (!(window as any).loadPyodide) {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
          script.async = true;
          document.head.appendChild(script);
          script.onload = async () => {
            const py = await (window as any).loadPyodide();
            setPyodide(py);
          };
        } else {
          const py = await (window as any).loadPyodide();
          setPyodide(py);
        }
      };
      loadPy();
    }
  }, [question.type, pyodide]);

  const runCode = async () => {
    if (!pyodide || !question.testCases) return;
    setIsRunning(true);
    const code = (answers[currentQ] as string) || question.starterCode || "";
    const results: any[] = [];
    let overallPassed = true;

    try {
      // 1. Run the user's code to define the function in the global scope
      await pyodide.runPythonAsync(code);

      // 2. Extract the function name from the question (default to find_max if not specified)
      const functionNameMatch = question.question.match(/`(\w+)\(.*\)`/);
      const funcName = functionNameMatch ? functionNameMatch[1] : "find_max";

      for (const tc of question.testCases) {
        // 3. Call the function directly and let Pyodide return the value
        // We wrap it in str() to ensure we get a consistent string representation for comparison
        const evalCode = `str(${funcName}(${tc.input}))`;
        const output = await pyodide.runPythonAsync(evalCode);
        const actual = String(output).trim();
        const passed = actual === tc.expectedOutput;
        
        if (!passed) overallPassed = false;
        results.push({ input: tc.input, expected: tc.expectedOutput, actual, passed });
      }
      setTestResults(results);
      if (overallPassed) {
        setCodingPassed((prev: Record<number, boolean>) => ({ ...prev, [currentQ]: true }));
      } else {
        setCodingPassed((prev: Record<number, boolean>) => ({ ...prev, [currentQ]: false }));
      }
    } catch (err: any) {
      console.error("Pyodide Execution Error:", err);
      setTestResults([{ input: "Error", expected: "", actual: err.message, passed: false }]);
    } finally {
      setIsRunning(false);
    }
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
          
          {question.type === "coding" ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground px-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${pyodide ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                    <span>{pyodide ? "Python 3.12 (Pyodide) Ready" : "Initializing Engine..."}</span>
                  </div>
                  <span>main.py</span>
                </div>
                <div className="relative group">
                  <Editor
                    value={(answers[currentQ] as string) || question.starterCode || ""}
                    onValueChange={(code) => selectAnswer(code)}
                    highlight={(code) => highlight(code, languages.python, "python")}
                    padding={20}
                    className="prism-editor-wrapper font-mono min-h-[220px]"
                    style={{
                      fontFamily: '"Fira Code", "Fira Mono", "Cascadia Code", "Source Code Pro", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    }}
                  />
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="h-8 text-xs bg-background/50 backdrop-blur-md border border-white/10"
                      onClick={() => selectAnswer(question.starterCode || "")}
                    >
                      <RotateCcw className="w-3 h-3 mr-1" /> Reset
                    </Button>
                    <Button 
                      size="sm" 
                      className="h-8 text-xs gradient-bg text-primary-foreground font-bold shadow-lg shadow-primary/20"
                      onClick={runCode}
                      disabled={isRunning || !pyodide}
                    >
                      {isRunning ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Play className="w-3 h-3 mr-1" />}
                      {isRunning ? "Running..." : "Run Tests"}
                    </Button>
                  </div>
                </div>
              </div>

              {testResults.length > 0 && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground px-1">
                    <TerminalIcon className="w-4 h-4" />
                    <span>Test Execution Results</span>
                  </div>
                  
                  <div className="terminal-output">
                    <div className="terminal-header">
                      <div className="terminal-dot red" />
                      <div className="terminal-dot yellow" />
                      <div className="terminal-dot green" />
                      <span className="text-[10px] text-muted-foreground ml-2 font-mono uppercase tracking-widest">Output Console</span>
                    </div>
                    <div className="terminal-content space-y-3">
                      {testResults.map((res, i) => (
                        <div key={i} className="flex gap-4 items-start group">
                          <div className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${res.passed ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                            {res.passed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-[11px] text-muted-foreground font-mono">Case #{i + 1}: input({res.input})</span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${res.passed ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                                {res.passed ? 'PASSED' : 'FAILED'}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 bg-white/5 p-2 rounded-lg border border-white/5">
                              <div>
                                <p className="text-[9px] uppercase text-muted-foreground tracking-tighter">Expected</p>
                                <code className="text-xs text-white/70">{res.expected}</code>
                              </div>
                              <div>
                                <p className="text-[9px] uppercase text-muted-foreground tracking-tighter">Actual</p>
                                <code className={`text-xs ${res.passed ? 'text-primary' : 'text-destructive font-bold'}`}>
                                  {res.actual}
                                </code>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!isRunning && testResults.length > 0 && testResults.every(r => r.passed) && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-xl bg-primary/10 border border-primary/30 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                    <Trophy className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-primary">All Test Cases Passed!</h4>
                    <p className="text-xs text-muted-foreground">Excellent logic! You can now proceed to submit your exam.</p>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
            {question.options.map((opt: string, idx: number) => (
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
          )}
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
