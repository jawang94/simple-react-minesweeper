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
  flagsPlaced: PropTypes.number,
  placeFlag: PropTypes.func,
  refreshBoard: PropTypes.func,
};

const defaultProps = {
  boardData: [],
  gameStatus: '',
  bombCount: 0,
  flagsPlaced: 0,
  placeFlag: () => {},
  refreshBoard: () => {},
};

const GridBoardDisplay = ({
  boardData,
  gameStatus,
  bombCount,
  flagsPlaced,
  placeFlag,
  refreshBoard,
}) => {
  return (
    <div className="board">
      <Button onClick={refreshBoard}>Reset Board</Button>

      <div style={{ color: 'black', textAlign: 'center', marginBottom: '5vh' }}>
        <h2>{gameStatus}</h2>
        <div className="info-container">
          <img src={bomb} alt="bombemoji" /> {bombCount}
          <div className="divider" />
          <img src={flag} alt="flagemoji" /> {flagsPlaced}
        </div>
      </div>

      <div className={`grid-board ${gameStatus !== 'In Progress' ? 'overlay' : null}`}>
        {boardData.map(row => {
          return row.map(cell => {
            return (
              <div className="cell" key={cell.x + cell.y}>
                <GridSquareContainer
                  x={cell.x}
                  y={cell.y}
                  isBomb={cell.isBomb}
                  isFlag={cell.isFlag}
                  isHidden={cell.isHidden}
                  placeFlag={placeFlag}
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
