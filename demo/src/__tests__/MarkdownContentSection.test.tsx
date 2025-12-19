import React from 'react';
import {render} from '@testing-library/react';
import MarkdownContentSection from '../sections/MarkdownContentSection';

describe('MarkdownContentSection', () => {
  it('matches snapshot', () => {
    const {container} = render(<MarkdownContentSection/>);
    expect(container).toMatchSnapshot();
  });
});
