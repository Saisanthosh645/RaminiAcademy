import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firestore";
import { COLLECTIONS } from "@/firebase/collections";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Award, Calendar, User, BookOpen, ExternalLink, ShieldCheck } from "lucide-react";
import { LoadingScreen } from "@/components/LoadingScreen";
import type { Certificate } from "@/types/firebase";

const VerifyCertificate = () => {
  const { certificateId } = useParams<{ certificateId: string }>();
  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      if (!certificateId) return;

      try {
        const certsRef = collection(db, COLLECTIONS.certificates);
        const q = query(certsRef, where("id", "==", certificateId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError("Invalid Certificate ID");
        } else {
          setCertificate(querySnapshot.docs[0].data() as Certificate);
        }
      } catch (err) {
        console.error("Error fetching certificate:", err);
        setError("An error occurred during verification");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [certificateId]);

  if (loading) return <LoadingScreen message="Verifying Certificate..." fullScreen />;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-10 space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Certificate Verification
          </h1>
          <p className="text-muted-foreground">
            Verifying the authenticity of Ramini Academy completion certificates.
          </p>
        </div>

        {certificate ? (
          <Card className="border-2 border-primary/20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 text-sm font-semibold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Valid
              </Badge>
            </div>
            
            <CardHeader className="pt-8 pb-4 text-center border-b border-border/50">
              <CardTitle className="text-2xl font-black text-primary uppercase tracking-widest font-display italic">
                Verified Achievement
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-8 pt-8 px-6 sm:px-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-1.5 group">
                  <div className="flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-widest gap-2">
                    <User className="w-3.5 h-3.5" /> Recipient
                  </div>
                  <p className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {certificate.userName}
                  </p>
                </div>

                <div className="space-y-1.5 group">
                  <div className="flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-widest gap-2">
                    <BookOpen className="w-3.5 h-3.5" /> Course
                  </div>
                  <p className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {certificate.courseName}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-widest gap-2">
                    <Award className="w-3.5 h-3.5" /> Certificate ID
                  </div>
                  <p className="font-mono text-base font-medium text-foreground bg-muted/50 px-2 py-1 rounded">
                    {certificate.id}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-widest gap-2">
                    <Calendar className="w-3.5 h-3.5" /> Date of Issue
                  </div>
                  <p className="text-base font-medium text-foreground">
                    {new Date(certificate.dateOfIssue).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-border/50">
                <div className="bg-primary/5 rounded-xl p-4 flex items-start gap-4">
                  <ShieldCheck className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-primary">Official Record</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      This certificate is an official document from Ramini Academy. It confirms the completion of the mentioned course and verification of the recipient's identity through our secure platform.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-destructive/20 shadow-xl overflow-hidden">
            <div className="p-8 text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 text-destructive mb-2">
                <XCircle className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Verification Failed</h2>
                <p className="text-muted-foreground">
                  The Certificate ID <span className="font-mono font-bold text-destructive">"{certificateId}"</span> was not found in our database or is invalid.
                </p>
              </div>
              <Button asChild variant="outline" className="mt-4">
                <a href="/">Back to Home</a>
              </Button>
            </div>
          </Card>
        )}

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-6">
            © {new Date().getFullYear()} Ramini Academy. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
             {/* Small logo placeholder */}
             <img src="/favicon.ico" alt="Logo" className="w-8 h-8" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificate;
