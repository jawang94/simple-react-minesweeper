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
    bombSet: new Set(),
    flagSet: new Set(),
    gameStatus: 'In Progress',
    bombCount: totalBombs,
    flagsPlaced: 0,
  };
  const [refresh, toggleRefresh] = useState(false);
  const [state, updateState] = useState(initState);

  const refreshBoard = () => {
    toggleRefresh(!refresh);
    updateState({ ...initState });
  };

  const createBoard = ({ rows, columns, totalBombs }) => {
    if (!rows || !columns) return;

    let data = generateMatrix(rows, columns);
    const { boardData, bombSet } = generateBombs(data, rows, columns, totalBombs);
    console.log(bombSet);
    return updateState({ ...state, boardData, bombSet });
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
          isHidden: true,
        };
      }
    }

    return emptyMatrix;
  };

  const generateBombs = (boardData, numberOfRows, numberOfColumns, bombsNeeded) => {
    let bombSet = state.bombSet;
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
        bombSet.add(boardData[x][y]);
      } else break;
    }

    return { boardData, bombSet };
  };

  const placeFlag = (click, x, y) => {
    click.preventDefault();
    let currentBoard = state.boardData;
    let currentFlagSet = state.flagSet;
    let currentGameStatus = state.gameStatus;

    if (currentBoard[x][y].isFlag) {
      currentBoard[x][y].isFlag = false;
      currentFlagSet.delete(currentBoard[x][y]);
    } else {
      currentBoard[x][y].isFlag = true;
      currentFlagSet.add(currentBoard[x][y]);
    }
    console.log(currentFlagSet, state.bombSet);

    if (currentFlagSet.size >= state.bombCount) {
      const parseFlagsAndBombs = () => {
        let flags = state.flagSet;
        let bombs = state.bombSet;

        for (let flag of flags.keys()) {
          if (!bombs.has(flag)) {
            alert('Boom, yer dead matey.');

            return 'Loser';
          }
        }
        alert('You made it! Nice work champ.');

        return 'Winner';
      };

      currentGameStatus = parseFlagsAndBombs();
    }

    updateState({
      ...state,
      boardData: currentBoard,
      flagsPlaced: currentFlagSet.size,
      flagSet: currentFlagSet,
      gameStatus: currentGameStatus,
    });
  };

  useEffect(() => {
    createBoard(gameSettings);
    // disabling unnecessary eslint error for effect dependencies
    // eslint-disable-next-line
  }, [refresh]);

  return <GridBoardDisplay {...state} placeFlag={placeFlag} refreshBoard={refreshBoard} />;
};
GridBoardContainer.propTypes = propTypes;

export default memo(GridBoardContainer);
