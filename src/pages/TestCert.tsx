import React, { useEffect, useState } from "react";
import { Certificate } from "@/components/Certificate";
import { useCertificateDownload } from "@/hooks/useCertificateDownload";

const TestCert = () => {
  const { downloadPDF, downloadImage, isDownloading } = useCertificateDownload();
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const handleTestDownload = async () => {
    try {
      const success = await downloadPDF("certificate-capture", "Test User");
      if (!success) setErrorDetails("PDF Download failed. Check console.");
      else setErrorDetails("PDF Download success!");
    } catch (e: any) {
      setErrorDetails(e.message || String(e));
    }
  };

  const handleTestImageDownload = async () => {
    try {
      const success = await downloadImage("certificate-capture", "Test User");
      if (!success) setErrorDetails("Image Download failed. Check console.");
      else setErrorDetails("Image Download success!");
    } catch (e: any) {
      setErrorDetails(e.message || String(e));
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Test Certificate Download</h1>
      <div className="flex gap-4 mb-4">
        <button 
          id="test-download-btn"
          className="px-4 py-2 bg-blue-500 text-white rounded" 
          onClick={handleTestDownload} 
          disabled={isDownloading}
        >
          {isDownloading ? "Downloading..." : "Download Test PDF"}
        </button>
        <button 
          id="test-image-btn"
          className="px-4 py-2 bg-emerald-500 text-white rounded" 
          onClick={handleTestImageDownload} 
          disabled={isDownloading}
        >
          {isDownloading ? "Downloading..." : "Download Test Image"}
        </button>
      </div>
      
      {errorDetails && (
        <div id="error-output" className="p-4 bg-red-100 text-red-800 rounded mb-4">
          {errorDetails}
        </div>
      )}

      {/* Visible so we can see if it renders at all */}
      <div className="border border-gray-300 inline-block overflow-hidden" style={{ transform: 'scale(0.5)', transformOrigin: 'top left' }}>
        <Certificate 
          id="certificate-capture"
          userName="Jane Doe"
          courseTitle="Advanced React Patterns"
          score={95}
          grade="Distinction"
          date="March 31, 2026"
          certId="TEST-CERT-123"
          verificationUrl="http://localhost:5173/verify/TEST-CERT-123"
        />
      </div>
    </div>
  );
};

export default TestCert;
