import {
    PieChart,
    Pie,
    Cell,
    Legend,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { CHART_COLORS } from "./constants";

interface PieChartPassFailProps {
    pass: number;
    fail: number;
    height?: number;
}

export function PieChartPassFail({
    pass,
    fail,
    height = 300,
}: PieChartPassFailProps) {
    const data = [
        { name: "Pass", value: pass, fill: CHART_COLORS.success },
        { name: "Fail", value: fail, fill: CHART_COLORS.destructive },
    ];

    return (
        <ResponsiveContainer width="100%" height={height}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={height <= 200 ? 60 : 90}
                    innerRadius={0}
                    label={false}
                >
                    {data.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend
                    formatter={(value, entry) => {
                        const payload = entry.payload as { value: number };
                        return `${value}: ${payload.value}`;
                    }}
                    layout="vertical"
                    align="right"
                    verticalAlign="bottom"
                />
            </PieChart>
        </ResponsiveContainer>
    );
}
