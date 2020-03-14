import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import GridBoardDisplay from './GridBoardDisplay';

const propTypes = { gameSettings: PropTypes.object };

const GridBoardContainer = ({ gameSettings, gameSettings: { totalBombs } }) => {
  const initState = {
    gridMatrix: [],
    gameStatus: 'In Progress',
    bombCount: totalBombs,
  };
  const [state, updateState] = useState(initState);

  const createBoard = ({ height, width }) => {
    let data = generateMatrix(height, width);
    console.log(data);
    updateState({ ...state, gridMatrix: data });
  };

  const generateMatrix = (height, width) => {
    let emptyMatrix = [];

    for (let i = 0; i < height; i++) {
      emptyMatrix.push([]);
      for (let j = 0; j < width; j++) {
        emptyMatrix[i][j] = {
          x: i,
          y: j,
        };
      }
    }
    return emptyMatrix;
  };

  useEffect(() => {
    createBoard(gameSettings);
  }, []);

  return <GridBoardDisplay {...state} />;
};
GridBoardContainer.propTypes = propTypes;

export default memo(GridBoardContainer);
