/**
 * Password strength validator for enhanced security
 */

export interface PasswordStrength {
  score: number; // 0-5
  strength: "weak" | "fair" | "good" | "strong" | "very-strong";
  feedback: string[];
  passed: boolean;
}

export const validatePassword = (password: string): PasswordStrength => {
  const feedback: string[] = [];
  let score = 0;

  // Minimum length check (8 chars required)
  if (password.length >= 8) {
    score++;
  } else {
    feedback.push("Password must be at least 8 characters long");
  }

  // Uppercase letters
  if (/[A-Z]/.test(password)) {
    score++;
  } else {
    feedback.push("Add uppercase letters (A-Z)");
  }

  // Lowercase letters
  if (/[a-z]/.test(password)) {
    score++;
  } else {
    feedback.push("Add lowercase letters (a-z)");
  }

  // Numbers
  if (/\d/.test(password)) {
    score++;
  } else {
    feedback.push("Add numbers (0-9)");
  }

  // Special characters
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score++;
  } else {
    feedback.push("Add special characters (!@#$%^&* etc)");
  }

  // Map score to strength level
  const strengthMap: ("weak" | "fair" | "good" | "strong" | "very-strong")[] = [
    "weak",
    "weak",
    "fair",
    "good",
    "strong",
    "very-strong",
  ];

  return {
    score,
    strength: strengthMap[score],
    feedback,
    passed: score >= 3, // Passed if score is "good" or higher
  };
};

export const getPasswordStrengthColor = (strength: string): string => {
  switch (strength) {
    case "very-strong":
      return "bg-emerald-500";
    case "strong":
      return "bg-green-500";
    case "good":
      return "bg-yellow-500";
    case "fair":
      return "bg-orange-500";
    case "weak":
      return "bg-red-500";
    default:
      return "bg-gray-300";
  }
};
