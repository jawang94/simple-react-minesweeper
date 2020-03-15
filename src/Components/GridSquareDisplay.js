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
  placeFlag: PropTypes.func,
};
const defaultProps = { isBomb: false, isFlag: false, isHidden: false, placeFlag: () => {} };

const GridSquareDisplay = ({ x, y, isBomb, isFlag, isHidden, placeFlag }) => {
  useEffect(() => {}, [isFlag]);

  return (
    <div
      className={`grid-square ${isHidden ? 'hidden' : null}`}
      onContextMenu={e => placeFlag(e, x, y)}
    >
      {isHidden ? (
        isFlag ? (
          <img src={flag} alt="flagemoji" />
        ) : null
      ) : isBomb ? (
        <img src={bomb} alt="bombemoji" />
      ) : (
        <span>lol</span>
      )}
    </div>
  );
};
GridSquareDisplay.propTypes = propTypes;
GridSquareDisplay.defaultProps = defaultProps;

export default memo(GridSquareDisplay);
