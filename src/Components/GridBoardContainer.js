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
  const statusMap = {
    default: 'In Progress',
    loser: { status: 'You Lost :(', message: 'Boom, yer dead matey.' },
    winner: { status: 'You Won! :D', message: 'You made it! Nice work champ.' },
  };
  const initState = {
    boardData: [],
    bombSet: new Set(),
    flagSet: new Set(),
    gameStatus: statusMap.default,
    bombCount: totalBombs,
    flagCount: 0,
  };
  const [refresh, toggleRefresh] = useState(false);
  const [gameOverBreaker, triggerGameOverBreaker] = useState(false);
  const [state, updateState] = useState(initState);

  const refreshBoard = () => {
    updateState({ ...initState });
    triggerGameOverBreaker(false);
    toggleRefresh(!refresh);
  };

  const createBoard = ({ rows, columns, totalBombs }) => {
    if (!rows || !columns) return;

    const emptyMatrix = generateMatrix(rows, columns);
    const { partiallyFilledMatrix, bombSet } = generateBombs(
      emptyMatrix,
      rows,
      columns,
      totalBombs,
    );
    const fullyFilledMatrix = generateSquareValues(partiallyFilledMatrix);
    console.log(fullyFilledMatrix);
    return updateState({ ...state, boardData: fullyFilledMatrix, bombSet });
  };

  const generateMatrix = (rows, columns) => {
    let emptyMatrix = [];

    for (let i = 0; i < rows; i++) {
      emptyMatrix.push([]);
      for (let j = 0; j < columns; j++) {
        // NOTE: Default properties of each cell declared here
        emptyMatrix[i][j] = {
          x: j,
          y: i,
          isBomb: false,
          isFlag: false,
          isHidden: true,
          adjacentBombs: 0,
        };
      }
    }

    return emptyMatrix;
  };

  const generateBombs = (emptyMatrix, numberOfRows, numberOfColumns, bombsNeeded) => {
    let partiallyFilledMatrix = emptyMatrix;
    let bombSet = state.bombSet;
    let generatedBombs = 0;
    let x = 0;
    let y = 0;

    while (generatedBombs < bombsNeeded) {
      x = Math.floor(Math.random() * numberOfColumns);
      y = Math.floor(Math.random() * numberOfRows);

      if (partiallyFilledMatrix[y][x].isBomb) continue;
      else if (!partiallyFilledMatrix[y][x].isBomb) {
        partiallyFilledMatrix[y][x].isBomb = true;
        generatedBombs += 1;
        bombSet.add(partiallyFilledMatrix[y][x]);
      } else break;
    }

    return { partiallyFilledMatrix, bombSet };
  };

  const generateSquareValues = partiallyFilledMatrix => {
    let fullyFilledMatrix = partiallyFilledMatrix;

    fullyFilledMatrix.forEach(row => {
      row.forEach(({ x, y }) => {
        fullyFilledMatrix[y][x].adjacentBombs = getAdjacentSquares(x, y, fullyFilledMatrix, true);
      });
    });

    return fullyFilledMatrix;
  };

  const placeFlag = (clickEvent, x, y) => {
    clickEvent.preventDefault();
    let currentBoard = state.boardData;
    let currentFlagSet = state.flagSet;
    let currentBombSet = state.bombSet;
    let currentBombCount = state.bombCount;
    let currentGameStatus = state.gameStatus;

    if (currentBoard[y][x].isFlag) {
      return;
    } else {
      if (currentBombSet.has(currentBoard[y][x])) {
        currentBombCount -= 1;
      }
      currentBoard[y][x].isFlag = true;
      currentFlagSet.add(currentBoard[y][x]);
    }
    console.log(currentFlagSet, currentBombSet);

    if (currentFlagSet.size >= 10) {
      const parseFlagsAndBombs = () => {
        let flags = state.flagSet;
        let bombs = currentBombSet;

        for (let flag of flags.keys()) {
          if (!bombs.has(flag)) {
            alert('Aw shucks, better luck next time.');

            return 'loser';
          }
        }
        alert('You made it! Good work champ.');

        return 'winner';
      };

      currentGameStatus = statusMap[parseFlagsAndBombs()].status;
      triggerGameOverBreaker(true);
    }

    updateState({
      ...state,
      boardData: currentBoard,
      flagCount: currentFlagSet.size,
      flagSet: currentFlagSet,
      bombCount: currentBombCount,
      gameStatus: currentGameStatus,
    });
  };

  const handleLeftClick = (clickEvent, x, y) => {
    clickEvent.preventDefault();
    let currentBoard = state.boardData;
    if (currentBoard[y][x].isRevealed || currentBoard[y][x].isFlag) return;

    if (currentBoard[y][x].isBomb) {
      let zeroOutHiddenSquares = 0;

      triggerGameOverBreaker(true);
      updateState({
        ...state,
        gameStatus: statusMap.loser.status,
        hiddenSquareCount: zeroOutHiddenSquares,
      });
      alert('Boom, yer dead matey.');
    } else {
      currentBoard[y][x].isHidden = false;

      if (!currentBoard[y][x].adjacentBombs) {
        currentBoard = checkAdjacentSquares(x, y, currentBoard);
      }

      console.log(currentBoard);
      updateState({
        ...state,
        boardData: currentBoard,
      });
    }
  };

  const checkAdjacentSquares = (x, y, currentBoard) => {
    let adjacentSquares = getAdjacentSquares(x, y, currentBoard);
    console.log(adjacentSquares);

    adjacentSquares.forEach(({ x, y }) => {
      if (
        !currentBoard[y][x].isFlag &&
        (!currentBoard[y][x].isBomb || !currentBoard[y][x].adjacentBombs) &&
        currentBoard[y][x].isHidden
      ) {
        currentBoard[y][x].isHidden = false;
        console.log('trigger');
        if (currentBoard[y][x].adjacentBombs === 0) {
          checkAdjacentSquares(x, y, currentBoard);
        }
      }
      return null;
    });

    console.log('board', currentBoard);
    return currentBoard;
  };

  const getAdjacentSquares = (x, y, currentBoard, returnBombCount) => {
    let adjacentSquares = [];
    let adjacentBombs = 0;

    if (x > 0) {
      if (currentBoard[y][x - 1].isBomb) {
        adjacentBombs += 1;
      }
      adjacentSquares.push(currentBoard[y][x - 1]);
    }
    if (x < 9) {
      if (currentBoard[y][x + 1].isBomb) {
        adjacentBombs += 1;
      }
      adjacentSquares.push(currentBoard[y][x + 1]);
    }
    if (y > 0) {
      if (currentBoard[y - 1][x].isBomb) {
        adjacentBombs += 1;
      }
      adjacentSquares.push(currentBoard[y - 1][x]);
    }
    if (y < 9) {
      if (currentBoard[y + 1][x].isBomb) {
        adjacentBombs += 1;
      }
      adjacentSquares.push(currentBoard[y + 1][x]);
    }
    if (x < 9 && y > 0) {
      if (currentBoard[y - 1][x + 1].isBomb) {
        adjacentBombs += 1;
      }
      adjacentSquares.push(currentBoard[y - 1][x + 1]);
    }
    if (x < 9 && y < 9) {
      if (currentBoard[y + 1][x + 1].isBomb) {
        adjacentBombs += 1;
      }
      adjacentSquares.push(currentBoard[y + 1][x + 1]);
    }
    if (x > 0 && y < 9) {
      if (currentBoard[y + 1][x - 1].isBomb) {
        adjacentBombs += 1;
      }
      adjacentSquares.push(currentBoard[y + 1][x - 1]);
    }
    if (x > 0 && y > 0) {
      if (currentBoard[y - 1][x - 1].isBomb) {
        adjacentBombs += 1;
      }
      adjacentSquares.push(currentBoard[y - 1][x - 1]);
    }

    if (returnBombCount) return adjacentBombs;
    return adjacentSquares;
  };

  useEffect(() => {
    createBoard(gameSettings);
    console.log('render test');
    // disabling unnecessary eslint error for effect dependencies
    // eslint-disable-next-line
  }, [refresh]);

  return (
    <GridBoardDisplay
      {...state}
      placeFlag={placeFlag}
      refreshBoard={refreshBoard}
      handleLeftClick={handleLeftClick}
      gameOverBreaker={gameOverBreaker}
    />
  );
};
GridBoardContainer.propTypes = propTypes;

export default memo(GridBoardContainer);
