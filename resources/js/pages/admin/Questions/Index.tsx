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
import { CreateQuestionDialog } from "./_components/CreateQuestionDialog";
import { ViewQuestionDialog } from "./_components/ViewQuestionDialog";
import { EditQuestionDialog } from "./_components/EditQuestionDialog";
import { DeleteQuestionDialog } from "./_components/DeleteQuestionDialog";

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
    questions: Question[];
    subjects: Subject[];
    tags: Tag[];
}

export default function Index({ questions, subjects, tags }: Props) {
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
        null
    );

    const handleView = (question: Question) => {
        setSelectedQuestion(question);
        setViewDialogOpen(true);
    };

    const handleEdit = (question: Question) => {
        setSelectedQuestion(question);
        setEditDialogOpen(true);
    };

    const handleDelete = (question: Question) => {
        setSelectedQuestion(question);
        setDeleteDialogOpen(true);
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { title: "Dashboard", href: "/admin" },
                { title: "Questions", href: "/admin/questions" },
            ]}
        >
            <Head title="Questions" />
            <div className="p-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Questions</CardTitle>
                            <Button onClick={() => setCreateDialogOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Question
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Question Text</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {questions.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="text-center"
                                        >
                                            No questions found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    questions.map((question) => (
                                        <TableRow key={question.id}>
                                            <TableCell>{question.id}</TableCell>
                                            <TableCell>
                                                {question.subject?.name ||
                                                    "N/A"}
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-md">
                                                    <div className="truncate">
                                                        {question.question_text}
                                                    </div>
                                                    {question.tags &&
                                                        question.tags.length >
                                                            0 && (
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {question.tags.map(
                                                                    (tag) => (
                                                                        <span
                                                                            key={
                                                                                tag.id
                                                                            }
                                                                            className="text-xs bg-muted px-2 py-0.5 rounded"
                                                                        >
                                                                            {
                                                                                tag.tag_text
                                                                            }
                                                                        </span>
                                                                    )
                                                                )}
                                                            </div>
                                                        )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleView(question)
                                                        }
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleEdit(question)
                                                        }
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDelete(
                                                                question
                                                            )
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

                <CreateQuestionDialog
                    open={createDialogOpen}
                    onOpenChange={setCreateDialogOpen}
                    subjects={subjects}
                    tags={tags}
                />

                <ViewQuestionDialog
                    open={viewDialogOpen}
                    onOpenChange={setViewDialogOpen}
                    question={selectedQuestion}
                />

                <EditQuestionDialog
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                    question={selectedQuestion}
                    subjects={subjects}
                    tags={tags}
                />

                <DeleteQuestionDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    question={selectedQuestion}
                />
            </div>
        </AdminLayout>
    );
}
