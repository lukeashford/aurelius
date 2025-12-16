import React from 'react';
import {render, screen} from '@testing-library/react';
import StreamingCursorSection from '../sections/StreamingCursorSection';

describe('StreamingCursorSection', () => {
  it('renders the section header', () => {
    render(<StreamingCursorSection/>);
    expect(screen.getByRole('heading', {name: /Streaming Cursor/i, level: 2})).toBeInTheDocument();
  });

  it('renders basic usage heading', () => {
    render(<StreamingCursorSection/>);
    expect(screen.getByRole('heading', {name: /Basic Usage/i, level: 3})).toBeInTheDocument();
  });

  it('renders interactive demo heading', () => {
    render(<StreamingCursorSection/>);
    expect(screen.getByRole('heading', {name: /Interactive Demo/i, level: 3})).toBeInTheDocument();
  });

  it('renders start streaming button', () => {
    render(<StreamingCursorSection/>);
    expect(screen.getByRole('button', {name: /Start Streaming/i})).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const {container} = render(<StreamingCursorSection/>);
    expect(container).toMatchSnapshot();
  });
});
