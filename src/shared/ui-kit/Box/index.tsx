import React from 'react';
import MuiBox, { BoxProps as MuiBoxProps} from '@material-ui/core/Box';

export interface BoxProps extends MuiBoxProps {};

const Box: React.FC<BoxProps> = (props: BoxProps) => <MuiBox {...props} />;

export default Box;
