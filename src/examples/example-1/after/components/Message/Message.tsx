import React from 'react';
import { messageStyles } from './Message.styles';

export interface MessageProps {
  children: React.ReactNode;
}

function Message(props: MessageProps) {
  return <div style={messageStyles}>{props.children}</div>
}

export default Message;
