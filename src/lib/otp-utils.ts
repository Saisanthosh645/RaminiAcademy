/**
 * OTP (One-Time Password) utilities for 2FA
 */

export interface OTPData {
  code: string;
  expiresAt: number;
  attempts: number;
  maxAttempts: number;
}

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 5;

/**
 * Generate a random OTP code
 */
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Create OTP data object with expiry
 */
export const createOTPData = (): OTPData => {
  return {
    code: generateOTP(),
    expiresAt: Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000,
    attempts: 0,
    maxAttempts: MAX_OTP_ATTEMPTS,
  };
};

/**
 * Verify OTP code
 */
export const verifyOTP = (
  inputCode: string,
  otpData: OTPData
): { valid: boolean; message: string } => {
  if (Date.now() > otpData.expiresAt) {
    return { valid: false, message: "OTP has expired. Please request a new one." };
  }

  if (otpData.attempts >= otpData.maxAttempts) {
    return { valid: false, message: "Too many failed attempts. Please request a new OTP." };
  }

  if (inputCode === otpData.code) {
    return { valid: true, message: "OTP verified successfully." };
  }

  return {
    valid: false,
    message: `Invalid OTP. ${otpData.maxAttempts - otpData.attempts - 1} attempts remaining.`,
  };
};

/**
 * Get remaining time for OTP in seconds
 */
export const getOTPRemainingTime = (otpData: OTPData): number => {
  const remaining = Math.ceil((otpData.expiresAt - Date.now()) / 1000);
  return Math.max(0, remaining);
};

/**
 * Format OTP time remaining as string (MM:SS)
 */
export const formatOTPTime = (otpData: OTPData): string => {
  const seconds = getOTPRemainingTime(otpData);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};
