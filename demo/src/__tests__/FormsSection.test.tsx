import React from 'react';
import { render, screen } from '@testing-library/react';
import FormsSection from '../sections/FormsSection';

describe('FormsSection', () => {
  it('renders the section header', () => {
    render(<FormsSection />);
    expect(screen.getByRole('heading', { name: /Form Elements/i })).toBeInTheDocument();
    expect(screen.getByText(/Standard form components with consistent styling/i)).toBeInTheDocument();
  });

  it('renders Select component section', () => {
    render(<FormsSection />);
    expect(screen.getByText('Select')).toBeInTheDocument();
    expect(screen.getByText('Standard Select')).toBeInTheDocument();
    expect(screen.getByText('Select an option from the list.')).toBeInTheDocument();
  });

  it('renders Textarea component section', () => {
    render(<FormsSection />);
    expect(screen.getByText('Textarea')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter a description...')).toBeInTheDocument();
  });

  it('renders Toggles section with all toggle types', () => {
    render(<FormsSection />);
    expect(screen.getByText('Toggles')).toBeInTheDocument();
  });

  it('renders Checkbox components', () => {
    render(<FormsSection />);
    expect(screen.getByText('Accept terms and conditions')).toBeInTheDocument();
    expect(screen.getByText('Subscribe to newsletter')).toBeInTheDocument();
  });

  it('renders Radio components', () => {
    render(<FormsSection />);
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('Enterprise')).toBeInTheDocument();
  });

  it('renders Switch components', () => {
    render(<FormsSection />);
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Dark Mode')).toBeInTheDocument();
  });

  it('shows error states for form elements', () => {
    render(<FormsSection />);
    expect(screen.getByText('This field is required.')).toBeInTheDocument();
    expect(screen.getByText('Please provide more details.')).toBeInTheDocument();
  });

  it('renders disabled form elements', () => {
    render(<FormsSection />);
    const disabledElements = screen.getAllByText('Disabled');
    // Should have at least some disabled elements
    expect(disabledElements.length).toBeGreaterThanOrEqual(2);
  });

  it('renders error state select', () => {
    render(<FormsSection />);
    const errorStates = screen.getAllByText('Error State');
    expect(errorStates.length).toBeGreaterThan(0);
  });

  it('renders select with options', () => {
    const { container } = render(<FormsSection />);
    const selects = container.querySelectorAll('select');
    expect(selects.length).toBeGreaterThan(0);
  });

  it('matches snapshot', () => {
    const { container } = render(<FormsSection />);
    expect(container).toMatchSnapshot();
  });
});
