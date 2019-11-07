import { Options, CurrentStep, DraftPicks, PlayersData } from './App' 
export interface Props {
  teams: string[], 
  options: Options, 
  draftOrder: string[][], 
  setCurrentStep(argName: CurrentStep): void, 
  draftPicks: DraftPicks, 
  setDraftPicks(argName: DraftPicks): void, 
  players: PlayersData,
}

export interface SelectOption {
  label: string,
  idx: number,
}

export interface LatestPick {
  playerIdx: number | null,
  team: string | null,
}

export interface OptionType {
  label: string;
  value: string;
}