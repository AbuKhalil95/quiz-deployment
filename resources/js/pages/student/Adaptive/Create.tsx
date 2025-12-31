import * as React from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import InputError from "@/components/input-error";
import { handleFormErrors } from "@/lib/utils";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { route } from "ziggy-js";

interface Subject {
    id: number;
    name: string;
}

interface Props {
    subjects: Subject[];
}

export default function Create({ subjects }: Props) {
    const form = useForm({
        total_questions: "",
        strategy: "mixed",
        subject_ids: [] as number[],
        title: "",
        time_limit_minutes: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route("student.adaptive.generate"), {
            onError: (errors) => {
                handleFormErrors(errors);
            },
            onSuccess: () => {
                // Redirect happens automatically
            },
        });
    };

    const toggleSubject = (subjectId: number) => {
        const current = form.data.subject_ids;
        if (current.includes(subjectId)) {
            form.setData(
                "subject_ids",
                current.filter((id) => id !== subjectId)
            );
        } else {
            form.setData("subject_ids", [...current, subjectId]);
        }
    };

    const strategyOptions = [
        { value: "worst_performing", label: "Worst Performing" },
        { value: "never_attempted", label: "Never Attempted" },
        { value: "recently_incorrect", label: "Review Incorrect" },
        { value: "weak_subjects", label: "Weak Subjects" },
        { value: "mixed", label: "Mixed Challenge" },
    ];

    return (
        <>
            <Head title="Create Adaptive Quiz" />
            <div className="container mx-auto py-8 px-4 max-w-4xl">
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.visit(route("student.dashboard"))}
                        className="mb-4"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                    <h1 className="text-3xl font-bold">Create Adaptive Quiz</h1>
                    <p className="text-muted-foreground mt-2">
                        Generate a personalized quiz based on your performance
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Quiz Configuration</CardTitle>
                        <CardDescription>
                            Select your strategy and preferences to generate a
                            personalized adaptive quiz
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Strategy Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="strategy">Strategy *</Label>
                                <Select
                                    value={form.data.strategy}
                                    onValueChange={(value) =>
                                        form.setData("strategy", value)
                                    }
                                >
                                    <SelectTrigger id="strategy">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {strategyOptions.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError
                                    message={form.errors.strategy}
                                    className="mt-1"
                                />
                                <p className="text-sm text-muted-foreground">
                                    Choose how questions should be selected for
                                    this quiz
                                </p>
                            </div>

                            {/* Total Questions */}
                            <div className="space-y-2">
                                <Label htmlFor="total_questions">
                                    Total Questions *
                                </Label>
                                <Input
                                    id="total_questions"
                                    type="number"
                                    min="1"
                                    value={form.data.total_questions}
                                    onChange={(e) =>
                                        form.setData(
                                            "total_questions",
                                            e.target.value
                                        )
                                    }
                                />
                                <InputError
                                    message={form.errors.total_questions}
                                    className="mt-1"
                                />
                            </div>

                            {/* Subject Selection */}
                            <div className="space-y-2">
                                <Label>Subjects (Optional)</Label>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Leave empty to include all subjects, or
                                    select specific subjects
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {subjects.map((subject) => (
                                        <div
                                            key={subject.id}
                                            className="flex items-center space-x-2"
                                        >
                                            <Checkbox
                                                id={`subject-${subject.id}`}
                                                checked={form.data.subject_ids.includes(
                                                    subject.id
                                                )}
                                                onCheckedChange={() =>
                                                    toggleSubject(subject.id)
                                                }
                                            />
                                            <Label
                                                htmlFor={`subject-${subject.id}`}
                                                className="cursor-pointer font-normal"
                                            >
                                                {subject.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                                <InputError
                                    message={form.errors.subject_ids}
                                    className="mt-1"
                                />
                            </div>

                            {/* Time Limit */}
                            <div className="space-y-2">
                                <Label htmlFor="time_limit_minutes">
                                    Time Limit (minutes, optional)
                                </Label>
                                <Input
                                    id="time_limit_minutes"
                                    type="number"
                                    min="1"
                                    value={form.data.time_limit_minutes}
                                    onChange={(e) =>
                                        form.setData(
                                            "time_limit_minutes",
                                            e.target.value
                                        )
                                    }
                                />
                                <InputError
                                    message={form.errors.time_limit_minutes}
                                    className="mt-1"
                                />
                            </div>

                            {/* Title */}
                            <div className="space-y-2">
                                <Label htmlFor="title">
                                    Custom Title (Optional)
                                </Label>
                                <Input
                                    id="title"
                                    type="text"
                                    maxLength={255}
                                    value={form.data.title}
                                    onChange={(e) =>
                                        form.setData("title", e.target.value)
                                    }
                                    placeholder="Leave empty for auto-generated title"
                                />
                                <InputError
                                    message={form.errors.title}
                                    className="mt-1"
                                />
                            </div>

                            <div className="flex justify-end space-x-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        router.visit(route("student.dashboard"))
                                    }
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={form.processing}
                                >
                                    {form.processing ? (
                                        <>
                                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        "Generate Quiz"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}



