import { describe, it, expect, vi } from 'vitest';
import { render } from '../../test/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Settings from '../Settings/Settings';

// mock the child components
//font
vi.mock('../Settings/Font/Font', () => ({
  default: () => <div data-testid="font-component">Font Component</div>,
}));
//theme
vi.mock('../Settings/Theme/Theme', () => ({
  default: () => <div data-testid="theme-component">Theme Component</div>,
}));

// mock the icons
//settings menu icon
vi.mock('../../assets/menu.svg?react', () => ({
  default: () => <div data-testid="menu-icon" />,
}));
// //font icon
// vi.mock('../../assets/font.svg?react', () => ({
//   default: () => <div data-testid="font-icon" />,
// }));
// //theme icon
// vi.mock('../../assets/theme.svg?react', () => ({
//   default: () => <div data-testid="theme-icon" />,
// }));

describe('Settings Component', () => {
  it('should render settings button', () => {
    render(<Settings />);

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
  });

  it('should toggle dropdown when button is clicked', async () => {
    const user = userEvent.setup();
    render(<Settings />);

    const settingsButton = screen.getByText('Settings');
    const dropdown = screen.getByTestId('font-component').parentElement;

    // should be closed by default
    expect(dropdown).not.toHaveClass('open');

    // click to open
    await user.click(settingsButton);
    expect(dropdown).toHaveClass('open');

    // click to close
    await user.click(settingsButton);
    expect(dropdown).not.toHaveClass('open');
  });

  it('should show correct title attribute based on state', async () => {
    const user = userEvent.setup();
    render(<Settings />);

    const settingsButton = screen.getByText('Settings');

    // should be "open settings" by default
    expect(settingsButton).toHaveAttribute('title', 'open settings');

    // after clicking, should show "close settings"
    await user.click(settingsButton);
    expect(settingsButton).toHaveAttribute('title', 'close settings');
  });

  it('should render Font and Theme components when open', async () => {
    const user = userEvent.setup();
    render(<Settings />);

    // Open the dropdown
    const settingsButton = screen.getByText('Settings');
    await user.click(settingsButton);

    // Both components should be visible
    expect(screen.getByTestId('font-component')).toBeInTheDocument();
    expect(screen.getByTestId('theme-component')).toBeInTheDocument();

    // icons should be visible also
    // expect(screen.getByTestId('font-icon')).toBeInTheDocument();
    // expect(screen.getByTestId('theme-icon')).toBeInTheDocument();
  });

  // it('should have proper CSS classes', () => {
  //   render(<Settings />);

  //   const container = screen
  //     .getByText('Settings')
  //     .closest('.settings__container');
  //   const dropdownWrapper = screen
  //     .getByText('Settings')
  //     .closest('.settings__dropdown-wrapper');
  //   const button = screen.getByText('Settings');

  //   expect(container).toHaveClass('settings__container');
  //   expect(dropdownWrapper).toHaveClass('settings__dropdown-wrapper');
  //   expect(button).toHaveClass('settings__button');
  // });
});
