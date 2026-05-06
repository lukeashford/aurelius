import React from 'react';
import {render, screen} from '@testing-library/react';
import InputsSection from '../sections/InputsSection';

describe('InputsSection', () => {
  it('renders the section header', () => {
    render(<InputsSection/>);
    expect(screen.getByRole('heading', {name: /Inputs/i, level: 2})).toBeInTheDocument();
  });

  it('renders input examples', () => {
    const {container} = render(<InputsSection/>);
    const inputs = container.querySelectorAll('input');
    // 4 plain Input (Default, With Icons, Invalid, Disabled)
    // + 3 ChatInput (Info, Warning, Error) — each contributes a hidden <input>
    expect(inputs.length).toBe(7);
  });

  it('matches snapshot', () => {
    const {container} = render(<InputsSection/>);
    expect(container).toMatchSnapshot();
  });
});
