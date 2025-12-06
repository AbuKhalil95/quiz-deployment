import { Head } from "@inertiajs/react";
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
    attempts: Attempt[];
}

export default function Index({ attempts }: Props) {
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
                                {attempts.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="text-center"
                                        >
                                            No attempts found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    attempts.map((attempt) => (
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
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
