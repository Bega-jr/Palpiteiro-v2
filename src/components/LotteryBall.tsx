import React from 'react';
import { cn } from '../lib/utils';

interface LotteryBallProps {
  number: number;
  isHot?: boolean;
  isCold?: boolean;
  className?: string;
}

export function LotteryBall({ number, isHot, isCold, className }: LotteryBallProps) {
  // Cores baseadas na Lotofácil (Roxo/Rosa)
  return (
    <div
      className={cn(
        "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-bold shadow-sm transition-all duration-300",
        isHot && "bg-red-100 text-red-700 border-2 border-red-200",
        isCold && "bg-blue-100 text-blue-700 border-2 border-blue-200",
        !isHot && !isCold && "bg-white text-gray-700 border border-gray-200",
        "hover:scale-110 cursor-default",
        className
      )}
    >
      {number.toString().padStart(2, '0')}
    </div>
  );
}
