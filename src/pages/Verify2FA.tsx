import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Shield, Loader2, AlertCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { createOTPData, verifyOTP, formatOTPTime, OTPData } from "@/lib/otp-utils";

const Verify2FA = () => {
  const [otp, setOtp] = useState<OTPData | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize OTP on component mount
    const newOTP = createOTPData();
    setOtp(newOTP);
  }, []);

  useEffect(() => {
    // Check OTP expiry
    if (otp && new Date().getTime() > otp.expiresAt) {
      toast({
        title: "OTP Expired",
        description: "Your verification code has expired. Please request a new one.",
        variant: "destructive",
      });
      setOtp(null);
    }
  }, [otp]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;

    setLoading(true);
    try {
      const result = verifyOTP(verificationCode, otp);

      if (result.valid) {
        toast({
          title: "Verified! ✓",
          description: "You have been successfully verified.",
        });
        // Redirect to dashboard
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= otp.maxAttempts) {
          toast({
            title: "Too Many Attempts",
            description: "Please request a new OTP code.",
            variant: "destructive",
          });
          setOtp(null);
        } else {
          toast({
            title: "Invalid Code",
            description: result.message,
            variant: "destructive",
          });
        }
      }
    } finally {
      setLoading(false);
      setVerificationCode("");
    }
  };

  const handleResendOTP = () => {
    setIsResending(true);
    try {
      const newOTP = createOTPData();
      setOtp(newOTP);
      setAttempts(0);
      setVerificationCode("");
      toast({
        title: "New OTP Generated",
        description: "A new 6-digit verification code has been generated.",
      });
    } finally {
      setIsResending(false);
    }
  };

  if (!otp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Generating verification code...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4" style={{ background: "var(--gradient-hero)" }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
        <div className="glass-card rounded-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-bg mb-2">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <h1 className="text-2xl font-bold font-display text-card-foreground">Two-Factor Authentication</h1>
            <p className="text-muted-foreground text-sm">Enter your verification code to continue</p>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
            <p className="text-xs text-amber-900 flex items-center gap-2">
              <Clock className="w-3 h-3 flex-shrink-0" />
              <strong>Code expires in:</strong> {formatOTPTime(otp)}
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-card-foreground">Your 6-Digit Code</Label>
              <div className="text-center text-3xl font-mono tracking-widest font-bold text-primary">
                {otp.code}
              </div>
              <p className="text-xs text-center text-muted-foreground">
                This code was generated for your account
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verification" className="text-card-foreground">
                Enter Code to Verify
              </Label>
              <Input
                id="verification"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                className="text-center text-2xl tracking-widest"
              />
              <p className="text-xs text-muted-foreground">Type the code above to verify your identity</p>
            </div>

            {attempts > 0 && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-xs text-red-900">
                  {otp.maxAttempts - attempts} attempt{otp.maxAttempts - attempts !== 1 ? "s" : ""} remaining
                </p>
              </div>
            )}

            <Button type="submit" className="w-full gradient-bg text-primary-foreground font-semibold" disabled={verificationCode.length !== 6 || loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Verify & Continue
            </Button>
          </form>

          <button
            onClick={handleResendOTP}
            disabled={isResending}
            className="w-full text-sm text-primary hover:underline font-medium disabled:opacity-50"
          >
            {isResending ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin mr-2 inline" />
                Generating new code...
              </>
            ) : (
              "Generate new code"
            )}
          </button>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex gap-3">
            <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-900">
              <strong>Note:</strong> Two-factor authentication is enabled on your account for added security.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Verify2FA;
