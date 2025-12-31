import * as React from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SmartPagination } from "@/components/common/SmartPagination";
import { ArrowLeft, Search, Users, BookOpen, Clock } from "lucide-react";
import { route } from "ziggy-js";
import { SharedData } from "@/types";

interface Subject {
    id: number;
    name: string;
}

interface TargetStudent {
    id: number;
    name: string;
}

interface Quiz {
    id: number;
    title: string;
    total_questions: number;
    time_limit_minutes: number | null;
    created_at: string;
    created_by: number | null;
    subject: {
        id: number;
        name: string;
    } | null;
    target_student: {
        id: number;
        name: string;
    } | null;
    strategy: string;
    subject_ids: number[] | null;
    attempt_count: number;
}

interface Props {
    quizzes: {
        data: Quiz[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
    strategies: Record<string, string>;
    subjects: Subject[];
    targetStudents: TargetStudent[];
    filters: {
        strategy?: string;
        subject_id?: string;
        target_student_id?: string;
        search?: string;
    };
}

const strategyColors: Record<string, string> = {
    worst_performing: "bg-red-100 text-red-800",
    never_attempted: "bg-blue-100 text-blue-800",
    recently_incorrect: "bg-orange-100 text-orange-800",
    weak_subjects: "bg-purple-100 text-purple-800",
    mixed: "bg-green-100 text-green-800",
};

export default function Browse({
    quizzes,
    strategies,
    subjects,
    targetStudents,
    filters,
}: Props) {
    const { auth } = usePage<SharedData>().props;
    const currentUserId = auth?.user?.id;

    const [search, setSearch] = React.useState(filters.search || "");
    const [strategy, setStrategy] = React.useState(filters.strategy || "all");
    const [subjectId, setSubjectId] = React.useState(
        filters.subject_id || "all"
    );
    const [targetStudentId, setTargetStudentId] = React.useState(
        filters.target_student_id || "all"
    );

    const applyFilters = () => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (strategy && strategy !== "all") params.set("strategy", strategy);
        if (subjectId && subjectId !== "all")
            params.set("subject_id", subjectId);
        if (targetStudentId && targetStudentId !== "all")
            params.set("target_student_id", targetStudentId);

        router.get(
            route("student.adaptive.index"),
            Object.fromEntries(params),
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const clearFilters = () => {
        setSearch("");
        setStrategy("all");
        setSubjectId("all");
        setTargetStudentId("all");
        router.get(route("student.adaptive.index"));
    };

    const handlePageChange = (url: string | null) => {
        if (url) {
            router.visit(url, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const getStrategyColor = (strategyKey: string) => {
        return strategyColors[strategyKey] || "bg-gray-100 text-gray-800";
    };

    return (
        <>
            <Head title="Browse Challenges" />
            <div className="container mx-auto py-8 px-4 max-w-7xl">
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.visit(route("student.dashboard"))}
                        className="mb-4"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                    <h1 className="text-3xl font-bold">Browse Challenges</h1>
                    <p className="text-muted-foreground mt-2">
                        Take adaptive quizzes created by other students
                    </p>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="search">Search</Label>
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="search"
                                        placeholder="Search by title or student..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                applyFilters();
                                            }
                                        }}
                                        className="pl-8"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="strategy">Strategy</Label>
                                <Select
                                    value={strategy}
                                    onValueChange={setStrategy}
                                >
                                    <SelectTrigger id="strategy">
                                        <SelectValue placeholder="All strategies" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All strategies
                                        </SelectItem>
                                        {Object.entries(strategies).map(
                                            ([key, label]) => (
                                                <SelectItem
                                                    key={key}
                                                    value={key}
                                                >
                                                    {label}
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Select
                                    value={subjectId}
                                    onValueChange={setSubjectId}
                                >
                                    <SelectTrigger id="subject">
                                        <SelectValue placeholder="All subjects" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All subjects
                                        </SelectItem>
                                        {subjects.map((subject) => (
                                            <SelectItem
                                                key={subject.id}
                                                value={String(subject.id)}
                                            >
                                                {subject.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="target_student">
                                    Target Student
                                </Label>
                                <Select
                                    value={targetStudentId}
                                    onValueChange={setTargetStudentId}
                                >
                                    <SelectTrigger id="target_student">
                                        <SelectValue placeholder="All students" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All students
                                        </SelectItem>
                                        {targetStudents.map((student) => (
                                            <SelectItem
                                                key={student.id}
                                                value={String(student.id)}
                                            >
                                                {student.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 mt-4">
                            <Button variant="outline" onClick={clearFilters}>
                                Clear
                            </Button>
                            <Button onClick={applyFilters}>
                                Apply Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Quiz Cards */}
                {quizzes.data.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">
                                No challenges available. Be the first to create
                                one!
                            </p>
                            <Button
                                className="mt-4"
                                onClick={() =>
                                    router.visit(
                                        route("student.adaptive.create")
                                    )
                                }
                            >
                                Create Challenge
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                            {quizzes.data.map((quiz) => {
                                const isCreatedByMe =
                                    quiz.created_by === currentUserId;
                                return (
                                    <Card
                                        key={quiz.id}
                                        className={`hover:shadow-lg transition-shadow ${
                                            isCreatedByMe
                                                ? "bg-yellow-50 dark:bg-yellow-950/20"
                                                : ""}`}
                                    >
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <CardTitle className="text-lg">
                                                    {quiz.title}
                                                </CardTitle>
                                                <Badge
                                                    className={getStrategyColor(
                                                        quiz.strategy
                                                    )}
                                                >
                                                    {strategies[
                                                        quiz.strategy
                                                    ] || quiz.strategy}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                {quiz.target_student && (
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <Users className="mr-2 h-4 w-4" />
                                                        Created for:{" "}
                                                        {
                                                            quiz.target_student
                                                                .name
                                                        }
                                                    </div>
                                                )}

                                                {quiz.subject && (
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <BookOpen className="mr-2 h-4 w-4" />
                                                        {quiz.subject.name}
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">
                                                        {quiz.total_questions}{" "}
                                                        questions
                                                    </span>
                                                    {quiz.time_limit_minutes && (
                                                        <span className="flex items-center text-muted-foreground">
                                                            <Clock className="mr-1 h-3 w-3" />
                                                            {
                                                                quiz.time_limit_minutes
                                                            }{" "}
                                                            min
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="text-sm text-muted-foreground">
                                                    {quiz.attempt_count}{" "}
                                                    {quiz.attempt_count === 1
                                                        ? "attempt"
                                                        : "attempts"}
                                                </div>

                                                <Button
                                                    className="w-full"
                                                    onClick={() =>
                                                        router.visit(
                                                            route(
                                                                "student.quizzes.show",
                                                                quiz.id
                                                            )
                                                        )
                                                    }
                                                >
                                                    Challenge
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        <SmartPagination
                            currentPage={quizzes.current_page}
                            totalPages={quizzes.last_page}
                            onPageChange={(page) => {
                                const url = quizzes.links.find(
                                    (link) =>
                                        link.label === String(page) && link.url
                                )?.url;
                                if (url) handlePageChange(url);
                            }}
                            prevPageUrl={quizzes.prev_page_url}
                            nextPageUrl={quizzes.next_page_url}
                            onUrlChange={handlePageChange}
                        />
                    </>
                )}
            </div>
        </>
    );
}
