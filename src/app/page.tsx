import type { Metadata } from 'next';
import { ArtworksTable } from '@/components/artworks-table';
import { type ArtworksApiResponse } from '@/lib/types';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Art Institute Explorer',
  description: 'Explore artworks from the Art Institute of Chicago.',
};

async function getArtworks(page: number): Promise<ArtworksApiResponse> {
  const fields = 'id,title,place_of_origin,artist_display,inscriptions,date_start,date_end';
  // Using a limit of 10 for consistency
  const url = `https://api.artic.edu/api/v1/artworks?page=${page}&fields=${fields}&limit=10`;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      console.error('Failed to fetch artworks:', res.statusText);
      return {
        pagination: { total: 0, limit: 10, offset: 0, total_pages: 0, current_page: page, next_url: '', prev_url: '' },
        data: [],
      };
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching artworks:', error);
    return {
      pagination: { total: 0, limit: 10, offset: 0, total_pages: 0, current_page: page, next_url: '', prev_url: '' },
      data: [],
    };
  }
}

function TableSkeleton() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-12 w-64" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
            <div className="p-4 border-b">
                <Skeleton className="h-6 w-full" />
            </div>
            {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border-b">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-5 flex-1" />
                </div>
            ))}
        </div>
        <div className="flex justify-center items-center mt-6">
            <Skeleton className="h-10 w-80" />
        </div>
      </CardContent>
    </Card>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    page?: string;
  };
}) {
  const currentPage = Number(searchParams?.page) || 1;
  const artworksData = await getArtworks(currentPage);

  return (
    <main className="container mx-auto py-10 px-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">Art Institute Explorer</h1>
        <p className="text-muted-foreground text-lg">Discover masterpieces from Chicago's collection</p>
      </header>
      <Suspense key={currentPage} fallback={<TableSkeleton />}>
        <ArtworksTable
          initialArtworks={artworksData.data}
          initialPagination={artworksData.pagination}
        />
      </Suspense>
    </main>
  );
}
