import React, { useState, ChangeEvent, FunctionComponent } from 'react'
import { Options } from '../../types/App'
import { Props } from '../../types/SetupPage'
import { TextField, IconButton, Button } from '@material-ui/core';
import Add from '@material-ui/icons/AddCircle';
import Remove from '@material-ui/icons/RemoveCircle';

import { optionsSchema } from '../../constants/schemas';
import './SetupPage.scss'

const SetupPage: FunctionComponent<Props> = ({teams, setTeams, options, setOptions, setCurrentStep, draftOrder, setStandardDraftOrder}) => {

  const [recalculateFlag, setRecalculateFlag] = useState <boolean> (false);

  const _handleChange = (name: string) => (event: ChangeEvent<HTMLInputElement>)  => {
    if (!recalculateFlag) setRecalculateFlag(true);
    setOptions({
      ...options, 
      [name]: Number(event.target.value),
    });
  };

  const _handleIncrement = (name: keyof Options, increment: number) => {
    const newValue: number = options[name] + increment;
    if (newValue < 0) {
      return;
    }
    setOptions({ ...options, [name]: newValue});
    if (name === 'numOfTeams') {
      if (!recalculateFlag) setRecalculateFlag(true);
      if (increment === 1) {
        setTeams([...teams, `Team ${newValue}`]);
      } else {
        setTeams(teams.slice(0, newValue));
      }
    }
  };

  const _handleNextStep = () => {
    if (recalculateFlag || draftOrder.length === 0) {
      setStandardDraftOrder();
    } 
    localStorage.teams = teams.join(',');
    localStorage.numOfTeams = options.numOfTeams;
    localStorage.draftRounds = options.draftRounds;
    localStorage.time = options.time;
    localStorage.currentStep = 'draftOrder';
    setCurrentStep('draftOrder');
  }

  const optionKeys = Object.keys(options) as (keyof Options)[];
  return <div className='Setup'>
    <div className='Setup-Teams'>
      {teams.map((team, idx) => <div className='Setup-Teams-Team' key={idx}>
        <TextField
          hiddenLabel
          variant="filled"
          fullWidth
          value={team}
          onChange={(e) => {
            const teamCopy = [...teams];
            teamCopy[idx] = e.target.value;
            setTeams(teamCopy);
          }}
        />
      </div>)}
    </div>
    <div className='Setup-Options'>
      {optionKeys.map((option) => <div className='Setup-Options-Option' key={option}>
        {optionsSchema[option].label}
        <TextField
          hiddenLabel
          variant="filled"
          value={options[option]}
          disabled={optionsSchema[option].disabled}
          onChange={_handleChange(option)}
        />
        <div>
          <IconButton
            onClick={() => _handleIncrement(option, -1)}
          >
            <Remove/>
          </IconButton>
          <IconButton
            onClick={() => _handleIncrement(option, 1)}
          >
            <Add/>
          </IconButton>
        </div>
      </div>)}
      <Button variant='contained' onClick={() => _handleNextStep()}>
        Next Step
      </Button>
    </div>
  </div>
};

export default SetupPage;