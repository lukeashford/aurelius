import React from 'react';
import {render} from '@testing-library/react';
import FileChipSection from '../sections/FileChipSection';

describe('FileChipSection', () => {
  it('matches snapshot', () => {
    const {container} = render(<FileChipSection/>);
    expect(container).toMatchSnapshot();
  });
});
