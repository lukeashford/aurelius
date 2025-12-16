import React from 'react';
import {render, screen} from '@testing-library/react';
import MarkdownContentSection from '../sections/MarkdownContentSection';

describe('MarkdownContentSection', () => {
  it('renders the section header', () => {
    render(<MarkdownContentSection/>);
    expect(screen.getByRole('heading', {name: /Markdown Content/i, level: 2})).toBeInTheDocument();
  });

  it('renders example content heading', () => {
    render(<MarkdownContentSection/>);
    expect(screen.getByRole('heading', {name: /Example Content/i, level: 3})).toBeInTheDocument();
  });

  it('renders nested content heading', () => {
    render(<MarkdownContentSection/>);
    expect(screen.getByRole('heading', {name: /Nested Content/i, level: 3})).toBeInTheDocument();
  });

  it('renders markdown headings', () => {
    render(<MarkdownContentSection/>);
    expect(screen.getByRole('heading', {name: /Main Heading/i, level: 1})).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: /Secondary Heading/i, level: 2})).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const {container} = render(<MarkdownContentSection/>);
    expect(container).toMatchSnapshot();
  });
});
