import { useState, useMemo, useCallback } from "react";

type UsePaginationOptions<T> = {
  items: T[];
  itemsPerPage: number;
  initialPage?: number;
};

type UsePaginationReturn<T> = {
  currentPage: number;
  totalPages: number;
  displayedItems: T[];
  goToPage: (page: number) => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  canGoToPage: (page: number) => boolean;
};

/**
 * Business hook for pagination logic.
 *
 * Components that need pagination compose this hook.
 *
 * @example
 * const { displayedItems, currentPage, totalPages, goToNextPage, goToPreviousPage } = usePagination({
 *   items: jobs,
 *   itemsPerPage: 10
 * });
 */
export function usePagination<T>({
  items,
  itemsPerPage,
  initialPage = 1,
}: UsePaginationOptions<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(items.length / itemsPerPage));
  }, [items.length, itemsPerPage]);

  const displayedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(() => {
      const target = Math.max(1, Math.min(totalPages, page));
      return target;
    });
  }, [totalPages]);

  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const goToLastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  const goToNextPage = useCallback(() => {
    setCurrentPage((current) => Math.min(totalPages, current + 1));
  }, [totalPages]);

  const goToPreviousPage = useCallback(() => {
    setCurrentPage((current) => Math.max(1, current - 1));
  }, []);

  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  const canGoToPage = useCallback((page: number) => {
    return page >= 1 && page <= totalPages;
  }, [totalPages]);

  return {
    currentPage,
    totalPages,
    displayedItems,
    goToPage,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPreviousPage,
    canGoToPage,
  };
}
