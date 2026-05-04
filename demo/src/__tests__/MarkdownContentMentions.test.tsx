import React from 'react';
import {render, screen} from '@testing-library/react';
import {MarkdownContent} from '@lukeashford/aurelius';

describe('MarkdownContent mention rendering', () => {
  const renderer = (name: string) =>
      <span data-testid={`mention-${name}`}>{name}</span>;

  it('renders mentions in plain prose', () => {
    render(
        <MarkdownContent content="Look at @hero in this scene"
                         mentionRenderer={renderer}/>
    );
    expect(screen.getByTestId('mention-hero')).toBeInTheDocument();
  });

  it('preserves surrounding bold formatting around a mention', () => {
    const {container} = render(
        <MarkdownContent content="Edit **@hero now** before shipping"
                         mentionRenderer={renderer}/>
    );
    const chip = screen.getByTestId('mention-hero');
    expect(chip).toBeInTheDocument();
    // The chip lives inside a <strong>, proving the chip didn't break the
    // surrounding markdown.
    expect(chip.closest('strong')).not.toBeNull();
    // No literal asterisks leaked through.
    expect(container.textContent).not.toMatch(/\*\*/);
  });

  it('does not render mentions inside inline code spans', () => {
    render(
        <MarkdownContent content="Use `@literal` in code, not @real"
                         mentionRenderer={renderer}/>
    );
    expect(screen.queryByTestId('mention-literal')).toBeNull();
    expect(screen.getByTestId('mention-real')).toBeInTheDocument();
  });

  it('does not render mentions inside fenced code blocks', () => {
    const fenced = '```\n@inside_code\n```\n\nBut @outside is rendered.';
    render(<MarkdownContent content={fenced} mentionRenderer={renderer}/>);
    expect(screen.queryByTestId('mention-inside_code')).toBeNull();
    expect(screen.getByTestId('mention-outside')).toBeInTheDocument();
  });

  it('does not match emails (foo@bar pattern)', () => {
    render(
        <MarkdownContent content="Email me at user@example so I can review @hero"
                         mentionRenderer={renderer}/>
    );
    // No 'example' mention — the @ was preceded by a word char.
    expect(screen.queryByTestId('mention-example')).toBeNull();
    expect(screen.getByTestId('mention-hero')).toBeInTheDocument();
  });

  it('renders mentions inside list items', () => {
    const list = '1. First @hero_pose\n2. Then @villain_pose';
    render(<MarkdownContent content={list} mentionRenderer={renderer}/>);
    const heroChip = screen.getByTestId('mention-hero_pose');
    const villainChip = screen.getByTestId('mention-villain_pose');
    expect(heroChip.closest('li')).not.toBeNull();
    expect(villainChip.closest('li')).not.toBeNull();
    // Both items belong to the same ordered list.
    expect(heroChip.closest('ol')).toBe(villainChip.closest('ol'));
  });

  it('leaves mentions as literal text when no renderer is provided', () => {
    const {container} = render(
        <MarkdownContent content="See @hero for details"/>
    );
    expect(container.textContent).toContain('@hero');
  });

  it('hardens external links with target=_blank rel=noopener', () => {
    render(<MarkdownContent content="See [link](https://example.com)"/>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders plain text verbatim when isMarkdown is false', () => {
    const {container} = render(
        <MarkdownContent isMarkdown={false} content="**not bold** and @no_chip"/>
    );
    expect(container.textContent).toContain('**not bold**');
    expect(container.textContent).toContain('@no_chip');
  });
});
