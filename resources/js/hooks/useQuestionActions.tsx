import { LucideIcon } from "lucide-react";
import {
    Eye,
    Pencil,
    Trash2,
    UserPlus,
    UserMinus,
    CheckCircle,
    Clock,
    History,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";

export interface Question {
    id: number;
    state?: string;
    assigned_to?: number;
    creator?: {
        id: number;
        name: string;
        roles?: {
            id: number;
            name: string;
        }[];
    };
    state_history?: any[];
}

export interface CurrentUser {
    id?: number;
    roles?: string[];
}

export type ActionContext = "row" | "view" | "edit";

export interface QuestionAction {
    key: string;
    label: string;
    icon?: LucideIcon;
    variant?: VariantProps<typeof buttonVariants>["variant"];
    size?: VariantProps<typeof buttonVariants>["size"];
    onClick: () => void;
    visible: boolean;
    showIconOnly?: boolean;
}

interface UseQuestionActionsProps {
    question: Question;
    currentUser?: CurrentUser | null;
    context: ActionContext;
    handlers: {
        onView?: (question: Question) => void;
        onEdit?: (question: Question) => void;
        onDelete?: (question: Question) => void;
        onAssign?: (questionId: number) => void;
        onUnassign?: (questionId: number) => void;
        onChangeState?: (questionId: number, newState: string) => void;
        onResetToInitial?: (questionId: number) => void;
        onReviewStages?: () => void;
        onSaveDraft?: () => void;
        onSaveAndApprove?: () => void;
    };
}

export function useQuestionActions({
    question,
    currentUser,
    context,
    handlers,
}: UseQuestionActionsProps): QuestionAction[] {
    const actions: QuestionAction[] = [];

    // Helper functions for permission checks
    const isAssignedToSelf = question.assigned_to === currentUser?.id;
    const isAdmin = currentUser?.roles?.includes("admin");
    const isCreator = question.creator?.id === currentUser?.id;
    const isAdminCreated =
        question.creator?.roles?.some((r) => r.name === "admin") ?? false;
    const isTeacher = currentUser?.roles?.includes("teacher");

    const canAssign =
        question.state === "initial" &&
        !isAssignedToSelf &&
        ((isAdminCreated && isTeacher) || isCreator || isAdmin);

    const canEdit = isAssignedToSelf && question.state !== "done";
    const canDelete = isAdmin || isCreator;

    const canReset =
        question.state === "done" &&
        (isAssignedToSelf ||
            (!isAssignedToSelf &&
                ((isAdminCreated && isTeacher) || isCreator || isAdmin)));

    const canMarkAsDone = isAssignedToSelf && question.state === "under-review";

    const canUnassign = isAssignedToSelf && question.state === "under-review";

    const canApprove =
        context === "edit" &&
        question.state === "under-review" &&
        (isAdmin || isAssignedToSelf);

    // View action - only for row and view contexts
    if (context !== "edit" && handlers.onView) {
        actions.push({
            key: "view",
            label: "View",
            icon: Eye,
            variant: "outline",
            size: "sm",
            onClick: () => handlers.onView!(question),
            visible: true,
            showIconOnly: context === "row",
        });
    }

    // Assign to Me - only for row and view contexts
    if (context !== "edit" && handlers.onAssign && canAssign) {
        actions.push({
            key: "assign",
            label: "Assign to Me",
            icon: UserPlus,
            variant: "default",
            size: "sm",
            onClick: () => handlers.onAssign!(question.id),
            visible: true,
        });
    }

    // Edit action - for row and view contexts
    if (context !== "edit" && handlers.onEdit && canEdit) {
        actions.push({
            key: "edit",
            label: "Edit",
            icon: Pencil,
            variant: "outline",
            size: "sm",
            onClick: () => handlers.onEdit!(question),
            visible: true,
            showIconOnly: context === "row",
        });
    }

    // Reset to Initial / Review Again - only for row and view contexts
    if (context !== "edit" && handlers.onResetToInitial && canReset) {
        actions.push({
            key: "reset",
            label: isAssignedToSelf ? "Review Again" : "Reset & Assign to Me",
            icon: Clock,
            variant: "outline",
            size: "sm",
            onClick: () => handlers.onResetToInitial!(question.id),
            visible: true,
        });
    }

    // Mark as Done - only for row and view contexts
    if (context !== "edit" && handlers.onChangeState && canMarkAsDone) {
        actions.push({
            key: "mark-done",
            label: "Mark as Done",
            icon: CheckCircle,
            variant: "default",
            size: "sm",
            onClick: () => handlers.onChangeState!(question.id, "done"),
            visible: true,
        });
    }

    // Unassign - only for row and view contexts
    if (context !== "edit" && handlers.onUnassign && canUnassign) {
        actions.push({
            key: "unassign",
            label: "Unassign",
            icon: UserMinus,
            variant: "outline",
            size: "sm",
            onClick: () => handlers.onUnassign!(question.id),
            visible: true,
            showIconOnly: context === "row",
        });
    }

    // Delete - only for row and view contexts
    if (context !== "edit" && handlers.onDelete && canDelete) {
        actions.push({
            key: "delete",
            label: "Delete",
            icon: Trash2,
            variant: "destructive",
            size: "sm",
            onClick: () => handlers.onDelete!(question),
            visible: true,
            showIconOnly: context === "row",
        });
    }

    // Review Stages - only for view context
    if (
        context === "view" &&
        handlers.onReviewStages &&
        question.state_history &&
        question.state_history.length > 0
    ) {
        actions.push({
            key: "review-stages",
            label: "Review Stages",
            icon: History,
            variant: "outline",
            size: "sm",
            onClick: handlers.onReviewStages,
            visible: true,
        });
    }

    // Save as Draft - only for edit context
    if (context === "edit" && handlers.onSaveDraft) {
        actions.push({
            key: "save-draft",
            label: "Save as Draft",
            variant: canApprove ? "outline" : "default",
            size: "default",
            onClick: handlers.onSaveDraft,
            visible: true,
        });
    }

    // Save and Approve - only for edit context when applicable
    if (context === "edit" && handlers.onSaveAndApprove && canApprove) {
        actions.push({
            key: "save-approve",
            label: "Save and Approve",
            variant: "default",
            size: "default",
            onClick: () => {
                handlers.onSaveAndApprove!();
            },
            visible: true,
        });
    }

    return actions;
}
