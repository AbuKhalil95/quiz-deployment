import {
    CircleCheck,
    Info,
    LoaderCircle,
    OctagonX,
    TriangleAlert,
} from "lucide-react";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            theme="system"
            className="toaster group"
            position={"top-center"}
            icons={{
                success: <CircleCheck className="h-4 w-4" />,
                info: <Info className="h-4 w-4" />,
                warning: <TriangleAlert className="h-4 w-4" />,
                error: <OctagonX className="h-4 w-4" />,
                loading: <LoaderCircle className="h-4 w-4 animate-spin" />,
            }}
            toastOptions={{
                classNames: {
                    success: "!bg-green-500 !text-white",
                    info: "!bg-blue-500 !text-white",
                    warning: "!bg-yellow-500 !text-white",
                    error: "!bg-red-500 !text-white",
                    loading: "!bg-gray-500 !text-white",
                    toast: "group toast !border-0 group-[.toaster]:shadow-lg",
                    description:
                        "group-[.toast]:text-muted-foreground",
                    actionButton:
                        "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                    cancelButton:
                        "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
                },
            }}
            {...props}
        />
    );
};

export { Toaster };



