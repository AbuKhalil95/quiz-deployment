import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Cell,
} from "recharts";
import { CHART_COLORS, formatPercent } from "./constants";

interface BarChartPercentProps {
    data: Array<Record<string, string | number>>;
    xKey: string;
    barKey?: string;
    color?: string;
    height?: number;
    showGrid?: boolean;
    xAxisAngle?: number;
    highlightLowest?: boolean;
}

export function BarChartPercent({
    data,
    xKey,
    barKey = "avg_score",
    color = CHART_COLORS.bar,
    height = 300,
    showGrid = false,
    xAxisAngle,
    highlightLowest = false,
}: BarChartPercentProps) {
    const lowestIndex = highlightLowest && data.length > 0
        ? data.reduce((minIdx, curr, idx, arr) =>
              (curr[barKey] as number) < (arr[minIdx][barKey] as number)
                  ? idx
                  : minIdx,
              0
          )
        : -1;
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
                    tickFormatter={formatPercent}
                    domain={[0, 100]}
                    className="text-muted-foreground"
                />
                <Tooltip
                    formatter={(v: number | undefined) => [
                        v != null ? formatPercent(v) : "",
                        "Avg %",
                    ]}
                />
                <Bar dataKey={barKey} fill={color} radius={[6, 6, 0, 0]}>
                    {highlightLowest &&
                        data.map((_, index) => (
                            <Cell
                                key={index}
                                fill={
                                    index === lowestIndex
                                        ? CHART_COLORS.destructive
                                        : color
                                }
                            />
                        ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
