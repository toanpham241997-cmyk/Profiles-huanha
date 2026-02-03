import { useState } from "react";
import { useLogin } from "@/hooks/use-auth";
import { TechButton } from "@/components/TechButton";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Lock, User } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: login, isPending } = useLogin();
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ username, password }, {
      onSuccess: () => setLocation("/")
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />
        <div className="absolute -top-1/2 -left-1/2 w-full h-full border-[100px] border-secondary/20 rounded-full animate-spin-slow" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 p-8 shadow-2xl clip-tech-card relative">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">System Access</h1>
            <p className="text-muted-foreground font-tech uppercase tracking-widest text-sm">Authentication Required</p>
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
                  placeholder="Username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold font-display uppercase text-primary ml-1">Passcode</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-secondary/30 border-2 border-secondary focus:border-primary px-10 py-3 outline-none transition-colors font-body clip-button"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <TechButton 
              type="submit" 
              className="w-full" 
              size="lg"
              isLoading={isPending}
            >
              Initialize Session
            </TechButton>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">New user? </span>
            <a href="/register" className="text-primary font-bold hover:underline font-display uppercase">Register Access</a>
          </div>

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary" />
        </div>
      </motion.div>
    </div>
  );
}
