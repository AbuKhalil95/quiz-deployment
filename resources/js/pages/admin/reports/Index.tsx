import { Head, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
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
import { Eye, Pencil } from "lucide-react";
import { Link } from "@inertiajs/react";
import { SmartPagination } from "@/components/common/SmartPagination";

interface Report {
    id: number;
    user: { id: number; name: string };
    question: { id: number; question_text: string };
    reason: string | null;
    status: "pending" | "approved";
    created_at: string;
}

interface Props {
    reports: {
        data: Report[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function QuestionReports({ reports, filters }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "");
    const [isMounted, setIsMounted] = useState(false);

    /* 🔹 Debounced search + status (EXACTLY like Attempts) */
    useEffect(() => {
        if (!isMounted) {
            setIsMounted(true);
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                route("admin.question-reports.index"),
                { search, status },
                { preserveState: true, replace: true },
            );
        }, 500);

        return () => clearTimeout(timeout);
    }, [search, status]);

    const togglePending = () => {
        setStatus(status === "pending" ? "" : "pending");
    };

    const updateStatus = (id: number) => {
        router.patch(
            route("admin.question-reports.update-status", id),
            { status: "approved" },
            { preserveScroll: true },
        );
    };

    const goToPage = (url: string | null) => {
        if (!url) return;

        router.get(
            url,
            {
                search,
                status,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const formatDate = (date: string) => new Date(date).toLocaleString();

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
                        {/* 🔍 Search + Status */}
                        <div className="mb-4 flex gap-3 items-center">
                            {/* Search */}
                            <div className=" flex w-[220px] gap-2">
                                <input
                                    type="text"
                                    placeholder="Search subjects..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="border px-2 py-1 rounded w-full"
                                />
                            </div>

                            <Button
                                variant={
                                    status === "pending" ? "default" : "outline"
                                }
                                onClick={togglePending}
                            >
                                Pending Only
                            </Button>
                        </div>

                        {/* 📋 Table */}
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Question</TableHead>
                                    <TableHead>Note</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {reports.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="text-center"
                                        >
                                            No reports found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    reports.data.map((report) => (
                                        <TableRow key={report.id}>
                                            <TableCell>{report.id}</TableCell>
                                            <TableCell>
                                                {report.user.name}
                                            </TableCell>
                                            <TableCell>
                                                {report.question.question_text}
                                            </TableCell>
                                            <TableCell
                                                className="max-w-[200px] truncate"
                                                title={
                                                    report.reason ?? undefined
                                                }
                                            >
                                                {report.reason || "—"}
                                            </TableCell>
                                            <TableCell>
                                                {report.status === "pending" ? (
                                                    <Button
                                                        size="sm"
                                                        className="bg-yellow-500 text-white"
                                                        onClick={() =>
                                                            updateStatus(
                                                                report.id,
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
                                                                "admin.questions.edit",
                                                                report.question
                                                                    .id,
                                                            )}
                                                            title="Edit question"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
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
                                                            title="View report"
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

                        {/* 🔢 Smart Pagination */}
                        <SmartPagination
                            currentPage={reports.current_page}
                            totalPages={reports.last_page}
                            prevPageUrl={reports.prev_page_url}
                            nextPageUrl={reports.next_page_url}
                            onUrlChange={goToPage}
                            buildUrl={(page) =>
                                `/admin/question-reports?page=${page}`
                            }
                        />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
