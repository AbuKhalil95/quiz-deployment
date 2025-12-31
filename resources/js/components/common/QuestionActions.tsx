import { Button } from "@/components/ui/button";
import { QuestionAction } from "@/hooks/useQuestionActions";

interface QuestionActionsProps {
    actions: QuestionAction[];
    className?: string;
}

export function QuestionActions({
    actions,
    className = "",
}: QuestionActionsProps) {
    return (
        <div className={`flex gap-2 flex-wrap ${className}`}>
            {actions.map((action) => {
                if (!action.visible) return null;

                const Icon = action.icon;
                const content =
                    action.showIconOnly && Icon ? (
                        <Icon className="h-4 w-4" />
                    ) : Icon ? (
                        <>
                            <Icon className="h-4 w-4 mr-2" />
                            {action.label}
                        </>
                    ) : (
                        action.label
                    );

                return (
                    <Button
                        key={action.key}
                        variant={action.variant || "outline"}
                        size={action.size || "sm"}
                        onClick={action.onClick}
                    >
                        {content}
                    </Button>
                );
            })}
        </div>
    );
}
