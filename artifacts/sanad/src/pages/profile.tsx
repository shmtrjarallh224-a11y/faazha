import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { LogOut, User as UserIcon, ShieldCheck, MapPin, Briefcase, ChevronLeft } from "lucide-react";
import { useUpdateProvider, useGetProvider } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const { data: providerDetails, refetch } = useGetProvider(user?.id || 0, {
    query: { enabled: user?.role === 'provider', queryKey: ['provider', user?.id] }
  });

  const updateProvider = useUpdateProvider();

  const handleAvailabilityToggle = (checked: boolean) => {
    if (!user) return;
    updateProvider.mutate({
      id: user.id,
      data: { isAvailable: checked }
    }, {
      onSuccess: () => {
        toast({ title: "تم تحديث حالة التوفر" });
        refetch();
      }
    });
  };

  if (!user) return null;

  return (
    <div className="pb-24 bg-background min-h-screen">
      <div className="bg-primary pt-10 pb-20 px-4 rounded-b-[2rem] shadow-sm text-center relative">
        <h1 className="text-2xl font-bold text-primary-foreground mb-6">حسابي</h1>
      </div>

      <div className="max-w-md mx-auto px-4 mt-[-4rem] relative z-10 space-y-6">
        <Card className="border-border shadow-sm">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Avatar className="w-24 h-24 border-4 border-background shadow-sm mb-4">
              <AvatarImage src={user.avatarUrl || ""} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm text-muted-foreground mt-1" dir="ltr">{user.phone}</p>
            
            <div className="flex gap-2 mt-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary font-normal">
                {user.role === 'provider' ? 'مزود خدمة' : user.role === 'admin' ? 'مدير' : 'عميل'}
              </Badge>
              {user.status === 'active' && (
                <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20 font-normal">
                  حساب نشط
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {user.role === 'provider' && providerDetails && (
          <Card className="border-border shadow-sm">
            <CardContent className="p-0">
              <div className="p-4 border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">متاح للعمل</p>
                    <p className="text-xs text-muted-foreground">استقبال طلبات جديدة</p>
                  </div>
                </div>
                <Switch 
                  checked={providerDetails.isAvailable} 
                  onCheckedChange={handleAvailabilityToggle}
                />
              </div>
              
              <div className="p-4 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">المهنة</p>
                    <p className="font-bold text-sm">{providerDetails.categoryName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">المنطقة</p>
                    <p className="font-bold text-sm">{providerDetails.city}، {providerDetails.district}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-between h-14 rounded-xl border-border bg-card">
            <span className="flex items-center gap-3">
              <UserIcon className="w-5 h-5 text-muted-foreground" />
              تعديل البيانات الشخصية
            </span>
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-between h-14 rounded-xl border-destructive/20 text-destructive hover:bg-destructive/5 hover:text-destructive"
            onClick={logout}
          >
            <span className="flex items-center gap-3">
              <LogOut className="w-5 h-5" />
              تسجيل الخروج
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
