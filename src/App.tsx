import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { getDocs } from "firebase/firestore";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/components/ThemeProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Courses from "@/pages/Courses";
import CourseDetail from "@/pages/CourseDetail";
import Profile from "@/pages/Profile";
import Schedule from "@/pages/Schedule";
import VerifyCertificate from "@/pages/VerifyCertificate";
import NotFound from "@/pages/NotFound";
import { coursesCollection } from "@/firebase/firestore";
import { seedCourses } from "@/firebase/seedCourses";

const queryClient = new QueryClient();

const AppContent = () => {
  useEffect(() => {
    const initializeSeeding = async () => {
      // Client-side seed requires Firestore rules that allow course writes.
      // In production, seed with Admin SDK and keep rules locked down.
      const allowClientSeed =
        import.meta.env.VITE_ENABLE_CLIENT_COURSE_SEED === "true" || import.meta.env.DEV;
      if (!allowClientSeed) {
        return;
      }
      try {
        const snapshot = await getDocs(coursesCollection);
        // In dev: always re-seed so local price/data changes propagate to Firestore instantly.
        // In prod: only seed if Firestore is empty (first-time setup).
        if (snapshot.empty || import.meta.env.DEV) {
          await seedCourses();
        }
      } catch (error) {
        // Silent in production; log in dev
        if (import.meta.env.DEV) console.error("Seeding error:", error);
      }
    };

    initializeSeeding();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />
          <Route path="/course/:courseId" element={<CourseDetail />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/verify/:certificateId" element={<VerifyCertificate />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
