import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { CHART_COLORS } from "./constants";

interface AreaChartScoreProps {
    data: Array<Record<string, string | number>>;
    xKey: string;
    yKey: string;
    color?: string;
    height?: number;
    yAxisPercent?: boolean;
}

export function AreaChartScore({
    data,
    xKey,
    yKey,
    color = CHART_COLORS.primary,
    height = 300,
    yAxisPercent = false,
}: AreaChartScoreProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                    dataKey={xKey}
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                />
                <YAxis
                    tick={{ fontSize: 12 }}
                    {...(yAxisPercent && {
                        domain: [0, 100],
                        tickFormatter: (v: number) => `${v}%`,
                    })}
                    className="text-muted-foreground"
                />
                <Tooltip
                    formatter={
                        yAxisPercent
                            ? (v: number | undefined) =>
                                  v != null ? [`${v}%`, "Avg %"] : ["", ""]
                            : undefined
                    }
                />
                <Area
                    type="monotone"
                    dataKey={yKey}
                    stroke={color}
                    fill={color}
                    fillOpacity={0.3}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
