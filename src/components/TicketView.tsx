import { cn } from '../lib/utils';

interface TicketViewProps {
  selectedNumbers: number[];
  className?: string;
}

export function TicketView({ selectedNumbers, className }: TicketViewProps) {
  // Array de 1 a 25
  const allNumbers = Array.from({ length: 25 }, (_, i) => i + 1);

  return (
    <div className={cn("bg-white p-4 rounded-xl border-2 border-purple-100 shadow-sm max-w-[300px] mx-auto", className)}>
      <div className="text-center mb-3 border-b border-gray-100 pb-2">
        <span className="text-xs font-bold text-purple-600 tracking-widest uppercase">Volante Virtual</span>
      </div>
      
      <div className="grid grid-cols-5 gap-2">
        {allNumbers.map((num) => {
          const isSelected = selectedNumbers.includes(num);
          return (
            <div
              key={num}
              className={cn(
                "aspect-square flex items-center justify-center rounded-full text-sm font-bold transition-all duration-300",
                isSelected 
                  ? "bg-purple-600 text-white shadow-md scale-105" 
                  : "bg-gray-50 text-gray-400 border border-gray-100"
              )}
            >
              {num.toString().padStart(2, '0')}
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 text-center">
        <div className="text-xs text-gray-500 flex justify-between px-2">
          <span>Marcados: <strong className="text-purple-700">{selectedNumbers.length}</strong></span>
          <span>Restantes: <strong>{25 - selectedNumbers.length}</strong></span>
        </div>
      </div>
    </div>
  );
}
