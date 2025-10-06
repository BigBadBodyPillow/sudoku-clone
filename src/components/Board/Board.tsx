import { useEffect, useState } from 'react';
// import { useMemo } from 'react';
import {
  type Grid,
  type NotesGrid,
  cloneGrid,
  generateCompletedGrid,
  isValidMove,
  makePuzzle,
  createEmptyNotesGrid,
} from '../../utils/sudoku';

//css
import './Board.css';

interface HandleChangeParams {
  row: number;
  col: number;
  value: string;
}
interface cellStatusParams {
  row: number;
  col: number;
}

function Board() {
  const boards = 9; // game is made up of 3x3 boards
  const square = 9; // number of cells board

  const [puzzle, setPuzzle] = useState<Grid | null>(null);
  const [solution, setSolution] = useState<Grid | null>(null);
  const [userGrid, setUserGrid] = useState<Grid | null>(null);
  const [notesGrid, setNotesGrid] = useState<NotesGrid>(createEmptyNotesGrid());
  const [noteEditingStatus, setNoteEditingStatus] = useState<boolean>(false);

  // create new game.
  // set what the user sees
  // set the answered board
  const regenerate = () => {
    const completed = generateCompletedGrid();
    // s is the complete game board.
    // p isthe version with suqres removed untill it reaches the clues perameter
    const { puzzle: p, solution: s } = makePuzzle({ completed, clues: 40 });

    setPuzzle(p);
    setSolution(s);
    setUserGrid(cloneGrid(p));
    setNotesGrid(createEmptyNotesGrid());
  };

  useEffect(() => {
    regenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // caches flag to avoid rendering work until everything exists
  // const isReady = useMemo(
  //   () => !!puzzle && !!solution && !!userGrid,
  //   [puzzle, solution, userGrid]
  // );
  const isReady = !!puzzle && !!solution && !!userGrid;

  // manage user input.
  // only digits 1-9 are allowed
  const handleChange = ({ row, col, value }: HandleChangeParams) => {
    if (!puzzle || !userGrid) return;

    // prevent changes to clue squares
    if (puzzle[row][col] !== 0) return;

    const trimmed = value.trim();

    // toggle notes mode
    if (noteEditingStatus) {
      if (trimmed === '') return; // ignore empty

      const note = Number(trimmed);

      //if not number, 0 or > 9 ignore
      if (!Number.isInteger(note) || note < 1 || note > 9) return;

      setNotesGrid((prev) => {
        const next: NotesGrid = prev.map((row) =>
          row.map((col) => new Set<number>(col))
        );

        const cellNotes = next[row][col];

        // if the number already exists, remove it
        if (cellNotes.has(note)) cellNotes.delete(note);
        // otherwise add it
        else cellNotes.add(note);

        return next;
      });
      return;
    }

    const next = cloneGrid(userGrid); // copy the game board

    // if empty set to 0
    if (trimmed === '') {
      next[row][col] = 0;
    }
    // otherwise set the user input
    else {
      const num = Number(trimmed);

      if (Number.isInteger(num) && num >= 1 && num <= 9) {
        next[row][col] = num; // set the note
      }
    }
    setUserGrid(next);

    // if the placed value is valid, remove that digit from notes in row/col/subgrid
    const placed = next[row][col];
    const isPlacedValid =
      placed !== 0 && isValidMove({ grid: next, row, col, value: placed });

    setNotesGrid((prev) => {
      const nextNotes: NotesGrid = prev.map((row) =>
        row.map((col) => new Set<number>(col))
      );

      // always clear notes when a number is entered
      nextNotes[row][col].clear();

      if (isPlacedValid) {
        const digit = placed;
        // clear row
        for (let c = 0; c < 9; c += 1) {
          if (c !== col) nextNotes[row][c].delete(digit);
        }
        // clear column
        for (let r = 0; r < 9; r += 1) {
          if (r !== row) nextNotes[r][col].delete(digit);
        }

        const startRow = row - (row % 3);
        const startCol = col - (col % 3);

        // clear subgrid
        for (let row = 0; row < 3; row += 1) {
          for (let col = 0; col < 3; col += 1) {
            const boardRow = startRow + row;
            const boardColumn = startCol + col;
            if (boardRow === row && boardColumn === col) continue;
            nextNotes[boardRow][boardColumn].delete(digit);
          }
        }
      }

      return nextNotes;
    });
  };

  //checks if cell is a clue or invalid (main purpose is styling)
  const cellStatus = ({ row, col }: cellStatusParams) => {
    if (!puzzle || !userGrid) {
      return { given: false, invalid: false } as const;
    }

    const given = puzzle[row][col] !== 0; // clues
    const value = userGrid[row][col]; // userinput

    // is invalid if not a clue, not empty and breaks game rules
    const invalid =
      !given &&
      value !== 0 &&
      !isValidMove({ grid: userGrid, row, col, value });

    return { given, invalid } as const;
  };

  // allow only 1-9, backspace delete and tab
  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    const allowed = ['Backspace', 'Delete', 'Tab'];

    if (allowed.includes(e.key)) return; // allow
    if (/^[1-9]$/.test(e.key)) return; // allow
    e.preventDefault(); // block everything else
  };

  return (
    <>
      <div className="board-wrapper">
        <div className="board-container">
          {/* each board | 9 total boards = 1 3x3 game grid*/}
          {Array.from({ length: boards }, (_, boardIndex) => (
            <div
              className="board"
              data-index={`board${boardIndex + 1}`}
              key={boardIndex}
            >
              {/* each square in the board | 9 total cells = 1 3x3 board */}
              {Array.from({ length: square }, (_, squareIndex) => {
                //      game grid
                //  =================
                // | [a] | [b] | [c] | *0
                // | --- | --- | --- |
                // | [d] | [e] | [f] | *1
                // | --- | --- | --- |
                // | [g] | [h] | [i] | *2
                //  =================
                //   *0    *1    *2
                //
                //    board [i]
                //     =======
                //    | $ x x | *0
                //    | x x # | *1
                //    | x x x | *2
                //     =======
                //     *0*1*2
                // board coordinates:
                // all squares in i have a board index of 8
                // row: (8)/3 = floor(2) = 2
                // col: (8)%3 = 2
                // = [2,2] in the overall game
                // square coordinates:
                // all cells in a board have an index in a range of 0-8
                // $ would be 0 and # would be 5
                // $:[0,0]
                //  row: (0)/3 = floor(0) = 0
                //  col: (0)%3 = 0
                //
                // #:[1,2]
                //  row: (5)/3 = floor(1.66) = 1
                //  col: (5)%3 = 2
                //
                // board:[2,2]
                // $:[0,0] | #:[1,2] in board
                //
                // overall game
                // $:[6,6] = [2*3+0, 2*3+0]
                // #:[7,8] = [2*3+1, 2*3+2]
                // game co ordinates 3x3 of boards
                const boardRow = Math.floor(boardIndex / 3);
                const boardCol = boardIndex % 3;
                // co ordinates within the board 3x3 of squares
                const cellRow = Math.floor(squareIndex / 3);
                const cellCol = squareIndex % 3;
                // grid coordinates 9x9 of squares
                const row = boardRow * 3 + cellRow;
                const col = boardCol * 3 + cellCol;
                const { given, invalid } = cellStatus({ row, col });
                const value = isReady && userGrid ? userGrid[row][col] : 0;
                return (
                  <div
                    className={`square${given ? ' given' : ' editable'}${
                      invalid ? ' invalid' : ''
                    }`}
                    data-index={`square${squareIndex + 1}`}
                    key={squareIndex}
                  >
                    {/* if not a clue add an input */}
                    {given ? (
                      <span className="square-text">
                        {isReady && puzzle ? puzzle[row][col] : ''}
                      </span>
                    ) : (
                      <div className="square-cell">
                        {/* notes overlay for empty cells */}
                        {value === 0 ? (
                          <div className="notes-grid" aria-hidden="true">
                            {/* notes placeholders */}
                            {Array.from({ length: 9 }, (_, i) => {
                              const n = i + 1;
                              const has = notesGrid[row][col].has(n);
                              return (
                                <span
                                  key={n}
                                  className={`note${has ? ' present' : ''}`}
                                >
                                  {has ? n : ''}
                                </span>
                              );
                            })}
                          </div>
                        ) : null}
                        <input
                          className="square-input"
                          // name={`input ${squareIndex + 1}`}
                          inputMode="numeric"
                          pattern="[1-9]"
                          maxLength={1}
                          value={value === 0 ? '' : String(value)}
                          onKeyDown={handleKeyDown}
                          //replace anything thats not 1-9 with nothing
                          onChange={(e) =>
                            handleChange({
                              row,
                              col,
                              value: e.target.value.replace(/[^1-9]/g, ''),
                            })
                          }
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="controls">
          <button
            className="new-game-button"
            onClick={regenerate}
            title="start a new game with a new board"
          >
            new game
          </button>
          <button
            aria-pressed={noteEditingStatus}
            className="notes-button"
            onClick={() =>
              setNoteEditingStatus((currentValue) => !currentValue)
            }
            title="Toggle notes mode (type digits to add/remove notes)"
          >
            notes
          </button>
        </div>
      </div>
    </>
  );
}

export default Board;
