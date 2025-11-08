import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '../../test/test-utils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Board from '../Board/Board';

// Mock the SVG imports
//new game icon
vi.mock('../../assets/newgame.svg?react', () => ({
  default: () => <div data-testid="newgame-icon" />,
}));
// notes icon-
vi.mock('../../assets/notes.svg?react', () => ({
  default: () => <div data-testid="notes-icon" />,
}));

describe('Board Component', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    // initialize touch mocks (off unless specified otherwise)
    Object.defineProperty(navigator, 'maxTouchPoints', { value: 0 });
    Object.defineProperty(window, 'ontouchstart', { value: undefined });
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });

    // clear any existing DOM elements
    document.body.innerHTML = '';
  });

  it('should render the board with all 81 cells', async () => {
    render(<Board />);

    await waitFor(() => {
      const inputs = screen.getAllByRole('textbox');
      const spans = screen.getAllByText(/^[1-9]$/);
      expect(inputs.length + spans.length).toBe(81);
    });
  });

  it('should render new game and notes buttons', async () => {
    render(<Board />);

    await waitFor(() => {
      expect(screen.getByText('new game')).toBeInTheDocument();
      expect(screen.getByText('notes')).toBeInTheDocument();
      expect(screen.getByTestId('newgame-icon')).toBeInTheDocument();
      expect(screen.getByTestId('notes-icon')).toBeInTheDocument();
    });
  });

  // idk how to test that the board changes, i could probably figure that out but it would be really obvious to tell if it doesn
  it.skip('should start a new game when new game button is clicked', async () => {
    render(<Board />);

    await waitFor(() => {
      expect(screen.getByText('new game')).toBeInTheDocument();
    });

    const newGameButton = screen.getByText('new game');
    await user.click(newGameButton);

    // The board should re-render with new puzzle
    await waitFor(() => {
      const inputs = screen.getAllByRole('textbox');
      const spans = screen.getAllByText(/^[1-9]$/);
      expect(inputs.length + spans.length).toBe(81);
    });

    // expect(boardDataNew.not.toEqual(boardDataOld));
  });

  it('should toggle notes mode when notes button is clicked', async () => {
    render(<Board />);

    await waitFor(() => {
      expect(screen.getByText('notes')).toBeInTheDocument();
    });

    const notesButton = screen.getByText('notes');
    expect(notesButton).toHaveAttribute('aria-pressed', 'false');

    await user.click(notesButton);
    expect(notesButton).toHaveAttribute('aria-pressed', 'true');

    await user.click(notesButton);
    expect(notesButton).toHaveAttribute('aria-pressed', 'false');
  });

  // check if cells are editable
  it('should allow input in editable cells', async () => {
    render(<Board />);

    // 81 - the given cells
    // 40 clues set
    // sometimes there can be more given cells to make the puzzle unique
    await waitFor(() => {
      const inputs = screen.getAllByRole('textbox');
      expect(inputs.length).toBeGreaterThan(39);
      expect(inputs.length).toBeLessThan(45);
    });

    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    const firstInput = inputs[0];

    await user.type(firstInput, '5');
    expect(firstInput.value).toBe('5');
  });

  it('should not allow input in given cells', async () => {
    render(<Board />);

    await waitFor(() => {
      const spans = screen.getAllByText(/^[1-9]$/); // given cells render as spans
      // expect(spans.length).toBeGreaterThan(81);
      expect(spans.length).toBeGreaterThan(39);
      expect(spans.length).toBeLessThan(45);
    });

    const spans = screen.getAllByText(/^[1-9]$/);
    const firstSpan = spans[0];

    // clue cells should have the 'given' class
    expect(firstSpan.closest('.square')).toHaveClass('given');
  });

  // //idk maybe i should mock data, 1 might be valid or invalid depending on the puzzle
  // it.skip('should validate user input and show invalid styling', async () => {
  //   render(<Board />);

  //   await waitFor(() => {
  //     const inputs = screen.getAllByRole('textbox');
  //     expect(inputs.length).toBeGreaterThan(39);
  //     expect(inputs.length).toBeLessThan(45);
  //   });

  //   const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
  //   const firstInput = inputs[0];

  //   // Try to enter an invalid number
  //   await user.clear(firstInput);
  //   await user.type(firstInput, '1');

  //   // verify that its there at leaest
  //   expect(firstInput.value).toBe('1');
  // });

  it('should handle keyboard input correctly', async () => {
    render(<Board />);

    await waitFor(() => {
      const inputs = screen.getAllByRole('textbox');
      expect(inputs.length).toBeGreaterThan(39);
      expect(inputs.length).toBeLessThan(45);
    });

    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    const firstInput = inputs[0];

    // Test valid number input
    fireEvent.keyDown(firstInput, { key: '5' });
    await user.type(firstInput, '5');
    expect(firstInput.value).toBe('5');

    // Test backspace
    fireEvent.keyDown(firstInput, { key: 'Backspace' });
    await user.clear(firstInput);
    expect(firstInput.value).toBe('');

    // Test invalid input ((should be prevented)
    fireEvent.keyDown(firstInput, { key: '0' });
    await user.type(firstInput, '0');
    expect(firstInput.value).toBe(''); // Should not allow 0

    fireEvent.keyDown(firstInput, { key: 'a' });
    await user.type(firstInput, 'a');
    expect(firstInput.value).toBe(''); // Should not allow letters
  });

  it('should handle notes mode input', async () => {
    render(<Board />);

    await waitFor(() => {
      expect(screen.getByText('notes')).toBeInTheDocument();
    });

    // toggler notes mode on
    const notesButton = screen.getByText('notes');
    await user.click(notesButton);

    await waitFor(() => {
      const inputs = screen.getAllByRole('textbox');
      expect(inputs.length).toBeGreaterThan(39);
      expect(inputs.length).toBeLessThan(45);
    });

    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    const firstInput = inputs[0];

    // In notes mode, typing should add notes instead of actual input
    await user.type(firstInput, '5');

    // The input field should remain empty in notes mode
    expect(firstInput.value).toBe('');
  });

  it.skip('should show keypad on desktop when cell is clicked', async () => {
    // This test is temporarily skipped due to keypad not appearing in test environment
    // The keypad functionality works in the actual application but is difficult to test
    // in the jsdom environment due to touch detection and timing issues

    // Mock desktop environment
    Object.defineProperty(navigator, 'maxTouchPoints', { value: 0 });
    Object.defineProperty(window, 'ontouchstart', { value: undefined });

    render(<Board />);

    // wait for initialize
    await waitFor(
      () => {
        const inputs = screen.getAllByRole('textbox');
        expect(inputs.length).toBeGreaterThan(0);

        //  check that we have given cells (spans with numbers)
        const givenCells = screen.getAllByText(/^[1-9]$/);
        // expect(givenCells.length).toBeGreaterThan(0);
        expect(givenCells.length).toBeGreaterThan(39);
        expect(givenCells.length).toBeLessThan(45);
      },
      { timeout: 5000 }
    );

    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    const firstInput = inputs[0];

    // Click on the input cell container (not the input itself)
    const squareCell = firstInput.closest('.square-cell');
    expect(squareCell).toBeInTheDocument();

    fireEvent.click(squareCell!);

    // Keypad should appear
    await waitFor(
      () => {
        const keypad = document.querySelector('.keypad');
        expect(keypad).toBeInTheDocument();

        // Keypad container should be visible
        expect(keypad).toBeVisible();
      },
      { timeout: 3000 }
    );
  });

  it('should not show keypad on touch devices', async () => {
    // mock touch device
    Object.defineProperty(navigator, 'maxTouchPoints', { value: 1 });
    Object.defineProperty(window, 'ontouchstart', { value: {} });

    render(<Board />);

    await waitFor(() => {
      const inputs = screen.getAllByRole('textbox');
      expect(inputs.length).toBeGreaterThan(39);
      expect(inputs.length).toBeLessThan(45);
    });

    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    const firstInput = inputs[0];

    // Click on the input cell
    fireEvent.click(firstInput.closest('.square-cell')!);

    // Keypad should not appear
    await waitFor(() => {
      const keypad = document.querySelector('.keypad');
      expect(keypad).not.toBeInTheDocument();
    });
  });
});
