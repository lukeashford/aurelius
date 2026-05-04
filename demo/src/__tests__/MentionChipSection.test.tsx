import React from 'react';
import {render} from '@testing-library/react';
import MentionChipSection from '../sections/MentionChipSection';

describe('MentionChipSection', () => {
  it('matches snapshot', () => {
    const {container} = render(<MentionChipSection/>);
    expect(container).toMatchSnapshot();
  });
});
