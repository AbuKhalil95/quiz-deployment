import "../css/app.css";

import { createInertiaApp, router } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

const appName = import.meta.env.VITE_APP_NAME || "Quizzes";

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob("./pages/**/*.tsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <>
                <App {...props} />
                <Toaster closeButton />
            </>
        );
    },
    progress: {
        color: "#4B5563",
    },
}).then(() => {
    // Handle Inertia errors
    router.on("error", (errors) => {
        if (errors.errors) {
            // Laravel validation errors - show first error
            const firstError = Object.values(errors.errors)[0];
            if (Array.isArray(firstError)) {
                toast.error(firstError[0]);
            } else {
                toast.error(firstError);
            }
        } else if (errors.message) {
            // General error message
            toast.error(errors.message);
        }
    });

    console.log(`${appName} initialized`);
});
