import * as React from "react";
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

interface Tag {
    id: number;
    tag_text: string;
}

interface ViewTagDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tag: Tag | null;
}

export function ViewTagDialog({ open, onOpenChange, tag }: ViewTagDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tag Details</DialogTitle>
                    <DialogDescription>View tag information</DialogDescription>
                </DialogHeader>
                {tag && (
                    <div className="grid gap-4 py-4">
                        <div>
                            <Label className="text-muted-foreground">
                                Tag Text
                            </Label>
                            <p className="text-sm font-medium">
                                {tag.tag_text}
                            </p>
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
