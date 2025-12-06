import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
    status: number;
    message?: string;
}

export default function Error({ status, message }: ErrorProps) {
    const titles: Record<number, string> = {
        503: "503: Service Unavailable",
        500: "500: Server Error",
        404: "404: Page Not Found",
        403: "403: Forbidden",
    };

    const descriptions: Record<number, string> = {
        503: "Sorry, we are doing some maintenance. Please check back soon.",
        500: message || "Whoops, something went wrong on our servers.",
        404:
            message ||
            "Sorry, the page you are looking for could not be found.",
        403: message || "Sorry, you are forbidden from accessing this page.",
    };

    return (
        <>
            <Head title={titles[status] || "Error"} />
            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-md text-center">
                    <h1 className="text-6xl font-bold text-gray-900">
                        {status}
                    </h1>
                    <h2 className="mt-4 text-2xl font-semibold text-gray-800">
                        {titles[status] || "Error"}
                    </h2>
                    <p className="mt-4 text-gray-600">{descriptions[status]}</p>
                    <div className="mt-8">
                        <Button asChild>
                            <Link href="/admin">Go back to dashboard</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
