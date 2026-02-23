import { Head } from "@inertiajs/react";
import StudentLayout from "@/layouts/student";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
} from "recharts";

interface Props {
    progress: any[];
    quizPerformance: any[];
    pass: number;
    fail: number;
    wrongQuestions: any[];
}

export default function Index({
    progress,
    quizPerformance,
    pass,
    fail,
    wrongQuestions,
}: Props) {
    const passFailData = [
        { name: "Pass", value: pass },
        { name: "Fail", value: fail },
    ];

    return (
        <StudentLayout title="My Analytics">
            <Head title="My Analytics" />

            <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* ================= Quiz Performance ================= */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quiz Performance</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={quizPerformance}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="quiz" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar
                                        dataKey="avg_score"
                                        fill="#22c55e"
                                        radius={[6, 6, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* ================= Pass / Fail ================= */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pass vs Fail</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={passFailData}
                                        dataKey="value"
                                        nameKey="name"
                                        outerRadius={90}
                                    >
                                        {passFailData.map((entry, index) => (
                                            <Cell
                                                key={index}
                                                fill={
                                                    index === 0
                                                        ? "#22c55e"
                                                        : "#ef4444"
                                                }
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* ================= Progress ================= */}
                <Card>
                    <CardHeader>
                        <CardTitle>Progress Over Time</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={progress}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="avg_score"
                                    stroke="#6366f1"
                                    fill="#6366f1"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </StudentLayout>
    );
}
