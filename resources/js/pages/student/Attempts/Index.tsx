import { Head, Link, router } from "@inertiajs/react";
import StudentLayout from "@/layouts/student";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { route } from "ziggy-js";
import { Eye, Play, ArrowLeft, Check, Archive, ArchiveRestore } from "lucide-react";
import { SmartPagination } from "@/components/common/SmartPagination";
import { RelativeDate } from "@/components/common/RelativeDate";

interface Quiz {
    id: number;
    title: string;
}

interface Attempt {
    id: number;
    score: number;
    total_correct: number;
    total_incorrect: number;
    created_at: string;
    ended_at: string | null;
    archived_at: string | null;
    quiz: Quiz;
}

interface Props {
    attempts: {
        data: Attempt[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
}

export default function AttemptsIndex({ attempts }: Props) {
    const handlePageChange = (url: string | null) => {
        if (url) {
            router.visit(url, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    return (
        <StudentLayout title="My Attempts">
            <Head title="My Attempts" />
            <div className="space-y-6">
                <div>
                    <Button
                        variant="ghost"
                        onClick={() => router.visit(route("student.dashboard"))}
                        className="mb-4"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                    <h1 className="text-3xl font-bold mb-2">My Attempts</h1>
                    <p className="text-muted-foreground">
                        View your quiz history and results.
                    </p>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Quiz</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Score</TableHead>
                                        <TableHead>Correct</TableHead>
                                        <TableHead>Incorrect</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {attempts.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="text-center py-8"
                                            >
                                                <p className="text-muted-foreground">
                                                    No attempts yet.
                                                </p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        attempts.data.map((attempt) => (
                                            <TableRow key={attempt.id}>
                                                <TableCell className="font-medium">
                                                    <span>
                                                        {attempt.quiz?.title ?? "N/A"}
                                                        {attempt.archived_at && (
                                                            <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                                                                (archived)
                                                            </span>
                                                        )}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <RelativeDate
                                                        date={attempt.created_at}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {attempt.score}
                                                </TableCell>
                                                <TableCell className="text-green-600">
                                                    {attempt.total_correct}
                                                </TableCell>
                                                <TableCell className="text-red-600">
                                                    {attempt.total_incorrect}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end items-center gap-1">
                                                        <Button
                                                            asChild
                                                            variant="default"
                                                            size="sm"
                                                        >
                                                            <Link
                                                                href={route(
                                                                    "student.attempts.show",
                                                                    attempt.id
                                                                )}
                                                            >
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View Details
                                                            </Link>
                                                        </Button>
                                                        {!attempt.ended_at && (
                                                            <>
                                                                <Button
                                                                    asChild
                                                                    variant="outline"
                                                                    size="sm"
                                                                >
                                                                    <Link
                                                                        href={route(
                                                                            "student.attempts.resume",
                                                                            attempt.id
                                                                        )}
                                                                    >
                                                                        <Play className="mr-2 h-4 w-4" />
                                                                        Resume
                                                                    </Link>
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 shrink-0"
                                                                    title="Complete"
                                                                    onClick={() =>
                                                                        router.post(
                                                                            route(
                                                                                "student.attempts.complete",
                                                                                attempt.id
                                                                            ),
                                                                            {},
                                                                            {
                                                                                preserveScroll: true,
                                                                            }
                                                                        )
                                                                    }
                                                                >
                                                                    <Check className="h-4 w-4" />
                                                                </Button>
                                                                {attempt.archived_at ? (
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
                                                                        title="Unarchive"
                                                                        onClick={() =>
                                                                            router.post(
                                                                                route(
                                                                                    "student.attempts.unarchive",
                                                                                    attempt.id
                                                                                ),
                                                                                {},
                                                                                {
                                                                                    preserveScroll: true,
                                                                                }
                                                                            )
                                                                        }
                                                                    >
                                                                        <ArchiveRestore className="h-4 w-4" />
                                                                    </Button>
                                                                ) : (
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
                                                                        title="Archive"
                                                                        onClick={() =>
                                                                            router.post(
                                                                                route(
                                                                                    "student.attempts.archive",
                                                                                    attempt.id
                                                                                ),
                                                                                {},
                                                                                {
                                                                                    preserveScroll: true,
                                                                                }
                                                                            )
                                                                        }
                                                                    >
                                                                        <Archive className="h-4 w-4" />
                                                                    </Button>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {attempts.last_page > 1 && (
                            <div className="p-4">
                                <SmartPagination
                                    currentPage={attempts.current_page}
                                    totalPages={attempts.last_page}
                                    onPageChange={(page) => {
                                        const url = attempts.links.find(
                                            (link) =>
                                                link.label === String(page) &&
                                                link.url
                                        )?.url;
                                        if (url) handlePageChange(url);
                                    }}
                                    prevPageUrl={attempts.prev_page_url}
                                    nextPageUrl={attempts.next_page_url}
                                    onUrlChange={handlePageChange}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </StudentLayout>
    );
}
