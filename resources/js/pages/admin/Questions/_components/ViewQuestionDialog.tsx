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
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

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

interface Question {
    id: number;
    subject_id: number;
    question_text: string;
    subject?: Subject;
    tags?: Tag[];
    options?: Option[];
}

interface ViewQuestionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    question: Question | null;
}

export function ViewQuestionDialog({
    open,
    onOpenChange,
    question,
}: ViewQuestionDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Question Details</DialogTitle>
                    <DialogDescription>
                        View question information
                    </DialogDescription>
                </DialogHeader>
                {question && (
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-muted-foreground">
                                    Subject
                                </Label>
                                <p className="text-sm font-medium">
                                    {question.subject?.name || "N/A"}
                                </p>
                            </div>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">
                                Question Text
                            </Label>
                            <p className="text-sm font-medium whitespace-pre-wrap mt-1">
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
                                        <Badge key={tag.id} variant="secondary">
                                            {tag.tag_text}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                        {question.options && question.options.length > 0 && (
                            <div>
                                <Label className="text-muted-foreground mb-2">
                                    Options
                                </Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {question.options.map((option, index) => (
                                        <div
                                            key={option.id}
                                            className={`p-3 border rounded-lg ${
                                                option.is_correct
                                                    ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700/50"
                                                    : "bg-background"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-medium">
                                                    Option {index + 1}
                                                </span>
                                                {option.is_correct ? (
                                                    <Badge
                                                        variant="default"
                                                        className="bg-green-400 hover:bg-green-500 text-xs"
                                                    >
                                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                                        Correct
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        <XCircle className="h-3 w-3 mr-1" />
                                                        Incorrect
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-xs whitespace-pre-wrap">
                                                {option.option_text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
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

