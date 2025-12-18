import React from 'react';
import {render, screen} from '@testing-library/react';
import StreamingCursorSection from '../sections/StreamingCursorSection';

describe('StreamingCursorSection', () => {
  it('renders the section header', () => {
    render(<StreamingCursorSection/>);
    expect(screen.getByRole('heading', {name: /Streaming Cursor/i, level: 2})).toBeInTheDocument();
  });

  it('renders the section subtitle', () => {
    render(<StreamingCursorSection/>);
    expect(screen.getByText(/Animated cursor for streaming text and real-time content./i))
    .toBeInTheDocument();
  });

  it('shows the current variant label', () => {
    render(<StreamingCursorSection/>);
    expect(screen.getByText(/variant="line"/i)).toBeInTheDocument();
  });

  it('renders the streaming cursor element', () => {
    const {container} = render(<StreamingCursorSection/>);
    expect(container.querySelector('.animate-cursor-blink')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const {container} = render(<StreamingCursorSection/>);
    expect(container).toMatchSnapshot();
  });
});
