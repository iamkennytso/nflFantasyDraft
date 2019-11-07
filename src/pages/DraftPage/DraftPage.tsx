import React, { useState, useEffect, useRef, FunctionComponent } from 'react';
import { Props, SelectOption, LatestPick } from '../../types/DraftPage'
import Select from 'react-select';
import { ValueType } from 'react-select/src/types'; 
import {
  MenuItem,
  Table, 
  TableHead, 
  TableBody, 
  TableCell, 
  TableRow, 
  Paper, 
  CircularProgress,
  Button,
} from '@material-ui/core';
import './DraftPage.scss'
import { DraftPicks } from '../../types/App';

function useInterval(callback: any, delay: number) {
  const savedCallback: any = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const DraftPage: FunctionComponent<Props> = ({teams, options, draftOrder, setCurrentStep, draftPicks, setDraftPicks, players}) => {
  const [draftStarted, setDraftStarted] = useState <boolean> (false);
  const [selectOptions] = useState <SelectOption[]> (() => Object.keys(players).map((player, idx) => {
    return {
      label: player,
      idx,
    }
  }));
  const [searchable, setSearchable] = useState <boolean> (false);
  const [timer, setTimer] = useState <number> (Number(options.time));
  const [pickOrder] = useState <string[]> (() => draftOrder.reduce((accu, round, idx) => {
    if (idx % 2 === 0) {
      const snakeBack = [...round].reverse();
      accu.unshift(...snakeBack);
    } else {
      accu.unshift(...round);
    }
    return accu;
  },[]));

  const [currentlyPicking, setCurrentlyPicking] = useState <string> ('');
  const [currentPickNumber, setCurrentPickNumber] = useState <number> (0);
  const [latestPick, setLatestPick] = useState <LatestPick> ({playerIdx: null, team: null});

  useEffect(() => {
    if (!draftPicks) {
      const newDraftPicks = teams.reduce((accu: DraftPicks, team) => {
        accu[team] = [];
        return accu;
      }, {})
      setDraftPicks(newDraftPicks);
    } else {
      let pickNumber = 0;
      Object.keys(draftPicks).forEach(team => {
        draftPicks[team].forEach(pick => {
          pickOrder.pop();
          pickNumber++
          selectOptions[pick.idx] = {
            ...selectOptions[pick.idx],
            label: `! ${pick.player.n} ${pick.player.p} !`,
          }
        })
      })
      setCurrentPickNumber(pickNumber);
    }
  }, []);

  useInterval(() => setTimer(timer - 1), 1000);

  const _getTimerClassName = () => {
    switch (true) {
      case timer > 30:
        return 'green';
      case timer > 15:
        return 'yellow';
      case timer > 0:
        return 'red';
      default:
        return 'maroon';
    }
  }

  const _handlePlayerPick = (value: ValueType<SelectOption>): void => {
    const { label, idx } = value as SelectOption;
    // mutating selectOptions
    selectOptions[idx] = {
      label: `! ${label} !`,
      idx,
    }
    // mutating draftPicks
    draftPicks[currentlyPicking].push({player: players[label], idx});
    localStorage.draftPicks = JSON.stringify(draftPicks);
    setLatestPick({playerIdx: idx, team: currentlyPicking});
    setCurrentlyPicking(pickOrder.pop() as string);
    setTimer(Number(options.time));
    setCurrentPickNumber(currentPickNumber + 1);
  }

  const _handleUndo = (): void => {
    const latestPickTeam = latestPick.team as string;
    const latestPickIdx = latestPick.playerIdx as number;
    pickOrder.push(currentlyPicking);
    setCurrentlyPicking(latestPickTeam);
    draftPicks[latestPickTeam].pop();
    setTimer(Number(options.time));
    selectOptions[latestPickIdx] = {
      ...selectOptions[latestPickIdx],
      label: selectOptions[latestPickIdx].label.slice(2, selectOptions[latestPickIdx].label.length -2)
    }
    setLatestPick({playerIdx: null, team: null})
  }

  const _handlePrevStep = (): void => {
    setCurrentStep('draftOrder')
  }

  const _handleNextStep = (): void => {
    return;
  }

  // fix this typing OptionProps<OptionType>
  function Option(props: any) {
    const disabled: boolean = !!props.children && String(props.children).charAt(0) === '!';
    return <MenuItem
      component="div"
      disabled={disabled}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  }

  return <div className='DraftPage'>
    <div className='onDeck'>
      On Deck:
      {pickOrder.length && <span> {pickOrder[pickOrder.length]} </span>}
      {pickOrder.length > 1 && <span> {pickOrder[pickOrder.length - 1]} </span>}
      {pickOrder.length > 2 && <span> {pickOrder[pickOrder.length - 2]} </span>}
      {pickOrder.length > 3 && <span> {pickOrder[pickOrder.length - 3]} </span>}
      {pickOrder.length > 4 && <span> {pickOrder[pickOrder.length - 4]} </span>}
    </div>
    {draftPicks
      ? <Paper className='DraftOrder-Paper'>
        <Table>
          <TableHead>
            <TableRow>
              {teams.map(team => <TableCell key={`header${team}`} >
                {team}
              </TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {draftOrder.map((round, idx) => {
              return <TableRow key={`round${idx}`}>
                {teams.map((teamPick) => {
                  return <TableCell 
                    key={`${teamPick}${idx}`} 
                    className={`
                      team 
                      team-${draftPicks[teamPick][idx] && draftPicks[teamPick][idx].player && draftPicks[teamPick][idx].player.t}
                    `
                  }>
                    {draftPicks[teamPick][idx] && draftPicks[teamPick][idx].player && draftPicks[teamPick][idx].player.n}
                  </TableCell>
                })}
              </TableRow>
            })}
          </TableBody>
        </Table>
      </Paper>
      : <div>
        <CircularProgress/>
      </div>
    }
    {draftStarted
      ? <div className='DraftOrder-Bottom'>
        <span>
          Pick: {currentPickNumber} <br/>Currently Picking: {currentlyPicking}
        </span>
        <Select
          className="PlayerInput"
          placeholder="Search a player with at least 3 letters"
          options={searchable ? selectOptions : []}
          components={{Option}}
          value={null}
          onChange={_handlePlayerPick}
          onInputChange={(input) => {
            setSearchable(input.length > 2);
          }}
        />
        <span className={`timer timer-${_getTimerClassName()}`}> 
          {timer}
        </span>
      </div>
      : <div>
        <Button variant='contained' onClick={() => {
          setDraftStarted(true);
          setCurrentlyPicking(pickOrder.pop() as string);
          setTimer(Number(options.time));
          setCurrentPickNumber(currentPickNumber + 1);
        }}>
          {draftPicks && draftPicks.length ? 'Resume' : 'Start'} Draft
        </Button>
      </div>
    }
    <div className='buttons'>
      <Button variant='contained' onClick={() => _handlePrevStep()}>
        Previous Step
      </Button>
      {latestPick.team && <Button variant='contained' onClick={() => _handleUndo()}>
        Undo
      </Button>}
      <Button variant='contained' onClick={() => _handleNextStep()} disabled>
        Finalize
      </Button>
    </div>
  </div>
  
}

export default DraftPage