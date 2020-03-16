import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import GridBoardDisplay from './GridBoardDisplay';

const propTypes = {
  difficulty: PropTypes.string,
  updateDifficulty: PropTypes.func,
  gameSettings: PropTypes.shape({
    columns: PropTypes.number.isRequired,
    rows: PropTypes.number.isRequired,
    totalBombs: PropTypes.number.isRequired,
  }).isRequired,
};

const defaultProps = {
  difficulty: 'Medium',
  updateDifficulty: () => {},
};

const GridBoardContainer = ({
  difficulty,
  updateDifficulty,
  gameSettings,
  gameSettings: { totalBombs },
}) => {
  const statusMap = {
    default: 'In Progress',
    loser: { status: 'You Lost :(', message: 'Boom, yer dead matey.' },
    winner: { status: 'You Won! :D', message: 'You made it! Nice work champ.' },
  };
  const initState = {
    boardData: [],
    bombCount: totalBombs,
    bombSet: new Set(),
    flagCount: 0,
    flagSet: new Set(),
    gameStatus: statusMap.default,
  };
  const [refresh, toggleRefresh] = useState(false);
  const [gameOverBreaker, triggerGameOverBreaker] = useState(false);
  const [state, updateState] = useState(initState);

  // Refreshes the game state and recreates the board. Triggered by 'Change Difficulty' && 'Reset Board' buttons.
  const refreshBoard = () => {
    updateState({ ...initState, bombCount: gameSettings.totalBombs });
    triggerGameOverBreaker(false);
    toggleRefresh(!refresh);
  };

  const handleUpdateDifficulty = async value => {
    updateDifficulty(value);
    refreshBoard();
  };

  // Calls on three helper methods to create the game board matrix && populate with values.
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

    return updateState({ ...state, boardData: fullyFilledMatrix, bombSet });
  };

  // Creates a 2d matrix of objects with default properties based on game board dimensions.
  const generateMatrix = (rows, columns) => {
    let emptyMatrix = [];

    for (let i = 0; i < rows; i++) {
      emptyMatrix.push([]);
      for (let j = 0; j < columns; j++) {
        // Default properties of each square are created here.
        emptyMatrix[i][j] = {
          adjacentBombs: 0,
          isBomb: false,
          isFlag: false,
          isHidden: true,
          x: j,
          y: i,
        };
      }
    }

    return emptyMatrix;
  };

  // Randomly plants bombs within the 2d matrix and keeps track of the chosen squares via a bombSet.
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

  // For each square of the 2d matrix, finds how many bombs are adjacent to it and updates the object property.
  const generateSquareValues = partiallyFilledMatrix => {
    let fullyFilledMatrix = partiallyFilledMatrix;

    fullyFilledMatrix.forEach(row => {
      row.forEach(({ x, y }) => {
        fullyFilledMatrix[y][x].adjacentBombs = getAdjacentSquares(x, y, fullyFilledMatrix, true);
      });
    });

    return fullyFilledMatrix;
  };

  // Flags a square (if not already), decrements bomb count if a bomb is on the square, handles win/loss scenario if max flags placed
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

    if (currentFlagSet.size >= totalBombs) {
      const parseFlagsAndBombs = () => {
        const currentFlagSet = state.flagSet;

        for (const flag of currentFlagSet.keys()) {
          if (!currentBombSet.has(flag)) {
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

  // Ends game if bomb selected otherwise reveals selected square and calls recursive helper method for adjacent squares.
  const handleLeftClick = (clickEvent, x, y) => {
    clickEvent.preventDefault();
    let currentBoard = state.boardData;
    if (currentBoard[y][x].isRevealed || currentBoard[y][x].isFlag) return;

    if (currentBoard[y][x].isBomb) {
      triggerGameOverBreaker(true);

      updateState({
        ...state,
        gameStatus: statusMap.loser.status,
      });

      alert('Boom, yer dead matey.');
    } else {
      currentBoard[y][x].isHidden = false;

      if (!currentBoard[y][x].adjacentBombs) {
        currentBoard = checkAdjacentSquares(x, y, currentBoard);
      }

      updateState({
        ...state,
        boardData: currentBoard,
      });
    }
  };

  // Gets all adjacent squares for the selected coordinate, reveals current square if appropriate, and recurses if current square is a "zero" square.
  const checkAdjacentSquares = (x, y, currentBoard) => {
    let adjacentSquares = getAdjacentSquares(x, y, currentBoard);

    // Note x and y in the below iterator are deconstructed from adjacentSquares. Not the same as the parent scope x and y.
    adjacentSquares.forEach(({ x, y }) => {
      if (
        !currentBoard[y][x].isFlag &&
        (!currentBoard[y][x].isBomb || !currentBoard[y][x].adjacentBombs) &&
        currentBoard[y][x].isHidden
      ) {
        currentBoard[y][x].isHidden = false;
        if (currentBoard[y][x].adjacentBombs === 0) {
          checkAdjacentSquares(x, y, currentBoard);
        }
      }

      return null;
    });

    return currentBoard;
  };

  // Checks all squares adjacent to provided coordinate && returns either the squares or the number of adjacent bombs.
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

  // Effect which runs on render && subsequently whenever the refresh state is toggled via changing difficulty or resetting the board.
  useEffect(() => {
    createBoard(gameSettings);
    // disabling unnecessary eslint error for effect dependencies
    // eslint-disable-next-line
  }, [refresh]);

  return (
    <GridBoardDisplay
      {...state}
      difficulty={difficulty}
      gameOverBreaker={gameOverBreaker}
      handleLeftClick={handleLeftClick}
      handleUpdateDifficulty={handleUpdateDifficulty}
      placeFlag={placeFlag}
      refreshBoard={refreshBoard}
    />
  );
};
GridBoardContainer.propTypes = propTypes;
GridBoardContainer.defaultProps = defaultProps;

export default memo(GridBoardContainer);
// Exports to ./GameDisplay.js
