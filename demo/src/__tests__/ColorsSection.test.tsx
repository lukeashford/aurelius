import React from 'react';
import {render, screen} from '@testing-library/react';
import ColorsSection from '../sections/ColorsSection';

describe('ColorsSection', () => {
  it('renders the section header', () => {
    render(<ColorsSection/>);
    expect(screen.getByRole('heading', {name: /Colors/i, level: 2})).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const {container} = render(<ColorsSection/>);
    expect(container).toMatchSnapshot();
  });
});
