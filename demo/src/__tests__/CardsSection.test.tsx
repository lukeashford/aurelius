import React from 'react';
import {render, screen} from '@testing-library/react';
import CardsSection from '../sections/CardsSection';

describe('CardsSection', () => {
  it('renders the section header', () => {
    render(<CardsSection/>);
    expect(screen.getByRole('heading', {name: /Cards/i, level: 2})).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const {container} = render(<CardsSection/>);
    expect(container).toMatchSnapshot();
  });
});
