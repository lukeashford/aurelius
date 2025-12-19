import React from 'react';
import {render, screen} from '@testing-library/react';
import BadgesSection from '../sections/BadgesSection';

describe('BadgesSection', () => {
  it('renders the section header', () => {
    render(<BadgesSection/>);
    expect(screen.getByRole('heading', {name: /Badges/i, level: 2})).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const {container} = render(<BadgesSection/>);
    expect(container).toMatchSnapshot();
  });
});
