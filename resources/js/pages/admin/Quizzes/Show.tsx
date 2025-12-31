import * as React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminLayout from "@/layouts/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Pencil } from "lucide-react";
import { route } from "ziggy-js";
import { SmartPagination } from "@/components/common/SmartPagination";

interface Subject {
    id: number;
    name: string;
}

interface QuizQuestion {
    id: number;
    order: number;
    question: {
        id: number;
        question_text: string;
    };
}

interface Quiz {
    id: number;
    title: string;
    mode: string;
    subject?: Subject;
    time_limit_minutes?: number;
    total_questions?: number;
    questions?: QuizQuestion[];
}

interface Props {
    quiz: Quiz;
}

const formatMode = (mode: string) => {
    const modeMap: Record<string, string> = {
        by_subject: "By Subject",
        mixed_bag: "Mixed Bag",
        timed: "Timed",
    };
    return modeMap[mode] || mode;
};

export default function Show({ quiz }: Props) {
    const [currentPage, setCurrentPage] = React.useState(1);
    const questionsPerPage = 10;

    const totalQuestions = quiz.questions?.length || 0;
    const totalPages = Math.ceil(totalQuestions / questionsPerPage);

    const displayedQuestions = quiz.questions
        ?.sort((a, b) => a.order - b.order)
        .slice(
            (currentPage - 1) * questionsPerPage,
            currentPage * questionsPerPage
        );

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { title: "Dashboard", href: "/admin" },
                { title: "Quizzes", href: "/admin/quizzes" },
                {
                    title: quiz.title,
                    href: `/admin/quizzes/${quiz.id}`,
                },
            ]}
        >
            <Head title={`Quiz: ${quiz.title}`} />
            <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <Button variant="outline" asChild>
                        <Link href={route("admin.quizzes.index")}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Quizzes
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href={route("admin.quizzes.edit", quiz.id)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Quiz
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quiz Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground">
                                        ID
                                    </Label>
                                    <p className="text-lg font-semibold">
                                        {quiz.id}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">
                                        Title
                                    </Label>
                                    <p className="text-lg font-semibold">
                                        {quiz.title}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">
                                        Mode
                                    </Label>
                                    <p className="text-lg font-semibold">
                                        {formatMode(quiz.mode)}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">
                                        Subject
                                    </Label>
                                    <p className="text-lg font-semibold">
                                        {quiz.subject?.name || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">
                                        Time Limit
                                    </Label>
                                    <p className="text-lg font-semibold">
                                        {quiz.time_limit_minutes
                                            ? `${quiz.time_limit_minutes} minutes`
                                            : "No time limit"}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">
                                        Total Questions
                                    </Label>
                                    <p className="text-lg font-semibold">
                                        {quiz.total_questions || totalQuestions}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Questions ({totalQuestions})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {displayedQuestions &&
                            displayedQuestions.length > 0 ? (
                                <>
                                    <div className="overflow-x-auto">
                                        <div className="space-y-3 min-w-full">
                                            {displayedQuestions.map((q) => (
                                                <div
                                                    key={q.id}
                                                    className="border rounded p-3 bg-muted/50"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <span className="font-semibold text-muted-foreground min-w-[40px]">
                                                            #{q.order}
                                                        </span>
                                                        <p className="text-sm flex-1">
                                                            {
                                                                q.question
                                                                    .question_text
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <SmartPagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={goToPage}
                                    />
                                </>
                            ) : (
                                <p className="text-muted-foreground">
                                    No questions found
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
