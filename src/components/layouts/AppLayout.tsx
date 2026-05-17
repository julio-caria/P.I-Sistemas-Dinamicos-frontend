import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
 
export default function AppLayout() {
    return (
        <SidebarProvider>
            <AppSidebar />
              <div className="flex flex-col flex-1 min-h-screen bg-zinc-100 overflow-auto">
                <header className="flex items-center gap-3 px-6 py-3 border-b bg-white sticky top-0 z-10">
                    <SidebarTrigger />
                    {/* Adicione breadcrumbs, avatar ou notificações aqui se quiser */}
                </header>
 
                <main className="flex-1 p-10 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </SidebarProvider>
    );
}
 
