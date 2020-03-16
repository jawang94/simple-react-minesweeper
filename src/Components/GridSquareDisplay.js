import React, { memo } from 'react';
import PropTypes from 'prop-types';
import './Styles/GridSquareDisplay.css';
import bomb from '../Static/bomb.png';
import flag from '../Static/flag.png';

const propTypes = {
  adjacentBombs: PropTypes.number,
  gameOverBreaker: PropTypes.bool,
  handleLeftClick: PropTypes.func,
  isBomb: PropTypes.bool,
  isFlag: PropTypes.bool,
  isHidden: PropTypes.bool,
  placeFlag: PropTypes.func,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
};

const defaultProps = {
  adjacentBombs: 0,
  gameOverBreaker: false,
  handleLeftClick: () => {},
  isBomb: false,
  isFlag: false,
  isHidden: true,
  placeFlag: () => {},
};

const GridSquareDisplay = ({
  adjacentBombs,
  gameOverBreaker,
  handleLeftClick,
  isBomb,
  isFlag,
  isHidden,
  placeFlag,
  x,
  y,
}) => {
  return (
    <button
      className={`grid-square ${isHidden && !gameOverBreaker ? 'hidden' : null}`}
      onContextMenu={clickEvent => placeFlag(clickEvent, x, y)}
      onClick={clickEvent => handleLeftClick(clickEvent, x, y)}
    >
      {isHidden && !gameOverBreaker ? (
        isFlag ? (
          <img src={flag} alt="flagemoji" />
        ) : null
      ) : isBomb ? (
        <img src={bomb} alt="bombemoji" />
      ) : (
        <span>{adjacentBombs}</span>
      )}
    </button>
  );
};
GridSquareDisplay.propTypes = propTypes;
GridSquareDisplay.defaultProps = defaultProps;

export default memo(GridSquareDisplay);
// Exports to ./GridSquareContainer.js
