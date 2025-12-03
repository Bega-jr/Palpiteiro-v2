interface LotteryBallProps {
  number: number
  isQuente?: boolean
  isFrio?: boolean
  isAtrasado?: boolean
  isModa?: boolean
  isFinalQuente?: boolean
  className?: string
}

export function LotteryBall({ 
  number, 
  isQuente, 
  isFrio, 
  isAtrasado, 
  isModa, 
  isFinalQuente,
  className = '' 
}: LotteryBallProps) {
  let bgColor = 'bg-gray-200 text-gray-700'
  let ringColor = ''
  let scale = ''
  let shadow = 'shadow-lg'

  if (isModa) {
    bgColor = 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
    ringColor = 'ring-8 ring-yellow-300'
    scale = 'scale-125'
    shadow = 'shadow-2xl'
  } else if (isAtrasado) {
    bgColor = 'bg-gradient-to-br from-purple-600 to-pink-600 text-white'
    ringColor = 'ring-8 ring-purple-400'
    scale = 'scale-110'
  } else if (isQuente) {
    bgColor = 'bg-gradient-to-br from-red-500 to-pink-500 text-white'
    ringColor = 'ring-8 ring-red-300'
  } else if (isFrio) {
    bgColor = 'bg-gradient-to-br from-blue-400 to-cyan-400 text-white'
    ringColor = 'ring-8 ring-blue-300'
  } else if (isFinalQuente) {
    bgColor = 'bg-gradient-to-br from-green-400 to-emerald-500 text-white'
    ringColor = 'ring-8 ring-green-300'
  }

  return (
    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-2xl md:text-3xl font-black transition-all ${bgColor} ${ringColor} ${scale} ${shadow} ${className}`}>
      {number.toString().padStart(2, '0')}
    </div>
  )
}