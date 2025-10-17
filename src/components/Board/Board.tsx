import { useEffect, useRef, useState } from 'react';
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

//icon
import NewGameIcon from '../../assets/newgame.svg?react';
import NotesIcon from '../../assets/notes.svg?react';

interface HandleChangeParams {
  row: number;
  col: number;
  value: string;
}
interface cellPositionParams {
  row: number;
  col: number;
}
interface InputParams {
  grid: Grid;
  row: number;
  col: number;
  trimmed: string;
}

function Board() {
  const boards = 9; // game is made up of 3x3 boards
  const square = 9; // number of cells board

  const [puzzle, setPuzzle] = useState<Grid | null>(null);
  const [solution, setSolution] = useState<Grid | null>(null);
  const [userGrid, setUserGrid] = useState<Grid | null>(null);
  const [notesGrid, setNotesGrid] = useState<NotesGrid>(createEmptyNotesGrid());
  const [isNotesMode, setIsNotesMode] = useState<boolean>(false);
  const [activeCell, setActiveCell] = useState<cellPositionParams | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const keypadRef = useRef<HTMLDivElement | null>(null);

  // create new game.
  // set what the user sees
  // set the answered board
  const newGame = () => {
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
    newGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // disable keypad if on mobile
  useEffect(() => {
    const hasTouch =
      (typeof window !== 'undefined' && 'ontouchstart' in window) ||
      (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) ||
      (typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(pointer: coarse)').matches);
    setIsTouchDevice(!!hasTouch);
  }, []);

  // hide keypad when clicking outside of it
  useEffect(() => {
    if (!activeCell) return;

    const handleDown = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (keypadRef.current && target && keypadRef.current.contains(target))
        return;
      setActiveCell(null);
    };

    document.addEventListener('mousedown', handleDown, true);
    return () => {
      document.removeEventListener('mousedown', handleDown, true);
    };
  }, [activeCell]);

  const isReady = !!puzzle && !!solution && !!userGrid;

  // for user input in a cell.
  // for normal and notes
  const handleChange = ({ row, col, value }: HandleChangeParams) => {
    if (!puzzle || !userGrid) return;
    if (isClueCell(puzzle, row, col)) return; // no edit a given cell

    const trimmed = value.trim();

    // toggle note
    if (isNotesMode) {
      handleNotesInput(row, col, trimmed);
      return;
    }

    // add note to grid
    const updatedGrid = applyUserInput({ grid: userGrid, row, col, trimmed });
    setUserGrid(updatedGrid);

    const placed = updatedGrid[row][col];
    const isPlacedValid =
      placed !== 0 &&
      isValidMove({ grid: updatedGrid, row, col, value: placed });

    //cleanup
    const updatedNotes = updateNotesAfterPlacement(
      notesGrid,
      row,
      col,
      placed,
      isPlacedValid
    );
    setNotesGrid(updatedNotes);
  };

  // reutursn true if teh cell is a given cell. (not editable)
  const isClueCell = (puzzle: Grid, row: number, col: number): boolean => {
    return puzzle[row][col] !== 0;
  };

  // handles note input mode
  // toggles the note in the cell.
  const handleNotesInput = (row: number, col: number, trimmed: string) => {
    if (trimmed === '') return;

    const note = Number(trimmed);
    if (!Number.isInteger(note) || note < 1 || note > 9) return;

    setNotesGrid((prev) => {
      // copy the grid
      const next: NotesGrid = prev.map((row) =>
        row.map((col) => new Set<number>(col))
      );

      const cellNotes = next[row][col];

      // delete or add a note
      cellNotes.has(note) ? cellNotes.delete(note) : cellNotes.add(note);
      return next;
    });
  };

  // converts empty input to 0 otherwise sets the digit
  const applyUserInput = ({ grid, row, col, trimmed }: InputParams): Grid => {
    const next = cloneGrid(grid);
    // const num = Number(trimmed);

    if (trimmed === '') {
      next[row][col] = 0;
    } else {
      const num = Number(trimmed);

      if (Number.isInteger(num) && num >= 1 && num <= 9) {
        next[row][col] = num;
      }
    }

    return next;
  };

  // c;ear notes and remove digits in row/column/subgrid
  const updateNotesAfterPlacement = (
    prev: NotesGrid,
    row: number,
    col: number,
    digit: number,
    isValid: boolean
  ): NotesGrid => {
    const next: NotesGrid = prev.map((row) =>
      row.map((col) => new Set<number>(col))
    );

    next[row][col].clear(); // alwauys clear edited cell

    if (!isValid) return next;

    // row
    for (let c = 0; c < 9; c++) {
      if (c !== col) next[row][c].delete(digit);
    }

    //colimn
    for (let r = 0; r < 9; r++) {
      if (r !== row) next[r][col].delete(digit);
    }

    // subgrid
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const boardRow = startRow + r;
        const boardCol = startCol + c;
        if (boardRow === row && boardCol === col) continue;
        next[boardRow][boardCol].delete(digit);
      }
    }

    return next;
  };

  //checks if cell is a clue or invalid (main purpose is styling)
  const cellStatus = ({ row, col }: cellPositionParams) => {
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
                      <div
                        className="square-cell"
                        onClick={() => {
                          if (isTouchDevice) return; // not show keypad on mobile/touch
                          setActiveCell({ row, col });
                        }}
                      >
                        {/* notes overlay for empty cells */}
                        {value === 0 ? (
                          <div className="notes-grid" aria-hidden="true">
                            {/* notes placeholders */}
                            {Array.from({ length: 9 }, (_, i) => {
                              const note = i + 1;
                              const hasNote = notesGrid[row][col].has(note);
                              return (
                                <span
                                  key={note}
                                  className={`note${hasNote ? ' present' : ''}`}
                                >
                                  {hasNote ? note : ''}
                                </span>
                              );
                            })}
                          </div>
                        ) : null}
                        <input
                          className="square-input"
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
                        {/* keypad shown only on desktop and only for the active cell */}
                        {!isTouchDevice &&
                        activeCell &&
                        activeCell.row === row &&
                        activeCell.col === col ? (
                          <div
                            className="keypad"
                            ref={keypadRef}
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            {Array.from({ length: 9 }, (_, i) => {
                              const numpadKey = i + 1;
                              return (
                                <button
                                  key={numpadKey}
                                  className="keypad-key"
                                  type="button"
                                  onClick={() => {
                                    handleChange({
                                      row,
                                      col,
                                      value: String(numpadKey),
                                    });
                                    setActiveCell(null);
                                  }}
                                >
                                  {numpadKey}
                                </button>
                              );
                            })}
                            {!isNotesMode ? (
                              <button
                                type="button"
                                className="keypad-key keypad-delete"
                                onClick={() => {
                                  handleChange({ row, col, value: '' });
                                  setActiveCell(null);
                                }}
                              >
                                delete
                              </button>
                            ) : null}
                          </div>
                        ) : null}
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
            onClick={newGame}
            title="start a new game with a new board"
          >
            <NewGameIcon className="newgame--icon" />
            new game
          </button>
          <button
            aria-pressed={isNotesMode}
            className="notes-button"
            onClick={() => setIsNotesMode((currentValue) => !currentValue)}
            title="Toggle notes mode (type digits to add/remove notes)"
          >
            <NotesIcon className="notes--icon" />
            notes
          </button>
        </div>
      </div>
    </>
  );
}

export default Board;
