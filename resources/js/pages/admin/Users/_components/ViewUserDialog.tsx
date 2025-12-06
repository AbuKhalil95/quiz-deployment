import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface User {
    id: number;
    name: string;
    email: string;
    roles: Array<{ id: number; name: string }>;
}

interface ViewUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
}

export function ViewUserDialog({
    open,
    onOpenChange,
    user,
}: ViewUserDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>User Details</DialogTitle>
                    <DialogDescription>View user information</DialogDescription>
                </DialogHeader>
                {user && (
                    <div className="grid gap-4 py-4">
                        <div>
                            <Label className="text-muted-foreground">Name</Label>
                            <p className="text-sm font-medium">{user.name}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Email</Label>
                            <p className="text-sm font-medium">{user.email}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Roles</Label>
                            <p className="text-sm font-medium">
                                {user.roles
                                    .map((role) => role.name)
                                    .join(", ") || "No roles"}
                            </p>
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

