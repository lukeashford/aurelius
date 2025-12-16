import React from 'react';
import {render, screen} from '@testing-library/react';
import TooltipSection from '../sections/TooltipSection';

describe('TooltipSection', () => {
  it('renders the section header', () => {
    render(<TooltipSection/>);
    expect(screen.getByRole('heading', {name: /Tooltip/i, level: 2})).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const {container} = render(<TooltipSection/>);
    expect(container).toMatchSnapshot();
  });
});
