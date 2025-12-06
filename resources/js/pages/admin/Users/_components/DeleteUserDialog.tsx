import * as React from "react";
import { router } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface User {
    id: number;
    name: string;
    email: string;
    roles: Array<{ id: number; name: string }>;
}

interface DeleteUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
    onSuccess?: () => void;
}

export function DeleteUserDialog({
    open,
    onOpenChange,
    user,
    onSuccess,
}: DeleteUserDialogProps) {
    const handleDelete = () => {
        if (!user) return;

        router.delete(route("admin.users.destroy", user.id), {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
                onSuccess?.();
                toast.success("User deleted successfully");
            },
            onError: (errors) => {
                const errorMessage =
                    errors.message ||
                    errors.error ||
                    "Failed to delete user";
                toast.error(errorMessage);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete User</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this user? This action
                        cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                {user && (
                    <div className="py-4">
                        <p className="text-sm">
                            <strong>Name:</strong> {user.name}
                        </p>
                        <p className="text-sm">
                            <strong>Email:</strong> {user.email}
                        </p>
                    </div>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        Delete User
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

