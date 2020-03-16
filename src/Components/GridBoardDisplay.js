import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';
import GridSquareContainer from './GridSquareContainer';
import {
  Button,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroupButtonDropdown,
} from 'reactstrap';
import './Styles/GridBoardDisplay.css';
import bomb from '../Static/bomb.png';
import flag from '../Static/flag.png';

const propTypes = {
  boardData: PropTypes.array,
  bombCount: PropTypes.number,
  difficulty: PropTypes.string,
  flagCount: PropTypes.number,
  gameOverBreaker: PropTypes.bool,
  gameStatus: PropTypes.string,
  handleLeftClick: PropTypes.func,
  handleUpdateDifficulty: PropTypes.func,
  placeFlag: PropTypes.func,
  refreshBoard: PropTypes.func,
};

const defaultProps = {
  boardData: [],
  bombCount: 0,
  difficulty: 'Medium',
  flagCount: 0,
  gameOverBreaker: false,
  gameStatus: '',
  handleLeftClick: () => {},
  handleUpdateDifficulty: () => {},
  placeFlag: () => {},
  refreshBoard: () => {},
};

const GridBoardDisplay = ({
  boardData,
  bombCount,
  difficulty,
  flagCount,
  gameOverBreaker,
  gameStatus,
  handleLeftClick,
  handleUpdateDifficulty,
  placeFlag,
  refreshBoard,
}) => {
  const [difficultyDropdown, toggleDifficultyDropdown] = useState(false);

  return (
    <div className="board">
      <InputGroupButtonDropdown
        addonType="append"
        className="change-difficulty"
        isOpen={difficultyDropdown}
        toggle={() => toggleDifficultyDropdown(!difficultyDropdown)}
      >
        <DropdownToggle caret>{difficulty ? difficulty : 'Change Difficulty'}</DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={() => handleUpdateDifficulty('Easy')}>Easy</DropdownItem>
          <DropdownItem onClick={() => handleUpdateDifficulty('Medium')}>Medium</DropdownItem>
          <DropdownItem onClick={() => handleUpdateDifficulty('Hard')}>Hard</DropdownItem>
        </DropdownMenu>
      </InputGroupButtonDropdown>

      <Button onClick={refreshBoard}>Reset Board</Button>

      <div style={{ color: 'black', textAlign: 'center', marginBottom: '5vh' }}>
        <h2>{gameStatus}</h2>
        <div className="info-container">
          <img src={bomb} alt="bombemoji" /> {bombCount}
          <div className="divider" />
          <img src={flag} alt="flagemoji" /> {flagCount}
        </div>
      </div>

      <div className={`grid-board ${gameStatus !== 'In Progress' ? 'overlay' : null}`}>
        {boardData.map(row => {
          return row.map(square => {
            return (
              <div className="square" key={square.x + square.y}>
                <GridSquareContainer
                  adjacentBombs={square.adjacentBombs}
                  gameOverBreaker={gameOverBreaker}
                  handleLeftClick={handleLeftClick}
                  isBomb={square.isBomb}
                  isFlag={square.isFlag}
                  isHidden={square.isHidden}
                  placeFlag={placeFlag}
                  x={square.x}
                  y={square.y}
                />
              </div>
            );
          });
        })}
      </div>
    </div>
  );
};
GridBoardDisplay.propTypes = propTypes;
GridBoardDisplay.defaultProps = defaultProps;

export default memo(GridBoardDisplay);
// Exports to ./GridBoardContainer.js
