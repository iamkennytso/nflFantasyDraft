import { Options, CurrentStep } from './App' 

export interface Props {
  teams: string[], 
  setTeams(argName: string[]): void, 
  options: Options, 
  setOptions(argName: Options): void, 
  setCurrentStep(argName: CurrentStep): void, 
  draftOrder: string[][], 
  setStandardDraftOrder(): void,
}