import React from 'react';
import {render, screen} from '@testing-library/react';
import FeedbackSection from '../sections/FeedbackSection';

describe('FeedbackSection', () => {
  it('renders the section header', () => {
    render(<FeedbackSection/>);
    expect(screen.getByRole('heading', {name: /Feedback/i, level: 2})).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const {container} = render(<FeedbackSection/>);
    expect(container).toMatchSnapshot();
  });
});
