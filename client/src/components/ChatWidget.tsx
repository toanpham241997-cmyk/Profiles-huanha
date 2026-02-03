import { useState, useEffect, useRef } from "react";
import { useUser } from "@/hooks/use-auth";
import { useCreateConversation, useChatStream } from "@/hooks/use-chat";
import { TechButton } from "./TechButton";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function ChatWidget() {
  const { data: user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  
  const { mutateAsync: createConversation } = useCreateConversation();
  const { messages, isStreaming, sendMessage } = useChatStream(conversationId);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Create conversation on open if none exists
  useEffect(() => {
    if (isOpen && !conversationId && user) {
      createConversation("Support Chat").then(conv => setConversationId(conv.id));
    }
  }, [isOpen, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isStreaming) return;
    
    sendMessage(inputValue);
    setInputValue("");
  };

  if (!user) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-background border-2 border-primary z-50 shadow-2xl clip-tech-card flex flex-col"
          >
            {/* Header */}
            <div className="bg-primary p-4 flex items-center justify-between text-primary-foreground">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm">Huấn Hà Support</h3>
                  <p className="text-xs opacity-80 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/10">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Hello! How can I help you today?</p>
                </div>
              )}
              
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3 max-w-[85%]",
                    msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    msg.role === "user" ? "bg-accent" : "bg-primary"
                  )}>
                    {msg.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                  </div>
                  <div className={cn(
                    "p-3 rounded-lg text-sm",
                    msg.role === "user" 
                      ? "bg-accent/10 border border-accent/20 text-foreground rounded-tr-none" 
                      : "bg-primary/10 border border-primary/20 text-foreground rounded-tl-none"
                  )}>
                    {msg.content || <span className="animate-pulse">Thinking...</span>}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 border-t bg-background">
              <div className="flex gap-2">
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about our services..."
                  disabled={isStreaming}
                  className="flex-1 bg-secondary/50 border border-input px-3 py-2 rounded focus:outline-none focus:border-primary transition-colors text-sm font-body"
                />
                <TechButton 
                  type="submit" 
                  size="sm" 
                  disabled={!inputValue.trim() || isStreaming}
                  className="px-3"
                >
                  <Send className="w-4 h-4" />
                </TechButton>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/40 flex items-center justify-center z-50 border-4 border-background"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </>
  );
}
