import React, { memo } from 'react';
import PropTypes from 'prop-types';
import GridSquareContainer from './GridSquareContainer';
import './Styles/GridBoardDisplay.css';

const propTypes = {
  boardData: PropTypes.array,
  gameStatus: PropTypes.string,
  bombCount: PropTypes.number,
};

const defaultProps = {
  boardData: [],
  gameStatus: '',
  bombCount: 0,
};

const GridBoardDisplay = ({ boardData, gameStatus, bombCount }) => {
  return (
    <div className="board">
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

      <div className="grid-board">
        {boardData.map(row => {
          return row.map(cell => {
            return (
              <div className="cell" key={cell.x + cell.y}>
                <GridSquareContainer isBomb={cell.isBomb} />
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
