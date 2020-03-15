import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import GridBoardDisplay from './GridBoardDisplay';

const propTypes = { gameSettings: PropTypes.object };
const defaultProps = {
  gameSettings: {
    rows: 0,
    columns: 0,
    totalBombs: 0,
  },
};

const GridBoardContainer = ({ gameSettings, gameSettings: { totalBombs } }) => {
  const initState = {
    boardData: [],
    gameStatus: 'In Progress',
    bombCount: totalBombs,
  };
  const [state, updateState] = useState(initState);

  const createBoard = ({ rows, columns, totalBombs }) => {
    if (!rows || !columns) return;

    let data = generateMatrix(rows, columns);
    data = generateBombs(data, rows, columns, totalBombs);
    console.log(data);

    return updateState({ ...state, boardData: data });
  };

  const generateMatrix = (rows, columns) => {
    let emptyMatrix = [];

    for (let i = 0; i < rows; i++) {
      emptyMatrix.push([]);
      for (let j = 0; j < columns; j++) {
        // NOTE: Default properties of each cell declared here
        emptyMatrix[i][j] = {
          x: i,
          y: j,
          isBomb: false,
          isFlag: false,
        };
      }
    }

    return emptyMatrix;
  };

  const generateBombs = (boardData, numberOfRows, numberOfColumns, bombsNeeded) => {
    let generatedBombs = 0;
    let row = 0;
    let column = 0;

    while (generatedBombs < bombsNeeded) {
      row = generateRandomNumber(numberOfRows);
      column = generateRandomNumber(numberOfColumns);

      if (boardData[row][column].isBomb) continue;
      else if (!boardData[row][column].isBomb) {
        boardData[row][column].isBomb = true;
        generatedBombs += 1;
      } else break;
    }

    return boardData;
  };

  const generateRandomNumber = max => {
    return Math.floor(Math.random() * max);
  };

  useEffect(() => {
    createBoard(gameSettings);
    // disabling unnecessary eslint error for effect dependencies
    // eslint-disable-next-line
  }, []);

  return <GridBoardDisplay {...state} />;
};
GridBoardContainer.propTypes = propTypes;
GridBoardContainer.defaultProps = defaultProps;

export default memo(GridBoardContainer);
