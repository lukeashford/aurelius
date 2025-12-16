import React from 'react';
import {render, screen} from '@testing-library/react';
import IconButtonSection from '../sections/IconButtonSection';

describe('IconButtonSection', () => {
  it('renders the section header', () => {
    render(<IconButtonSection/>);
    expect(screen.getByRole('heading', {name: /Icon Buttons/i, level: 2})).toBeInTheDocument();
  });

  it('renders icon buttons', () => {
    render(<IconButtonSection/>);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('renders variant labels', () => {
    render(<IconButtonSection/>);
    expect(screen.getByText('primary')).toBeInTheDocument();
    expect(screen.getByText('danger')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const {container} = render(<IconButtonSection/>);
    expect(container).toMatchSnapshot();
  });
});
