"use client";

import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface QuestionFlagReportProps {
    questionId: number;
    isFlagged?: boolean;
    isReported?: boolean;
    onFlaggedChange?: (value: boolean) => void;
    onReportedChange?: (value: boolean) => void;
    className?: string;
    /** Icon size: default h-5 w-5 for take page, h-4 w-4 for smaller contexts */
    iconClassName?: string;
}

export function QuestionFlagReport({
    questionId,
    isFlagged = false,
    isReported = false,
    onFlaggedChange,
    onReportedChange,
    className,
    iconClassName = "h-5 w-5",
}: QuestionFlagReportProps) {
    const [flagged, setFlagged] = useState(isFlagged);
    const [reported, setReported] = useState(isReported);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState("");

    useEffect(() => {
        setFlagged(isFlagged);
        setReported(isReported);
    }, [isFlagged, isReported]);

    const handleFlag = () => {
        setFlagged(true);
        setReported(false);
        onReportedChange?.(false);
        onFlaggedChange?.(true);
        router.post(route("student.questions.flag", questionId), {}, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleUnflag = () => {
        setFlagged(false);
        onFlaggedChange?.(false);
        router.delete(route("student.questions.unflag", questionId), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleReportClick = () => {
        setShowReportModal(true);
    };

    const handleUnreport = () => {
        setReported(false);
        onReportedChange?.(false);
        router.delete(route("student.questions.unreport", questionId), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleReportSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reportReason.trim()) return;
        router.post(
            route("student.questions.report", questionId),
            { reason: reportReason.trim() },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setReported(true);
                    setFlagged(false);
                    onFlaggedChange?.(false);
                    onReportedChange?.(true);
                    setShowReportModal(false);
                    setReportReason("");
                },
            },
        );
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("text-foreground", className)}
                    >
                        <Flag
                            className={cn(
                                iconClassName,
                                (reported || flagged) && "fill-current",
                                reported
                                    ? "text-red-500"
                                    : flagged
                                      ? "text-yellow-500"
                                      : "text-muted-foreground",
                            )}
                        />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {!flagged && (
                        <DropdownMenuItem onClick={handleFlag}>
                            🟡 Flag for review
                        </DropdownMenuItem>
                    )}
                    {flagged && (
                        <DropdownMenuItem onClick={handleUnflag}>
                            ❌ Remove flag
                        </DropdownMenuItem>
                    )}
                    {!reported && (
                        <DropdownMenuItem onClick={handleReportClick}>
                            🔴 Report problem
                        </DropdownMenuItem>
                    )}
                    {reported && (
                        <DropdownMenuItem onClick={handleUnreport}>
                            ❌ Remove report
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog
                open={showReportModal}
                onOpenChange={(open) => {
                    setShowReportModal(open);
                    if (!open) setReportReason("");
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Report a problem</DialogTitle>
                        <DialogDescription>
                            Describe the issue with this question. Your report
                            will be reviewed by an instructor.
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={handleReportSubmit}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="report-reason">Reason</Label>
                            <Textarea
                                id="report-reason"
                                placeholder="Enter reason..."
                                value={reportReason}
                                onChange={(e) =>
                                    setReportReason(e.target.value)
                                }
                                required
                                rows={3}
                                className="resize-none"
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setShowReportModal(false);
                                    setReportReason("");
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" variant="destructive">
                                Submit report
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
