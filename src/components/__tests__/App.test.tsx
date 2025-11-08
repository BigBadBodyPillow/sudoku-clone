import { describe, it, expect, vi } from 'vitest';
import { render } from '../../test/test-utils';
import { screen } from '@testing-library/react';
import App from '../../App';

// mock the child components
vi.mock('../../components/Board/Board', () => ({
  default: () => <div data-testid="board">Board Component</div>,
}));

vi.mock('../../components/RainbowLine/RainbowLine', () => ({
  default: () => <div data-testid="rainbow-line">Rainbow Line Component</div>,
}));

vi.mock('../../components/Settings/Settings', () => ({
  default: () => <div data-testid="settings">Settings Component</div>,
}));

// it should render the app
describe('App Component', () => {
  it('should render all main components', () => {
    render(<App />);

    expect(screen.getByTestId('rainbow-line')).toBeInTheDocument();
    expect(screen.getByTestId('board')).toBeInTheDocument();
    expect(screen.getByTestId('settings')).toBeInTheDocument();
  });

  it('should render components in the correct order', () => {
    render(<App />);

    const rainbowLine = screen.getByTestId('rainbow-line');
    const board = screen.getByTestId('board');
    const settings = screen.getByTestId('settings');

    // Check that components are rendered in the expected order
    const appElement = screen.getByTestId('rainbow-line').parentElement;
    const children = Array.from(appElement!.children);

    expect(children[0]).toBe(rainbowLine);
    expect(children[1]).toBe(board);
    expect(children[2]).toBe(settings);
  });
});
