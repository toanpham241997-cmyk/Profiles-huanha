import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// Types matching the integration output
interface Conversation {
  id: number;
  title: string;
}

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

interface ConversationDetail extends Conversation {
  messages: Message[];
}

export function useConversations() {
  return useQuery({
    queryKey: ["/api/conversations"],
    queryFn: async () => {
      const res = await fetch("/api/conversations");
      if (!res.ok) throw new Error("Failed to fetch conversations");
      return (await res.json()) as Conversation[];
    },
  });
}

export function useConversation(id: number | null) {
  return useQuery({
    queryKey: ["/api/conversations", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await fetch(`/api/conversations/${id}`);
      if (!res.ok) throw new Error("Failed to fetch conversation");
      return (await res.json()) as ConversationDetail;
    },
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (title: string) => {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("Failed to create conversation");
      return (await res.json()) as Conversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
    },
  });
}

// Hook for streaming chat
export function useChatStream(conversationId: number | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Load initial messages
  const { data: initialData } = useConversation(conversationId);
  
  useEffect(() => {
    if (initialData?.messages) {
      setMessages(initialData.messages);
    }
  }, [initialData]);

  const sendMessage = async (content: string) => {
    if (!conversationId) return;

    // Optimistically add user message
    const tempUserMessage: Message = {
      id: Date.now(),
      role: "user",
      content,
    };
    setMessages((prev) => [...prev, tempUserMessage]);
    setIsStreaming(true);

    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      // Set up reader for SSE
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) throw new Error("No response body");

      let assistantMessageContent = "";
      
      // Add placeholder assistant message
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", content: "" }
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");
        
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.content) {
                assistantMessageContent += data.content;
                setMessages((prev) => {
                  const newMessages = [...prev];
                  const lastMsg = newMessages[newMessages.length - 1];
                  if (lastMsg.role === "assistant") {
                    lastMsg.content = assistantMessageContent;
                  }
                  return newMessages;
                });
              }
              
              if (data.done) {
                setIsStreaming(false);
                queryClient.invalidateQueries({ queryKey: ["/api/conversations", conversationId] });
              }
              
              if (data.error) {
                throw new Error(data.error);
              }
            } catch (e) {
              console.error("Error parsing SSE data", e);
            }
          }
        }
      }
    } catch (error: any) {
      setIsStreaming(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send message",
      });
    }
  };

  return {
    messages,
    isStreaming,
    sendMessage,
  };
}
