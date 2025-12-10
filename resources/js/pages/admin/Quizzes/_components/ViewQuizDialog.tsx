import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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

interface ViewQuizDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    quiz: Quiz | null;
}

const formatMode = (mode: string) => {
    const modeMap: Record<string, string> = {
        by_subject: "By Subject",
        mixed_bag: "Mixed Bag",
        timed: "Timed",
    };
    return modeMap[mode] || mode;
};

export function ViewQuizDialog({
    open,
    onOpenChange,
    quiz,
}: ViewQuizDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Quiz Details</DialogTitle>
                    <DialogDescription>View quiz information</DialogDescription>
                </DialogHeader>

                {quiz && (
                    <div className="grid gap-4 py-4">
                        <div>
                            <Label className="text-muted-foreground">
                                Title
                            </Label>
                            <p className="text-sm font-medium">{quiz.title}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">
                                Mode
                            </Label>
                            <p className="text-sm font-medium">
                                {formatMode(quiz.mode)}
                            </p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">
                                Subject
                            </Label>
                            <p className="text-sm font-medium">
                                {quiz.subject?.name || "N/A"}
                            </p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">
                                Time Limit
                            </Label>
                            <p className="text-sm font-medium">
                                {quiz.time_limit_minutes
                                    ? `${quiz.time_limit_minutes} minutes`
                                    : "N/A"}
                            </p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">
                                Total Questions
                            </Label>
                            <p className="text-sm font-medium">
                                {quiz.total_questions || "N/A"}
                            </p>
                        </div>
                        {quiz.questions && quiz.questions.length > 0 ? (
                            <div>
                                <Label className="text-muted-foreground mb-2 block">
                                    Questions ({quiz.questions.length})
                                </Label>
                                <div className="max-h-80 overflow-y-auto border rounded p-2 bg-gray-50">
                                    <ul className="list-decimal ml-5 space-y-1">
                                        {quiz.questions.map((q, index) => (
                                            <li
                                                key={q.id}
                                                className="text-sm font-medium"
                                            >
                                                {q.question.question_text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <p>No questions found</p>
                        )}
                    </div>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
