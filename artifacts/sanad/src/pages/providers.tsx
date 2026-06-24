import { useState } from "react";
import { useLocation } from "wouter";
import { useListProviders, useListCategories } from "@workspace/api-client-react";
import { ProviderCard } from "@/components/provider-card";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Providers() {
  const searchParams = new URLSearchParams(window.location.search);
  const initialCategory = searchParams.get("categoryId") ? parseInt(searchParams.get("categoryId")!) : null;
  const initialSearch = searchParams.get("search") || "";
  
  const [search, setSearch] = useState(initialSearch);
  const [activeCategory, setActiveCategory] = useState<number | null>(initialCategory);

  const { data: categories } = useListCategories();
  
  const { data: providersPage, isLoading } = useListProviders({
    categoryId: activeCategory ?? undefined,
    search: search || undefined,
  }, { query: { queryKey: ['providers', activeCategory, search] } });

  return (
    <div className="pb-24">
      <div className="bg-primary pt-6 pb-6 px-4">
        <div className="max-w-md mx-auto relative">
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-muted-foreground">
            <Search className="h-5 w-5" />
          </div>
          <Input
            type="search"
            placeholder="ابحث عن المهنيين..."
            className="h-12 pl-12 pr-12 rounded-xl bg-background border-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6">
        {/* Categories scroll */}
        <div className="flex overflow-x-auto pb-4 -mx-4 px-4 gap-2 scrollbar-hide">
          <Button
            variant={activeCategory === null ? "default" : "outline"}
            className="rounded-full shrink-0"
            onClick={() => setActiveCategory(null)}
          >
            الكل
          </Button>
          {categories?.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? "default" : "outline"}
              className="rounded-full shrink-0"
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.icon} {cat.name}
            </Button>
          ))}
        </div>

        <div className="mt-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : providersPage?.providers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              لا يوجد نتائج مطابقة لبحثك
            </div>
          ) : (
            <div className="space-y-3">
              {providersPage?.providers.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
