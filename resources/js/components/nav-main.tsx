import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavGroup } from "@/types";
import { Link, usePage } from "@inertiajs/react";

export function NavMain({ items = [] }: { items: NavGroup[] }) {
    const page = usePage<{ auth: { user: { roles: string[] } | null } }>();
    const userRoles = page.props.auth.user?.roles || [];

    return (
        <SidebarGroup className="px-2 py-0">
            {items.map((item, index) => (
                <div key={index}>
                    <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                    <SidebarMenu>
                        {item.items.map((navItem) => {
                            // Check if user has any of the required roles
                            if (
                                navItem.role &&
                                !navItem.role.some((role) => userRoles.includes(role))
                            )
                                return null;
                            return (
                                <SidebarMenuItem key={navItem.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={page.url.startsWith(navItem.href)}
                                        tooltip={{ children: navItem.title }}
                                    >
                                        <Link href={navItem.href}>
                                            {navItem.icon && <navItem.icon />}
                                            <span>{navItem.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </div>
            ))}
        </SidebarGroup>
    );
}



