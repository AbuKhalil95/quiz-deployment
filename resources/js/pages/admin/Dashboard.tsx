import { Head } from "@inertiajs/react";
import AdminLayout from "@/layouts/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
    return (
        <AdminLayout breadcrumbs={[{ title: "Dashboard", href: "/admin" }]}>
            <Head title="Dashboard" />
            <div className="p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Admin Dashboard</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Welcome to the admin dashboard powered by Inertia
                            React!
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
