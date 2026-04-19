import { QRCodeCanvas } from "qrcode.react";
import React from "react";

interface CertificateProps {
  id?: string;
  userName: string;
  courseTitle: string;
  score: number;
  grade: string;
  date: string;
  certId: string;
  verificationUrl: string;
  isSample?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export const Certificate = React.forwardRef<HTMLDivElement, CertificateProps>(
  ({ id, userName, courseTitle, score, grade, date, certId, verificationUrl, isSample, style, className }, ref) => {
    return (
      <div 
        ref={ref}
        id={id}
        className={`relative bg-white overflow-hidden shrink-0 select-none ${className}`}
        style={{ 
          width: "1123px", 
          height: "794px",
          color: "#0f172a", // Forced dark slate text
          fontFamily: "'Inter', sans-serif",
          ...style 
        }}
      >
        {/* Main Background Layer */}
        <div className="absolute inset-0 bg-white"></div>
        
        {/* Architectural Borders (Forced Light Theme) */}
        <div className="absolute inset-0 m-10 border-[1px] border-slate-100"></div>
        <div className="absolute inset-[48px] border-[1px] border-slate-200"></div>
        <div className="absolute inset-16 border-[6px] border-double border-[#0ea5e9]/20 rounded-sm"></div>

        {/* Ornament Corners */}
        <div className="absolute top-16 left-16 w-16 h-16 border-t-[4px] border-l-[4px] border-[#0ea5e9]/30 rounded-tl-sm"></div>
        <div className="absolute top-16 right-16 w-16 h-16 border-t-[4px] border-r-[4px] border-[#0ea5e9]/30 rounded-tr-sm"></div>
        <div className="absolute bottom-16 left-16 w-16 h-16 border-b-[4px] border-l-[4px] border-[#0ea5e9]/30 rounded-bl-sm"></div>
        <div className="absolute bottom-16 right-16 w-16 h-16 border-b-[4px] border-r-[4px] border-[#0ea5e9]/30 rounded-br-sm"></div>

        {/* Content Container */}
        <div className="relative h-full flex flex-col items-center p-12 text-center z-10">
          {/* Header Section - Compact */}
          <div className="mb-6 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-white shadow-lg ring-4 ring-slate-50 overflow-hidden mb-4 flex items-center justify-center border border-slate-100">
              <img src="/android-chrome-192x192.png" alt="Logo" className="w-12 h-12 object-contain" />
            </div>
            <h1 className="text-5xl font-black tracking-[0.2em] uppercase italic text-[#0ea5e9] leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Certificate
            </h1>
            <p className="text-[12px] tracking-[0.6em] text-slate-300 font-bold uppercase mt-2">
              Of Professional Achievement
            </p>
          </div>

          {/* Main Award Body - Better Spacing */}
          <div className="flex-1 flex flex-col justify-center space-y-8 w-full px-16">
            <div className="space-y-4">
              <p className="text-[12px] text-slate-400 uppercase tracking-[0.3em] font-bold">This award is presented to</p>
              <h2 className="text-7xl font-bold italic text-slate-900 tracking-tight leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
                {userName || "Student Name"}
              </h2>
              <div className="h-1 w-48 bg-gradient-to-r from-transparent via-[#0ea5e9]/30 to-transparent mx-auto mt-4"></div>
            </div>

            <div className="space-y-6 max-w-4xl mx-auto">
              <p className="text-[11px] text-slate-400 uppercase tracking-widest font-extrabold leading-relaxed">
                For having successfully mastered the industry-standard curriculum <br /> and demonstrated verified proficiency in the professional discipline of:
              </p>
              <div className="space-y-6">
                <h3 className="text-5xl font-black text-slate-800 uppercase tracking-tight italic bg-slate-50/50 py-5 px-16 rounded-2xl border border-slate-100 inline-block font-sans" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {courseTitle || "Course Title"}
                </h3>
                
                <div className="flex items-center justify-center gap-8">
                  <div className="h-px w-20 bg-slate-100"></div>
                  <div className="inline-flex items-center gap-8 py-2 px-10 bg-white shadow-sm rounded-full border border-slate-100 text-[12px] font-mono font-bold text-[#0ea5e9] tracking-widest uppercase">
                    <span>Performance Metric: {score}%</span>
                    <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                    <span>Class Standard: {grade}</span>
                  </div>
                  <div className="h-px w-20 bg-slate-100"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Verification & Authority Footer - Fixed at Bottom */}
          <div className="w-full mt-4 grid grid-cols-3 items-end gap-10 border-t border-slate-100 pt-8 px-10">
            {/* Verification Zone (Left) */}
            <div className="flex items-center gap-4 text-left">
              <div className="p-1.5 bg-white rounded-lg shadow-lg ring-1 ring-slate-100 shrink-0">
                <QRCodeCanvas value={verificationUrl} size={75} level="H" includeMargin={false} />
              </div>
              <div className="space-y-1 min-w-0">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">Auth-ID Token</p>
                <p className="text-[12px] font-mono font-bold text-[#0ea5e9] leading-none truncate max-w-[140px]">
                  {certId || "PENDING"}
                </p>
                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest leading-none pt-3">Global Portal</p>
                <p className="text-[9px] font-mono text-slate-500 truncate leading-none">
                  {verificationUrl.replace(/^https?:\/\//, '')}
                </p>
              </div>
            </div>

            {/* Authority Zone (Center) */}
            <div className="flex flex-col items-center">
              <div 
                className="mb-2 italic text-3xl text-slate-800 opacity-90 select-none" 
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Ramini Academy
              </div>
              <div className="h-px w-56 bg-slate-200 mb-2"></div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Authorized Academic Official</p>
            </div>

            {/* Date Zone (Right) */}
            <div className="flex flex-col items-center min-w-[180px]">
              <p className="text-xl font-bold text-slate-800 italic mb-3 leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
                {date}
              </p>
              <div className="h-px w-48 bg-slate-200 mb-2"></div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Date of Global Award</p>
            </div>
          </div>
        </div>

        {/* Global Seal Design Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(14,165,233,0.02)_0%,transparent_70%)] pointer-events-none"></div>

        {/* Sample Watermark */}
        {isSample && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden">
            <div className="rotate-[-35deg] text-[120px] font-black text-slate-500/[0.15] uppercase tracking-[0.1em] whitespace-nowrap select-none border-[15px] border-slate-500/[0.15] px-20 py-10 rounded-[40px]">
              Sample Certificate
            </div>
          </div>
        )}
      </div>
    );
  }
);

Certificate.displayName = "Certificate";
