export type Grid = number[][];

interface IsSafeParams {
  grid: Grid;
  row: number;
  col: number;
  num: number;
}
interface SolveGridParams {
  grid: Grid;
  countSolutions: boolean;
  limit: number;
}
interface isValidMoveParams {
  grid: Grid;
  row: number;
  col: number;
  value: number;
}

interface makePuzzleParams {
  completed: Grid;
  clues: number;
}

const gridSize = 9; // the game is a 3x3 grid made up of 3x3 boardSize. this totals 9 numbers in a single row
const boardSize = 3; // 3x3 cells = 1 board

// an array of 9 arrays which themselves have an array of 9 0s
// this makes up the 81 total numbers for the game
function createEmptyGrid(): Grid {
  return Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
}

// randomize the numbers
// https://www.w3schools.com/js/tryit.asp?filename=tryjs_array_sort_random2
// example:
// input :[1, 2, 3, 4, 5, 6, 7, 8, 9]
// output :[5, 6, 1, 4, 9, 2, 3, 7, 8]
function shuffle<T>(array: T[]): T[] {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    // const k = a[i];
    // a[i] = a[j];
    // a[j] = k;

    // swap places
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// check if placement is valid
// example:
// (ignore invalid numbers please its easier to look at this way)
//  =======================
// | 1 2 3 | 4 5 6 | 7 8 9 | *0
// | 1 2 3 | 4 5 6 | 7 8 9 | *1
// | 1 2 3 | 4 5 6 | 7 8 9 | *2
// | ----- | ----- | ----- |
// | 1 2 3 | $ 5 6 | 7 8 9 | *3
// | 1 2 3 | 4 5 # | 7 8 9 | *4
// | 1 2 3 | 4 5 6 | 7 8 9 | *5
// | ----- | ----- | ----- |
// | 1 2 3 | 4 5 6 | 7 8 9 | *6
// | 1 2 3 | 4 5 6 | 7 8 9 | *7
// | 1 2 3 | 4 5 6 | 7 8 9 | *8
//  =======================
//  *0*1*2  *3*4*5  *6*7*8
//
// is #  a valid space to add a number
//
// the '#' is in row 4 and column 5 ( [[4],[5]]).
// check if # is anywhere else in its row ([4], [x]).
// check if # is anywhere else in its column ([x], [5]).
// if it does, return false.
//
// to find the board it belongs to:
// row 4 - (row 4 % 3) = row 3
// column 5 - (column 5 % 3) = column 3
// the cell is represented by '$' ( [[3],[3]] ).
// check all cells in the board starting from '$' ( [[3],[3]] ).
// [[3],[3]]
// [[3],[4]]
// [[3],[5]]
// [[4],[3]]
// [[4],[4]]
// [[4],[5]]
// [[5],[3]]
// [[5],[4]]
// [[5],[5]]
// if it does, return false.
//
// otherwise, is valid.
//
function isSafe({ grid, row, col, num }: IsSafeParams): boolean {
  // if the number exists in the row or column then is not safe
  for (let i = 0; i < gridSize; i += 1) {
    if (grid[row][i] === num || grid[i][col] === num) return false;
  }

  // the first row/column in the sub grid that the selected cell is part of
  const boardRow = row - (row % boardSize);
  const boardCol = col - (col % boardSize);

  // check if number exists in its board(the 3x3)
  // variables names get really long so:
  // r is the row relative to the board
  // c is the column relative to the board
  // boardRow + r gives you the overall row index in the grid
  // boardCol + c gives you the overall column index in the grid
  for (let r = 0; r < boardSize; r += 1) {
    for (let c = 0; c < boardSize; c += 1) {
      if (grid[boardRow + r][boardCol + c] === num) return false;
    }
  }
  return true;
}

// find empty cell (value of 0), return it, or null if full
function findEmpty(grid: Grid): [number, number] | null {
  for (let r = 0; r < gridSize; r += 1) {
    for (let c = 0; c < gridSize; c += 1) {
      if (grid[r][c] === 0) return [r, c];
    }
  }
  return null;
}

// clone the game and solve it
export function solveGrid({
  grid,
  countSolutions = false,
  limit = 2,
}: SolveGridParams): { solved: boolean; solutions: number } {
  // const wholeBoard = grid.map((row) => row.slice());
  const wholeBoard = cloneGrid(grid); //copy the game board

  let solutions = 0;

  // check untill no cell is empty
  function backtrack(): boolean {
    const empty = findEmpty(wholeBoard);

    // if ther are no empty cells that measn the board is complete
    if (!empty) {
      solutions += 1;
      return true;
    }

    const [row, col] = empty; // position of empty cell

    // test all numbers in a random order
    for (const num of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
      // if valid place it in the empty cell
      if (isSafe({ grid: wholeBoard, row, col, num })) {
        wholeBoard[row][col] = num;
        const solved = backtrack();

        // allow to return early if counting is false
        if (!countSolutions && solved) return true;
        // or in the case that it is enabled, that its reached its limit
        if (countSolutions && solutions >= limit) return true;

        // change it back to empty if cases are false
        wholeBoard[row][col] = 0;
      }
    }
    return false;
  }

  const solved = backtrack();

  return { solved, solutions };
}

// create full gird with no empty(0) cells
export function generateCompletedGrid(): Grid {
  // 9x9 grid full of 0s (0 = empty)
  const grid = createEmptyGrid();

  function backtrack(): boolean {
    const empty = findEmpty(grid);
    // case to end early; if no cells are empty the grid is full
    if (!empty) return true;

    const [row, col] = empty;

    // try adding number
    for (const num of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
      if (isSafe({ grid, row, col, num })) {
        grid[row][col] = num;

        // e nd if number added
        if (backtrack()) return true;

        // reset if not add
        grid[row][col] = 0;
      }
    }
    // if no number is valid
    return false;
  }

  backtrack();
  return grid;
}

//copy the game board
export function cloneGrid(grid: Grid): Grid {
  return grid.map((row) => row.slice());
}

// remove some numbers from sovled grid untill the number of
// revleaed squares are equal to the clues
// returns the final grid and the solution
export function makePuzzle({ completed, clues = 32 }: makePuzzleParams): {
  puzzle: Grid;
  solution: Grid;
} {
  const puzzle = cloneGrid(completed);

  // list of all cell coordinates from [0,0] to [8,8]
  const positions: [number, number][] = [];
  for (let r = 0; r < gridSize; r += 1) {
    for (let c = 0; c < gridSize; c += 1) {
      positions.push([r, c]);
    }
  }

  // remove random cells
  for (const [r, c] of shuffle(positions)) {
    //skip if already empty
    if (puzzle[r][c] === 0) continue;

    const backup = puzzle[r][c];
    puzzle[r][c] = 0;

    const { solutions } = solveGrid({
      grid: puzzle,
      countSolutions: true,
      limit: 2,
    });

    // console.log(solutions);

    // revert if more than 1 solution
    if (solutions !== 1) {
      puzzle[r][c] = backup;
    }

    //stop removing once revealed squares have is <= clues
    const filled = puzzle.flat().filter((n) => n !== 0).length;
    if (filled <= clues) break;
  }

  // console.log(cloneGrid(completed));
  return { puzzle, solution: cloneGrid(completed) };
}

// console.log(asd);

// validates user input
export function isValidMove({
  grid,
  row,
  col,
  value,
}: isValidMoveParams): boolean {
  if (value < 1 || value > 9) return false;

  // backup
  const current = grid[row][col];

  // clear cell so it doesnt flag its self when checking
  grid[row][col] = 0;
  const ok = isSafe({ grid, row, col, num: value });

  // add it back
  grid[row][col] = current;

  return ok;
}
