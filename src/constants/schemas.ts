export const optionsSchema: OptionsSchema = {
  numOfTeams: {
    label: 'Number of teams (max 16):',
    disabled: true,
  },
  draftRounds: {
    label: 'Number of draft rounds:',
  },
  time: {
    label: 'Time for each pick (in seconds):',
  }
}

type OptionsSchema = {
  [propName: string] : {
    label: string,
    disabled?: boolean,
  }
}