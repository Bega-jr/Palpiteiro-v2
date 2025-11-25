// Dados simulados para a página de resultados
// Em produção, isso viria de uma API (ex: API da Caixa ou serviço de terceiros)

export interface PrizeTier {
  acertos: number;
  ganhadores: number;
  premio: number;
}

export interface WinnerLocation {
  cidade: string;
  uf: string;
  ganhadores: number;
}

export interface LotteryResult {
  concurso: number;
  data: string;
  dezenas: number[];
  acumulado: boolean;
  proximoPremio: number;
  arrecadacaoTotal: number;
  premiacao: PrizeTier[];
  ganhadoresPorLocal: WinnerLocation[];
  ganhadoresCanalEletronico: number;
}

export const MOCK_LATEST_RESULT: LotteryResult = {
  concurso: 3545,
  data: "12/05/2025",
  dezenas: [1, 2, 4, 5, 8, 10, 11, 13, 14, 16, 17, 20, 23, 24, 25],
  acumulado: false,
  proximoPremio: 1700000,
  arrecadacaoTotal: 18500000,
  premiacao: [
    { acertos: 15, ganhadores: 2, premio: 1540320.50 },
    { acertos: 14, ganhadores: 245, premio: 1840.30 },
    { acertos: 13, ganhadores: 8540, premio: 30.00 },
    { acertos: 12, ganhadores: 102300, premio: 12.00 },
    { acertos: 11, ganhadores: 540200, premio: 6.00 },
  ],
  ganhadoresPorLocal: [
    { cidade: "São Paulo", uf: "SP", ganhadores: 1 },
    { cidade: "Belo Horizonte", uf: "MG", ganhadores: 1 }
  ],
  ganhadoresCanalEletronico: 0
};
