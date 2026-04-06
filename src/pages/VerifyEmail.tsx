import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GraduationCap, Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { auth } from "@/firebase/auth";
import { applyActionCode, checkActionCode } from "firebase/auth";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { toast } = useToast();
  const { user, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If already verified, go to login
    if (user?.emailVerified) {
      navigate("/login", { replace: true });
      return;
    }

    // Check if verification was done from email link
    const oobCode = searchParams.get("oobCode");

    if (oobCode) {
      verifyWithCode(oobCode);
    } else {
      setLoading(false);
    }
  }, [searchParams, user?.emailVerified, navigate]);

  const verifyWithCode = async (code: string) => {
    setVerifying(true);
    try {
      // Check if code is valid
      const result = await checkActionCode(auth, code);
      
      if (result.email) {
        // Apply the code to verify email
        await applyActionCode(auth, code);
        
        // Reload auth to get updated emailVerified status
        if (auth.currentUser) {
          await auth.currentUser.reload();
        }
        
        setVerified(true);
        toast({
          title: "Email Verified! ✓",
          description: "Your email has been successfully verified.",
        });
        
        // Set flag in localStorage to bypass check on login page
        localStorage.setItem("emailJustVerified", "true");
        
        // Redirect to login after 2 seconds
        setTimeout(() => navigate("/login", { replace: true }), 2000);
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid verification link",
        variant: "destructive",
      });
      setVerified(false);
    } finally {
      setVerifying(false);
      setLoading(false);
    }
  };

  const handleContinue = () => {
    // Set flag in localStorage to bypass check on login page
    localStorage.setItem("emailJustVerified", "true");
    // Force a window reload to refresh auth state
    window.location.href = "/login";
  };

  const handleResendEmail = async () => {
    setResendLoading(true);
    try {
      await resendVerificationEmail();
      toast({
        title: "Email Resent ✓",
        description: `Verification link sent to ${user?.email}`,
      });
    } catch (error) {
      console.error("Resend error:", error);
      toast({
        title: "Error",
        description: "Failed to resend email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setResendLoading(false);
    }
  };

  if (loading && verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Verifying your email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4" style={{ background: "var(--gradient-hero)" }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
        <div className="glass-card rounded-2xl p-8 space-y-6">
          {verified ? (
            <>
              <div className="text-center space-y-2">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 mb-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </motion.div>
                <h1 className="text-2xl font-bold font-display text-card-foreground">Email Verified!</h1>
                <p className="text-muted-foreground text-sm">You can now sign in with your account</p>
              </div>
              <div className="text-center space-y-3">
                <Button onClick={handleContinue} className="w-full gradient-bg text-primary-foreground font-semibold">
                  Continue to Login
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center space-y-2">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-bg mb-2">
                  <GraduationCap className="w-8 h-8 text-primary-foreground" />
                </motion.div>
                <h1 className="text-2xl font-bold font-display text-card-foreground">Verify Your Email</h1>
                <p className="text-muted-foreground text-sm">Click the link we sent to activate your account</p>
              </div>

              {/* Email Check */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex gap-3">
                <Mail className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-card-foreground text-sm">Check your email</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    We sent a verification link to <strong>{user?.email}</strong>. Click the link to verify.
                  </p>
                </div>
              </div>

              {/* Spam Folder Tip */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex gap-3">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-900">
                  <strong>Tip:</strong> Check your spam or promotions folder if you don't see it.
                </p>
              </div>

              {/* Resend Button */}
              <Button
                onClick={handleResendEmail}
                disabled={resendLoading}
                variant="outline"
                className="w-full"
              >
                {resendLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  "Resend Email"
                )}
              </Button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
