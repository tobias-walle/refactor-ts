import React from 'react';
import Message from './Message';
import { messageStyles } from './Message.styles';

describe('Message', () => {
  it('should render component', () => {
    expect(
      Message({ children: 'Test' })
    ).toEqual(
      <div style={messageStyles}>Test</div>
    )
  });
});
