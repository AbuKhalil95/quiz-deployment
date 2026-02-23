import { Head } from "@inertiajs/react";
import { useMemo } from "react";
import AdminLayout from "@/layouts/admin";
import { Card, CardContent } from "@/components/ui/card";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    RadialBarChart,
    RadialBar,
    Legend,
    BarChart,
    Bar,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Props {
    quizAverages: any[];
    attemptsOverTime: any[];
    hardQuestions: any[];
    stats: {
        students: number;
        quizzes: number;
        attempts: number;
        pass: number;
        fail: number;
    };
    isAdmin: boolean;
}

export default function Index({
    quizAverages,
    attemptsOverTime,
    hardQuestions,
    stats,
    isAdmin,
}: Props) {
    const total = stats.pass + stats.fail;

    const passFailData = useMemo(
        () => [
            {
                name: "Pass",
                value: stats.pass,
                fill: "#22c55e",
            },
            {
                name: "Fail",
                value: stats.fail,
                fill: "#ef4444",
            },
        ],
        [stats],
    );

    const successRate = total ? Math.round((stats.pass / total) * 100) : 0;

    return (
        <AdminLayout
            breadcrumbs={[
                { title: "Dashboard", href: "/admin" },
                { title: "Analytics", href: "/admin/charts" },
            ]}
        >
            <Head title="SaaS Analytics" />

            <div className="p-8 space-y-10">
                {/* ================= KPI SECTION ================= */}
                <div
                    className={`grid grid-cols-1 md:grid-cols-${
                        isAdmin ? 4 : 3
                    } gap-6`}
                >
                    {isAdmin && (
                        <KpiCard title="Students" value={stats.students ?? 0} />
                    )}
                    <KpiCard title="Quizzes" value={stats.quizzes} />
                    <KpiCard title="Attempts" value={stats.attempts} />

                    <KpiCard
                        title="Success Rate"
                        value={`${successRate}%`}
                        trend={successRate > 50}
                    />
                </div>

                {/* ================= PERFORMANCE SECTION ================= */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Attempts Trend */}
                    <AnalyticsCard title="Attempts Trend">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={attemptsOverTime}>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="attempts"
                                    stroke="#6366f1"
                                    fill="#6366f1"
                                    fillOpacity={0.3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </AnalyticsCard>

                    {/* Pass / Fail Radial */}
                    <AnalyticsCard title="Pass vs Fail">
                        <ResponsiveContainer width="100%" height={300}>
                            <RadialBarChart
                                innerRadius="20%"
                                outerRadius="100%"
                                data={passFailData}
                            >
                                <RadialBar dataKey="value" />
                                <Tooltip />
                                <Legend />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </AnalyticsCard>
                </div>

                {/* ================= QUIZ PERFORMANCE ================= */}
                <AnalyticsCard title="Quiz Performance Overview">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={quizAverages}>
                            <XAxis dataKey="quiz" />
                            <YAxis />
                            <Tooltip />
                            <Bar
                                dataKey="avg_score"
                                fill="#2563eb"
                                radius={[6, 6, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </AnalyticsCard>
            </div>
        </AdminLayout>
    );
}

/* ========================== COMPONENTS ========================== */

function KpiCard({
    title,
    value,
    trend,
}: {
    title: string;
    value: string | number;
    trend?: boolean;
}) {
    return (
        <Card className="shadow-lg hover:scale-[1.02] transition-all duration-200">
            <CardContent className="p-6 flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className="text-3xl font-bold mt-2">{value}</p>
                </div>

                {trend !== undefined && (
                    <div>
                        {trend ? (
                            <TrendingUp className="text-green-500 w-6 h-6" />
                        ) : (
                            <TrendingDown className="text-red-500 w-6 h-6" />
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function AnalyticsCard({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <Card className="shadow-lg">
            <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">{title}</h2>
                {children}
            </CardContent>
        </Card>
    );
}
