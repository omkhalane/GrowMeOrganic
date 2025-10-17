"use client";

import { useState, useMemo, useEffect } from "react";
import { type Artwork, type Pagination as PaginationType } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaginationControls } from "@/components/pagination-controls";
import { X } from "lucide-react";

interface ArtworksTableProps {
  initialArtworks: Artwork[];
  initialPagination: PaginationType;
}

export function ArtworksTable({ initialArtworks, initialPagination }: ArtworksTableProps) {
  const [artworks, setArtworks] = useState<Artwork[]>(initialArtworks);
  const [pagination, setPagination] = useState<PaginationType>(initialPagination);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  // Update state when initial props change (on navigation)
  useEffect(() => {
    setArtworks(initialArtworks);
    setPagination(initialPagination);
  }, [initialArtworks, initialPagination]);

  const currentPageRowIds = useMemo(() => new Set(artworks.map((artwork) => artwork.id)), [artworks]);

  const selectedOnCurrentPage = useMemo(() => {
    return new Set([...selectedRows].filter(id => currentPageRowIds.has(id)));
  }, [selectedRows, currentPageRowIds]);
  
  const handleSelectAll = (checked: boolean) => {
    const newSelectedRows = new Set(selectedRows);
    if (checked) {
      currentPageRowIds.forEach(id => newSelectedRows.add(id));
    } else {
      currentPageRowIds.forEach(id => newSelectedRows.delete(id));
    }
    setSelectedRows(newSelectedRows);
  };

  const handleRowSelect = (id: number, checked: boolean) => {
    const newSelectedRows = new Set(selectedRows);
    if (checked) {
      newSelectedRows.add(id);
    } else {
      newSelectedRows.delete(id);
    }
    setSelectedRows(newSelectedRows);
  };
  
  const isAllOnPageSelected = artworks.length > 0 && selectedOnCurrentPage.size === artworks.length;
  const headerCheckboxState =
    isAllOnPageSelected
      ? true
      : selectedOnCurrentPage.size > 0
      ? 'indeterminate'
      : false;

  return (
    <Card className="shadow-lg border-2 border-transparent hover:border-primary/20 transition-all duration-300">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-2xl font-headline">Artwork Collection</CardTitle>
          <div className="flex items-center gap-2 bg-accent p-2 rounded-lg border">
            <span className="font-medium text-accent-foreground text-sm px-2">{selectedRows.size} item(s) selected</span>
            <Button variant="ghost" size="sm" onClick={() => setSelectedRows(new Set())} disabled={selectedRows.size === 0}>
              <X className="h-4 w-4 mr-2" />
              Clear selection
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] px-4">
                  <Checkbox
                    checked={headerCheckboxState}
                    onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                    aria-label="Select all rows on this page"
                  />
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Artist</TableHead>
                <TableHead className="hidden md:table-cell">Origin</TableHead>
                <TableHead className="hidden lg:table-cell">Dates</TableHead>
                <TableHead className="hidden xl:table-cell">Inscriptions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {artworks.length > 0 ? (
                artworks.map((artwork) => (
                  <TableRow
                    key={artwork.id}
                    data-state={selectedRows.has(artwork.id) ? "selected" : ""}
                    className="transition-colors"
                  >
                    <TableCell className="px-4">
                      <Checkbox
                        checked={selectedRows.has(artwork.id)}
                        onCheckedChange={(checked) => handleRowSelect(artwork.id, !!checked)}
                        aria-label={`Select row for ${artwork.title}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{artwork.title || 'N/A'}</TableCell>
                    <TableCell>{artwork.artist_display.split('\n')[0] || 'N/A'}</TableCell>
                    <TableCell className="hidden md:table-cell">{artwork.place_of_origin || 'N/A'}</TableCell>
                    <TableCell className="hidden lg:table-cell">{artwork.date_start && artwork.date_end ? `${artwork.date_start}–${artwork.date_end}`: (artwork.date_start || 'N/A')}</TableCell>
                    <TableCell className="hidden xl:table-cell"><p className="truncate max-w-xs">{artwork.inscriptions || 'N/A'}</p></TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {pagination.total_pages > 1 && (
            <div className="mt-6">
            <PaginationControls
                currentPage={pagination.current_page}
                totalPages={pagination.total_pages}
            />
            </div>
        )}
      </CardContent>
    </Card>
  );
}
