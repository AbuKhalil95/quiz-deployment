import { Head, Link } from "@inertiajs/react";
import AuthLayout from "@/layouts/common/AuthLayout";
import { useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import InputError from "@/components/input-error";
import { toast } from "sonner";

export default function Register() {
    const form = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route("register.post"), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                form.clearErrors();
                toast.success("Account created successfully");
            },
            onError: () => {
                const msg =
                    form.errors.email ||
                    form.errors.name ||
                    form.errors.password ||
                    form.errors.password_confirmation ||
                    "Please fix the errors below.";
                toast.error(msg);
            },
        });
    };

    return (
        <>
            <Head title="Register" />
            <AuthLayout>
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">
                            Create an account
                        </CardTitle>
                        <CardDescription>
                            Enter your details to register
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={form.data.name}
                                    onChange={(e) =>
                                        form.setData("name", e.target.value)
                                    }
                                    required
                                    autoFocus
                                />
                                <InputError message={form.errors.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={form.data.email}
                                    onChange={(e) =>
                                        form.setData("email", e.target.value)
                                    }
                                    required
                                />
                                <InputError message={form.errors.email} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={form.data.password}
                                    onChange={(e) =>
                                        form.setData("password", e.target.value)
                                    }
                                    required
                                />
                                <InputError message={form.errors.password} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">
                                    Confirm password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={form.data.password_confirmation}
                                    onChange={(e) =>
                                        form.setData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                                <InputError
                                    message={form.errors.password_confirmation}
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={form.processing}
                            >
                                {form.processing
                                    ? "Creating account..."
                                    : "Register"}
                            </Button>
                        </form>
                        <div className="mt-4 text-center text-sm">
                            <Link
                                href={route("login")}
                                className="text-primary hover:underline"
                            >
                                Already have an account? Login
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </AuthLayout>
        </>
    );
}
