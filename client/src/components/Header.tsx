import { Link } from "wouter";
import { useUser, useLogout } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Menu, User as UserIcon, LogOut, ChevronRight } from "lucide-react";
import { TechButton } from "./TechButton";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const { data: user } = useUser();
  const { mutate: logout } = useLogout();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b-2 border-primary/10">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo Area - Click to open sidebar if logged in */}
          <div 
            className="flex items-center gap-4 cursor-pointer group"
            onClick={() => user && setSidebarOpen(true)}
          >
            <div className="relative w-10 h-10 bg-primary clip-button flex items-center justify-center group-hover:bg-accent transition-colors">
              <span className="font-display font-bold text-white text-xl">H</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-lg leading-none">Hà Văn Huấn</h1>
              <p className="font-tech text-xs text-muted-foreground uppercase tracking-widest">Fullstack Developer</p>
            </div>
          </div>

          {/* Navigation / User Area */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <span className="font-tech text-sm text-muted-foreground">
                  Welcome, <span className="text-primary font-bold">{user.username}</span>
                </span>
                <TechButton variant="outline" size="sm" onClick={() => setSidebarOpen(true)} icon={<Menu className="w-4 h-4" />}>
                  Menu
                </TechButton>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/login">
                  <TechButton variant="ghost" size="sm">Login</TechButton>
                </Link>
                <Link href="/register">
                  <TechButton variant="primary" size="sm">Register</TechButton>
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Decorative bottom border line with accent */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
      </header>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && user && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed top-0 left-0 h-full w-80 bg-background z-50 border-r-4 border-primary shadow-2xl"
            >
              <div className="p-8 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-display text-primary">Profile</h2>
                  <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-muted rounded-full">
                    <ChevronRight className="w-6 h-6 rotate-180" />
                  </button>
                </div>

                <div className="bg-secondary/30 p-6 clip-tech-card mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold">{user.username}</h3>
                      <p className="text-xs text-muted-foreground uppercase">{user.role}</p>
                    </div>
                  </div>
                  <div className="space-y-2 font-tech text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Member Since</span>
                      <span>2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className="text-green-500 font-bold">Active</span>
                    </div>
                  </div>
                </div>

                <nav className="space-y-2 flex-1">
                  <button className="w-full text-left px-4 py-3 hover:bg-primary/5 border-l-2 border-transparent hover:border-primary transition-all font-display uppercase text-sm">
                    Dashboard
                  </button>
                  <button className="w-full text-left px-4 py-3 hover:bg-primary/5 border-l-2 border-transparent hover:border-primary transition-all font-display uppercase text-sm">
                    My Orders
                  </button>
                  <button className="w-full text-left px-4 py-3 hover:bg-primary/5 border-l-2 border-transparent hover:border-primary transition-all font-display uppercase text-sm">
                    Settings
                  </button>
                </nav>

                <TechButton 
                  variant="destructive" 
                  className="w-full mt-auto" 
                  onClick={() => {
                    logout();
                    setSidebarOpen(false);
                  }}
                  icon={<LogOut className="w-4 h-4" />}
                >
                  Logout
                </TechButton>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
