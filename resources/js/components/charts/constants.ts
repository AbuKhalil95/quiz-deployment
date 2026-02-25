export const CHART_COLORS = {
    primary: "hsl(var(--chart-1))",
    success: "hsl(var(--chart-2))",
    destructive: "hsl(var(--chart-3))",
    bar: "hsl(var(--chart-4))",
} as const;

export const formatPercent = (v: number) => `${v}%`;
