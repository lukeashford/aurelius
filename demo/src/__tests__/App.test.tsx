import React from 'react';
import {render, screen} from '@testing-library/react';
import App from '../App';

describe('App', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  it('renders the main heading', () => {
    render(<App/>);
    expect(screen.getByRole('heading', {name: /Aurelius Design/i, level: 1})).toBeInTheDocument();
  });

  it('renders navigation sidebar with all sections', () => {
    render(<App/>);

    const navItems = [
      'Overview',
      "Director's Note",
      'Colors',
      'Typography',
      'Buttons',
      'Badges',
      'Inputs',
      'Forms',
      'Cards',
      'Avatar',
      'Feedback',
      'Tooltip',
      'Overlays',
    ];

    navItems.forEach(item => {
      expect(screen.getByRole('link', {name: item})).toBeInTheDocument();
    });
  });

  it('renders all section components', () => {
    render(<App/>);

    // Check that all section IDs are present
    expect(document.getElementById('overview')).toBeInTheDocument();
    expect(document.getElementById('director-note')).toBeInTheDocument();
    expect(document.getElementById('colors')).toBeInTheDocument();
    expect(document.getElementById('typography')).toBeInTheDocument();
    expect(document.getElementById('buttons')).toBeInTheDocument();
    expect(document.getElementById('badges')).toBeInTheDocument();
    expect(document.getElementById('inputs')).toBeInTheDocument();
    expect(document.getElementById('forms')).toBeInTheDocument();
    expect(document.getElementById('cards')).toBeInTheDocument();
    expect(document.getElementById('avatar')).toBeInTheDocument();
    expect(document.getElementById('feedback')).toBeInTheDocument();
    expect(document.getElementById('tooltip')).toBeInTheDocument();
    expect(document.getElementById('modal')).toBeInTheDocument();
  });

  it('displays main view by default', () => {
    render(<App/>);
    expect(screen.getByText(/A cohesive visual language/i)).toBeInTheDocument();
  });

  it('switches to legal view when hash is #legal', () => {
    window.location.hash = '#legal';
    render(<App/>);

    // Check that the main view content is not present
    expect(screen.queryByText(/A cohesive visual language/i)).not.toBeInTheDocument();
    // Check for Impressum heading
    expect(screen.getByRole('heading', {name: /Impressum/i})).toBeInTheDocument();
  });

  it('renders expected number of sections', () => {
    const {container} = render(<App/>);
    const sections = container.querySelectorAll('.section-header');

    // Should have all the main sections rendered
    expect(sections.length).toBeGreaterThanOrEqual(12);
  });

  it('renders GitHub link in sidebar', () => {
    render(<App/>);
    const githubLink = screen.getByRole('link', {name: /View Source on GitHub/i});

    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/lukeashford/aurelius');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('applies correct background and text colors', () => {
    const {container} = render(<App/>);
    const mainDiv = container.firstChild as HTMLElement;

    expect(mainDiv).toHaveClass('bg-obsidian');
    expect(mainDiv).toHaveClass('text-white');
  });

  it('has sidebar with correct styling classes', () => {
    const {container} = render(<App/>);
    const sidebar = container.querySelector('aside');

    expect(sidebar).toBeInTheDocument();
    expect(sidebar).toHaveClass('fixed');
    expect(sidebar).toHaveClass('left-0');
    expect(sidebar).toHaveClass('top-0');
  });

  it('navigation links have correct href attributes', () => {
    render(<App/>);

    const overviewLink = screen.getByRole('link', {name: 'Overview'});
    expect(overviewLink).toHaveAttribute('href', '#overview');

    const colorsLink = screen.getByRole('link', {name: 'Colors'});
    expect(colorsLink).toHaveAttribute('href', '#colors');
  });
});
