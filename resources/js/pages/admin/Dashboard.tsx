import { Head, router } from "@inertiajs/react";
import { useMemo, useState, useEffect } from "react";
import AdminLayout from "@/layouts/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ChartCard,
    EmptyChartMessage,
    BarChartPercent,
    BarChartCount,
    PieChartPassFail,
    AreaChartAttempts,
    CHART_COLORS,
} from "@/components/charts";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

interface Student {
    id: number;
    name: string;
}

interface Props {
    quizAverages: any[];
    attemptsOverTime: any[];
    attemptsPerQuiz: Array<{ quiz: string; attempts: number }>;
    performanceBySubject: Array<{ subject: string; avg_score: number }>;
    topStudents: Array<{ student: string; avg_score: number }>;
    stats: {
        students: number;
        quizzes: number;
        attempts: number;
        pass: number;
        fail: number;
    };
    students: Student[];
    isAdmin: boolean;
    filters?: {
        date_from?: string;
        date_to?: string;
        student_id?: string;
        exclude_challenges?: boolean;
    };
}

const PRESETS = {
    "7d": { label: "Last 7 days", days: 7 },
    "30d": { label: "Last 30 days", days: 30 },
    "90d": { label: "Last 90 days", days: 90 },
    all: { label: "All time", days: null },
} as const;

function getPresetDates(preset: keyof typeof PRESETS) {
    if (preset === "all") return { from: "", to: "" };
    const days = PRESETS[preset].days!;
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);
    return {
        from: from.toISOString().split("T")[0],
        to: to.toISOString().split("T")[0],
    };
}

export default function Dashboard({
    quizAverages,
    attemptsOverTime,
    attemptsPerQuiz = [],
    performanceBySubject = [],
    topStudents = [],
    stats,
    students = [],
    isAdmin,
    filters = {},
}: Props) {
    const inferPreset = (): keyof typeof PRESETS => {
        if (!filters.date_from || !filters.date_to) return "all";
        const from = new Date(filters.date_from).getTime();
        const to = new Date(filters.date_to).getTime();
        const days = Math.round((to - from) / (1000 * 60 * 60 * 24));
        if (days <= 7) return "7d";
        if (days <= 30) return "30d";
        if (days <= 90) return "90d";
        return "all";
    };

    const [preset, setPreset] = useState<keyof typeof PRESETS>(inferPreset);

    useEffect(() => {
        setPreset(inferPreset());
    }, [filters?.date_from, filters?.date_to]);

    const successRate = useMemo(() => {
        const total = stats.pass + stats.fail;
        return total ? Math.round((stats.pass / total) * 100) : 0;
    }, [stats.pass, stats.fail]);

    const excludeChallenges = filters.exclude_challenges !== false;

    const applyFilters = (overrides?: {
        preset?: keyof typeof PRESETS;
        studentId?: string;
        excludeChallenges?: boolean;
    }) => {
        const p = overrides?.preset ?? preset;
        const sid = overrides?.studentId ?? filters.student_id;
        const excl = overrides?.excludeChallenges ?? excludeChallenges;
        setPreset(p);
        const { from, to } = getPresetDates(p);
        router.get(
            route("admin.dashboard"),
            {
                date_from: from || undefined,
                date_to: to || undefined,
                student_id: sid || undefined,
                exclude_challenges: excl ? "1" : "0",
            },
            { preserveState: true }
        );
    };

    const hasAnyData =
        quizAverages.length > 0 ||
        attemptsOverTime.length > 0 ||
        attemptsPerQuiz.length > 0 ||
        stats.attempts > 0;

    return (
        <AdminLayout
            breadcrumbs={[{ title: "Dashboard", href: "/admin" }]}
        >
            <Head title="Dashboard" />

            <div className="p-8 space-y-8">
                {/* ================= HEADER: FILTER + KPIs ================= */}
                <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                            Date range:
                        </span>
                        <Select
                            value={preset}
                            onValueChange={(v) =>
                                applyFilters({ preset: v as keyof typeof PRESETS })
                            }
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {(Object.keys(PRESETS) as (keyof typeof PRESETS)[]).map(
                                    (k) => (
                                        <SelectItem key={k} value={k}>
                                            {PRESETS[k].label}
                                        </SelectItem>
                                    )
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {students.length > 0 && !filters.student_id && (
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">
                                Student:
                            </span>
                            <Select
                                value="all"
                                onValueChange={(v) =>
                                    applyFilters({
                                        studentId: v === "all" ? "" : v,
                                    })
                                }
                            >
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="All students" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All students
                                    </SelectItem>
                                    {students.map((s) => (
                                        <SelectItem
                                            key={s.id}
                                            value={String(s.id)}
                                        >
                                            {s.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    {filters.student_id && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => applyFilters({ studentId: "" })}
                        >
                            View all students
                        </Button>
                    )}

                    <div className="flex items-center gap-2">
                        <Switch
                            id="exclude-challenges"
                            checked={excludeChallenges}
                            onCheckedChange={(checked) =>
                                applyFilters({ excludeChallenges: checked })
                            }
                        />
                        <label
                            htmlFor="exclude-challenges"
                            className="text-sm text-muted-foreground cursor-pointer"
                        >
                            Quizzes only (exclude challenges)
                        </label>
                    </div>
                </div>

                {/* ================= KPI SECTION ================= */}
                <div
                    className={`grid grid-cols-1 sm:grid-cols-2 ${
                        isAdmin ? "lg:grid-cols-4" : "lg:grid-cols-3"
                    } gap-4`}
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

                {/* ================= EMPTY STATE ================= */}
                {!hasAnyData && (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
                            <h2 className="text-xl font-semibold mb-2">
                                No analytics data yet
                            </h2>
                            <p className="text-muted-foreground text-center max-w-md">
                                Attempts will appear here once students complete
                                quizzes.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {hasAnyData && (
                    <>
                        <div className="flex flex-wrap gap-6">
                            <ChartCard
                                title="Attempts Trend"
                                className="min-w-[min(320px,100%)] flex-1 basis-[320px]"
                            >
                                {attemptsOverTime.length === 0 ? (
                                    <EmptyChartMessage>
                                        No attempts in selected range
                                    </EmptyChartMessage>
                                ) : (
                                    <AreaChartAttempts data={attemptsOverTime} />
                                )}
                            </ChartCard>

                            <ChartCard
                                title="Attempts per Quiz"
                                className="min-w-[min(320px,100%)] max-w-[520px] flex-1 basis-[320px]"
                            >
                                {attemptsPerQuiz.length === 0 ? (
                                    <EmptyChartMessage>
                                        No attempts in selected range
                                    </EmptyChartMessage>
                                ) : (
                                    <BarChartCount
                                        data={attemptsPerQuiz}
                                        xKey="quiz"
                                        barKey="attempts"
                                        color={CHART_COLORS.primary}
                                        xAxisAngle={-45}
                                    />
                                )}
                            </ChartCard>

                            <ChartCard
                                title="Pass vs Fail"
                                className="min-w-[min(320px,100%)] max-w-[520px] flex-1 basis-[320px]"
                            >
                                {stats.pass === 0 && stats.fail === 0 ? (
                                    <EmptyChartMessage>
                                        No completed attempts
                                    </EmptyChartMessage>
                                ) : (
                                    <PieChartPassFail
                                        pass={stats.pass}
                                        fail={stats.fail}
                                    />
                                )}
                            </ChartCard>

                            {performanceBySubject.length > 0 && (
                                <ChartCard
                                    title="Performance by Subject"
                                    className="min-w-[min(320px,100%)] max-w-[520px] flex-1 basis-[320px]"
                                >
                                    <BarChartPercent
                                        data={performanceBySubject}
                                        xKey="subject"
                                        color={CHART_COLORS.success}
                                    />
                                </ChartCard>
                            )}

                            {topStudents.length > 0 && !filters.student_id && (
                                <ChartCard
                                    title="Top Students by Avg Score"
                                    className="min-w-[min(320px,100%)] max-w-[520px] flex-1 basis-[320px]"
                                >
                                    <BarChartPercent
                                        data={topStudents}
                                        xKey="student"
                                        color={CHART_COLORS.bar}
                                        xAxisAngle={-45}
                                    />
                                </ChartCard>
                            )}
                        </div>

                        <ChartCard
                            title="Quiz Performance Overview"
                            subtitle={
                                quizAverages.length > 0
                                    ? (() => {
                                          const worst = quizAverages.reduce(
                                              (min, curr) =>
                                                  (curr.avg_score as number) <
                                                  (min.avg_score as number)
                                                      ? curr
                                                      : min
                                          );
                                          return `Worst: ${worst.quiz} (${worst.avg_score}%)`;
                                      })()
                                    : undefined
                            }
                            className="min-w-[min(320px,100%)] max-w-[800px] w-full flex-1"
                        >
                            {quizAverages.length === 0 ? (
                                <EmptyChartMessage>
                                    No quiz attempts in selected range
                                </EmptyChartMessage>
                            ) : (
                                <BarChartPercent
                                    data={quizAverages}
                                    xKey="quiz"
                                    color={CHART_COLORS.bar}
                                    height={350}
                                    highlightLowest
                                />
                            )}
                        </ChartCard>
                    </>
                )}
            </div>
        </AdminLayout>
    );
}

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
                    <p className="text-sm text-muted-foreground">{title}</p>
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
