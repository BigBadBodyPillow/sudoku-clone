// interface BoardProps {
//   Boards: number;
// }

import '../Styles/Board.css';

function Board() {
  const boards = 1;
  const square = 9; // 1 board is a 3x3 grid

  return (
    <div className="board-container">
      {/* boards */}
      {Array.from({ length: boards }, (_, i) => (
        <div className="board" data-index={`board${i + 1}`} key={i}>
          {/* gsquares in a board */}
          {Array.from({ length: square }, (_, j) => (
            <div className="square" data-index={`square${j + 1}`} key={j}>
              square {j + 1}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Board;
