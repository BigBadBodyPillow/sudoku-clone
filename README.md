# Sudoku Clone

## Preview

<!-- <p align="center">
  <img src="https://github.com/user-attachments/assets/62722d91-4e5c-4ce3-958c-9ddf966f1979" alt="cat">
</p> -->
<p align="center">
  <img src="/Sudoku.png" alt="preview">
</p>

## Features

- Notes
- keypad
- customisation
  - font
  - theme colours

## Todo

- [x] make it work
- [x] add the notes thing
- [x] remove notes from row/column/subgrid when an actual number is inputed
- [x] add 'number pad' that appears when cell is clicked(not focused? & not on mobile)
- [x] font changer
- [x] theme changer
- [x] font size changer
- [ ] do something when win
- [ ] optimise for performance

## Learnings from this project

- I underestimated the complexity of sudoku...
- Highschool math is actually usefull
- [Fisher Yates (un?-)Sorting alorithm](https://www.w3schools.com/js/js_array_sort.asp)
- Maybe it would be better to use a canvas... [sudoku.com](https://sudoku.com) uses it? I dont have experience with it yet so ill consider that for furture projects

## Logic

### Assumptions:

- Creates the full board - 2d array.
- Remove some some numbers - The remaining numbers will be the the clues that are shown.
- When a user inputs, compare against full board.

### Reality:

#### Problems:

- My assumption was that i could just generate rows -arrays of 1-9,
  then shuffle them and check each column, then board untill there were no repeats of the same number.
  This 'bruteforce' methdology ended up being kinda slow.. _who would have thought._
- By removing some numbers you change the 'puzzle' this means that there is a chance for there to be multple ways to 'solve' it.
  Having differnt ways to solve the game isnt necessarily a problem,
  thought it is if your only way of validating a move is by comparing it to a pre-determined list which only has 1 'solution'

#### generating the grid

<ol>
<li> Create a 9x9 2d array and fill it with 0s (consider 0 to mean its empty) </li>
<li> Find an empty cell in the array. </li>
<li> Pick a random number in the range of 1 - 9 to and try to add it in the empty space. </li>
<li> Check if the number is safe to add to the grid: </li>
    <ul>
   <li>check if that number doesnt exist in the row and column.</li>
   <li>check if the number doesnt exists in the 3x3 board</li>
   </ul>
<li>  If the number does already exist do <strong>not</strong> add the number, then try another number. </li>
<li>  If the number does <strong>not</strong> already exists, add the number to the grid. (This means the cell is no longer empty) </li>
<li>  Repeat step 2 untill there are no empty cells in the grid. </li>
</ol>

#### Checking the 3x3 board

- consider that the grid is made up of 9 3x3 sub-grid that i will refer to as boards

<ol>
<li>find the position of the first cell in the board that contains the cell you want to check</li>
<li>check each cell in the board</li>
<li>if a cell in the board has the same number that you want to check for, consider it not valid</li>
    <ul><li>note: that you would have to empty the cell of the number you are checking for otherwise there would always be a false positive</li></ul>
</ol>

#### generating the 'puzzle'

- The amount of cells remaing determines the difficulty.
- judging by [sudoku.com](https://sudoku.com/) the amout of cells revealed are:
  - Easy ~ 39
  - Medium ~ 35
  - Hard ~ 30
  - Expert ~ 28
  - Master ~ 25
  - Extreme ~ 23

<ol>
<li>Pick a random cell</li>
<li>if the random cell was already empty, skip it</li>
<li>Otherwise, set that cell to 0 (empty)</li>
<li>check if this change would allow there to be multiple ways to solve it.</li>
<li>If it would then revert the change and try another cell.</li>
<li>Repeat step 1 untill the amount of remaining cells is appropriate to the difficulty scaling.</li>
</ol>

## setup

To run this project locally, you will need to have Node.js and npm installed.

1.  Clone the repository:

    ```bash
    git clone https://github.com/BigBadBodyPillow/sudoku-clone.git
    ```

2.  Navigate to the project directory:

    ```bash
    cd sudoku-clone
    ```

3.  Install the dependencies:

    ```bash
    npm install
    ```

4.  Start the dev server:

    ```bash
    npm run dev
    ```

## tools used

- [react colorful](https://github.com/omgovich/react-colorful)
- [svgrepo](https://www.svgrepo.com/)
