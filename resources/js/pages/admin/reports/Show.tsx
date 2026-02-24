import { Head, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import AdminLayout from "@/layouts/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";

interface Report {
    id: number;
    user: { id: number; name: string; email?: string };
    question: { id: number; question_text: string };
    reason: string | null;
    status: "pending" | "approved";
    created_at: string;
}

interface Props {
    report: Report;
}

export default function Show({ report }: Props) {
    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleString();

    return (
        <AdminLayout
            breadcrumbs={[
                { title: "Dashboard", href: "/admin" },
                { title: "Question Reports", href: "/admin/question-reports" },
                { title: `Report #${report.id}`, href: `/admin/reports/${report.id}` },
            ]}
        >
            <Head title={`Report #${report.id}`} />
            <div className="p-6">
                <div className="mb-4">
                    <Button variant="outline" asChild>
                        <Link href={route("admin.question-reports.index")}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Reports
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle>Report Details</CardTitle>
                        <Button variant="outline" size="sm" asChild>
                            <Link
                                href={route(
                                    "admin.questions.edit",
                                    report.question.id,
                                )}
                                title="Edit question"
                            >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit question
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Student
                                </label>
                                <p>{report.user.name}</p>
                                {report.user.email && (
                                    <p className="text-xs text-muted-foreground">
                                        {report.user.email}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Question
                                </label>
                                <p>{report.question.question_text}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Status
                                </label>
                                <p>{report.status}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Created At
                                </label>
                                <p>{formatDate(report.created_at)}</p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Reason
                                </label>
                                <p className="bg-gray-100 p-2 rounded border">
                                    {report.reason || "No reason provided"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
