import React, { memo } from 'react';
import './Styles/GridSquareDisplay.css';
import bomb from './Static/bomb.png';
import flag from './Static/flag.png';
import PropTypes from 'prop-types';

const propTypes = { isBomb: PropTypes.bool, isFlag: PropTypes.bool };
const defaultProps = { isBomb: false, isFlag: false };

const GridSquareDisplay = ({ isBomb, isFlag }) => {
  console.log(isBomb);
  return (
    <div className="grid-square">
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
