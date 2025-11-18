import React from 'react';
import { cn } from '@/lib/utils';

export default function NoPabrikCard({ className }: { className?: string }) {
  return (
    <p className={cn(
      "text-neutral-500 p-4 bg-white rounded-lg shadow-sm border text-center",
      className
    )}>
      Tidak ada pabrik terhubung.
    </p>
  );
}