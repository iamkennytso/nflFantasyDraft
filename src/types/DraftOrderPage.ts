import { Options, CurrentStep } from './App' 
export interface Props {
  teams: string[], 
  options: Options, 
  setCurrentStep(arg: CurrentStep): void,
  draftOrder: string[][], 
  setDraftOrder(arg: string[][]): void, 
}

export interface PicksPerTeam {
  [propName: string]: number,
}