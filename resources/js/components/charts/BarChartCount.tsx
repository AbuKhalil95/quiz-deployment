import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { CHART_COLORS } from "./constants";

interface BarChartCountProps {
    data: Array<Record<string, string | number>>;
    xKey: string;
    barKey?: string;
    color?: string;
    height?: number;
    showGrid?: boolean;
    xAxisAngle?: number;
}

export function BarChartCount({
    data,
    xKey,
    barKey = "attempts",
    color = CHART_COLORS.primary,
    height = 300,
    showGrid = false,
    xAxisAngle,
}: BarChartCountProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
                {showGrid && (
                    <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-muted"
                    />
                )}
                <XAxis
                    dataKey={xKey}
                    tick={{ fontSize: xAxisAngle ? 11 : 12 }}
                    angle={xAxisAngle}
                    textAnchor={xAxisAngle ? "end" : undefined}
                    height={xAxisAngle ? 80 : undefined}
                    className="text-muted-foreground"
                />
                <YAxis
                    tick={{ fontSize: 12 }}
                    allowDecimals={false}
                    className="text-muted-foreground"
                />
                <Tooltip />
                <Bar dataKey={barKey} fill={color} radius={[6, 6, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}
