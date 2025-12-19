import React from 'react';
import {render, screen} from '@testing-library/react';
import TypographySection from '../sections/TypographySection';

describe('TypographySection', () => {
  it('renders the section header', () => {
    render(<TypographySection/>);
    expect(screen.getByRole('heading', {name: /Typography/i, level: 2})).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const {container} = render(<TypographySection/>);
    expect(container).toMatchSnapshot();
  });
});
