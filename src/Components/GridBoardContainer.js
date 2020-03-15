import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import GridBoardDisplay from './GridBoardDisplay';

const propTypes = {
  gameSettings: PropTypes.shape({
    rows: PropTypes.number.isRequired,
    columns: PropTypes.number.isRequired,
    totalBombs: PropTypes.number.isRequired,
  }).isRequired,
};

const GridBoardContainer = ({ gameSettings, gameSettings: { totalBombs } }) => {
  const initState = {
    boardData: [],
    gameStatus: 'In Progress',
    bombCount: totalBombs,
    flagsPlaced: 0,
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

  const placeFlag = (click, x, y) => {
    click.preventDefault();
    let currentBoard = state.boardData;
    let currentFlags = state.flagsPlaced;

    if (currentBoard[x][y].isFlag) {
      currentBoard[x][y].isFlag = false;
      currentFlags -= 1;
    } else {
      currentBoard[x][y].isFlag = true;
      currentFlags += 1;
    }

    updateState({
      ...state,
      boardData: currentBoard,
      flagsPlaced: currentFlags,
    });
  };

  const generateBombs = (boardData, numberOfRows, numberOfColumns, bombsNeeded) => {
    let generatedBombs = 0;
    let x = 0;
    let y = 0;

    while (generatedBombs < bombsNeeded) {
      x = Math.floor(Math.random() * numberOfRows);
      y = Math.floor(Math.random() * numberOfColumns);

      if (boardData[x][y].isBomb) continue;
      else if (!boardData[x][y].isBomb) {
        boardData[x][y].isBomb = true;
        generatedBombs += 1;
      } else break;
    }

    return boardData;
  };

  useEffect(() => {
    createBoard(gameSettings);
    // disabling unnecessary eslint error for effect dependencies
    // eslint-disable-next-line
  }, []);

  return <GridBoardDisplay {...state} placeFlag={placeFlag} />;
};
GridBoardContainer.propTypes = propTypes;

export default memo(GridBoardContainer);
