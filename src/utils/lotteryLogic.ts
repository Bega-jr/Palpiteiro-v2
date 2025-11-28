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
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Função para calcular estatísticas reais do histórico mockado
export const calculateStats = () => {
  const frequency: Record<number, number> = {};
  const delay: Record<number, number> = {};

  // Inicializa contadores
  for (let i = 1; i <= 25; i++) {
    frequency[i] = 0;
    delay[i] = 0;
  }

  // Calcula frequência real
  MOCK_HISTORY.forEach((game) => {
    game.forEach((num) => {
      frequency[num]++;
    });
  });

  // Calcula atraso real (quantos jogos atrás o número saiu pela última vez)
  for (let num = 1; num <= 25; num++) {
    let contestsDelayed = 0;
    for (let i = 0; i < MOCK_HISTORY.length; i++) {
        if (MOCK_HISTORY[i].includes(num)) {
            break; // Encontrou o número, para de contar o atraso
        }
        contestsDelayed++;
    }
    delay[num] = contestsDelayed;
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
  
  const today = new Date();
  const daySeed = today.getDate() + (today.getMonth() + 1) * 100 + today.getFullYear() * 10000;
  
  let seedCounter = daySeed;

  const getNextRandom = () => {
    if (isVip) return Math.random();
    return seededRandom(seedCounter++);
  };

  const createGame = (strategy: 'balanced' | 'hot' | 'cold' | 'pattern_0'): number[] => {
    const numbers = new Set<number>();
    let attempts = 0;

    // Loop principal para garantir 15 números
    while (numbers.size < 15 && attempts < 5000) {
      attempts++;
      let num = Math.floor(getNextRandom() * 25) + 1;

      // Lógica de viés estatístico
      if (strategy === 'hot' && getNextRandom() > 0.4) { // Aumentei a chance de selecionar um quente
        const hotIndex = Math.floor(getNextRandom() * stats.hotNumbers.length);
        num = stats.hotNumbers[hotIndex];
      }
      
      // Lógica específica para Final 0 (mantida, mas a robustez acima ajuda)
      if (mode === 'final_0' || strategy === 'pattern_0') {
         // Não há uma regra de negócio clara aqui, mas mantive sua verificação de sequência
         if (numbers.has(num - 1) && numbers.has(num - 2) && getNextRandom() > 0.6) {
             continue; // Pula para evitar triplas sequências excessivas em final 0
         }
      }

      numbers.add(num);
    }
    
    // VERIFICAÇÃO DE ROBUSTEZ: Garante que 15 números foram gerados
    if (numbers.size < 15) {
        // Fallback: se falhou em gerar com a estratégia, gera um jogo aleatório simples
        console.warn(`Fallback: Failed to generate 15 numbers for strategy ${strategy}. Generating balanced game.`);
        return createGame('balanced');
    }

    return Array.from(numbers).sort((a, b) => a - b);
  };

  for (let i = 0; i < 7; i++) {
    let strategy: 'balanced' | 'hot' | 'cold' | 'pattern_0' = 'balanced';
    
    // Definição de estratégias para os 7 jogos gerados
    if (mode === 'final_0') strategy = 'pattern_0';
    else if (i === 0 || i === 1) strategy = 'hot'; // Jogos 1 e 2 são quentes
    else if (i === 2) strategy = 'cold';          // Jogo 3 é frio
    else strategy = 'balanced';                  // Outros são balanceados

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
