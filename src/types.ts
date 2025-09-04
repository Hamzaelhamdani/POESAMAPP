export type Pools = { p1: (string | null)[]; p2: (string | null)[]; p3: (string | null)[]; p4: (string | null)[] }
export type WinnersRound1 = { p1: string | null; p2: string | null; p3: string | null; p4: string | null }
export type WinnersSemis = { sf1: string | null; sf2: string | null }
export type Finals = { finalWinner: string | null; thirdWinner: string | null }

export type BracketState = {
  startups: string[]
  pools: Pools
  winnersR1: WinnersRound1
  winnersSemis: WinnersSemis
  finals: Finals
}
