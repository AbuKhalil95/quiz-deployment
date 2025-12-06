import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    submitButtonText?: string;
    cancelButtonText?: string;
    onSubmit: (e: React.FormEvent) => void;
    onReset?: () => void;
    isProcessing?: boolean;
    closeOnInteractOutside?: boolean;
    children: React.ReactNode;
}

export function FormDialog({
    open,
    onOpenChange,
    title,
    description,
    submitButtonText = "Submit",
    cancelButtonText = "Cancel",
    onSubmit,
    onReset,
    isProcessing = false,
    children,
    closeOnInteractOutside = true,
}: FormDialogProps) {
    const handleOpenChange = (newOpen: boolean) => {
        onOpenChange(newOpen);
        if (!newOpen && onReset) {
            onReset();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                showCloseButton={closeOnInteractOutside}
                onInteractOutside={(e) => {
                    if (closeOnInteractOutside) {
                        e.preventDefault();
                    }
                }}
            >
                <form onSubmit={onSubmit}>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        {description && (
                            <DialogDescription>{description}</DialogDescription>
                        )}
                    </DialogHeader>
                    <div className="grid gap-4 py-4">{children}</div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                        >
                            {cancelButtonText}
                        </Button>
                        <Button type="submit" disabled={isProcessing}>
                            {isProcessing
                                ? `${submitButtonText}ing...`
                                : submitButtonText}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
