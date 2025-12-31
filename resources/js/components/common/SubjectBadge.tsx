import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SubjectBadgeProps {
    subject:
        | {
              id: number;
              name: string;
          }
        | null
        | undefined;
    className?: string;
    as?: "badge" | "span";
}

// Generate a consistent monochrome color based on subject ID
const getSubjectColor = (subjectId: number | null | undefined): string => {
    if (!subjectId) {
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200";
    }

    // Use modulo to cycle through monochrome shades
    const shades = [
        "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
        "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
        "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200",
        "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-200",
        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200",
    ];

    return shades[subjectId % shades.length];
};

export function SubjectBadge({
    subject,
    className,
    as = "badge",
}: SubjectBadgeProps) {
    if (!subject) {
        return null;
    }

    const colorClass = getSubjectColor(subject.id);

    if (as === "span") {
        return (
            <span
                className={cn(
                    "text-xs px-2 py-0.5 rounded font-medium",
                    colorClass,
                    className
                )}
            >
                {subject.name}
            </span>
        );
    }

    return <Badge className={cn(colorClass, className)}>{subject.name}</Badge>;
}
