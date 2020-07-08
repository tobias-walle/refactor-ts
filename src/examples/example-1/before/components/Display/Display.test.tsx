import React from 'react';
import Display from './Display';
import { displayStyles } from './Display.styles';

describe('Display', () => {
  it('should render component', () => {
    expect(
      Display({ children: 'Test' })
    ).toEqual(
      <div style={displayStyles}>Test</div>
    )
  });
});
