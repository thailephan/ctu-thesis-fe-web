import React from 'react';
import {Box, Tip as GrommetTip, DropProps, Button} from "grommet";
import { PadType, BackgroundType, MarginType, RoundType, ElevationType } from 'grommet/utils';

interface IProps {
   children: React.ReactNode;
   title: string;
   dropProps?: DropProps;
   contentProps?: {
       background?: BackgroundType;
       pad?: PadType;
       margin?: MarginType;
       round?: RoundType;
       elevation?: ElevationType;
   };
}

function Tip(props: IProps) {
    const {title, children, dropProps, contentProps} = props;
    const defaultDropProps: DropProps = { align: {left: "right"} };
    return (
       <GrommetTip plain content={
               <Box background="dark-1" pad="small" round="small" margin="xsmall" {...contentProps}>
                   {title}
               </Box>
           } dropProps={dropProps || defaultDropProps}>
           {children}
       </GrommetTip>
    );
}

export default Tip;