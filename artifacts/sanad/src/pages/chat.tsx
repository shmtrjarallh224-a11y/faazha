import { useState, useRef, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useGetMessages, useSendMessage } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, Send, Loader2 } from "lucide-react";

export default function Chat() {
  const [, params] = useRoute("/messages/:id");
  const otherUserId = parseInt(params?.id || "0");
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading, refetch } = useGetMessages(otherUserId, {
    query: { enabled: !!otherUserId, queryKey: ['messages', otherUserId] }
  });

  const sendMutation = useSendMessage();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    sendMutation.mutate({
      id: otherUserId,
      data: { content }
    }, {
      onSuccess: () => {
        setContent("");
        refetch();
      }
    });
  };

  if (isLoading) {
    return <div className="h-screen flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  // Find the other user's name/avatar from the first message they sent (or fallback if empty)
  const otherMessage = messages?.find(m => m.senderId === otherUserId);
  const otherName = otherMessage?.senderName || "مستخدم";
  
  return (
    <div className="flex flex-col h-[100dvh] bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border p-3 flex items-center gap-3">
        <Link href="/messages">
          <Button variant="ghost" size="icon" className="rounded-full shrink-0">
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
        <Avatar className="w-10 h-10 border border-border">
          <AvatarFallback className="bg-primary/10 text-primary font-bold">
            {otherName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <h1 className="font-bold truncate">{otherName}</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages?.map((msg) => {
          const isMe = msg.senderId === user?.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                isMe 
                  ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                  : 'bg-muted rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          );
        })}
        {messages?.length === 0 && (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
            أرسل أول رسالة لبدء المحادثة
          </div>
        )}
      </div>

      <div className="p-3 bg-background border-t border-border pb-safe">
        <form onSubmit={handleSend} className="flex items-center gap-2 max-w-md mx-auto">
          <Input 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="اكتب رسالة..." 
            className="flex-1 rounded-full bg-muted/50 border-transparent focus-visible:ring-1 focus-visible:ring-primary"
          />
          <Button 
            type="submit" 
            size="icon" 
            className="rounded-full bg-accent text-primary hover:bg-accent/90 shrink-0 h-10 w-10"
            disabled={!content.trim() || sendMutation.isPending}
          >
            {sendMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 -ml-1 rtl:ml-0 rtl:mr-1" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
