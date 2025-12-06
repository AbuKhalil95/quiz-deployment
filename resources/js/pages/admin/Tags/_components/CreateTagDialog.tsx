import * as React from "react";
import { useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import { toast } from "sonner";
import { FormDialog } from "@/components/FormDialog";

interface CreateTagDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateTagDialog({ open, onOpenChange }: CreateTagDialogProps) {
    const form = useForm({
        tag_text: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route("admin.tags.create"), {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
                form.reset();
                form.clearErrors();
                toast.success("Tag created successfully");
            },
            onError: () => {
                toast.error("Please fix the errors in the form");
            },
        });
    };

    const handleReset = () => {
        form.reset();
        form.clearErrors();
    };

    return (
        <FormDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Add New Tag"
            description="Create a new tag"
            submitButtonText="Create Tag"
            onSubmit={handleSubmit}
            onReset={handleReset}
            isProcessing={form.processing}
        >
            <div className="grid gap-2">
                <Label htmlFor="tag_text">Tag Text</Label>
                <Input
                    id="tag_text"
                    value={form.data.tag_text}
                    onChange={(e) => form.setData("tag_text", e.target.value)}
                    required
                    autoFocus
                />
                <InputError message={form.errors.tag_text} />
            </div>
        </FormDialog>
    );
}
