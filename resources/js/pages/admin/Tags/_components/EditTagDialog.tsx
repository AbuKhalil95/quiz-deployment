import * as React from "react";
import { useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import { toast } from "sonner";
import { FormDialog } from "@/components/FormDialog";

interface Tag {
    id: number;
    tag_text: string;
}

interface EditTagDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tag: Tag | null;
}

export function EditTagDialog({ open, onOpenChange, tag }: EditTagDialogProps) {
    const form = useForm({
        tag_text: tag?.tag_text || "",
    });

    // Update form when tag changes
    React.useEffect(() => {
        if (tag) {
            form.setData({
                tag_text: tag.tag_text,
            });
        }
    }, [tag]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!tag) return;

        form.post(route("admin.tags.update", tag.id), {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
                form.clearErrors();
                toast.success("Tag updated successfully");
            },
            onError: () => {
                toast.error("Please fix the errors in the form");
            },
        });
    };

    const handleReset = () => {
        if (tag) {
            form.setData({
                tag_text: tag.tag_text,
            });
        }
        form.clearErrors();
    };

    if (!tag) return null;

    return (
        <FormDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Edit Tag"
            description="Update tag information"
            submitButtonText="Update Tag"
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
                />
                <InputError message={form.errors.tag_text} />
            </div>
        </FormDialog>
    );
}
