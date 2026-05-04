import React from 'react';
import {render} from '@testing-library/react';
import ComboboxSection from '../sections/ComboboxSection';

describe('ComboboxSection', () => {
  it('matches snapshot', () => {
    const {container} = render(<ComboboxSection/>);
    expect(container).toMatchSnapshot();
  });
});
