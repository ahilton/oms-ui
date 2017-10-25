import React, {Component} from 'react';

import { Colors, Icon } from "@blueprintjs/core";
import {Box, Flex} from "reflexbox";
import StockCard from "./StockCard";

export default class StockCardButton extends Component {

    render() {
        const {handleEvent, className, buttons, lastEvent} = this.props
        const buttonComponents = buttons.map((b)=>(
            <Box key={'button-'+b.value} w={1/buttons.length} p={1} className={b.class} onClick={()=>handleEvent(b.value, lastEvent)}>
                {b.value}
            </Box>
        ))
        return (
            <div>
                <Flex wrap align='center' w={1} p={0} className={className} style={{
                    textAlign:'center',
                    fontSize: 40,
                    fontVariant: 'small-caps'
                }}>
                    {buttonComponents}
                </Flex>
            </div>
        )
    }
}