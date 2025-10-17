"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function PaginationControls({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number | string) => {
    const pageNumber = Number(page);
    if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > totalPages) return;
    
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("page", String(pageNumber));
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`, { scroll: false });
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    // Maximum number of page links to show
    const pageRangeDisplayed = 3;
    const marginPagesDisplayed = 2;

    if (totalPages <= pageRangeDisplayed + marginPagesDisplayed * 2) {
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <PaginationItem key={i}>
                    <PaginationLink isActive={i === currentPage} onClick={() => handlePageChange(i)}>{i}</PaginationLink>
                </PaginationItem>
            );
        }
        return pageNumbers;
    }

    // Always show first pages
    for (let i = 1; i <= marginPagesDisplayed; i++) {
        pageNumbers.push(
            <PaginationItem key={i}>
                <PaginationLink isActive={i === currentPage} onClick={() => handlePageChange(i)}>{i}</PaginationLink>
            </PaginationItem>
        );
    }

    // Ellipsis after first pages
    if (currentPage > pageRangeDisplayed + 1) {
        pageNumbers.push(<PaginationEllipsis key="start-ellipsis" />);
    }

    // Pages around current page
    let startPage = Math.max(marginPagesDisplayed + 1, currentPage - Math.floor(pageRangeDisplayed / 2));
    let endPage = Math.min(totalPages - marginPagesDisplayed, currentPage + Math.floor(pageRangeDisplayed / 2));
    
    // Adjust window if it's too small
    if (endPage - startPage + 1 < pageRangeDisplayed) {
      if (currentPage < totalPages / 2) {
        endPage = startPage + pageRangeDisplayed - 1;
      } else {
        startPage = endPage - pageRangeDisplayed + 1;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
            <PaginationItem key={i}>
                <PaginationLink isActive={i === currentPage} onClick={() => handlePageChange(i)}>{i}</PaginationLink>
            </PaginationItem>
        );
    }

    // Ellipsis before last pages
    if (currentPage < totalPages - pageRangeDisplayed) {
        pageNumbers.push(<PaginationEllipsis key="end-ellipsis" />);
    }

    // Always show last pages
    for (let i = totalPages - marginPagesDisplayed + 1; i <= totalPages; i++) {
        pageNumbers.push(
            <PaginationItem key={i}>
                <PaginationLink isActive={i === currentPage} onClick={() => handlePageChange(i)}>{i}</PaginationLink>
            </PaginationItem>
        );
    }

    return pageNumbers;
  };


  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageChange(currentPage - 1)}
            aria-disabled={currentPage <= 1}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        {renderPageNumbers()}
        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageChange(currentPage + 1)}
            aria-disabled={currentPage >= totalPages}
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
