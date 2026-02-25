import { Card, CardContent } from "@/components/ui/card";

interface ChartCardProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    className?: string;
}

export function ChartCard({
    title,
    subtitle,
    children,
    className = "",
}: ChartCardProps) {
    return (
        <Card className={`shadow-lg ${className}`.trim()}>
            <CardContent className="p-6">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    {subtitle && (
                        <p className="text-sm text-muted-foreground mt-1">
                            {subtitle}
                        </p>
                    )}
                </div>
                {children}
            </CardContent>
        </Card>
    );
}
