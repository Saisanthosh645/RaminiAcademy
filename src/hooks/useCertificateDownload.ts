import { useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useToast } from "@/hooks/use-toast";

export const useCertificateDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const captureCanvas = async (elementId: string) => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with id ${elementId} not found`);
      toast({
        title: "Element not found",
        description: "Capture failed: the certificate element is missing from the DOM.",
        variant: "destructive",
      });
      return null;
    }

    try {
      await document.fonts.ready;
      await new Promise((resolve) => setTimeout(resolve, 800)); // Ensure everything is rendered

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: true,
        width: 1123,
        height: 794,
        scrollY: 0,
        x: 0,
        y: 0,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById(elementId);
          if (el) {
            el.style.position = 'fixed';
            el.style.top = '0';
            el.style.left = '0';
            el.style.opacity = '1';
            el.style.visibility = 'visible';
            el.style.display = 'block';
            el.style.zIndex = '9999';
            el.style.transform = 'none';
          }
        }
      });

      return canvas;
    } catch (error) {
      console.error("Canvas capture failed:", error);
      return null;
    }
  };

  const downloadPDF = async (elementId: string, studentName: string = "Student") => {
    setIsDownloading(true);
    try {
      const canvas = await captureCanvas(elementId);
      if (!canvas) throw new Error("Could not capture certificate");

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF('l', 'px', [1123, 794]);
      pdf.addImage(imgData, "PNG", 0, 0, 1123, 794);
      
      const fileName = `Certificate_${(studentName || "Student").replace(/\s+/g, "_")}.pdf`;
      pdf.save(fileName);
      
      toast({
        title: "Success",
        description: "Certificate PDF downloaded!",
      });
      return true;
    } catch (error) {
      console.error("PDF download failed:", error);
      toast({
        title: "Download Failed",
        description: "An error occurred while generating the PDF. Please try PNG download as a fallback.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadImage = async (elementId: string, studentName: string = "Student") => {
    setIsDownloading(true);
    try {
      const canvas = await captureCanvas(elementId);
      if (!canvas) throw new Error("Could not capture certificate");

      const imgData = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `Certificate_${(studentName || "Student").replace(/\s+/g, "_")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success",
        description: "Certificate image downloaded!",
      });
      return true;
    } catch (error) {
      console.error("Image download failed:", error);
      toast({
        title: "Download Failed",
        description: "An error occurred while generating the image.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadPDF, downloadImage, isDownloading };
};
