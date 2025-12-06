import * as React from "react";
import { router } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Question {
    id: number;
    question_text: string;
}

interface DeleteQuestionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    question: Question | null;
    onSuccess?: () => void;
}

export function DeleteQuestionDialog({
    open,
    onOpenChange,
    question,
    onSuccess,
}: DeleteQuestionDialogProps) {
    const handleDelete = () => {
        if (!question) return;

        router.delete(route("admin.questions.destroy", question.id), {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
                onSuccess?.();
                toast.success("Question deleted successfully");
            },
            onError: (errors) => {
                const errorMessage =
                    errors.message ||
                    errors.error ||
                    "Failed to delete question";
                toast.error(errorMessage);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Question</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this question? This
                        action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                {question && (
                    <div className="py-4">
                        <p className="text-sm">
                            <strong>Question:</strong>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {question.question_text.substring(0, 200)}
                            {question.question_text.length > 200 && "..."}
                        </p>
                    </div>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        Delete Question
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

