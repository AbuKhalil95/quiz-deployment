import SidebarLayout from "./SidebarLayout";
import { type BreadcrumbItem } from "@/types";
import { type ReactNode } from "react";

interface AdminLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AdminLayout({
    children,
    breadcrumbs,
    ...props
}: AdminLayoutProps) {
    return (
        <SidebarLayout breadcrumbs={breadcrumbs} {...props}>
            {children}
        </SidebarLayout>
    );
}

