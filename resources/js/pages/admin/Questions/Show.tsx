import { Head, Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "@/layouts/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useQuestionActions } from "@/hooks/useQuestionActions";
import { useQuestionActionHandlers } from "@/hooks/useQuestionActionHandlers";
import { QuestionActions } from "@/components/common/QuestionActions";
import { QuestionStatusBadge } from "@/components/common/QuestionStatusBadge";
import { SubjectBadge } from "@/components/common/SubjectBadge";

interface Subject {
    id: number;
    name: string;
}

interface Tag {
    id: number;
    tag_text: string;
}

interface Option {
    id: number;
    option_text: string;
    is_correct: boolean;
}

interface StateHistory {
    id: number;
    from_state: string | null;
    to_state: string;
    changed_by: {
        id: number;
        name: string;
    } | null;
    notes: string | null;
    created_at: string;
}

interface Question {
    id: number;
    subject_id: number;
    question_text: string;
    state?: string;
    assigned_to?: number;
    assigned_to_user?: {
        id: number;
        name: string;
    };
    subject?: Subject;
    tags?: Tag[];
    options?: Option[];
    explanations?: {
        correct?: string;
        wrong?: string;
        option1?: string;
        option2?: string;
        option3?: string;
        option4?: string;
        option5?: string;
    };
    creator?: {
        id: number;
        name: string;
        roles: {
            id: number;
            name: string;
        }[];
    };
    state_history?: StateHistory[];
}

interface Props {
    question: Question;
}

export default function Show({ question }: Props) {
    const { auth } = usePage().props as any;
    const currentUser = auth?.user;
    const [showReviewStages, setShowReviewStages] = useState(false);

    const toggleReviewStages = () => {
        setShowReviewStages((prev) => !prev);
    };

    const handlers = useQuestionActionHandlers({
        reloadOnSuccess: true,
        onReviewStagesCustom: toggleReviewStages,
    });

    const actions = useQuestionActions({
        question,
        currentUser,
        context: "view",
        handlers,
    });

    return (
        <AdminLayout
            breadcrumbs={[
                { title: "Dashboard", href: "/admin" },
                { title: "Questions", href: "/admin/questions" },
                {
                    title: `Question ${question.id}`,
                    href: `/admin/questions/${question.id}`,
                },
            ]}
        >
            <Head title={`Question: ${question.id}`} />
            <div className="p-6">
                <div className="mb-4 flex items-center justify-between gap-4 flex-wrap">
                    <Button variant="outline" asChild>
                        <Link href="/admin/questions">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Questions
                        </Link>
                    </Button>
                    <QuestionActions actions={actions} />
                </div>

                <div className="flex gap-6">
                    <div className="flex-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Question Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-muted-foreground">
                                            ID
                                        </Label>
                                        <p className="text-lg font-semibold">
                                            {question.id}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">
                                            Subject
                                        </Label>
                                        <div className="mt-1">
                                            {question.subject ? (
                                                <SubjectBadge
                                                    subject={question.subject}
                                                />
                                            ) : (
                                                <span className="text-muted-foreground text-sm">
                                                    N/A
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {question.state && (
                                    <div>
                                        <Label className="text-muted-foreground">
                                            Status
                                        </Label>
                                        <div className="mt-1">
                                            <QuestionStatusBadge
                                                state={question.state}
                                            />
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <Label className="text-muted-foreground mb-2">
                                        Question Text
                                    </Label>
                                    <p className="text-base whitespace-pre-wrap">
                                        {question.question_text}
                                    </p>
                                </div>
                                {question.tags && question.tags.length > 0 && (
                                    <div>
                                        <Label className="text-muted-foreground mb-2">
                                            Tags
                                        </Label>
                                        <div className="flex flex-wrap gap-2">
                                            {question.tags.map((tag) => (
                                                <Badge
                                                    key={tag.id}
                                                    variant="secondary"
                                                >
                                                    {tag.tag_text}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {/* General Explanations (shown before options) */}
                                {question.explanations &&
                                    (question.explanations.correct ||
                                        question.explanations.wrong) && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>
                                                    General Explanations
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                {question.explanations
                                                    .correct && (
                                                    <div className="p-3 bg-muted/50 border border-border rounded-lg">
                                                        <Label className="text-sm font-medium text-foreground mb-1.5 block">
                                                            Correct Answer
                                                            Explanation
                                                        </Label>
                                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                                            {
                                                                question
                                                                    .explanations
                                                                    .correct
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                                {question.explanations
                                                    .wrong && (
                                                    <div className="p-3 bg-muted/50 border border-border rounded-lg">
                                                        <Label className="text-sm font-medium text-foreground mb-1.5 block">
                                                            Wrong Answer
                                                            Fallback
                                                        </Label>
                                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                                            {
                                                                question
                                                                    .explanations
                                                                    .wrong
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    )}

                                {question.options &&
                                    question.options.length > 0 && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Options</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    {question.options.map(
                                                        (option, index) => {
                                                            const optionKey =
                                                                `option${
                                                                    index + 1
                                                                }` as keyof typeof question.explanations;
                                                            const explanation =
                                                                question
                                                                    .explanations?.[
                                                                    optionKey
                                                                ];

                                                            return (
                                                                <div
                                                                    key={
                                                                        option.id
                                                                    }
                                                                    className={`p-4 border rounded-lg ${
                                                                        option.is_correct
                                                                            ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700/50"
                                                                            : "bg-background"
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <span className="text-sm font-medium">
                                                                            Option{" "}
                                                                            {index +
                                                                                1}
                                                                        </span>
                                                                        {option.is_correct ? (
                                                                            <Badge
                                                                                variant="default"
                                                                                className="bg-green-400 hover:bg-green-500"
                                                                            >
                                                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                                                Correct
                                                                            </Badge>
                                                                        ) : (
                                                                            <Badge variant="outline">
                                                                                <XCircle className="h-3 w-3 mr-1" />
                                                                                Incorrect
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-sm whitespace-pre-wrap mb-3">
                                                                        {
                                                                            option.option_text
                                                                        }
                                                                    </p>
                                                                    {explanation && (
                                                                        <div className="mt-3 pt-3 border-t border-border">
                                                                            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                                                                                Explanation
                                                                            </Label>
                                                                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                                                                {
                                                                                    explanation
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                            </CardContent>
                        </Card>
                    </div>

                    <div
                        className={`transition-all duration-300 ease-in-out ${
                            showReviewStages
                                ? "w-80 opacity-100"
                                : "w-0 pl-0 border-0 opacity-0 overflow-hidden"
                        }`}
                    >
                        {showReviewStages && (
                            <Card id="review-stages" className="sticky top-6">
                                <CardHeader>
                                    <CardTitle>Status History</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
                                        {question.state_history &&
                                        question.state_history.length > 0 ? (
                                            question.state_history.map(
                                                (history) => (
                                                    <div
                                                        key={history.id}
                                                        className="border-l-2 border-primary pl-3 pb-3"
                                                    >
                                                        <div className="mb-1">
                                                            <span className="text-sm font-medium">
                                                                {history.from_state
                                                                    ? `${history.from_state} → ${history.to_state}`
                                                                    : `Created → ${history.to_state}`}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mb-1">
                                                            {new Date(
                                                                history.created_at
                                                            ).toLocaleString()}
                                                        </p>
                                                        {history.changed_by && (
                                                            <p className="text-xs text-muted-foreground mb-1">
                                                                Changed by:{" "}
                                                                {
                                                                    history
                                                                        .changed_by
                                                                        .name
                                                                }
                                                            </p>
                                                        )}
                                                        {history.notes && (
                                                            <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded">
                                                                {history.notes}
                                                            </p>
                                                        )}
                                                    </div>
                                                )
                                            )
                                        ) : (
                                            <p className="text-sm text-muted-foreground">
                                                No history available
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
