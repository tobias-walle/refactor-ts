import React from 'react';
import { displayStyles } from './Display.styles';

export interface DisplayProps {
  children: React.ReactNode;
}

function Display(props: DisplayProps) {
  return <div style={displayStyles}>{props.children}</div>
}

export default Display;
