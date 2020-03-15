import React, { useState, memo } from 'react';
import './Styles/GameDisplay.css';
import {
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupButtonDropdown,
  Input,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import PropTypes from 'prop-types';
import GridBoardContainer from './GridBoardContainer';

const propTypes = {
  updateUserName: PropTypes.func,
  updateAllegiance: PropTypes.func,
  handleSignInClick: PropTypes.func,
  userName: PropTypes.string,
  allegiance: PropTypes.string,
  signedIn: PropTypes.bool,
  gameSettings: PropTypes.object,
};
const defaultProps = {
  updateUserName: () => {},
  updateAllegiance: () => {},
  handleSignInClick: () => {},
  userName: '',
  allegiance: '',
  signedIn: false,
  gameSettings: {},
};

const GameDisplay = ({
  updateUserName,
  updateAllegiance,
  handleSignInClick,
  userName,
  allegiance,
  signedIn,
  gameSettings,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropDown = () => setDropdownOpen(!dropdownOpen);

  return (
    <>
      {signedIn ? (
        <div className="game-container">
          <h4 className="header">
            Welcome <span style={{ color: 'black' }}>{userName}</span> of{' '}
            <span style={{ color: 'green' }}>{allegiance}</span>
          </h4>
          <GridBoardContainer gameSettings={gameSettings} />
        </div>
      ) : (
        <div>
          <h1>Welcome to VantMineSweeper</h1>

          <div>
            <InputGroup>
              <InputGroupButtonDropdown
                className="dropdown"
                addonType="append"
                isOpen={dropdownOpen}
                toggle={toggleDropDown}
              >
                <DropdownToggle caret>
                  {allegiance ? allegiance : 'Select your allegiance'}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem header>Strong Picks</DropdownItem>
                  <DropdownItem onClick={() => updateAllegiance('VantAI')}>VantAI</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem header>Weak Picks</DropdownItem>
                  <DropdownItem onClick={() => updateAllegiance('Not VantAI')}>
                    Not VantAI
                  </DropdownItem>
                </DropdownMenu>
              </InputGroupButtonDropdown>

              <Input placeholder="...and enter your username" onChange={updateUserName} />

              <InputGroupAddon addonType="append">
                <Button
                  color="success"
                  disabled={!userName.length || !allegiance.length}
                  onClick={handleSignInClick}
                >
                  {!userName.length || !allegiance.length ? 'Not yet' : 'All set'}
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
