import { Head, Link, router, useForm } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import StudentLayout from "@/layouts/student";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { route } from "ziggy-js";
import {
    BookOpen,
    Check,
    ChevronLeft,
    ChevronRight,
    DoorOpen,
    Eye,
    EyeOff,
} from "lucide-react";
import { SubjectBadge } from "@/components/common/SubjectBadge";
import { TagBadge } from "@/components/common/TagBadge";
import { QuestionFlagReport } from "@/components/common/QuestionFlagReport";

interface Props {
    attempt: { id: number };
    question: any;
    questionIndex: string;
    questions: Array<{ id: number }>;
    selectedAnswer?: string;
    isFlagged?: boolean;
    ends_at_timestamp?: number | null;
    explanations?: Record<string, string> | null;
    showExplanationAll?: boolean; // ✅ من backend
    isReported?: boolean;
}

export default function QuizTake({
    attempt,
    question,
    questionIndex,
    questions,
    selectedAnswer = "",
    isFlagged = false,
    ends_at_timestamp,
    explanations = null,
    showExplanationAll = false,
    isReported = false,
}: Props) {
    const form = useForm({ answer: selectedAnswer });
    const qIndex = Number(questionIndex);
    const isFirstQuestion = qIndex === 0;
    const isLastQuestion = qIndex === questions.length - 1;
    const allowNavigation = useRef(false);
    const timerFinishedRef = useRef(false);

    const TIMER_STORAGE_KEY = `quiz_attempt_time_${attempt.id}`;

    const [showExplanation, setShowExplanation] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showSubjectAndTags, setShowSubjectAndTags] = useState(false);
    const [timeLeft, setTimeLeft] = useState(() => {
        if (!ends_at_timestamp) return null;
        try {
            const stored = localStorage.getItem(TIMER_STORAGE_KEY);
            if (stored !== null) {
                const parsed = parseInt(stored, 10);
                const now = Math.floor(Date.now() / 1000);
                const serverRemaining = ends_at_timestamp - now;
                if (!isNaN(parsed) && parsed > 0 && serverRemaining > 0) {
                    return Math.min(parsed, serverRemaining);
                }
            }
        } catch (_) {
            /* ignore */
        }
        const now = Math.floor(Date.now() / 1000);
        const diff = ends_at_timestamp - now;
        return diff > 0 ? diff : 0;
    });

    // تشغيل الشرح مباشرة إذا مفعل من admin
    useEffect(() => {
        if (showExplanationAll) {
            setShowExplanation(true);
        }
    }, [showExplanationAll]);

    // مؤقت الاختبار
    useEffect(() => {
        if (timeLeft === null) return;
        if (timeLeft <= 0) {
            if (!timerFinishedRef.current) {
                timerFinishedRef.current = true;
                finishQuiz();
            }
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (!prev || prev <= 1) {
                    clearInterval(timer);
                    try {
                        localStorage.removeItem(TIMER_STORAGE_KEY);
                    } catch (_) {
                        /* ignore */
                    }
                    if (!timerFinishedRef.current) {
                        timerFinishedRef.current = true;
                        finishQuiz();
                    }
                    return 0;
                }
                const next = prev - 1;
                try {
                    localStorage.setItem(TIMER_STORAGE_KEY, String(next));
                } catch (_) {
                    /* ignore */
                }
                return next;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const finishQuiz = () => {
        router.post(
            route("student.attempts.submit.single", [attempt.id, qIndex]),
            {},
            {
                onSuccess: () =>
                    router.visit(route("student.attempts.show", attempt.id)),
            },
        );
    };

    // إعادة ضبط السؤال عند تغييره
    useEffect(() => {
        form.reset();
        form.setData("answer", selectedAnswer || "");
        if (!showExplanationAll) setShowExplanation(false);
        setShowSubjectAndTags(false);
        allowNavigation.current = false;
    }, [question.id]);

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.data.answer) {
            router.visit(
                route("student.attempts.take.single", [attempt.id, qIndex + 1]),
            );
            return;
        }

        form.post(
            route("student.attempts.submit.single", [attempt.id, qIndex]),
            {
                onSuccess: () => {
                    router.visit(
                        route("student.attempts.take.single", [
                            attempt.id,
                            qIndex + 1,
                        ]),
                    );
                },
            },
        );
    };

    const handleFinish = (e: React.FormEvent) => {
        e.preventDefault();

        if (form.data.answer) {
            form.post(
                route("student.attempts.submit.single", [attempt.id, qIndex]),
                {
                    onSuccess: () =>
                        router.visit(
                            route("student.attempts.show", attempt.id),
                        ),
                },
            );
            return;
        }

        router.visit(route("student.attempts.show", attempt.id));
    };

    const handleShowExplanation = () => {
        setShowExplanation((v) => !v);
    };

    const handlePrevious = () => {
        if (qIndex > 0) {
            router.visit(
                route("student.attempts.take.single", [attempt.id, qIndex - 1]),
            );
        }
    };

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs > 0 ? hrs + " hr " : ""}${
            mins > 0 ? mins + " min " : ""
        }${secs} sec`;
    };

    return (
        <StudentLayout title="Take Quiz">
            <Head title="Take Quiz" />
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-4">
                    <p className="text-lg font-semibold">
                        Question {qIndex + 1} / {questions.length}
                    </p>
                    {timeLeft !== null && (
                        <p className="text-sm font-medium text-red-600">
                            Time Left: {formatTime(timeLeft)}
                        </p>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                            <div
                                className="flex flex-wrap items-center gap-1.5"
                                onMouseEnter={() => setShowSubjectAndTags(true)}
                                onMouseLeave={() =>
                                    setShowSubjectAndTags(false)
                                }
                                onClick={() => setShowSubjectAndTags((v) => !v)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        setShowSubjectAndTags((v) => !v);
                                    }
                                }}
                                title="Reveal subject and tags"
                            >
                                {(question.subject ||
                                    (question.tags &&
                                        question.tags.length > 0)) && (
                                    <>
                                        <span
                                            className={`inline-flex h-5 shrink-0 items-center text-muted-foreground transition-opacity ${
                                                showSubjectAndTags
                                                    ? "opacity-40"
                                                    : "opacity-100"
                                            }`}
                                            aria-hidden
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                        </span>
                                        {question.subject &&
                                            (showSubjectAndTags ? (
                                                <SubjectBadge
                                                    subject={question.subject}
                                                    className="min-w-[5rem] max-w-[7rem] truncate"
                                                />
                                            ) : (
                                                <span className="inline-flex h-5 min-w-[5rem] max-w-[7rem] items-center truncate rounded-md border border-transparent bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                                    ···
                                                </span>
                                            ))}
                                        {question.tags &&
                                            question.tags.length > 0 &&
                                            question.tags.map((tag: any) =>
                                                showSubjectAndTags ? (
                                                    <TagBadge
                                                        key={tag.id}
                                                        tag={tag}
                                                        className="min-w-[4rem] max-w-[6rem] truncate"
                                                    />
                                                ) : (
                                                    <span
                                                        key={tag.id}
                                                        className="inline-flex h-5 min-w-[4rem] max-w-[6rem] items-center truncate rounded-md border border-transparent bg-muted px-1.5 py-0.5 text-xs font-normal text-muted-foreground"
                                                    >
                                                        ···
                                                    </span>
                                                ),
                                            )}
                                    </>
                                )}
                            </div>
                            <QuestionFlagReport
                                questionId={question.id}
                                isFlagged={isFlagged}
                                isReported={isReported}
                            />
                        </div>

                        <CardTitle className="sm:text-xl">
                            {question.question_text}
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <RadioGroup
                                value={form.data.answer}
                                onValueChange={(v) => {
                                    form.setData("answer", v);
                                }}
                                className="space-y-3"
                            >
                                {question.options.map((option: any) => {
                                    const isSelected =
                                        form.data.answer === String(option.id);
                                    const showHighlight =
                                        (showExplanation ||
                                            showExplanationAll) &&
                                        (option.is_correct || isSelected);
                                    const isCorrectOption = Boolean(
                                        option.is_correct,
                                    );
                                    return (
                                        <Label
                                            key={option.id}
                                            htmlFor={`option-${option.id}`}
                                            className={`flex items-center space-x-2 p-4 border rounded-lg cursor-pointer ${
                                                showHighlight
                                                    ? isCorrectOption
                                                        ? "border-green-500 bg-green-50 dark:bg-green-950/30 dark:border-green-600"
                                                        : "border-red-400 bg-red-50 dark:bg-red-950/30 dark:border-red-500"
                                                    : "hover:bg-accent"
                                            }`}
                                        >
                                            <RadioGroupItem
                                                value={String(option.id)}
                                                id={`option-${option.id}`}
                                            />
                                            <span className="flex-1">
                                                {option.option_text}
                                            </span>
                                        </Label>
                                    );
                                })}
                            </RadioGroup>

                            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 mt-6">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                >
                                    <Link href={route("student.dashboard")}>
                                        <DoorOpen className="h-4 w-4" /> Resume
                                        Later
                                    </Link>
                                </Button>

                                <div className="flex flex-wrap items-center gap-2 flex-1 justify-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handlePrevious}
                                        disabled={isFirstQuestion}
                                    >
                                        <ChevronLeft className="mr-2 h-4 w-4" />{" "}
                                        Back
                                    </Button>

                                    {!showExplanationAll && explanations && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleShowExplanation}
                                        >
                                            {showExplanation ? (
                                                <Eye className="h-4 w-4" />
                                            ) : (
                                                <EyeOff className="h-4 w-4" />
                                            )}
                                            <span className="hidden sm:block">
                                                Answer
                                            </span>
                                        </Button>
                                    )}

                                    {isLastQuestion ? (
                                        <Button
                                            type="button"
                                            onClick={handleFinish}
                                            disabled={form.processing}
                                        >
                                            <Check className="mr-2 h-4 w-4" />{" "}
                                            Finish Quiz
                                        </Button>
                                    ) : (
                                        <Button
                                            type="button"
                                            onClick={handleNext}
                                            disabled={form.processing}
                                        >
                                            {form.data.answer ? "Next" : "Skip"}{" "}
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {(showExplanation || showExplanationAll) &&
                                explanations && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded border">
                                        {explanations.correct && (
                                            <p className="text-sm text-green-700">
                                                <strong>Explanation:</strong>{" "}
                                                {explanations.correct}
                                            </p>
                                        )}

                                        {form.data.answer &&
                                            explanations[
                                                `option${form.data.answer}`
                                            ] && (
                                                <p className="text-sm text-blue-700 mt-2">
                                                    <strong>
                                                        Selected option:
                                                    </strong>{" "}
                                                    {
                                                        explanations[
                                                            `option${form.data.answer}`
                                                        ]
                                                    }
                                                </p>
                                            )}

                                        {explanations.wrong &&
                                            !explanations[
                                                `option${form.data.answer}`
                                            ] && (
                                                <p className="text-sm text-red-700 mt-2">
                                                    {explanations.wrong}
                                                </p>
                                            )}
                                    </div>
                                )}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </StudentLayout>
    );
}
