import { useListConversations } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function Messages() {
  const { data: conversations, isLoading } = useListConversations({
    query: { queryKey: ['conversations'] }
  });

  return (
    <div className="pb-24 bg-background min-h-screen">
      <div className="bg-primary pt-6 pb-8 px-4 rounded-b-[2rem] shadow-sm">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-primary-foreground">الرسائل</h1>
          <p className="text-primary-foreground/80 mt-1 text-sm">تواصل مع عملائك والمهنيين</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !conversations || conversations.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-10 h-10 text-muted-foreground opacity-50" />
            </div>
            <h3 className="font-bold text-lg mb-2">لا توجد رسائل</h3>
            <p className="text-muted-foreground text-sm">
              لم تبدأ أي محادثات بعد
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((conv) => (
              <Link key={conv.id} href={`/messages/${conv.otherUserId}`}>
                <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-muted/50 cursor-pointer transition-colors border border-transparent hover:border-border/50">
                  <Avatar className="w-14 h-14 border border-border">
                    <AvatarImage src={conv.otherUserAvatarUrl || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {conv.otherUserName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-sm truncate">{conv.otherUserName}</h3>
                      {conv.updatedAt && (
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {format(new Date(conv.updatedAt), 'hh:mm a', { locale: ar })}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate w-full">
                      {conv.lastMessage || "صورة"}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <Badge className="bg-accent text-accent-foreground shrink-0 px-1.5 min-w-[20px] h-5 flex items-center justify-center">
                      {conv.unreadCount}
                    </Badge>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
