import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { ProtectedRoute } from "@/components/layout/protected-route";

// Pages
import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Providers from "@/pages/providers";
import ProviderDetail from "@/pages/provider-detail";
import NewRequest from "@/pages/new-request";
import MyRequests from "@/pages/my-requests";
import RequestDetail from "@/pages/request-detail";
import Favorites from "@/pages/favorites";
import Messages from "@/pages/messages";
import Chat from "@/pages/chat";
import Notifications from "@/pages/notifications";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";

// Admin Pages
import AdminDashboard from "@/pages/admin/dashboard";
import AdminUsers from "@/pages/admin/users";
import AdminProviders from "@/pages/admin/providers";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        
        {/* Admin Routes */}
        <Route path="/admin">
          <ProtectedRoute allowedRoles={['admin']}>
            <div className="flex min-h-screen bg-background text-foreground" dir="rtl">
              <aside className="w-64 bg-card border-l border-border p-4 flex flex-col gap-2">
                <h2 className="text-xl font-bold text-primary mb-6 px-2">إدارة سند</h2>
                <a href="/admin" className="px-4 py-2 hover:bg-muted rounded-xl transition-colors font-medium">لوحة التحكم</a>
                <a href="/admin/users" className="px-4 py-2 hover:bg-muted rounded-xl transition-colors font-medium">المستخدمين</a>
                <a href="/admin/providers" className="px-4 py-2 hover:bg-muted rounded-xl transition-colors font-medium">المهنيين</a>
                <a href="/" className="px-4 py-2 hover:bg-muted rounded-xl transition-colors font-medium text-muted-foreground mt-auto">العودة للتطبيق</a>
              </aside>
              <main className="flex-1 overflow-y-auto">
                <AdminDashboard />
              </main>
            </div>
          </ProtectedRoute>
        </Route>

        <Route path="/admin/users">
          <ProtectedRoute allowedRoles={['admin']}>
             <div className="flex min-h-screen bg-background text-foreground" dir="rtl">
              <aside className="w-64 bg-card border-l border-border p-4 flex flex-col gap-2">
                <h2 className="text-xl font-bold text-primary mb-6 px-2">إدارة سند</h2>
                <a href="/admin" className="px-4 py-2 hover:bg-muted rounded-xl transition-colors font-medium">لوحة التحكم</a>
                <a href="/admin/users" className="px-4 py-2 hover:bg-muted rounded-xl transition-colors font-medium">المستخدمين</a>
                <a href="/admin/providers" className="px-4 py-2 hover:bg-muted rounded-xl transition-colors font-medium">المهنيين</a>
                <a href="/" className="px-4 py-2 hover:bg-muted rounded-xl transition-colors font-medium text-muted-foreground mt-auto">العودة للتطبيق</a>
              </aside>
              <main className="flex-1 overflow-y-auto">
                <AdminUsers />
              </main>
            </div>
          </ProtectedRoute>
        </Route>

        <Route path="/admin/providers">
          <ProtectedRoute allowedRoles={['admin']}>
            <div className="flex min-h-screen bg-background text-foreground" dir="rtl">
              <aside className="w-64 bg-card border-l border-border p-4 flex flex-col gap-2">
                <h2 className="text-xl font-bold text-primary mb-6 px-2">إدارة سند</h2>
                <a href="/admin" className="px-4 py-2 hover:bg-muted rounded-xl transition-colors font-medium">لوحة التحكم</a>
                <a href="/admin/users" className="px-4 py-2 hover:bg-muted rounded-xl transition-colors font-medium">المستخدمين</a>
                <a href="/admin/providers" className="px-4 py-2 hover:bg-muted rounded-xl transition-colors font-medium">المهنيين</a>
                <a href="/" className="px-4 py-2 hover:bg-muted rounded-xl transition-colors font-medium text-muted-foreground mt-auto">العودة للتطبيق</a>
              </aside>
              <main className="flex-1 overflow-y-auto">
                <AdminProviders />
              </main>
            </div>
          </ProtectedRoute>
        </Route>

        {/* Client & Provider Routes */}
        <Route path="/">
          <Header />
          <Home />
          <BottomNav />
        </Route>

        <Route path="/providers">
          <Header />
          <Providers />
          <BottomNav />
        </Route>

        <Route path="/providers/:id">
          <ProviderDetail />
          <BottomNav />
        </Route>

        <Route path="/request/new">
          <ProtectedRoute>
            <NewRequest />
          </ProtectedRoute>
        </Route>

        <Route path="/my-requests">
          <ProtectedRoute>
            <Header />
            <MyRequests />
            <BottomNav />
          </ProtectedRoute>
        </Route>

        <Route path="/my-requests/:id">
          <ProtectedRoute>
            <RequestDetail />
          </ProtectedRoute>
        </Route>

        <Route path="/favorites">
          <ProtectedRoute>
            <Header />
            <Favorites />
            <BottomNav />
          </ProtectedRoute>
        </Route>

        <Route path="/messages">
          <ProtectedRoute>
            <Header />
            <Messages />
            <BottomNav />
          </ProtectedRoute>
        </Route>

        <Route path="/messages/:id">
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        </Route>

        <Route path="/notifications">
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        </Route>

        <Route path="/profile">
          <ProtectedRoute>
            <Header />
            <Profile />
            <BottomNav />
          </ProtectedRoute>
        </Route>
        
        <Route>
          <Header />
          <NotFound />
          <BottomNav />
        </Route>
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div dir="rtl" className="min-h-[100dvh] bg-background text-foreground font-sans">
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
          </div>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
