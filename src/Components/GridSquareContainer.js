import React, { memo } from 'react';
import GridSquareDisplay from './GridSquareDisplay';

const GridSquareContainer = props => {
  return <GridSquareDisplay {...props} />;
};

export default memo(GridSquareContainer);
