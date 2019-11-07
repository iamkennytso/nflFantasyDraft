import React, { useState, FunctionComponent } from 'react';
import * as TYPES from './types/App';
import './App.css';

import SetupPage from './pages/SetupPage/SetupPage';
import DraftOrderPage from './pages/DraftOrderPage/DraftOrderPage';
import DraftPage from './pages/DraftPage/DraftPage';

import testData from './testData.json';

const App: FunctionComponent = () => {
  const [players] = useState <TYPES.PlayersData> (() => {
    return testData;
  })
  // const meh: Players;
  const [currentStep, setCurrentStep] = useState <TYPES.CurrentStep> (() => {
    return localStorage.currentStep
      ? localStorage.currentStep
      : 'setup';
  });
  const [teams, setTeams] = useState <TYPES.Teams> (()=> {
    return localStorage.teams
      ? localStorage.teams.split(',')
      : ['Team 1', 'Team 2', 'Team 3', 'Team 4', 'Team 5', 'Team 6', 'Team 7', 'Team 8'];
  })
  const [options, setOptions] = useState <TYPES.Options> ({
    numOfTeams: localStorage.numOfTeams ? Number(localStorage.numOfTeams) : 8,
    draftRounds: localStorage.draftRounds ? Number(localStorage.draftRounds) : 15, 
    time: localStorage.time ? Number(localStorage.time) : 60,
  });
  const [draftOrder, setDraftOrder] = useState <TYPES.DraftOrder> (() => {
    if (localStorage.draftOrder) {
      return localStorage.draftOrder.split('|').map((round: string) => {
        return round.split(',');
      })
    }
    return [];
  });
  const [draftPicks, setDraftPicks] = useState <TYPES.DraftPicks> (() => {
    if (localStorage.draftPicks) {
      return JSON.parse(localStorage.draftPicks);
    }
    return null;
  })

  const setStandardDraftOrder = () => {
    const newDraftOrder: string[][] = [];
    for (let i = 0; i < Number(options.draftRounds); i++) {
      newDraftOrder.push(teams);
    }
    setDraftOrder(newDraftOrder);
  }

  const returnPage = () => {
    switch(currentStep) {
      case 'setup':
        return <SetupPage
          teams={teams}
          setTeams={setTeams}
          options={options}
          setOptions={setOptions}
          setCurrentStep={setCurrentStep}
          draftOrder={draftOrder}
          setStandardDraftOrder={setStandardDraftOrder}
        />
      case 'draftOrder':
        return <DraftOrderPage
          teams={teams}
          options={options}
          setCurrentStep={setCurrentStep}
          draftOrder={draftOrder}
          setDraftOrder={setDraftOrder}
        />
      case 'draft':
        return <DraftPage
          teams={teams}
          options={options}
          draftOrder={draftOrder}
          setCurrentStep={setCurrentStep}
          draftPicks={draftPicks}
          setDraftPicks={setDraftPicks}
          players={players}
        />
      default:
        return null;
    }
  }

  return (
    <div className="App">
      {returnPage()}
    </div>
  );
}

export default App;
