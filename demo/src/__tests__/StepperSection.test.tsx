import React from 'react';
import {render, screen} from '@testing-library/react';
import StepperSection from '../sections/StepperSection';

describe('StepperSection', () => {
  it('renders the section header', () => {
    render(<StepperSection/>);
    expect(screen.getByRole('heading', {name: /Stepper/i, level: 2})).toBeInTheDocument();
  });

  it('renders interactive example heading', () => {
    render(<StepperSection/>);
    expect(screen.getByRole('heading', {name: /Interactive Example/i, level: 3}))
    .toBeInTheDocument();
  });

  it('renders control buttons', () => {
    render(<StepperSection/>);
    expect(screen.getByRole('button', {name: /Previous/i})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /Next/i})).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const {container} = render(<StepperSection/>);
    expect(container).toMatchSnapshot();
  });
});
