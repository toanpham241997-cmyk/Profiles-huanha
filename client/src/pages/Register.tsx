import { useState } from "react";
import { useRegister } from "@/hooks/use-auth";
import { TechButton } from "@/components/TechButton";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Lock, User, Shield } from "lucide-react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: register, isPending } = useRegister();
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register({ username, password }, {
      onSuccess: () => setLocation("/login")
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/90 backdrop-blur-xl border-2 border-primary/20 p-8 shadow-2xl clip-tech-card">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">Create Uplink</h1>
            <p className="text-muted-foreground font-tech uppercase tracking-widest text-sm">New User Registration</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold font-display uppercase text-primary ml-1">Identity</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-secondary/30 border-2 border-secondary focus:border-primary px-10 py-3 outline-none transition-colors font-body clip-button"
                  placeholder="Choose username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold font-display uppercase text-primary ml-1">Secure Key</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-secondary/30 border-2 border-secondary focus:border-primary px-10 py-3 outline-none transition-colors font-body clip-button"
                  placeholder="Create password"
                />
              </div>
            </div>

            <TechButton 
              type="submit" 
              className="w-full" 
              size="lg"
              variant="outline"
              isLoading={isPending}
              icon={<Shield className="w-4 h-4" />}
            >
              Establish Link
            </TechButton>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already linked? </span>
            <a href="/login" className="text-primary font-bold hover:underline font-display uppercase">Access Portal</a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
