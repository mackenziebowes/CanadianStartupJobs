"use client";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useJobsContext } from "@/contexts/jobs";

export default function ListPagination() {
  const { currentPage, totalPages, goToPage, prevPage, nextPage } = useJobsContext();
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  return (
    <Pagination className="flex-1 px-8 h-16">
      <PaginationContent className="flex-1 w-full justify-between">
        <PaginationItem>
          <Button
            variant="ghost"
            onClick={prevPage}
            disabled={!hasPreviousPage}
          >
            <PaginationPrevious />
          </Button>
        </PaginationItem>
        {Array.from({ length: totalPages }).map((_, index) => {
          const pageNum = index + 1;
          const isActive = pageNum === currentPage;
          return (
            <PaginationItem key={`pagination-${index}`}>
              <Button
                variant={isActive ? "outline" : "ghost"}
                onClick={() => goToPage(pageNum)}
              >
                {pageNum}
              </Button>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <Button
            variant="ghost"
            onClick={nextPage}
            disabled={!hasNextPage}
          >
            <PaginationNext />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
