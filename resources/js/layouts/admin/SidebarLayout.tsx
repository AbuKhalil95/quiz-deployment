import { AppContent } from "@/components/app-content";
import { AppShell } from "@/components/app-shell";
import { AppSidebar } from "@/components/app-sidebar";
import { AppSidebarHeader } from "@/components/app-sidebar-header";
import Messages from "@/components/messages";
import { type BreadcrumbItem } from "@/types";
import { type PropsWithChildren } from "react";

interface SidebarLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function SidebarLayout({
    children,
    breadcrumbs = [],
}: SidebarLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <Messages />
                {children}
            </AppContent>
        </AppShell>
    );
}

