import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";
import { TechButton } from "@/components/TechButton";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="text-center space-y-8 p-8 max-w-lg mx-auto">
        <div className="flex justify-center mb-6">
          <div className="p-6 bg-destructive/10 rounded-full animate-pulse">
            <AlertTriangle className="h-20 w-20 text-destructive" />
          </div>
        </div>
        
        <h1 className="text-6xl font-display font-black text-foreground">404</h1>
        <h2 className="text-2xl font-tech uppercase tracking-widest text-muted-foreground">System Malfunction</h2>
        
        <p className="text-lg text-muted-foreground leading-relaxed">
          The requested coordinate sector does not exist or has been purged from the database.
        </p>

        <Link href="/">
          <TechButton size="lg" className="mt-8">
            Return to Base
          </TechButton>
        </Link>
      </div>
    </div>
  );
}
