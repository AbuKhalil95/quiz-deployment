import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { CHART_COLORS } from "./constants";

interface AreaChartAttemptsProps {
    data: Array<Record<string, string | number>>;
    xKey?: string;
    yKey?: string;
    height?: number;
}

export function AreaChartAttempts({
    data,
    xKey = "date",
    yKey = "attempts",
    height = 300,
}: AreaChartAttemptsProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data}>
                <XAxis
                    dataKey={xKey}
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                />
                <YAxis
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                />
                <Tooltip />
                <Area
                    type="monotone"
                    dataKey={yKey}
                    stroke={CHART_COLORS.primary}
                    fill={CHART_COLORS.primary}
                    fillOpacity={0.3}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
