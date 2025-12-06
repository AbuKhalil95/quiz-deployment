import { Head, Link } from "@inertiajs/react";
import AdminLayout from "@/layouts/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Quiz {
    id: number;
    title: string;
}

interface Student {
    id: number;
    name: string;
    email: string;
}

interface Question {
    id: number;
    question_text: string;
}

interface SelectedOption {
    id: number;
    option_text: string;
}

interface Answer {
    id: number;
    question_id: number;
    selected_option_id: number | null;
    is_correct: boolean;
    question: Question | null;
    selected_option: SelectedOption | null;
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
    quiz: Quiz | null;
    student: Student | null;
    answers: Answer[];
}

interface Props {
    attempt: Attempt;
}

export default function Show({ attempt }: Props) {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString();
    };

    const totalQuestions = attempt.answers.length;
    const percentage = totalQuestions > 0 
        ? Math.round((attempt.total_correct / totalQuestions) * 100) 
        : 0;

    return (
        <AdminLayout
            breadcrumbs={[
                { title: "Dashboard", href: "/admin" },
                { title: "Attempts", href: "/admin/attempts" },
                { title: `Attempt #${attempt.id}`, href: `/admin/attempts/${attempt.id}` },
            ]}
        >
            <Head title={`Attempt #${attempt.id}`} />
            <div className="p-6">
                <div className="mb-4">
                    <Button variant="outline" asChild>
                        <Link href={route("admin.attempts.index")}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Attempts
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6">
                    {/* Attempt Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Attempt Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Student
                                    </label>
                                    <p className="text-sm font-medium">
                                        {attempt.student?.name || "N/A"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {attempt.student?.email}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Quiz
                                    </label>
                                    <p className="text-sm font-medium">
                                        {attempt.quiz?.title || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Started At
                                    </label>
                                    <p className="text-sm">
                                        {formatDate(attempt.started_at)}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Ended At
                                    </label>
                                    <p className="text-sm">
                                        {formatDate(attempt.ended_at)}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Score
                                    </label>
                                    <p className="text-2xl font-bold">
                                        {attempt.total_correct} / {totalQuestions}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {percentage}% correct
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Breakdown
                                    </label>
                                    <div className="flex gap-2 mt-1">
                                        <Badge variant="default" className="bg-green-500">
                                            {attempt.total_correct} Correct
                                        </Badge>
                                        <Badge variant="destructive">
                                            {attempt.total_incorrect} Incorrect
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Answers */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Answers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {attempt.answers.length === 0 ? (
                                    <p className="text-center text-muted-foreground">
                                        No answers found
                                    </p>
                                ) : (
                                    attempt.answers.map((answer, index) => (
                                        <div
                                            key={answer.id}
                                            className="border rounded-lg p-4"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-muted-foreground">
                                                        Question {index + 1}
                                                    </span>
                                                    {answer.is_correct ? (
                                                        <Badge
                                                            variant="default"
                                                            className="bg-green-500"
                                                        >
                                                            <CheckCircle2 className="mr-1 h-3 w-3" />
                                                            Correct
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="destructive">
                                                            <XCircle className="mr-1 h-3 w-3" />
                                                            Incorrect
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">
                                                        Question
                                                    </label>
                                                    <p className="text-sm">
                                                        {answer.question
                                                            ?.question_text ||
                                                            "N/A"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">
                                                        Selected Answer
                                                    </label>
                                                    <p className="text-sm">
                                                        {answer.selected_option
                                                            ?.option_text ||
                                                            "No answer selected"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}

