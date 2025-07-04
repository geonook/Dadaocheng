import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const TaskCardSkeleton = () => (
  <div className="space-y-4 p-6 border rounded-lg">
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[90%]" />
      <Skeleton className="h-4 w-[80%]" />
    </div>
    <Skeleton className="h-10 w-full rounded-md" />
  </div>
);

export const SectionSkeleton = ({ cards = 3 }) => (
  <div className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <Skeleton className="h-10 w-[300px] mx-auto mb-4" />
        <Skeleton className="h-6 w-[500px] mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: cards }).map((_, i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);