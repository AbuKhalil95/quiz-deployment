import { Head, Link } from "@inertiajs/react";
import AdminLayout from "@/layouts/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Subject {
    id: number;
    name: string;
}

interface Tag {
    id: number;
    tag_text: string;
}

interface Option {
    id: number;
    option_text: string;
    is_correct: boolean;
}

interface Question {
    id: number;
    subject_id: number;
    question_text: string;
    subject?: Subject;
    tags?: Tag[];
    options?: Option[];
}

interface Props {
    question: Question;
}

export default function Show({ question }: Props) {
    return (
        <AdminLayout
            breadcrumbs={[
                { title: "Dashboard", href: "/admin" },
                { title: "Questions", href: "/admin/questions" },
                {
                    title: `Question ${question.id}`,
                    href: `/admin/questions/${question.id}`,
                },
            ]}
        >
            <Head title={`Question: ${question.id}`} />
            <div className="p-6">
                <div className="mb-4">
                    <Button variant="outline" asChild>
                        <Link href="/admin/questions">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Questions
                        </Link>
                    </Button>
                </div>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Question Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">ID</p>
                            <p className="text-lg font-semibold">{question.id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Subject</p>
                            <p className="text-lg font-semibold">
                                {question.subject?.name || "N/A"}
                            </p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-sm text-muted-foreground mb-2">
                                Question Text
                            </p>
                            <p className="text-base whitespace-pre-wrap">
                                {question.question_text}
                            </p>
                        </div>
                        {question.tags && question.tags.length > 0 && (
                            <div className="col-span-2">
                                <p className="text-sm text-muted-foreground mb-2">
                                    Tags
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {question.tags.map((tag) => (
                                        <Badge key={tag.id} variant="secondary">
                                            {tag.tag_text}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {question.options && question.options.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Options</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                {question.options.map((option, index) => (
                                    <div
                                        key={option.id}
                                        className={`p-4 border rounded-lg ${
                                            option.is_correct
                                                ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700/50"
                                                : "bg-background"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-sm font-medium">
                                                Option {index + 1}
                                            </span>
                                            {option.is_correct ? (
                                                <Badge
                                                    variant="default"
                                                    className="bg-green-400 hover:bg-green-500"
                                                >
                                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                                    Correct
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline">
                                                    <XCircle className="h-3 w-3 mr-1" />
                                                    Incorrect
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm whitespace-pre-wrap">
                                            {option.option_text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}

