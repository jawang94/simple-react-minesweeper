# VantMineSweeper

## How to run

1. Clone the repository to your machine.
2. Once in the project directory, run `yarn install`.
3. Once packages have been installed, run `yarn start`.

If app does not open automatically, navigate to [http://localhost:3000](http://localhost:3000) in your browser of choice.

## Game Overview

Select an allegiance, username, and difficulty to unlock the Login button.
Number of bombs generated varies by difficulty: Easy => 5, Medium => 10, Hard => 15.

To reset the game, either click on the Reset Board button on the left.
To change difficulty, use the dropdown on the left.
**Note: Changing difficulty will reset the board.**

Number of bombs remaining and number of flags placed are indicated on the game board.
Number of bombs will always start at the maximum based on difficulty. Number of flags will always start at 0.

A zero square is a square with no bombs in any of the squares adjacent to it (diagonals included);

If a win or lose scenario is encountered, the entire board will be revealed and the game will be frozen.

### To place a flag: Right click on a square

Flags may not be removed after placement.
Maximum number of flags allowed is equal to your difficulty: Easy => 5, Medium => 10, Hard => 15.
Once the maximum number of flags is reached, the game will end and display either a win or lose alert.
Placing a flag on a bomb square will decrease the number of bombs remaining.

### To reveal a square: Left click on a square

Left clicking on a bomb will end the game immediately
Left clicking on a **zero** square will also reveal adjacent squares. This effect will propogate until no more adjacent zero squares can be reached.
Left clicking on a flagged square does nothing.
Left clicking on a previously revealed square does nothing.

### How to win

Correctly flag all bombs.

### How to lose

Reveal a bomb **or** incorrectly flagging one or more bombs after using up all flags.

## Technical Notes

### Component Structure

As a habit, keeping components light, targeted, and modular is better than the inverse. Without over-modularizing, it was decided
that the app should have 3 components (a game component, a grid board component, and a grid square component). Each component has
a `Container` file which handles logic and a corresponding `Display` file which handles rendering and any light front-end logic.
Each `Display` file has a corresponding `.css` file located within the `/Styles` directory. Styling is a mix between inline css and imported css. Could have gone about this in several ways (css modules, inline bootstrap, styled jsx, etc), but for the purpose of this app, the cleanest method was chosen (least amount of clutter in the display files).

### General Code Guidelines

Code is always declared in this order:\
| Imports
| Prop Types
| Default Props
| Component Method
| Attaching props and default props to the component
| Export statement w/ comment indicating file(s) to which component is exported

Components are all functional and stateless with hooks.
Props and objects are generally destructured unless it makes more sense (subjectively) not to.
Methods are commented with general functionality.
All prop threading, typing, and default value declarations are alphabetized.
Lengthy object declarations are also alphabetized unless it makes more sense (subjectively) not to.

### Design Key Points

Since the game is so light, speed is not a huge factor however, still best to optimize where possible.

Heaviest computation is certainly on board creation and any time the 2d matrix needs to be traversed.
For this reason, objects are used as much as possible to cache high importance data for O(1) lookups (E.g. for flags, bombs, and matrix data). This way we only do the work one time on game load.
In this way we can essentially keep in-game interactions to near-constant time (the adjacent square traversal is pretty random but theoretically could get close to O(XY) time if user's luck is amazingly good yet ironically terrible).

**Areas for improvement:**
On game load, to speed things up we could try to plant as we create the matrix with a more involved random number function that returns true (plant) a certain percentage of the time. As far as calculating adjacent bombs, can imagine some genius way to go about it in one traversal but realistically not sure if the complexity would net any real world gains.

### Final Thoughts

Was good fun. Heard of Minesweeper before but had never played it. Feel like I'm slightly more cultured now and a marginally better game designer.
