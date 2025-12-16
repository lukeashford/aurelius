import React from 'react';
import {render, screen} from '@testing-library/react';
import BrandIconSection from '../sections/BrandIconSection';

describe('BrandIconSection', () => {
  it('renders the section header', () => {
    render(<BrandIconSection/>);
    expect(screen.getByRole('heading', {name: /Brand Icons/i, level: 2})).toBeInTheDocument();
  });

  it('renders variant labels', () => {
    render(<BrandIconSection/>);
    expect(screen.getByText('solid')).toBeInTheDocument();
    expect(screen.getByText('outline')).toBeInTheDocument();
  });

  it('renders examples heading', () => {
    render(<BrandIconSection/>);
    expect(screen.getByRole('heading', {name: /Examples/i, level: 3})).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const {container} = render(<BrandIconSection/>);
    expect(container).toMatchSnapshot();
  });
});
