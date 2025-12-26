import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Handles form validation errors and displays them to the user
 * @param errors - The errors object from an Inertia form
 * @param defaultMessage - Optional default error message if no errors are found
 */
export function handleFormErrors(
    errors: Record<string, string | undefined>,
    defaultMessage: string = "An error occurred. Please try again."
): void {
    const errorKeys = Object.keys(errors).filter(
        (key) => errors[key] !== undefined && errors[key] !== null
    );

    if (errorKeys.length === 0) {
        toast.error(defaultMessage);
        return;
    }

    // Get the first error message
    const firstError = errors[errorKeys[0]];

    if (errorKeys.length === 1) {
        toast.error(firstError || "Validation error");
    } else {
        toast.error(
            `${firstError || "Validation error"} (${
                errorKeys.length - 1
            } more error${errorKeys.length - 1 > 1 ? "s" : ""})`
        );
    }
}



