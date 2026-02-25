import { Head, Link, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import StudentLayout from "@/layouts/student";
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
    AreaChartScore,
    AreaChartAttempts,
    CHART_COLORS,
} from "@/components/charts";
import { BookOpen } from "lucide-react";
import { route } from "ziggy-js";

interface Subject {
    id: number;
    name: string;
}

interface Props {
    progress: Array<{ date: string; avg_score: number }>;
    attemptsOverTime: Array<{ date: string; attempts: number }>;
    attemptsPerQuiz: Array<{ quiz: string; attempts: number }>;
    quizPerformance: Array<{ quiz: string; avg_score: number }>;
    pass: number;
    fail: number;
    subjects: Subject[];
    filters?: {
        date_from?: string;
        date_to?: string;
        subject_id?: string;
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

export default function Index({
    progress,
    attemptsOverTime = [],
    attemptsPerQuiz = [],
    quizPerformance,
    pass,
    fail,
    subjects = [],
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

    const excludeChallenges = filters.exclude_challenges !== false;

    const applyFilters = (overrides?: {
        preset?: keyof typeof PRESETS;
        subjectId?: string;
        excludeChallenges?: boolean;
    }) => {
        const p = overrides?.preset ?? preset;
        const sid = overrides?.subjectId ?? filters.subject_id;
        const excl = overrides?.excludeChallenges ?? excludeChallenges;
        setPreset(p);
        const { from, to } = getPresetDates(p);
        router.get(
            route("student.charts.index"),
            {
                date_from: from || undefined,
                date_to: to || undefined,
                subject_id: sid || undefined,
                exclude_challenges: excl ? "1" : "0",
            },
            { preserveState: true },
        );
    };

    const hasAnyData =
        progress.length > 0 ||
        attemptsOverTime.length > 0 ||
        attemptsPerQuiz.length > 0 ||
        quizPerformance.length > 0 ||
        pass > 0 ||
        fail > 0;

    return (
        <StudentLayout title="My Analytics">
            <Head title="My Analytics" />

            <div className="space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                            Date range:
                        </span>
                        <Select
                            value={preset}
                            onValueChange={(v) =>
                                applyFilters({
                                    preset: v as keyof typeof PRESETS,
                                })
                            }
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {(
                                    Object.keys(
                                        PRESETS,
                                    ) as (keyof typeof PRESETS)[]
                                ).map((k) => (
                                    <SelectItem key={k} value={k}>
                                        {PRESETS[k].label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {subjects.length > 0 && (
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">
                                Subject:
                            </span>
                            <Select
                                value={filters.subject_id ?? "all"}
                                onValueChange={(v) =>
                                    applyFilters({
                                        subjectId: v === "all" ? "" : v,
                                    })
                                }
                            >
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="All subjects" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All subjects
                                    </SelectItem>
                                    {subjects.map((s) => (
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

                    <div className="flex items-center gap-2">
                        <Switch
                            id="exclude-challenges"
                            checked={excludeChallenges}
                            onCheckedChange={(checked) =>
                                applyFilters({
                                    excludeChallenges: checked,
                                })
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

                {!hasAnyData ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
                            <h2 className="text-xl font-semibold mb-2">
                                No analytics yet
                            </h2>
                            <p className="text-muted-foreground text-center max-w-md mb-6">
                                Complete a quiz to see your performance over
                                time, pass/fail stats, and which quizzes you
                                excel at.
                            </p>
                            <Button asChild>
                                <Link href={route("student.dashboard")}>
                                    Browse quizzes
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="flex flex-wrap gap-6">
                            <ChartCard
                                title="Progress Over Time"
                                className="min-w-full w-full flex-1"
                            >
                                {progress.length === 0 ? (
                                    <EmptyChartMessage>
                                        Take quizzes on different days to see
                                        your progress trend
                                    </EmptyChartMessage>
                                ) : (
                                    <AreaChartScore
                                        data={progress}
                                        xKey="date"
                                        yKey="avg_score"
                                        yAxisPercent
                                    />
                                )}
                            </ChartCard>
                            <ChartCard
                                title="Attempts Over Time"
                                className="min-w-[min(600px,100%)] flex-1"
                            >
                                {attemptsOverTime.length === 0 ? (
                                    <EmptyChartMessage>
                                        No attempts in selected range
                                    </EmptyChartMessage>
                                ) : (
                                    <AreaChartAttempts
                                        data={attemptsOverTime}
                                        xKey="date"
                                        yKey="attempts"
                                    />
                                )}
                            </ChartCard>

                            <ChartCard
                                title="Attempts per Quiz"
                                className="min-w-[min(600px,100%)] flex-1"
                            >
                                {attemptsPerQuiz.length === 0 ? (
                                    <EmptyChartMessage>
                                        No quiz attempts yet
                                    </EmptyChartMessage>
                                ) : (
                                    <BarChartCount
                                        data={attemptsPerQuiz}
                                        xKey="quiz"
                                        barKey="attempts"
                                        color={CHART_COLORS.primary}
                                        xAxisAngle={-15}
                                    />
                                )}
                            </ChartCard>

                            <ChartCard
                                title="Quiz Performance"
                                subtitle={
                                    quizPerformance.length > 0
                                        ? (() => {
                                              const worst =
                                                  quizPerformance.reduce(
                                                      (min, curr) =>
                                                          (curr.avg_score as number) <
                                                          (min.avg_score as number)
                                                              ? curr
                                                              : min,
                                                  );
                                              return `Worst: ${worst.quiz} (${worst.avg_score}%)`;
                                          })()
                                        : undefined
                                }
                                className="min-w-[min(600px,100%)] flex-1"
                            >
                                {quizPerformance.length === 0 ? (
                                    <EmptyChartMessage>
                                        No quiz attempts yet
                                    </EmptyChartMessage>
                                ) : (
                                    <BarChartPercent
                                        data={quizPerformance}
                                        xKey="quiz"
                                        color={CHART_COLORS.success}
                                        showGrid
                                        highlightLowest
                                    />
                                )}
                            </ChartCard>

                            <ChartCard
                                title="Pass vs Fail"
                                className="min-w-[min(380px,100%)] max-w-[380px] flex-1"
                            >
                                {pass === 0 && fail === 0 ? (
                                    <EmptyChartMessage>
                                        No completed attempts yet
                                    </EmptyChartMessage>
                                ) : (
                                    <PieChartPassFail pass={pass} fail={fail} />
                                )}
                            </ChartCard>
                        </div>
                    </>
                )}
            </div>
        </StudentLayout>
    );
}
