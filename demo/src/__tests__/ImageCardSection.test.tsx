import React from 'react';
import {render} from '@testing-library/react';
import ImageCardSection from '../sections/ImageCardSection';

describe('ImageCardSection', () => {
  it('matches snapshot', () => {
    const {container} = render(<ImageCardSection/>);
    expect(container).toMatchSnapshot();
  });
});
