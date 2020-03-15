import React, { useState, memo } from 'react';
import GameDisplay from './GameDisplay';

const GameContainer = () => {
  const initState = {
    userName: 'Test User', // set to mock data. remove prior to submission
    allegiance: 'Test Allegiance', // set to mock data. remove prior to submission
    signedIn: true, // set to mock data. remove prior to submission
    gameSettings: { rows: 10, columns: 10, totalBombs: 10 },
  };
  const [state, updateState] = useState(initState);

  const updateUserName = e => {
    updateState({ ...state, userName: e.target.value });
  };

  const updateAllegiance = value => {
    updateState({ ...state, allegiance: value });
  };

  const handleSignInClick = () => {
    if (state.userName.length && state.allegiance.length) {
      updateState({ ...state, signedIn: true });
    }
  };

  return (
    <GameDisplay
      {...state}
      updateUserName={updateUserName}
      updateAllegiance={updateAllegiance}
      handleSignInClick={handleSignInClick}
    />
  );
};

export default memo(GameContainer);
