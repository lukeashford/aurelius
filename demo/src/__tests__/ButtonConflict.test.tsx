import React from 'react';
import {render} from '@testing-library/react';
import {Button} from '@lukeashford/aurelius';

describe('Button Class Merging', () => {
  it('allows overriding default text color with custom className', () => {
    // variant="outlined" has "text-white"
    // we pass "text-ash" in className
    const {getByRole} = render(
        <Button variant="outlined" className="text-ash">
          Test Button
        </Button>
    );

    const button = getByRole('button');
    // In a real DOM with Tailwind, text-white and text-ash would both be there IF simple
    // concatenation was used. With twMerge, text-white should be removed.

    const classes = button.className.split(' ');
    expect(classes).toContain('text-ash');
    expect(classes).not.toContain('text-white');
  });

  it('keeps non-conflicting classes', () => {
    const {getByRole} = render(
        <Button variant="outlined" className="custom-extra-class">
          Test Button
        </Button>
    );

    const button = getByRole('button');
    const classes = button.className.split(' ');
    expect(classes).toContain('text-white'); // default from outlined
    expect(classes).toContain('custom-extra-class'); // custom
    expect(classes).toContain('border-ash'); // default from outlined
  });
});
