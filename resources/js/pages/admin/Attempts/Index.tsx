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
import { Eye } from "lucide-react";
import { Link } from "@inertiajs/react";
import { SmartPagination } from "@/components/common/SmartPagination";

interface Quiz {
    id: number;
    title: string;
}

interface Student {
    id: number;
    name: string;
    email: string;
}

interface Attempt {
    id: number;
    quiz_id: number;
    student_id: number;
    started_at: string;
    ended_at: string | null;
    score: number;
    total_correct: number;
    total_incorrect: number;
    total_questions: number;
    quiz: Quiz | null;
    student: Student | null;
}

interface Props {
    attempts: {
        data: Attempt[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
}

export default function Index({ attempts, filters }: any) {
    const [search, setSearch] = useState(filters.search || "");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        if (!isMounted) {
            setIsMounted(true);
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                "/admin/attempts",
                { search },
                { preserveState: true, replace: true }
            );
        }, 500);

        return () => clearTimeout(timeout);
    }, [search]);

    const goToPage = (url: string | null) => {
        if (url) router.get(url);
    };
    const formatDate = (dateString: string | null) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString();
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { title: "Dashboard", href: "/admin" },
                { title: "Attempts", href: "/admin/attempts" },
            ]}
        >
            <Head title="Attempts" />
            <div className="p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Quiz Attempts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Search */}
                        <div className="mb-4 flex w-[220px] gap-2">
                            <input
                                type="text"
                                placeholder="Search subjects..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="border px-2 py-1 rounded w-full mb-4"
                            />
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Quiz</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>Started At</TableHead>
                                    <TableHead>Ended At</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {attempts.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="text-center"
                                        >
                                            No attempts found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    attempts.data.map((attempt) => (
                                        <TableRow key={attempt.id}>
                                            <TableCell>{attempt.id}</TableCell>
                                            <TableCell>
                                                {attempt.student?.name || "N/A"}
                                            </TableCell>
                                            <TableCell>
                                                {attempt.quiz?.title || "N/A"}
                                            </TableCell>
                                            <TableCell>
                                                {attempt.score} /{" "}
                                                {attempt.total_questions} (
                                                {attempt.total_correct} correct,{" "}
                                                {attempt.total_incorrect}{" "}
                                                incorrect)
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(attempt.started_at)}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(attempt.ended_at)}
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
                                                                "admin.attempts.show",
                                                                attempt.id
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

                        <SmartPagination
                            currentPage={attempts.current_page}
                            totalPages={attempts.last_page}
                            onPageChange={() => {}}
                            prevPageUrl={attempts.prev_page_url}
                            nextPageUrl={attempts.next_page_url}
                            onUrlChange={goToPage}
                            buildUrl={(page) => `/admin/attempts?page=${page}`}
                        />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
