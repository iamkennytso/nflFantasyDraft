
interface Player {
  p: string,
  n: string,
  t: string,
}

export interface PlayersData {
  [propName: string] : Player
}

export type CurrentStep = 'setup' | 'draftOrder' | 'draft';

export type Teams = string[];

export interface Options {
  numOfTeams: number,
  draftRounds: number,
  time: number,
}

export type DraftOrder = string[][];

interface DraftPick {
  player: Player,
  idx: number,
}
export interface DraftPicks {
  [propName: string] : DraftPick[]
}
