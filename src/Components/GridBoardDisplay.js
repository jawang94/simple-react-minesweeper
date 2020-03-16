import React, { memo } from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import GridSquareContainer from './GridSquareContainer';
import './Styles/GridBoardDisplay.css';
import bomb from '../Static/bomb.png';
import flag from '../Static/flag.png';

const propTypes = {
  boardData: PropTypes.array,
  gameStatus: PropTypes.string,
  bombCount: PropTypes.number,
  flagCount: PropTypes.number,
  placeFlag: PropTypes.func,
  refreshBoard: PropTypes.func,
  handleLeftClick: PropTypes.func,
  gameOverBreaker: PropTypes.bool,
};

const defaultProps = {
  boardData: [],
  gameStatus: '',
  bombCount: 0,
  flagCount: 0,
  placeFlag: () => {},
  refreshBoard: () => {},
  handleLeftClick: () => {},
  gameOverBreaker: false,
};

const GridBoardDisplay = ({
  boardData,
  gameStatus,
  bombCount,
  flagCount,
  placeFlag,
  refreshBoard,
  handleLeftClick,
  gameOverBreaker,
}) => {
  return (
    <div className="board">
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
                  x={square.x}
                  y={square.y}
                  isBomb={square.isBomb}
                  isFlag={square.isFlag}
                  isHidden={square.isHidden}
                  adjacentBombs={square.adjacentBombs}
                  gameOverBreaker={gameOverBreaker}
                  placeFlag={placeFlag}
                  handleLeftClick={handleLeftClick}
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
