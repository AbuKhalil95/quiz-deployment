import { router } from "@inertiajs/react";
import { Question } from "./useQuestionActions";

interface UseQuestionActionHandlersOptions {
    /**
     * For Index context: preserve filters and pagination
     */
    preserveFilters?: {
        tab?: string;
        search?: string;
        subject_id?: number | null;
        page?: number;
    };
    /**
     * Use router.reload() instead of navigation for success callbacks
     * Useful for Show/Edit pages where you want to refresh the current page
     */
    reloadOnSuccess?: boolean;
    /**
     * For Edit context: form ref and approve state management
     */
    formRef?: React.RefObject<HTMLDivElement | null>;
    approveOnSubmit?: boolean;
    setApproveOnSubmit?: (value: boolean) => void;
    /**
     * Custom review stages handler (for toggle functionality)
     */
    onReviewStagesCustom?: () => void;
}

export function useQuestionActionHandlers(
    options: UseQuestionActionHandlersOptions = {}
) {
    const {
        preserveFilters,
        reloadOnSuccess = false,
        formRef,
        approveOnSubmit = false,
        setApproveOnSubmit,
        onReviewStagesCustom,
    } = options;

    const buildParams = () => {
        if (!preserveFilters) return {};
        const params: any = {};
        if (preserveFilters.tab && preserveFilters.tab !== "all") {
            params.tab = preserveFilters.tab;
        }
        if (preserveFilters.search) {
            params.search = preserveFilters.search;
        }
        if (preserveFilters.subject_id) {
            params.subject_id = preserveFilters.subject_id;
        }
        if (preserveFilters.page && preserveFilters.page > 1) {
            params.page = preserveFilters.page;
        }
        return params;
    };

    return {
        onView: (question: Question) => {
            router.visit(`/admin/questions/${question.id}`);
        },

        onEdit: (question: Question) => {
            router.visit(`/admin/questions/${question.id}/edit`);
        },

        onDelete: (question: Question) => {
            if (confirm("Are you sure you want to delete this question?")) {
                router.delete(`/admin/questions/${question.id}`, {
                    onSuccess: () => {
                        if (preserveFilters) {
                            // Preserve filters after delete
                            const params = buildParams();
                            router.get("/admin/questions", params, {
                                preserveScroll: true,
                                preserveState: true,
                                only: ["questions"],
                            });
                        } else {
                            router.visit("/admin/questions");
                        }
                    },
                });
            }
        },

        onAssign: (questionId: number) => {
            const params = reloadOnSuccess ? {} : buildParams();
            router.post(`/admin/questions/${questionId}/assign`, params, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: reloadOnSuccess ? () => router.reload() : undefined,
            });
        },

        onUnassign: (questionId: number) => {
            const params = reloadOnSuccess ? {} : buildParams();
            router.post(`/admin/questions/${questionId}/unassign`, params, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: reloadOnSuccess ? () => router.reload() : undefined,
            });
        },

        onChangeState: (questionId: number, newState: string) => {
            const params = reloadOnSuccess
                ? { state: newState }
                : { ...buildParams(), state: newState };
            router.post(`/admin/questions/${questionId}/change-state`, params, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: reloadOnSuccess ? () => router.reload() : undefined,
            });
        },

        onResetToInitial: (questionId: number) => {
            const params = reloadOnSuccess ? {} : buildParams();
            router.post(
                `/admin/questions/${questionId}/reset-to-initial`,
                params,
                {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: reloadOnSuccess
                        ? () => router.reload()
                        : undefined,
                }
            );
        },

        onReviewStages: onReviewStagesCustom
            ? onReviewStagesCustom
            : () => {
                  const element = document.getElementById("review-stages");
                  if (element) {
                      element.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                      });
                      element.classList.add(
                          "ring-2",
                          "ring-primary",
                          "ring-offset-2"
                      );
                      setTimeout(() => {
                          element.classList.remove(
                              "ring-2",
                              "ring-primary",
                              "ring-offset-2"
                          );
                      }, 2000);
                  }
              },

        onSaveDraft:
            formRef && setApproveOnSubmit
                ? () => {
                      setApproveOnSubmit(false);
                      setTimeout(() => {
                          if (formRef.current) {
                              const form =
                                  formRef.current.querySelector("form");
                              if (form) {
                                  form.requestSubmit();
                              }
                          }
                      }, 0);
                  }
                : undefined,

        onSaveAndApprove:
            formRef && setApproveOnSubmit
                ? () => {
                      setApproveOnSubmit(true);
                      setTimeout(() => {
                          if (formRef.current) {
                              const form =
                                  formRef.current.querySelector("form");
                              if (form) {
                                  form.requestSubmit();
                              }
                          }
                      }, 0);
                  }
                : undefined,
    };
}
