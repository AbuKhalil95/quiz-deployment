import * as React from "react";
import { useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import { toast } from "sonner";
import { FormDialog } from "@/components/FormDialog";

interface CreateUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateUserDialog({
    open,
    onOpenChange,
}: CreateUserDialogProps) {
    const form = useForm({
        name: "",
        email: "",
        password: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route("admin.users.create"), {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
                form.reset();
                form.clearErrors();
                toast.success("User created successfully");
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
            title="Add New User"
            description="Create a new user account"
            submitButtonText="Create User"
            onSubmit={handleSubmit}
            onReset={handleReset}
            isProcessing={form.processing}
        >
            <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    value={form.data.name}
                    onChange={(e) => form.setData("name", e.target.value)}
                    required
                />
                <InputError message={form.errors.name} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={form.data.email}
                    onChange={(e) => form.setData("email", e.target.value)}
                    required
                />
                <InputError message={form.errors.email} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    value={form.data.password}
                    onChange={(e) => form.setData("password", e.target.value)}
                    required
                    minLength={8}
                />
                <InputError message={form.errors.password} />
            </div>
        </FormDialog>
    );
}
