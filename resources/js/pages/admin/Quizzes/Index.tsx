import { Head } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "@/layouts/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { CreateQuizDialog } from "./_components/CreateQuizDialog";
import { ViewQuizDialog } from "./_components/ViewQuizDialog";
import { EditQuizDialog } from "./_components/EditQuizDialog";
import { DeleteQuizDialog } from "./_components/DeleteQuizDialog";

interface Subject {
    id: number;
    name: string;
}

interface Quiz {
    id: number;
    title: string;
    mode: string;
    subject_id?: number;
    time_limit_minutes?: number;
    total_questions?: number;
    subject?: Subject;
}

interface Props {
    quizzes: Quiz[];
    subjects: Subject[];
}

const formatMode = (mode: string) => {
    const modeMap: Record<string, string> = {
        by_subject: "By Subject",
        mixed_bag: "Mixed Bag",
        timed: "Timed",
    };
    return modeMap[mode] || mode;
};

export default function Index({ quizzes, subjects }: Props) {
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

    const handleView = (quiz: Quiz) => {
        setSelectedQuiz(quiz);
        setViewDialogOpen(true);
    };

    const handleEdit = (quiz: Quiz) => {
        setSelectedQuiz(quiz);
        setEditDialogOpen(true);
    };

    const handleDelete = (quiz: Quiz) => {
        setSelectedQuiz(quiz);
        setDeleteDialogOpen(true);
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { title: "Dashboard", href: "/admin" },
                { title: "Quizzes", href: "/admin/quizzes" },
            ]}
        >
            <Head title="Quizzes" />
            <div className="p-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Quizzes</CardTitle>
                            <Button onClick={() => setCreateDialogOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Quiz
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Mode</TableHead>
                                    <TableHead>Time Limit</TableHead>
                                    <TableHead>Questions</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {quizzes.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="text-center"
                                        >
                                            No quizzes found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    quizzes.map((quiz) => (
                                        <TableRow key={quiz.id}>
                                            <TableCell>{quiz.id}</TableCell>
                                            <TableCell>{quiz.title}</TableCell>
                                            <TableCell>
                                                {quiz.subject?.name || "N/A"}
                                            </TableCell>
                                            <TableCell>
                                                {formatMode(quiz.mode)}
                                            </TableCell>
                                            <TableCell>
                                                {quiz.time_limit_minutes
                                                    ? `${quiz.time_limit_minutes} min`
                                                    : "N/A"}
                                            </TableCell>
                                            <TableCell>
                                                {quiz.total_questions || "N/A"}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleView(quiz)
                                                        }
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleEdit(quiz)
                                                        }
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDelete(quiz)
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <CreateQuizDialog
                    open={createDialogOpen}
                    onOpenChange={setCreateDialogOpen}
                    subjects={subjects}
                />

                <ViewQuizDialog
                    open={viewDialogOpen}
                    onOpenChange={setViewDialogOpen}
                    quiz={selectedQuiz}
                />

                <EditQuizDialog
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                    quiz={selectedQuiz}
                    subjects={subjects}
                />

                <DeleteQuizDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    quiz={selectedQuiz}
                />
            </div>
        </AdminLayout>
    );
}

