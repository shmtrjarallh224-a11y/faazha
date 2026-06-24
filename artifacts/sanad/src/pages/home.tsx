import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useGetHomeFeed } from "@workspace/api-client-react";
import { ProviderCard } from "@/components/provider-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Sparkles, ChevronLeft, ArrowRight, ShieldCheck } from "lucide-react";

export default function Home() {
  const [showSplash, setShowSplash] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: feed, isLoading } = useGetHomeFeed({
    lat: undefined, // Would be nice to get real coords but default for now
    lng: undefined
  });

  useEffect(() => {
    const hasVisited = localStorage.getItem("sanad_visited");
    if (!hasVisited) {
      setShowSplash(true);
    }
  }, []);

  const dismissSplash = () => {
    localStorage.setItem("sanad_visited", "true");
    setShowSplash(false);
  };

  if (showSplash) {
    return (
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 z-[100] bg-primary flex flex-col items-center justify-center p-6 text-primary-foreground"
          dir="rtl"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 bg-accent rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-accent/20"
          >
            <ShieldCheck className="w-12 h-12 text-primary" />
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-5xl font-extrabold mb-4"
          >
            سند
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-primary-foreground/80 text-center mb-12 max-w-xs leading-relaxed"
          >
            كل خدمة تحتاجها أصبحت أقرب إليك
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="w-full max-w-xs"
          >
            <Button 
              size="lg" 
              onClick={dismissSplash}
              className="w-full bg-accent hover:bg-accent/90 text-primary font-bold text-lg h-14 rounded-xl"
            >
              ابدأ الآن
              <ArrowRight className="mr-2 w-5 h-5" />
            </Button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="pb-24">
      {/* Hero Search Section */}
      <section className="bg-primary pt-6 pb-12 px-4 rounded-b-[2.5rem] shadow-sm">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-primary-foreground mb-6">
            عن ماذا تبحث اليوم؟
          </h1>
          
          <div className="relative group">
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <Search className="h-5 w-5" />
            </div>
            <Input
              type="text"
              placeholder="مثال: كهربائي، سباك، نجار..."
              className="h-14 pl-4 pr-12 rounded-2xl bg-background/95 backdrop-blur-sm border-0 shadow-lg text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-accent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <div className="absolute inset-y-0 left-2 flex items-center pl-2">
                <Button size="sm" className="h-10 px-4 rounded-xl bg-accent text-primary hover:bg-accent/90">
                  بحث
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-md mx-auto px-4 mt-[-2rem] relative z-10">
        <div className="bg-background rounded-2xl p-4 shadow-sm border border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">موقعك الحالي</p>
              <p className="text-sm font-bold">صنعاء، حدة</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-primary text-xs">تغيير</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="max-w-md mx-auto px-4 mt-8 space-y-8">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-muted rounded-xl"></div>
              ))}
            </div>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/2"></div>
            <div className="h-32 bg-muted rounded-xl"></div>
            <div className="h-32 bg-muted rounded-xl"></div>
          </div>
        </div>
      ) : feed ? (
        <div className="max-w-md mx-auto px-4 mt-8 space-y-10">
          {/* Categories Grid */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">التصنيفات</h2>
              <Link href="/categories" className="text-sm text-primary font-medium flex items-center">
                عرض الكل
                <ChevronLeft className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {feed.categories.slice(0, 8).map((cat) => (
                <Link key={cat.id} href={`/providers?categoryId=${cat.id}`}>
                  <div className="flex flex-col items-center gap-2 cursor-pointer group">
                    <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm border border-border/50">
                      {cat.icon}
                    </div>
                    <span className="text-xs text-center font-medium text-muted-foreground group-hover:text-foreground transition-colors line-clamp-1">{cat.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Top Rated */}
          {feed.topRatedProviders.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  الأعلى تقييماً
                </h2>
                <Link href="/providers?sortBy=rating" className="text-sm text-primary font-medium">
                  عرض الكل
                </Link>
              </div>
              <div className="space-y-3">
                {feed.topRatedProviders.slice(0, 3).map((provider) => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            </section>
          )}

          {/* Nearby */}
          {feed.nearbyProviders.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  بالقرب منك
                </h2>
                <Link href="/providers?sortBy=distance" className="text-sm text-primary font-medium">
                  عرض الكل
                </Link>
              </div>
              <div className="space-y-3">
                {feed.nearbyProviders.slice(0, 3).map((provider) => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : null}
    </div>
  );
}
