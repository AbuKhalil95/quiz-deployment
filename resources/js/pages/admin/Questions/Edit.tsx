import { Head, Link, usePage } from "@inertiajs/react";
import { useRef, useState } from "react";
import AdminLayout from "@/layouts/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { QuestionForm } from "./_components/QuestionForm";
import { useQuestionActions } from "@/hooks/useQuestionActions";
import { useQuestionActionHandlers } from "@/hooks/useQuestionActionHandlers";
import { QuestionActions } from "@/components/common/QuestionActions";

interface Subject {
    id: number;
    name: string;
}

interface Tag {
    id: number;
    tag_text: string;
}

interface Question {
    id: number;
    subject_id: number;
    question_text: string;
    state?: string;
    assigned_to?: number;
    explanations?: {
        correct?: string;
        wrong?: string;
        option1?: string;
        option2?: string;
        option3?: string;
        option4?: string;
        option5?: string;
    };
    tags?: Tag[];
    options?: {
        id?: number;
        option_text: string;
        is_correct: boolean;
    }[];
}

interface Props {
    question: Question;
    subjects: Subject[];
    tags: Tag[];
}

export default function Edit({ question, subjects, tags }: Props) {
    const { auth } = usePage().props as any;
    const currentUser = auth?.user;
    const formRef = useRef<HTMLDivElement>(null);
    const [approveOnSubmit, setApproveOnSubmit] = useState(false);

    const handlers = useQuestionActionHandlers({
        reloadOnSuccess: true,
        formRef,
        approveOnSubmit,
        setApproveOnSubmit,
    });

    const actions = useQuestionActions({
        question,
        currentUser,
        context: "edit",
        handlers,
    });

    return (
        <AdminLayout
            breadcrumbs={[
                { title: "Dashboard", href: "/admin" },
                { title: "Questions", href: "/admin/questions" },
                {
                    title: `Edit Question ${question.id}`,
                    href: `/admin/questions/${question.id}/edit`,
                },
            ]}
        >
            <Head title={`Edit Question ${question.id}`} />
            <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <Button variant="outline" asChild>
                        <Link href={route("admin.questions.index")}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Questions
                        </Link>
                    </Button>
                    <QuestionActions actions={actions} />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Edit Question</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div ref={formRef as any}>
                            <QuestionForm
                                question={question}
                                subjects={subjects}
                                tags={tags}
                                showActions={false}
                                approveOnSubmit={approveOnSubmit}
                                onApproveSubmitChange={setApproveOnSubmit}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
