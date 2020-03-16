import React, { memo, useEffect } from 'react';
import './Styles/GridSquareDisplay.css';
import bomb from '../Static/bomb.png';
import flag from '../Static/flag.png';
import PropTypes from 'prop-types';

const propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  isBomb: PropTypes.bool,
  isFlag: PropTypes.bool,
  isHidden: PropTypes.bool,
  adjacentBombs: PropTypes.number,
  gameOverBreaker: PropTypes.bool,
  placeFlag: PropTypes.func,
  handleLeftClick: PropTypes.func,
};
const defaultProps = {
  isBomb: false,
  isFlag: false,
  isHidden: true,
  adjacentBombs: 0,
  gameOverBreaker: false,
  placeFlag: () => {},
  handleLeftClick: () => {},
};

const GridSquareDisplay = ({
  x,
  y,
  isBomb,
  isFlag,
  isHidden,
  adjacentBombs,
  gameOverBreaker,
  placeFlag,
  handleLeftClick,
}) => {
  useEffect(() => {}, [isFlag]);

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
