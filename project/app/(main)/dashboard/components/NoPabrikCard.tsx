// Di file: app/(main)/dashboard/components/NoPabrikCard.tsx

import React from 'react';
import { cn } from '@/lib/utils';

export default function NoPabrikCard({ className }: { className?: string }) {
  return (
    <div className={cn(
      "w-full h-[300px] flex items-center justify-center bg-neutral-20 rounded-lg border border-neutral-90",
      className
    )}>
      <h2 className="text-h4 font-bold text-blue-70 uppercase">
        BELUM ADA RANTAI
      </h2>
    </div>
  );
}