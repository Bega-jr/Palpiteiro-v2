// Simulação de dados históricos e lógica estatística
// Em um cenário real, isso viria do Supabase ou API da Caixa

export interface GameStats {
  sum: number;
  even: number;
  odd: number;
  prime: number;
}

export interface GeneratedGame {
  id: number;
  numbers: number[];
  stats: GameStats;
  type: 'balanced' | 'hot' | 'cold' | 'pattern_0' | 'daily';
}

// Números primos entre 1 e 25
const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23];

// Simula os últimos 20 resultados para base estatística
const MOCK_HISTORY = Array.from({ length: 20 }, () => {
  const result = new Set<number>();
  while (result.size < 15) {
    result.add(Math.floor(Math.random() * 25) + 1);
  }
  return Array.from(result);
});

// Função de número pseudo-aleatório com semente (Seedable RNG)
// Essencial para garantir que usuários Free vejam sempre o mesmo jogo no dia
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export const calculateStats = () => {
  const frequency: Record<number, number> = {};
  const delay: Record<number, number> = {}; // Concursos em atraso

  // Inicializa
  for (let i = 1; i <= 25; i++) {
    frequency[i] = 0;
    delay[i] = 0;
  }

  // Calcula frequência
  MOCK_HISTORY.forEach((game) => {
    game.forEach((num) => {
      frequency[num]++;
    });
  });

  // Calcula atraso (simplificado baseando-se no último jogo simulado)
  const lastGame = MOCK_HISTORY[0];
  for (let i = 1; i <= 25; i++) {
    if (!lastGame.includes(i)) {
      delay[i] = Math.floor(Math.random() * 5) + 1; // Simulação de atraso
    }
  }

  // Ordena por frequência
  const sortedByFreq = Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .map(([num]) => parseInt(num));

  return {
    hotNumbers: sortedByFreq.slice(0, 10), // 10 mais frequentes
    coldNumbers: sortedByFreq.slice(-5),   // 5 menos frequentes
    averageSum: 200, // Média teórica
    frequency,
    delay
  };
};

const getGameStats = (numbers: number[]): GameStats => {
  const sum = numbers.reduce((a, b) => a + b, 0);
  const odd = numbers.filter(n => n % 2 !== 0).length;
  const even = numbers.length - odd;
  const prime = numbers.filter(n => PRIMES.includes(n)).length;

  return { sum, even, odd, prime };
};

// Gera o Palpite do Dia baseado na data atual
export const generateDailyGame = (): GeneratedGame => {
  const today = new Date();
  const seedBase = today.getDate() + (today.getMonth() + 1) * 100 + today.getFullYear() * 10000;
  
  const numbers = new Set<number>();
  let currentSeed = seedBase;

  while (numbers.size < 15) {
    const rnd = seededRandom(currentSeed++);
    const num = Math.floor(rnd * 25) + 1;
    numbers.add(num);
  }

  const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

  return {
    id: 999,
    numbers: sortedNumbers,
    stats: getGameStats(sortedNumbers),
    type: 'daily'
  };
};

// Função principal de geração
export const generateSmartGames = (mode: 'standard' | 'final_0', isVip: boolean): GeneratedGame[] => {
  const stats = calculateStats();
  const games: GeneratedGame[] = [];
  
  // Configuração da Semente (Seed)
  // Se for VIP: usa Math.random() (aleatório real)
  // Se for FREE: usa a data atual + ID do jogo como semente (fixo para o dia)
  const today = new Date();
  const daySeed = today.getDate() + (today.getMonth() + 1) * 100 + today.getFullYear() * 10000;
  
  let seedCounter = daySeed; // Contador para variar a semente dentro do loop fixo

  // Função auxiliar para gerar um número (aleatório ou fixo)
  const getNextRandom = () => {
    if (isVip) return Math.random();
    return seededRandom(seedCounter++);
  };

  const createGame = (strategy: 'balanced' | 'hot' | 'cold' | 'pattern_0'): number[] => {
    const numbers = new Set<number>();
    let attempts = 0;

    while (numbers.size < 15 && attempts < 1000) {
      attempts++;
      let rnd = getNextRandom();
      let num = Math.floor(rnd * 25) + 1;

      // Lógica de viés estatístico
      if (strategy === 'hot' && getNextRandom() > 0.3) {
        const hotIndex = Math.floor(getNextRandom() * stats.hotNumbers.length);
        num = stats.hotNumbers[hotIndex];
      }
      
      // Lógica específica para Final 0
      if (mode === 'final_0' || strategy === 'pattern_0') {
         // Em final 0, a tendência de repetição é ligeiramente ajustada
         // e buscamos evitar sequências muito longas
         if (numbers.has(num - 1) && numbers.has(num - 2) && getNextRandom() > 0.5) {
             continue; // Pula para evitar triplas sequências excessivas em final 0
         }
      }

      numbers.add(num);
    }

    return Array.from(numbers).sort((a, b) => a - b);
  };

  for (let i = 0; i < 7; i++) {
    let strategy: 'balanced' | 'hot' | 'cold' | 'pattern_0' = 'balanced';
    
    if (mode === 'final_0') strategy = 'pattern_0';
    else if (i < 2) strategy = 'hot';
    else if (i === 2) strategy = 'cold';
    else strategy = 'balanced';

    const numbers = createGame(strategy);
    
    games.push({
      id: i + 1,
      numbers,
      stats: getGameStats(numbers),
      type: strategy
    });
  }

  return games;
};
