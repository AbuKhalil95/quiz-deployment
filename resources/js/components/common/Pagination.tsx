import { Link } from "@inertiajs/react";

interface Props {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export default function Pagination({ links }: Props) {
    function getClassName(active: boolean): string {
        if (active) {
            return "mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-white focus:border-primary focus:text-primary bg-blue-700 text-white";
        } else {
            return "mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-white focus:border-primary focus:text-primary";
        }
    }

    return (
        links.length > 3 && (
            <div className="mb-4">
                <div className="mt-8 flex flex-wrap">
                    {links.map((link, key) =>
                        link.url === null ? (
                            <div
                                key={key}
                                className="mr-1 mb-1 rounded border px-4 py-3 text-sm leading-4 text-gray-400"
                            >
                                {link.label}
                            </div>
                        ) : (
                            <Link
                                key={key}
                                className={getClassName(link.active)}
                                href={link.url}
                            >
                                {link.label}
                            </Link>
                        )
                    )}
                </div>
            </div>
        )
    );
}



