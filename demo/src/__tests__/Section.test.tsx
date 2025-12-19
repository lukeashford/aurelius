import React from 'react';
import {render, screen} from '@testing-library/react';
import Section from '../sections/Section';

describe('Section', () => {
  it('renders title, subtitle, and children', () => {
    render(
        <Section title="Test Title" subtitle="Test Subtitle">
          <div>Child content</div>
        </Section>,
    );

    expect(screen.getByRole('heading', {name: /test title/i, level: 2})).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const {container} = render(
        <Section title="Snapshot Title" subtitle="Snapshot Subtitle">
          <div>Snapshot child</div>
        </Section>,
    );

    expect(container).toMatchSnapshot();
  });
});