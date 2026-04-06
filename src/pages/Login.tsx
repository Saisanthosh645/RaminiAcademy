import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Mail, Lock, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/auth";
import { LoadingScreen } from "@/components/LoadingScreen";
import { getDoc } from "firebase/firestore";
import { usersRef } from "@/firebase/firestore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { user, login, loginWithGoogle, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // If already signed in, skip login page
  useEffect(() => {
    if (!user) return;
    
    // Check if they just verified their email
    const justVerified = localStorage.getItem("emailJustVerified") === "true";
    
    // If not email verified and didn't just verify, go to verification page
    if (!user.emailVerified && !auth.currentUser?.emailVerified && !justVerified) {
      navigate("/verify-email", { replace: true });
      return;
    }

    // Clear the flag if it was set
    if (justVerified) {
      localStorage.removeItem("emailJustVerified");
    }

    // Check if 2FA is enabled for this user
    if (user.emailVerified || justVerified) {
      checkTwoFARequired();
    }
  }, [user?.uid, user?.emailVerified, navigate]);

  const checkTwoFARequired = async () => {
    if (!user) return;
    try {
      const userDoc = await getDoc(usersRef(user.uid));
      const userData = userDoc.data();
      
      if (userData?.twoFactorEnabled && userData?.role && ["admin", "teacher"].includes(userData.role)) {
        navigate("/verify-2fa", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch {
      navigate("/dashboard", { replace: true });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing Fields",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsPending(true);
    try {
      await login(email, password);
      
      // Check email verification status
      if (auth.currentUser && !auth.currentUser.emailVerified) {
        toast({
          title: "Email Not Verified",
          description: "Please verify your email before logging in.",
          variant: "destructive",
        });
        navigate("/verify-email");
        return;
      }

      toast({ title: "Welcome back!", description: "Successfully logged in." });
      
      // Check for 2FA
      if (auth.currentUser) {
        try {
          const userDoc = await getDoc(usersRef(auth.currentUser.uid));
          const userData = userDoc.data();
          
          if (userData?.twoFactorEnabled && userData?.role && ["admin", "teacher"].includes(userData.role)) {
            navigate("/verify-2fa");
          } else {
            navigate("/dashboard");
          }
        } catch {
          navigate("/dashboard");
        }
      }
    } catch (error: any) {
      const errorCode = error.code;
      if (errorCode === "auth/user-not-found") {
        toast({
          title: "Account Not Found",
          description: "No account found with this email. Please sign up.",
          variant: "destructive",
        });
      } else if (errorCode === "auth/wrong-password") {
        toast({
          title: "Incorrect Password",
          description: "The password you entered is incorrect.",
          variant: "destructive",
        });
      } else if (errorCode === "auth/too-many-requests") {
        toast({
          title: "Too Many Failed Attempts",
          description: "Your account is temporarily locked. Try again later or reset your password.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login Failed",
          description: error.message || "Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsPending(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch {
      toast({ title: "Error", description: "Google login failed.", variant: "destructive" });
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Enter your email",
        description: "Please enter your email address above first.",
        variant: "destructive",
      });
      return;
    }
    setForgotLoading(true);
    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/reset-password`,
        handleCodeInApp: true,
      });
      toast({
        title: "Reset email sent!",
        description: `Check your inbox at ${email} for the password reset link.`,
      });
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        toast({
          title: "Email Not Found",
          description: "No account found with this email.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send reset email. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setForgotLoading(false);
    }
  };

  if (isLoading && !user) {
    return <LoadingScreen message="Checking your session..." fullScreen />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4" style={{ background: "var(--gradient-hero)" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-bg mb-2"
            >
              <GraduationCap className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <h1 className="text-2xl font-bold font-display text-card-foreground">Welcome Back</h1>
            <p className="text-muted-foreground text-sm">Sign in to your learning dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-card-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-card-foreground">
                  Password
                </Label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={forgotLoading}
                  className="text-xs text-primary hover:underline font-medium disabled:opacity-50 flex items-center gap-1"
                >
                  {forgotLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full gradient-bg text-primary-foreground font-semibold" disabled={isPending}>
              {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Sign In
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={handleGoogle} disabled={isPending}>
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex gap-3">
            <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-900">
              <strong>Note:</strong> You must verify your email before signing in for security.
            </p>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
