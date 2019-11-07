import React, { useEffect, useState, FunctionComponent, } from 'react';
import { Props, PicksPerTeam, } from '../../types/DraftOrderPage'
import {
  Table, 
  TableHead, 
  TableBody, 
  TableCell, 
  TableRow, 
  Paper, 
  Select, 
  Input, 
  MenuItem,
  Button,
} from '@material-ui/core';
import './DraftOrderPage.scss'

const DraftOrderPage: FunctionComponent<Props> = ({teams, options, draftOrder, setDraftOrder, setCurrentStep}) => {
  const [picksPerTeam, setPicksPerTeam] = useState <PicksPerTeam> ({});

  useEffect(() => {
    const standardPicksPerTeam: PicksPerTeam = {};
    teams.forEach(team => {
      standardPicksPerTeam[team] = options.draftRounds;
    });
    setPicksPerTeam(standardPicksPerTeam)
  }, [teams, options.draftRounds])

  const _handleChange = (idx: number, teamPickIdx: number) => (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const replacementRound = [...draftOrder[idx]];
    const newDraftOrder: string[][] = [...draftOrder];
    const newPicksPerTeam = {...picksPerTeam}
    const selectedTeam = event.target.value as string;

    newPicksPerTeam[replacementRound[teamPickIdx]] -= 1;
    newPicksPerTeam[selectedTeam] += 1;
    setPicksPerTeam(newPicksPerTeam);

    replacementRound[teamPickIdx] = selectedTeam;
    newDraftOrder[idx] = replacementRound;
    setDraftOrder(newDraftOrder);
  };

  const _handlePrevStep = () => {
    setCurrentStep('setup');
  }

  const _handleNextStep = () => {
    localStorage.draftOrder = draftOrder.join('|');
    localStorage.currentStep = 'draft';
    setCurrentStep('draft');
  }

  return <div className='DraftOrder'>
    <Paper className='DraftOrder-Paper'>
      <Table>
        <TableHead>
          <TableRow>
            {teams.map(team => <TableCell key={`header${team}`} >
              {team}: <span className={`standardRound-${Number(picksPerTeam[team]) === Number(options.draftRounds)}`}> 
                {picksPerTeam[team]} 
              </span>
            </TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {draftOrder.map((round, idx) => {
            return <TableRow key={`round${idx}`}>
              {round.map((teamPick, teamPickIdx) => {
                return <TableCell key={`${idx}${teamPickIdx}`} className={`teamNo${teams.indexOf(teamPick)}`}>
                <Select
                  value={teamPick}
                  onChange={_handleChange(idx, teamPickIdx)}
                  input={<Input name="age" id="age-helper" />}
                >
                  {teams.map(team => <MenuItem 
                    key={`${idx}${teamPickIdx}${team}`} 
                    value={team}
                  >
                    {team}
                  </MenuItem>)}
                </Select>
                </TableCell>
              })}
            </TableRow>
          })}
        </TableBody>
      </Table>
    </Paper>
    <div className='buttons'>
      <Button variant='contained' onClick={() => _handlePrevStep()}>
        Previous Step
      </Button>
      <Button variant='contained' onClick={() => _handleNextStep()}>
        Next Step
      </Button>
    </div>
  </div>
}

export default DraftOrderPage;