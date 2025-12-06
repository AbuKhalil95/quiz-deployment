import type { SharedData } from "@/types";
import { router, usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Messages() {
    const { flash } = usePage<SharedData>().props;

    useEffect(() => {
        // Handle flash messages from current page
        if (flash) {
            if (flash.success) toast.success(flash.success);
            if (flash.error) toast.error(flash.error);
            if (flash.warning) toast.warning(flash.warning);
            if (flash.info) toast.info(flash.info);
        }
    }, [flash]);

    return null;
}
