import { ProviderSummary } from "@workspace/api-client-react/src/generated/api.schemas";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, CheckCircle2, Briefcase } from "lucide-react";
import { Link } from "wouter";

interface ProviderCardProps {
  provider: ProviderSummary;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <Link href={`/providers/${provider.id}`}>
      <Card className="hover-elevate cursor-pointer overflow-hidden transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="relative">
              <Avatar className="w-16 h-16 border-2 border-background shadow-sm">
                <AvatarImage src={provider.avatarUrl || ""} alt={provider.name} className="object-cover" />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {provider.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {provider.isAvailable && (
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full"></span>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-bold text-base truncate flex items-center gap-1">
                    {provider.name}
                    {provider.isVerified && <CheckCircle2 className="w-4 h-4 text-primary" />}
                  </h3>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{provider.district}، {provider.city}</span>
                    {provider.distanceKm && (
                      <span className="opacity-70">({provider.distanceKm.toFixed(1)} كم)</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded text-sm font-medium">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {provider.rating.toFixed(1)}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="secondary" className="font-normal text-xs bg-primary/5 text-primary hover:bg-primary/10 border-primary/10">
                  <span className="ml-1 text-base">{provider.categoryIcon}</span>
                  {provider.categoryName}
                </Badge>
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                  <Briefcase className="w-3 h-3" />
                  {provider.completedJobs} مهمة
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
