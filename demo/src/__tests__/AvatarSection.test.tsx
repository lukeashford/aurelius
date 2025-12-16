import React from 'react';
import {render, screen} from '@testing-library/react';
import AvatarSection from '../sections/AvatarSection';

describe('AvatarSection', () => {
  it('renders the section header', () => {
    render(<AvatarSection/>);
    expect(screen.getByRole('heading', {name: /Avatar/i, level: 2})).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const {container} = render(<AvatarSection/>);
    expect(container).toMatchSnapshot();
  });
});
