import React from 'react';
import {render, screen} from '@testing-library/react';
import ImageCardSection from '../sections/ImageCardSection';

describe('ImageCardSection', () => {
  it('renders the section header', () => {
    render(<ImageCardSection/>);
    expect(screen.getByRole('heading', {name: /Image Cards/i, level: 2})).toBeInTheDocument();
  });

  it('renders aspect ratios heading', () => {
    render(<ImageCardSection/>);
    expect(screen.getByRole('heading', {name: /Aspect Ratios/i, level: 3})).toBeInTheDocument();
  });

  it('renders with overlay heading', () => {
    render(<ImageCardSection/>);
    expect(screen.getByRole('heading', {name: /With Overlay/i, level: 3})).toBeInTheDocument();
  });

  it('renders images', () => {
    render(<ImageCardSection/>);
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('matches snapshot', () => {
    const {container} = render(<ImageCardSection/>);
    expect(container).toMatchSnapshot();
  });
});
