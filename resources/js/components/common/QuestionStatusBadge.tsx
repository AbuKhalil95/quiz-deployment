import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface QuestionStatusBadgeProps {
    state: "initial" | "under-review" | "done" | string | null | undefined;
    className?: string;
    as?: "badge" | "span";
}

export function QuestionStatusBadge({
    state,
    className,
    as = "badge",
}: QuestionStatusBadgeProps) {
    if (!state) {
        return null;
    }

    const getStatusConfig = () => {
        switch (state) {
            case "initial":
                return {
                    label: "Unassigned",
                    className:
                        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200",
                };
            case "under-review":
                return {
                    label: "Under Review",
                    className:
                        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                };
            case "done":
                return {
                    label: "Done",
                    className:
                        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                };
            default:
                return {
                    label: state,
                    className: "bg-muted text-muted-foreground",
                };
        }
    };

    const config = getStatusConfig();

    if (as === "span") {
        return (
            <span
                className={cn(
                    "text-xs px-2 py-0.5 rounded font-medium",
                    config.className,
                    className
                )}
            >
                {config.label}
            </span>
        );
    }

    return (
        <Badge className={cn(config.className, className)}>
            {config.label}
        </Badge>
    );
}
