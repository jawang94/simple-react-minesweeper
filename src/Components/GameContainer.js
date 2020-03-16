import React, { useState, memo } from 'react';
import GameDisplay from './GameDisplay';

const GameContainer = () => {
  const difficultyMap = {
    Easy: 5,
    Medium: 10,
    Hard: 15,
  };
  const initState = {
    allegiance: '',
    userName: '',
    signedIn: false,
    difficulty: '',
    gameSettings: { rows: 10, columns: 10, totalBombs: 10 },
  };
  const [state, updateState] = useState(initState);

  // Updates player allegiance
  const updateAllegiance = value => {
    updateState({ ...state, allegiance: value });
  };

  // Updates player username
  const updateUserName = ({ target: { value } }) => {
    updateState({ ...state, userName: value });
  };

  // Updates game difficulty
  const updateDifficulty = value => {
    let updateGameSettings = state.gameSettings;
    updateGameSettings.totalBombs = difficultyMap[value];
    updateState({ ...state, gameSettings: updateGameSettings, difficulty: value });
  };

  // Signs player in and displays game board
  const handleSignInClick = () => {
    if (state.userName.length && state.allegiance.length) {
      updateState({ ...state, signedIn: true });
    }
  };

  return (
    <GameDisplay
      {...state}
      updateAllegiance={updateAllegiance}
      updateUserName={updateUserName}
      updateDifficulty={updateDifficulty}
      handleSignInClick={handleSignInClick}
    />
  );
};

export default memo(GameContainer);
// Exports to ../App.js
