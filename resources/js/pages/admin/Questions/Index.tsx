import { Head, router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import * as React from "react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Plus,
    Eye,
    Pencil,
    Trash2,
    CheckCircle,
    Clock,
    X,
    UserMinus,
    UserPlus,
    FileUp,
} from "lucide-react";
import { DeleteQuestionDialog } from "./_components/DeleteQuestionDialog";
import { SmartPagination } from "@/components/common/SmartPagination";
import { ImportQuestionsDialog } from "./_components/ImportQuestionsDialog";
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

interface StateHistory {
    id: number;
    from_state: string | null;
    to_state: string;
    changed_by: {
        id: number;
        name: string;
    } | null;
    notes: string | null;
    created_at: string;
}

export interface Question {
    id: number;
    subject_id: number;
    question_text: string;
    state?: string;
    assigned_to?: number;
    assigned_to_user?: {
        id: number;
        name: string;
    };
    assignedTo?: {
        id: number;
        name: string;
    };
    creator?: {
        id: number;
        name: string;
        roles: {
            id: number;
            name: string;
        }[];
    };
    subject?: Subject;
    tags?: Tag[];
    options?: Option[];
    state_history?: StateHistory[];
}

interface Props {
    questions: {
        data: Question[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
        total?: number;
        per_page?: number;
        from?: number;
        to?: number;
    };
    subjects: Subject[];
    filters: {
        search?: string;
        tab?: string;
        subject_id?: string;
    };
}

export default function Index({ questions, subjects, filters }: Props) {
    const { auth } = usePage().props as any;
    const currentUser = auth?.user;
    const [activeTab, setActiveTab] = useState(filters.tab || "all");
    const [search, setSearch] = useState(filters.search || "");
    const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(
        filters.subject_id ? parseInt(filters.subject_id) : null
    );
    const [isMounted, setIsMounted] = useState(false);

    const getCurrentUrl = () => {
        const params = new URLSearchParams(window.location.search);
        // Always preserve page parameter if we're not on page 1
        // If page is in URL, keep it; if not but we're on page > 1, add it
        if (questions.current_page > 1) {
            params.set("page", questions.current_page.toString());
        } else if (params.has("page") && params.get("page") === "1") {
            // Remove page=1 to keep URL clean
            params.delete("page");
        }
        const queryString = params.toString();
        return `/admin/questions${queryString ? `?${queryString}` : ""}`;
    };

    const updateFilters = (updates: {
        tab?: string;
        search?: string;
        subject_id?: number | null;
    }) => {
        const newTab = updates.tab !== undefined ? updates.tab : activeTab;
        const newSearch =
            updates.search !== undefined ? updates.search : search;
        const newSubjectId =
            updates.subject_id !== undefined
                ? updates.subject_id
                : selectedSubjectId;

        const params: any = {
            tab: newTab,
        };

        if (newSearch) {
            params.search = newSearch;
        }

        if (newSubjectId) {
            params.subject_id = newSubjectId;
        }

        router.get("/admin/questions", params, {
            preserveState: true,
            replace: true,
        });
    };

    // Reset select all mode when filters change
    useEffect(() => {
        setSelectAllMode(false);
        setSelectedIds(new Set());
        setAllFilteredIds([]);
    }, [activeTab, search, selectedSubjectId]);

    useEffect(() => {
        if (!isMounted) {
            setIsMounted(true);
            return;
        }

        const timeout = setTimeout(() => {
            updateFilters({ search });
        }, 500);

        return () => clearTimeout(timeout);
    }, [search]);

    useEffect(() => {
        if (isMounted) {
            updateFilters({ tab: activeTab });
        }
    }, [activeTab]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    const handleSubjectFilter = (subjectId: number | null) => {
        setSelectedSubjectId(subjectId);
        updateFilters({ subject_id: subjectId });
    };

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
        null
    );
    const [importDialogOpen, setImportDialogOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [selectAllMode, setSelectAllMode] = useState(false);
    const [allFilteredIds, setAllFilteredIds] = useState<number[]>([]);

    const handleView = (question: Question) => {
        router.visit(`/admin/questions/${question.id}`);
    };

    const handleEdit = (question: Question) => {
        router.visit(`/admin/questions/${question.id}/edit`);
    };

    const handleDelete = (question: Question) => {
        setSelectedQuestion(question);
        setDeleteDialogOpen(true);
    };

    const handleDeleteSuccess = () => {
        // Preserve current URL with filters and page to maintain scroll and state
        router.get(
            getCurrentUrl(),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                only: ["questions"],
            }
        );
    };

    const goToPage = (url: string | null) => {
        if (url) {
            // Preserve current filters when navigating pages
            const urlObj = new URL(url, window.location.origin);
            if (!urlObj.searchParams.has("tab")) {
                urlObj.searchParams.set("tab", activeTab);
            }
            if (search && !urlObj.searchParams.has("search")) {
                urlObj.searchParams.set("search", search);
            }
            if (selectedSubjectId && !urlObj.searchParams.has("subject_id")) {
                urlObj.searchParams.set(
                    "subject_id",
                    selectedSubjectId.toString()
                );
            }
            router.get(urlObj.pathname + urlObj.search);
        }
    };

    const handleAssign = (questionId: number) => {
        // Build query parameters to preserve current page and filters
        const params: any = {};
        if (activeTab && activeTab !== "all") {
            params.tab = activeTab;
        }
        if (search) {
            params.search = search;
        }
        if (selectedSubjectId) {
            params.subject_id = selectedSubjectId;
        }
        if (questions.current_page > 1) {
            params.page = questions.current_page;
        }

        router.post(`/admin/questions/${questionId}/assign`, params, {
            preserveScroll: true,
            preserveState: true,
            // Backend will use these params in the redirect
        });
    };

    const handleChangeState = (questionId: number, newState: string) => {
        // Build query parameters to preserve current page and filters
        const params: any = {
            state: newState,
        };
        if (activeTab && activeTab !== "all") {
            params.tab = activeTab;
        }
        if (search) {
            params.search = search;
        }
        if (selectedSubjectId) {
            params.subject_id = selectedSubjectId;
        }
        if (questions.current_page > 1) {
            params.page = questions.current_page;
        }

        router.post(`/admin/questions/${questionId}/change-state`, params, {
            preserveScroll: true,
            preserveState: true,
            // Backend will use these params in the redirect
        });
    };

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === questions.data.length && !selectAllMode) {
            setSelectedIds(new Set());
            setSelectAllMode(false);
        } else {
            setSelectedIds(new Set(questions.data.map((q: Question) => q.id)));
            setSelectAllMode(false);
        }
    };

    const handleSelectAllFiltered = async () => {
        if (selectAllMode) {
            // Deselect all
            setSelectedIds(new Set());
            setSelectAllMode(false);
            setAllFilteredIds([]);
        } else {
            // Fetch all IDs matching current filter
            const params = new URLSearchParams();
            if (activeTab && activeTab !== "all") {
                params.append("tab", activeTab);
            }
            if (search) {
                params.append("search", search);
            }
            if (selectedSubjectId) {
                params.append("subject_id", selectedSubjectId.toString());
            }

            try {
                const response = await fetch(
                    `/admin/questions/ids?${params.toString()}`
                );
                const data = await response.json();
                setAllFilteredIds(data.ids || []);
                setSelectedIds(new Set(data.ids || []));
                setSelectAllMode(true);
            } catch (error) {
                console.error("Failed to fetch all question IDs:", error);
            }
        }
    };

    const handleBulkDelete = () => {
        if (selectedIds.size === 0) return;

        const idsToDelete = selectAllMode
            ? allFilteredIds
            : Array.from(selectedIds);

        if (
            confirm(
                `Are you sure you want to delete ${idsToDelete.length} question(s)?`
            )
        ) {
            router.delete("/admin/questions/bulk", {
                data: { ids: idsToDelete },
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setSelectedIds(new Set());
                    setSelectAllMode(false);
                    setAllFilteredIds([]);
                    // Preserve current URL with filters to maintain scroll and state
                    router.get(
                        window.location.pathname + window.location.search,
                        {},
                        {
                            preserveScroll: true,
                            preserveState: true,
                            only: ["questions"],
                        }
                    );
                },
            });
        }
    };

    const handleBulkAssign = () => {
        if (selectedIds.size === 0) return;

        const idsToAssign = selectAllMode
            ? allFilteredIds
            : Array.from(selectedIds);

        // Build query parameters to preserve current page and filters
        const params: any = {
            ids: idsToAssign,
        };
        if (activeTab && activeTab !== "all") {
            params.tab = activeTab;
        }
        if (search) {
            params.search = search;
        }
        if (selectedSubjectId) {
            params.subject_id = selectedSubjectId;
        }
        if (questions.current_page > 1) {
            params.page = questions.current_page;
        }

        router.post("/admin/questions/bulk/assign", params, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setSelectedIds(new Set());
                setSelectAllMode(false);
                setAllFilteredIds([]);
            },
        });
    };

    const handleBulkMarkAsDone = () => {
        if (selectedIds.size === 0) return;

        const idsToChange = selectAllMode
            ? allFilteredIds
            : Array.from(selectedIds);

        // Build query parameters to preserve current page and filters
        const params: any = {
            ids: idsToChange,
            state: "done",
        };
        if (activeTab && activeTab !== "all") {
            params.tab = activeTab;
        }
        if (search) {
            params.search = search;
        }
        if (selectedSubjectId) {
            params.subject_id = selectedSubjectId;
        }
        if (questions.current_page > 1) {
            params.page = questions.current_page;
        }

        router.post("/admin/questions/bulk/change-state", params, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setSelectedIds(new Set());
                setSelectAllMode(false);
                setAllFilteredIds([]);
            },
        });
    };

    const handleUnassign = (questionId: number) => {
        // Build query parameters to preserve current page and filters
        const params: any = {};
        if (activeTab && activeTab !== "all") {
            params.tab = activeTab;
        }
        if (search) {
            params.search = search;
        }
        if (selectedSubjectId) {
            params.subject_id = selectedSubjectId;
        }
        if (questions.current_page > 1) {
            params.page = questions.current_page;
        }

        router.post(`/admin/questions/${questionId}/unassign`, params, {
            preserveScroll: true,
            preserveState: true,
            // Backend will use these params in the redirect
        });
    };

    const handleResetToInitial = (questionId: number) => {
        // Build query parameters to preserve current page and filters
        const params: any = {};
        if (activeTab && activeTab !== "all") {
            params.tab = activeTab;
        }
        if (search) {
            params.search = search;
        }
        if (selectedSubjectId) {
            params.subject_id = selectedSubjectId;
        }
        if (questions.current_page > 1) {
            params.page = questions.current_page;
        }

        router.post(`/admin/questions/${questionId}/reset-to-initial`, params, {
            preserveScroll: true,
            preserveState: true,
            // Backend will use these params in the redirect
        });
    };

    const renderQuestionsTable = (questionsData: any) => {
        const showAssignedTo = activeTab !== "my-review";
        const colSpan = showAssignedTo ? 8 : 7;

        if (!questionsData || questionsData.data.length === 0) {
            return (
                <TableRow>
                    <TableCell className="w-12"></TableCell>
                    <TableCell colSpan={colSpan - 1} className="text-center">
                        No questions found
                    </TableCell>
                </TableRow>
            );
        }

        return questionsData.data.map((question: Question) => (
            <TableRow key={question.id}>
                <TableCell className="w-12">
                    <Checkbox
                        checked={selectedIds.has(question.id)}
                        onCheckedChange={() => toggleSelect(question.id)}
                    />
                </TableCell>
                <TableCell className="w-16">{question.id}</TableCell>
                <TableCell className="max-w-md">
                    <div
                        className="text-sm overflow-hidden"
                        style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {question.question_text}
                    </div>
                    {question.tags && question.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                            {question.tags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="text-xs bg-muted px-2 py-0.5 rounded"
                                >
                                    {tag.tag_text}
                                </span>
                            ))}
                        </div>
                    )}
                </TableCell>
                <TableCell>{question.subject?.name || "N/A"}</TableCell>
                <TableCell>{question.creator?.name || "N/A"}</TableCell>
                {showAssignedTo && (
                    <TableCell>
                        {question.assignedTo?.name ||
                            question.assigned_to_user?.name ||
                            "—"}
                    </TableCell>
                )}
                {question.state && (
                    <TableCell>
                        <span
                            className={`text-xs px-2 py-0.5 rounded ${
                                question.state === "initial"
                                    ? "bg-gray-200"
                                    : question.state === "under-review"
                                    ? "bg-yellow-200"
                                    : "bg-green-200"
                            }`}
                        >
                            {question.state === "initial"
                                ? "Unassigned"
                                : question.state === "under-review"
                                ? "Under Review"
                                : "Done"}
                        </span>
                    </TableCell>
                )}
                <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                        {/* Always show View button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(question)}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>

                        {/* Assign to Self button: Show first if question is not assigned to self and can be assigned */}
                        {question.assigned_to !== currentUser?.id &&
                            question.state === "initial" &&
                            ((question.creator?.roles?.some(
                                (r) => r.name === "admin"
                            ) &&
                                currentUser?.roles?.includes("teacher")) ||
                                question.creator?.id === currentUser?.id ||
                                currentUser?.roles?.includes("admin")) && (
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => handleAssign(question.id)}
                                >
                                    Assign to Me
                                </Button>
                            )}

                        {/* Edit button: Only show when assigned to self and not done (includes initial state after reset) */}
                        {question.assigned_to === currentUser?.id &&
                            question.state !== "done" && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(question)}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            )}

                        {/* Reset to Initial button: Show when done and (assigned to self OR can be assigned) */}
                        {question.state === "done" &&
                            (question.assigned_to === currentUser?.id ||
                                (question.assigned_to !== currentUser?.id &&
                                    ((question.creator?.roles?.some(
                                        (r) => r.name === "admin"
                                    ) &&
                                        currentUser?.roles?.includes(
                                            "teacher"
                                        )) ||
                                        question.creator?.id ===
                                            currentUser?.id ||
                                        currentUser?.roles?.includes(
                                            "admin"
                                        )))) && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        handleResetToInitial(question.id)
                                    }
                                >
                                    <Clock className="h-4 w-4 mr-1" />
                                    {question.assigned_to === currentUser?.id
                                        ? "Review Again"
                                        : "Reset & Assign to Me"}
                                </Button>
                            )}

                        {/* Mark as Done button: Show when assigned to self and under-review */}
                        {question.assigned_to === currentUser?.id &&
                            question.state === "under-review" && (
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() =>
                                        handleChangeState(question.id, "done")
                                    }
                                >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Mark as Done
                                </Button>
                            )}

                        {/* Unassign button: Show when assigned to self and under-review */}
                        {question.assigned_to === currentUser?.id &&
                            question.state === "under-review" && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUnassign(question.id)}
                                >
                                    <UserMinus className="h-4 w-4" />
                                </Button>
                            )}

                        {/* Delete button: Show if user created it or is admin */}
                        {(currentUser?.roles?.includes("admin") ||
                            question.creator?.id === currentUser?.id) && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(question)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </TableCell>
            </TableRow>
        ));
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
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <CardTitle>Questions</CardTitle>
                            <div className="flex items-center gap-4 flex-wrap">
                                <div className="flex items-center gap-4 flex-wrap">
                                    {selectedIds.size > 0 && (
                                        <>
                                            <span className="text-sm text-muted-foreground">
                                                {selectAllMode
                                                    ? `All ${selectedIds.size} selected`
                                                    : `${selectedIds.size} selected`}
                                            </span>
                                            <Button
                                                variant="outline"
                                                onClick={handleBulkAssign}
                                            >
                                                <UserPlus className="h-4 w-4 mr-1" />
                                                Assign to Me
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={handleBulkMarkAsDone}
                                            >
                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                Mark as Done
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={handleBulkDelete}
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" />
                                                Delete Selected
                                            </Button>
                                        </>
                                    )}
                                    {questions.total !== undefined &&
                                        questions.total > 0 && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={
                                                    handleSelectAllFiltered
                                                }
                                            >
                                                {selectAllMode
                                                    ? `Deselect All (${questions.total})`
                                                    : `Select All (${questions.total})`}
                                            </Button>
                                        )}
                                </div>
                                <Button
                                    onClick={() =>
                                        router.visit("/admin/questions/create")
                                    }
                                >
                                    <Plus className="mr-2" />
                                    Add Question
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setImportDialogOpen(true)}
                                >
                                    <FileUp className="h-4 w-4 mr-1" />
                                    Import Excel
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto md:overflow-x-visible">
                            <Tabs
                                value={activeTab}
                                onValueChange={handleTabChange}
                            >
                                <p className="text-sm mb-2 text-slate-500">
                                    Set the questions and complete that before
                                    adding a new quiz
                                </p>
                                <TabsList className="mb-4">
                                    <TabsTrigger value="all">
                                        All Questions
                                    </TabsTrigger>
                                    <TabsTrigger value="review">
                                        Available for Review
                                    </TabsTrigger>
                                    <TabsTrigger value="my-review">
                                        <Clock className="h-4 w-4 mr-1" />
                                        My Reviews
                                    </TabsTrigger>
                                </TabsList>
                                {/* Filters */}
                                <div className="mb-4 space-y-3">
                                    {/* Search */}
                                    <div className="flex w-[220px] gap-2">
                                        <input
                                            type="text"
                                            placeholder="Search questions..."
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                            className="border px-2 py-1 rounded w-full"
                                        />
                                    </div>

                                    {/* Subject Filter Chips */}
                                    <div className="flex flex-wrap gap-2">
                                        <Badge
                                            variant={
                                                selectedSubjectId === null
                                                    ? "default"
                                                    : "outline"
                                            }
                                            className="cursor-pointer"
                                            onClick={() =>
                                                handleSubjectFilter(null)
                                            }
                                        >
                                            All Subjects
                                        </Badge>
                                        {subjects.map((subject) => (
                                            <Badge
                                                key={subject.id}
                                                variant={
                                                    selectedSubjectId ===
                                                    subject.id
                                                        ? "default"
                                                        : "outline"
                                                }
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    handleSubjectFilter(
                                                        subject.id
                                                    )
                                                }
                                            >
                                                {subject.name}
                                                {selectedSubjectId ===
                                                    subject.id && (
                                                    <X className="h-3 w-3 ml-1" />
                                                )}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <TabsContent value="all">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-12">
                                                    <Checkbox
                                                        checked={
                                                            selectAllMode ||
                                                            (questions.data
                                                                .length > 0 &&
                                                                selectedIds.size ===
                                                                    questions
                                                                        .data
                                                                        .length)
                                                        }
                                                        onCheckedChange={
                                                            toggleSelectAll
                                                        }
                                                    />
                                                </TableHead>
                                                <TableHead className="w-16">
                                                    ID
                                                </TableHead>
                                                <TableHead>
                                                    Question Text
                                                </TableHead>
                                                <TableHead>Subject</TableHead>
                                                <TableHead>
                                                    Created By
                                                </TableHead>
                                                {activeTab !== "my-review" && (
                                                    <TableHead>
                                                        Assigned To
                                                    </TableHead>
                                                )}
                                                <TableHead>State</TableHead>
                                                <TableHead className="text-right">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {renderQuestionsTable(questions)}
                                        </TableBody>
                                    </Table>

                                    {questions &&
                                        (questions.last_page > 1 ||
                                            questions.current_page > 1) &&
                                        !(
                                            questions.current_page === 1 &&
                                            questions.data.length === 0
                                        ) && (
                                            <SmartPagination
                                                currentPage={
                                                    questions.current_page
                                                }
                                                totalPages={questions.last_page}
                                                onPageChange={() => {}}
                                                prevPageUrl={
                                                    questions.prev_page_url
                                                }
                                                nextPageUrl={
                                                    questions.next_page_url
                                                }
                                                onUrlChange={goToPage}
                                                buildUrl={(page) => {
                                                    const params =
                                                        new URLSearchParams();
                                                    if (
                                                        activeTab &&
                                                        activeTab !== "all"
                                                    ) {
                                                        params.set(
                                                            "tab",
                                                            activeTab
                                                        );
                                                    }
                                                    if (search) {
                                                        params.set(
                                                            "search",
                                                            search
                                                        );
                                                    }
                                                    if (selectedSubjectId) {
                                                        params.set(
                                                            "subject_id",
                                                            selectedSubjectId.toString()
                                                        );
                                                    }
                                                    params.set(
                                                        "page",
                                                        page.toString()
                                                    );
                                                    return `/admin/questions?${params.toString()}`;
                                                }}
                                            />
                                        )}
                                    {questions && (
                                        <div className="text-center mt-4 text-sm text-muted-foreground">
                                            Total:{" "}
                                            {questions.total ||
                                                questions.data.length}{" "}
                                            question(s)
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="review">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-12">
                                                    <Checkbox
                                                        checked={
                                                            selectAllMode ||
                                                            (questions.data
                                                                .length > 0 &&
                                                                selectedIds.size ===
                                                                    questions
                                                                        .data
                                                                        .length)
                                                        }
                                                        onCheckedChange={
                                                            toggleSelectAll
                                                        }
                                                    />
                                                </TableHead>
                                                <TableHead className="w-16">
                                                    ID
                                                </TableHead>
                                                <TableHead>
                                                    Question Text
                                                </TableHead>
                                                <TableHead>Subject</TableHead>
                                                <TableHead>
                                                    Created By
                                                </TableHead>
                                                {activeTab !== "my-review" && (
                                                    <TableHead>
                                                        Assigned To
                                                    </TableHead>
                                                )}
                                                <TableHead>State</TableHead>
                                                <TableHead className="text-right">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {renderQuestionsTable(questions)}
                                        </TableBody>
                                    </Table>

                                    {questions &&
                                        (questions.last_page > 1 ||
                                            questions.current_page > 1) &&
                                        !(
                                            questions.current_page === 1 &&
                                            questions.data.length === 0
                                        ) && (
                                            <SmartPagination
                                                currentPage={
                                                    questions.current_page
                                                }
                                                totalPages={questions.last_page}
                                                onPageChange={() => {}}
                                                prevPageUrl={
                                                    questions.prev_page_url
                                                }
                                                nextPageUrl={
                                                    questions.next_page_url
                                                }
                                                onUrlChange={goToPage}
                                                buildUrl={(page) => {
                                                    const params =
                                                        new URLSearchParams();
                                                    if (
                                                        activeTab &&
                                                        activeTab !== "all"
                                                    ) {
                                                        params.set(
                                                            "tab",
                                                            activeTab
                                                        );
                                                    }
                                                    if (search) {
                                                        params.set(
                                                            "search",
                                                            search
                                                        );
                                                    }
                                                    if (selectedSubjectId) {
                                                        params.set(
                                                            "subject_id",
                                                            selectedSubjectId.toString()
                                                        );
                                                    }
                                                    params.set(
                                                        "page",
                                                        page.toString()
                                                    );
                                                    return `/admin/questions?${params.toString()}`;
                                                }}
                                            />
                                        )}
                                    {questions && (
                                        <div className="text-center mt-4 text-sm text-muted-foreground">
                                            Total:{" "}
                                            {questions.total ||
                                                questions.data.length}{" "}
                                            question(s)
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="my-review">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-12">
                                                    <Checkbox
                                                        checked={
                                                            selectAllMode ||
                                                            (questions.data
                                                                .length > 0 &&
                                                                selectedIds.size ===
                                                                    questions
                                                                        .data
                                                                        .length)
                                                        }
                                                        onCheckedChange={
                                                            toggleSelectAll
                                                        }
                                                    />
                                                </TableHead>
                                                <TableHead className="w-16">
                                                    ID
                                                </TableHead>
                                                <TableHead>
                                                    Question Text
                                                </TableHead>
                                                <TableHead>Subject</TableHead>
                                                <TableHead>
                                                    Created By
                                                </TableHead>
                                                {activeTab !== "my-review" && (
                                                    <TableHead>
                                                        Assigned To
                                                    </TableHead>
                                                )}
                                                <TableHead>State</TableHead>
                                                <TableHead className="text-right">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {renderQuestionsTable(questions)}
                                        </TableBody>
                                    </Table>

                                    {questions &&
                                        (questions.last_page > 1 ||
                                            questions.current_page > 1) &&
                                        !(
                                            questions.current_page === 1 &&
                                            questions.data.length === 0
                                        ) && (
                                            <SmartPagination
                                                currentPage={
                                                    questions.current_page
                                                }
                                                totalPages={questions.last_page}
                                                onPageChange={() => {}}
                                                prevPageUrl={
                                                    questions.prev_page_url
                                                }
                                                nextPageUrl={
                                                    questions.next_page_url
                                                }
                                                onUrlChange={goToPage}
                                                buildUrl={(page) => {
                                                    const params =
                                                        new URLSearchParams();
                                                    if (
                                                        activeTab &&
                                                        activeTab !== "all"
                                                    ) {
                                                        params.set(
                                                            "tab",
                                                            activeTab
                                                        );
                                                    }
                                                    if (search) {
                                                        params.set(
                                                            "search",
                                                            search
                                                        );
                                                    }
                                                    if (selectedSubjectId) {
                                                        params.set(
                                                            "subject_id",
                                                            selectedSubjectId.toString()
                                                        );
                                                    }
                                                    params.set(
                                                        "page",
                                                        page.toString()
                                                    );
                                                    return `/admin/questions?${params.toString()}`;
                                                }}
                                            />
                                        )}
                                    {questions && (
                                        <div className="text-center mt-4 text-sm text-muted-foreground">
                                            Total:{" "}
                                            {questions.total ||
                                                questions.data.length}{" "}
                                            question(s)
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </div>
                    </CardContent>
                </Card>

                <ImportQuestionsDialog
                    open={importDialogOpen}
                    onOpenChange={setImportDialogOpen}
                />

                <DeleteQuestionDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    question={selectedQuestion}
                    onSuccess={handleDeleteSuccess}
                />
            </div>
        </AdminLayout>
    );
}
