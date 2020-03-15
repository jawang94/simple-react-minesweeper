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
  placeFlag: PropTypes.func,
};
const defaultProps = { isBomb: false, isFlag: false, placeFlag: () => {} };

const GridSquareDisplay = ({ x, y, isBomb, isFlag, placeFlag }) => {
  useEffect(() => {}, [isFlag]);

  return (
    <div className="grid-square" onContextMenu={e => placeFlag(e, x, y)}>
      {isBomb ? (
        <img src={bomb} alt="bombemoji" />
      ) : isFlag ? (
        <img src={flag} alt="flagemoji" />
      ) : (
        <span>lol</span>
      )}
    </div>
  );
};
GridSquareDisplay.propTypes = propTypes;
GridSquareDisplay.defaultProps = defaultProps;

export default memo(GridSquareDisplay);
