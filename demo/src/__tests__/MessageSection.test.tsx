import React from 'react';
import {render, screen} from '@testing-library/react';
import MessageSection from '../sections/MessageSection';

describe('MessageSection', () => {
  it('renders the section header', () => {
    render(<MessageSection/>);
    expect(screen.getByRole('heading', {name: /Messages/i, level: 2})).toBeInTheDocument();
  });

  it('renders variants heading', () => {
    render(<MessageSection/>);
    expect(screen.getByRole('heading', {name: /Variants/i, level: 3})).toBeInTheDocument();
  });

  it('renders conversation example heading', () => {
    render(<MessageSection/>);
    expect(screen.getByRole('heading', {name: /Conversation Example/i, level: 3}))
    .toBeInTheDocument();
  });

  it('renders variant labels', () => {
    render(<MessageSection/>);
    expect(screen.getByText('user')).toBeInTheDocument();
    expect(screen.getByText('assistant')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const {container} = render(<MessageSection/>);
    expect(container).toMatchSnapshot();
  });
});
