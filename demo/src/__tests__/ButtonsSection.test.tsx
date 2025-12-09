import React from 'react';
import { render, screen } from '@testing-library/react';
import ButtonsSection from '../sections/ButtonsSection';

describe('ButtonsSection', () => {
  it('renders the section header', () => {
    render(<ButtonsSection />);
    expect(screen.getByRole('heading', { name: /Buttons/i, level: 2 })).toBeInTheDocument();
  });

  it('renders primary button', () => {
    render(<ButtonsSection />);
    const buttons = screen.getAllByRole('button', { name: /primary/i });
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('renders featured button', () => {
    render(<ButtonsSection />);
    const buttons = screen.getAllByRole('button', { name: /featured/i });
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('renders ghost button', () => {
    render(<ButtonsSection />);
    const buttons = screen.getAllByRole('button', { name: /ghost/i });
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('renders danger button', () => {
    render(<ButtonsSection />);
    const buttons = screen.getAllByRole('button', { name: /danger/i });
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('matches snapshot', () => {
    const { container } = render(<ButtonsSection />);
    expect(container).toMatchSnapshot();
  });
});
