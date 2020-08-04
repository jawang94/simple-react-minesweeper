import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';
import GridBoardContainer from './GridBoardContainer';
import {
  Button,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroup,
  InputGroupAddon,
  InputGroupButtonDropdown,
  Input,
} from 'reactstrap';
import './Styles/GameDisplay.css';

const propTypes = {
  allegiance: PropTypes.string,
  difficulty: PropTypes.string,
  gameSettings: PropTypes.object.isRequired,
  handleSignInClick: PropTypes.func,
  signedIn: PropTypes.bool,
  updateAllegiance: PropTypes.func,
  updateUserName: PropTypes.func,
  updateDifficulty: PropTypes.func,
  userName: PropTypes.string,
};

const defaultProps = {
  updateUserName: () => {},
  updateAllegiance: () => {},
  updateDifficulty: () => {},
  handleSignInClick: () => {},
  userName: '',
  allegiance: '',
  signedIn: false,
};

const GameDisplay = ({
  updateUserName,
  updateAllegiance,
  handleSignInClick,
  userName,
  allegiance,
  difficulty,
  signedIn,
  gameSettings,
  updateDifficulty,
}) => {
  const [allegianceDropdown, toggleAllegianceDropdown] = useState(false);
  const [difficultyDropdown, toggleDifficultyDropdown] = useState(false);

  return (
    <>
      {signedIn ? (
        <div className="game-container">
          <h4 className="header">
            Welcome <span style={{ color: 'black' }}>{userName}</span> of{' '}
            <span style={{ color: 'green' }}>{allegiance}</span>
          </h4>

          <GridBoardContainer
            gameSettings={gameSettings}
            difficulty={difficulty}
            updateDifficulty={updateDifficulty}
          />
        </div>
      ) : (
        <div>
          <h1>Welcome to Mediocre Minesweeper</h1>

          <div className="login-bar">
            <InputGroup>
              <InputGroupButtonDropdown
                className="dropdown"
                addonType="append"
                isOpen={allegianceDropdown}
                toggle={() => toggleAllegianceDropdown(!allegianceDropdown)}
              >
                <DropdownToggle caret>
                  {allegiance ? allegiance : 'Select your allegiance'}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem header>Strong Picks</DropdownItem>
                  <DropdownItem onClick={() => updateAllegiance('Team Jason')}>
                    Team Jason
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem header>Weak Picks</DropdownItem>
                  <DropdownItem onClick={() => updateAllegiance('Not Team Jason')}>
                    Not Team Jason
                  </DropdownItem>
                </DropdownMenu>
              </InputGroupButtonDropdown>

              <Input placeholder="...and enter your username" onChange={updateUserName} />

              <InputGroupButtonDropdown
                className="dropdown"
                addonType="append"
                isOpen={difficultyDropdown}
                toggle={() => toggleDifficultyDropdown(!difficultyDropdown)}
              >
                <DropdownToggle caret>
                  {difficulty ? difficulty : 'Select Difficulty'}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => updateDifficulty('Easy')}>Easy</DropdownItem>
                  <DropdownItem onClick={() => updateDifficulty('Medium')}>Medium</DropdownItem>
                  <DropdownItem onClick={() => updateDifficulty('Hard')}>Hard</DropdownItem>
                </DropdownMenu>
              </InputGroupButtonDropdown>

              <InputGroupAddon addonType="append">
                <Button
                  color="success"
                  disabled={!userName.length || !allegiance.length || !difficulty.length}
                  onClick={handleSignInClick}
                >
                  {!userName.length || !allegiance.length || !difficulty.length
                    ? 'Not yet'
                    : 'All set'}
                </Button>
              </InputGroupAddon>
            </InputGroup>
            <br />
          </div>
        </div>
      )}
    </>
  );
};
GameDisplay.propTypes = propTypes;
GameDisplay.defaultProps = defaultProps;

export default memo(GameDisplay);
// Exports to ./GameContainer.js
