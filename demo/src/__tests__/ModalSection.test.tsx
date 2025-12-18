import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import ModalSection from '../sections/ModalSection';

describe('ModalSection', () => {
  it('renders the section header', () => {
    render(<ModalSection/>);
    expect(screen.getByRole('heading', {name: /Modals/i})).toBeInTheDocument();
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
    expect(screen.getByText(/This is an example of the modal component/i)).toBeInTheDocument();
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

    // Close modal
    const confirmButton = screen.getByRole('button', {name: /Confirm/i});
    fireEvent.click(confirmButton);

    // Modal should be closed
    expect(screen.queryByText('Example Modal')).not.toBeInTheDocument();
  });

  it('renders modal with correct action buttons', () => {
    render(<ModalSection/>);

    // Open modal
    const openButton = screen.getByRole('button', {name: /Open Modal/i});
    fireEvent.click(openButton);

    // Check for action buttons
    expect(screen.getByRole('button', {name: /Cancel/i})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /Confirm/i})).toBeInTheDocument();
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
