import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { UserInfo } from "@/components/user-info";
import { type User } from "@/types";
import { router } from "@inertiajs/react";
import { LogOut, Settings } from "lucide-react";

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const handleLogout = () => {
        router.post(
            route("logout"),
            {},
            {
                preserveScroll: false,
                onSuccess: () => {
                    // User will be redirected to login route
                },
            }
        );
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <a className="block w-full cursor-pointer" href="#">
                        <Settings className="mr-2" />
                        Settings
                    </a>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <button className="block w-full" onClick={handleLogout}>
                    <LogOut className="mr-2" />
                    Logout
                </button>
            </DropdownMenuItem>
        </>
    );
}
