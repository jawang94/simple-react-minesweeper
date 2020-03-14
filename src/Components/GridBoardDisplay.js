import React, { memo } from 'react';
import PropTypes from 'prop-types';
import GridSquareContainer from './GridSquareContainer';
import './Styles/GridBoardDisplay.css';

const propTypes = {
  gridMatrix: PropTypes.array,
  gameStatus: PropTypes.string,
  bombCount: PropTypes.number,
};

const GridBoardDisplay = ({ gridMatrix, gameStatus, bombCount }) => {
  return (
    <div className="grid-board">
      <div style={{ color: 'black', textAlign: 'center', marginBottom: '5vh' }}>
        <h1>{gameStatus}</h1>
        <h6>
          <img
            src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/320/facebook/65/bomb_1f4a3.png"
            alt="bombemoji"
            style={{ height: '25px' }}
          />{' '}
          s Remaining: {bombCount}
        </h6>
      </div>

      {gridMatrix.map(row => {
        return row.map(cell => {
          return (
            <div key={cell.x * row.length + cell.y}>
              <GridSquareContainer />
            </div>
          );
        });
      })}
    </div>
  );
};
GridBoardDisplay.propTypes = propTypes;

export default memo(GridBoardDisplay);
