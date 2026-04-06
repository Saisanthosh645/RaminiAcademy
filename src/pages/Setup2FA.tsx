import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Shield, Loader2, CheckCircle2, AlertCircle, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { createOTPData, formatOTPTime, OTPData } from "@/lib/otp-utils";
import { usersRef } from "@/firebase/firestore";
import { updateDoc } from "firebase/firestore";

const Setup2FA = () => {
  const [step, setStep] = useState<"setup" | "verify" | "backup" | "complete">("setup");
  const [otp, setOtp] = useState<OTPData | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [verified2FA, setVerified2FA] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const generateBackupCodes = (): string[] => {
    return Array.from({ length: 10 }, () =>
      Math.random().toString(36).substring(2, 10).toUpperCase()
    );
  };

  const handleSetup = async () => {
    setLoading(true);
    try {
      const newOTP = createOTPData();
      setOtp(newOTP);
      setBackupCodes(generateBackupCodes());
      setStep("verify");
      toast({
        title: "OTP Generated",
        description: `A 6-digit code has been generated. You have 10 minutes.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to generate OTP",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;

    setLoading(true);
    try {
      if (verificationCode === otp.code) {
        setVerified2FA(true);
        setStep("backup");
        toast({
          title: "OTP Verified!",
          description: "Save your backup codes in a safe place",
        });
      } else {
        toast({
          title: "Invalid Code",
          description: "The code you entered is incorrect",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEnableOTP = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await updateDoc(usersRef(user.uid), {
        twoFactorEnabled: true,
      });
      toast({
        title: "2FA Enabled! ✓",
        description: "Two-factor authentication is now active on your account",
      });
      setStep("complete");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch {
      toast({
        title: "Error",
        description: "Failed to enable 2FA",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Backup codes copied to clipboard",
    });
  };

  const copyAllBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"));
    toast({
      title: "Copied!",
      description: "All backup codes copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4" style={{ background: "var(--gradient-hero)" }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
        <div className="glass-card rounded-2xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-2 ${
                step === "complete" ? "bg-emerald-500/10" : "gradient-bg"
              }`}
            >
              {step === "complete" ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              ) : (
                <Shield className="w-8 h-8 text-primary-foreground" />
              )}
            </motion.div>
            <h1 className="text-2xl font-bold font-display text-card-foreground">
              {step === "setup" && "Enable Two-Factor Authentication"}
              {step === "verify" && "Verify Your Account"}
              {step === "backup" && "Save Backup Codes"}
              {step === "complete" && "2FA Enabled!"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {step === "setup" && "Add an extra layer of security to your account"}
              {step === "verify" && `Enter the 6-digit code we generated`}
              {step === "backup" && "Keep these codes safe for account recovery"}
              {step === "complete" && "Your account is now protected"}
            </p>
          </div>

          {/* Setup Step */}
          {step === "setup" && (
            <>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 space-y-2">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-card-foreground">Why 2FA?</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      Two-factor authentication adds an extra security layer. You'll need to verify with a code each time you log in.
                    </p>
                  </div>
                </div>
              </div>

              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary font-bold">1</span>
                  <span>Click "Generate Code" to create your OTP</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">2</span>
                  <span>Enter the code in the next screen to verify</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">3</span>
                  <span>Save the backup codes for account recovery</span>
                </li>
              </ul>

              <Button onClick={handleSetup} className="w-full gradient-bg text-primary-foreground font-semibold" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Generate Code
              </Button>
            </>
          )}

          {/* Verify Step */}
          {step === "verify" && otp && (
            <>
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                  <p className="text-xs text-amber-900">
                    <strong>Code expires in:</strong> {formatOTPTime(otp)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-card-foreground">Your 6-Digit Code</Label>
                  <div className="text-center text-2xl font-mono tracking-widest font-bold text-primary">
                    {otp.code}
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    This code was generated and will be used for verification
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verification" className="text-card-foreground">
                    Enter Code to Confirm
                  </Label>
                  <Input
                    id="verification"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    maxLength={6}
                    className="text-center text-2xl tracking-widest"
                  />
                  <p className="text-xs text-muted-foreground">Type the code above to verify</p>
                </div>

                <Button type="submit" className="w-full gradient-bg text-primary-foreground font-semibold" disabled={verificationCode.length !== 6 || loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Verify Code
                </Button>
              </form>
            </>
          )}

          {/* Backup Codes Step */}
          {step === "backup" && backupCodes.length > 0 && (
            <>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-card-foreground">Save These Codes</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    If you lose access to your device, these codes will help you recover your account. Keep them somewhere safe!
                  </p>
                </div>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {backupCodes.map((code, i) => (
                    <div
                      key={i}
                      onClick={() => copyToClipboard(code)}
                      className="font-mono text-sm bg-card p-2 rounded text-center cursor-pointer hover:bg-primary/10 transition-colors"
                    >
                      {code}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={copyAllBackupCodes}
                  className="w-full flex items-center justify-center gap-2 text-xs text-primary hover:underline"
                >
                  <Copy className="w-3 h-3" />
                  Copy All Codes
                </button>
              </div>

              <Button onClick={handleEnableOTP} className="w-full gradient-bg text-primary-foreground font-semibold" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Enable 2FA
              </Button>
            </>
          )}

          {/* Complete Step */}
          {step === "complete" && (
            <>
              <div className="text-center space-y-4">
                <div className="bg-emerald-500/10 rounded-lg p-6">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Redirecting to dashboard...</p>
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                </div>
              </div>
            </>
          )}

          {/* Skip 2FA for now (only on setup step) */}
          {step === "setup" && (
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full text-sm text-muted-foreground hover:text-foreground text-center py-2"
            >
              Skip for now
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Setup2FA;
