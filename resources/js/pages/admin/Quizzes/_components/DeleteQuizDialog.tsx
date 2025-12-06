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

interface Quiz {
    id: number;
    title: string;
    mode: string;
}

interface DeleteQuizDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    quiz: Quiz | null;
    onSuccess?: () => void;
}

export function DeleteQuizDialog({
    open,
    onOpenChange,
    quiz,
    onSuccess,
}: DeleteQuizDialogProps) {
    const handleDelete = () => {
        if (!quiz) return;

        router.delete(route("admin.quizzes.destroy", quiz.id), {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
                onSuccess?.();
                toast.success("Quiz deleted successfully");
            },
            onError: (errors) => {
                const errorMessage =
                    errors.message ||
                    errors.error ||
                    "Failed to delete quiz";
                toast.error(errorMessage);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Quiz</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this quiz? This action
                        cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                {quiz && (
                    <div className="py-4">
                        <p className="text-sm">
                            <strong>Title:</strong> {quiz.title}
                        </p>
                        <p className="text-sm">
                            <strong>Mode:</strong> {quiz.mode}
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
                        Delete Quiz
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

