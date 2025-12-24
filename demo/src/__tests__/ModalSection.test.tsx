import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import ModalSection from '../sections/ModalSection';

describe('ModalSection', () => {
  it('renders the section header', () => {
    render(<ModalSection/>);
    expect(screen.getByRole('heading', {name: /Overlays/i})).toBeInTheDocument();
    expect(screen.getByText(/Components that overlay the main content/i)).toBeInTheDocument();
  });

  it('renders the Open Modal button', () => {
    render(<ModalSection/>);
    expect(screen.getByRole('button', {name: /Open Modal/i})).toBeInTheDocument();
  });

  it('modal is closed by default', () => {
    render(<ModalSection/>);
    // Modal title should not be visible initially
    expect(screen.queryByText('Example Modal')).not.toBeInTheDocument();
  });

  it('opens modal when button is clicked', () => {
    render(<ModalSection/>);

    const openButton = screen.getByRole('button', {name: /Open Modal/i});
    fireEvent.click(openButton);

    // Modal should now be visible
    expect(screen.getByText('Example Modal')).toBeInTheDocument();
    expect(screen.getByText(/This modal overlays the page content/i)).toBeInTheDocument();
  });

  it('closes modal when Cancel button is clicked', () => {
    render(<ModalSection/>);

    // Open modal
    const openButton = screen.getByRole('button', {name: /Open Modal/i});
    fireEvent.click(openButton);
    expect(screen.getByText('Example Modal')).toBeInTheDocument();

    // Close modal
    const cancelButton = screen.getByRole('button', {name: /Cancel/i});
    fireEvent.click(cancelButton);

    // Modal should be closed
    expect(screen.queryByText('Example Modal')).not.toBeInTheDocument();
  });

  it('closes modal when Confirm button is clicked', () => {
    render(<ModalSection/>);

    // Open modal
    const openButton = screen.getByRole('button', {name: /Open Modal/i});
    fireEvent.click(openButton);
    expect(screen.getByText('Example Modal')).toBeInTheDocument();

    // Close modal - use getAllByRole since there are multiple Confirm buttons
    const confirmButtons = screen.getAllByRole('button', {name: /^Confirm$/i});
    // The modal's Confirm button is rendered in the dialog
    const modalConfirmButton = confirmButtons.find(btn =>
      btn.closest('[role="dialog"]')
    );
    fireEvent.click(modalConfirmButton!);

    // Modal should be closed
    expect(screen.queryByText('Example Modal')).not.toBeInTheDocument();
  });

  it('renders modal with correct action buttons', () => {
    render(<ModalSection/>);

    // Open modal
    const openButton = screen.getByRole('button', {name: /Open Modal/i});
    fireEvent.click(openButton);

    // Check for action buttons inside the modal
    expect(screen.getByRole('button', {name: /Cancel/i})).toBeInTheDocument();
    // Use getAllByRole since there are multiple Confirm buttons
    const confirmButtons = screen.getAllByRole('button', {name: /^Confirm$/i});
    expect(confirmButtons.length).toBeGreaterThan(0);
  });

  it('renders drawer buttons', () => {
    render(<ModalSection/>);
    expect(screen.getByRole('button', {name: /Open Left/i})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /Open Right/i})).toBeInTheDocument();
  });

  it('renders dialog variant buttons', () => {
    render(<ModalSection/>);
    // These are the buttons to trigger the dialog variants
    const buttons = screen.getAllByRole('button');
    const buttonNames = buttons.map(b => b.textContent);
    expect(buttonNames).toContain('Confirm');
    expect(buttonNames).toContain('Alert');
    expect(buttonNames).toContain('Prompt');
  });

  it('matches snapshot when modal is closed', () => {
    const {container} = render(<ModalSection/>);
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot when modal is open', () => {
    const {container} = render(<ModalSection/>);

    const openButton = screen.getByRole('button', {name: /Open Modal/i});
    fireEvent.click(openButton);

    expect(container).toMatchSnapshot();
  });
});
