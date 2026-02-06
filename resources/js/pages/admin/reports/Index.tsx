import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "@/layouts/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import { Link } from "@inertiajs/react";

interface Report {
    id: number;
    user: { id: number; name: string };
    question: { id: number; question_text: string };
    status: "pending" | "approved";
    created_at: string;
}

interface Props {
    reports: Report[];
}

export default function QuestionReports({ reports }: Props) {
    const [localReports, setLocalReports] = useState(reports);

    const updateStatus = (reportId: number, status: "pending" | "approved") => {
        router.patch(
            route("admin.question-reports.update-status", reportId),
            { status },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setLocalReports((prev) =>
                        prev.map((r) =>
                            r.id === reportId ? { ...r, status } : r,
                        ),
                    );
                },
            },
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { title: "Dashboard", href: "/admin" },
                { title: "Question Reports", href: "/admin/question-reports" },
            ]}
        >
            <Head title="Question Reports" />
            <div className="p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Question Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Question</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {localReports.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="text-center"
                                        >
                                            No reports found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    localReports.map((report) => (
                                        <TableRow key={report.id}>
                                            <TableCell>{report.id}</TableCell>
                                            <TableCell>
                                                {report.user.name}
                                            </TableCell>
                                            <TableCell>
                                                {report.question.question_text}
                                            </TableCell>
                                            <TableCell>
                                                {report.status === "pending" ? (
                                                    <Button
                                                        size="sm"
                                                        className="bg-yellow-500 text-white"
                                                        onClick={() =>
                                                            updateStatus(
                                                                report.id,
                                                                "approved",
                                                            )
                                                        }
                                                    >
                                                        Pending → Approve
                                                    </Button>
                                                ) : (
                                                    <span className="text-green-600 font-semibold">
                                                        Approved
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(report.created_at)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={route(
                                                                "admin.reports.show",
                                                                report.id,
                                                            )}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
