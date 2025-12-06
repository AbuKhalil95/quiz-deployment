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

interface Tag {
    id: number;
    tag_text: string;
}

interface DeleteTagDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tag: Tag | null;
    onSuccess?: () => void;
}

export function DeleteTagDialog({
    open,
    onOpenChange,
    tag,
    onSuccess,
}: DeleteTagDialogProps) {
    const handleDelete = () => {
        if (!tag) return;

        router.delete(route("admin.tags.destroy", tag.id), {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
                onSuccess?.();
                toast.success("Tag deleted successfully");
            },
            onError: (errors) => {
                const errorMessage =
                    errors.message || errors.error || "Failed to delete tag";
                toast.error(errorMessage);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Tag</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this tag? This action
                        cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                {tag && (
                    <div className="py-4">
                        <p className="text-sm">
                            <strong>Tag:</strong> {tag.tag_text}
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
                        Delete Tag
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
