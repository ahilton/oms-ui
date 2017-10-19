import React, {Component} from 'react';

import { Colors, Icon } from "@blueprintjs/core";
import {Box, Flex} from "reflexbox";

export default class StockCard extends Component {

    render() {
        var {stockDetails, order, colorFg, content, containerStyle} = this.props
        if (!containerStyle){
            containerStyle = {
                width:400
            }
        }
        const contentComponent = content?
            <Box w={1} p={40} style={{textAlign:'center'}}>
                {content}
            </Box>:
            <Box w={1} p={40} style={{textAlign:'center'}}>
                <div style={{textAlign:'left', display:'inline-block', fontSize:40, marginRight:20}}>
                    {order && order.completed && <Icon className="pt-intent-success" iconName="tick-circle" iconSize="inherit"/>}
                </div>

                <div style={{textAlign:'left', display:'inline-block'}}>
                    <div style={{
                        fontSize:40,
                        fontVariant: 'small-caps',
                        color:colorFg
                    }}>{order && order.direction && order.direction.toLowerCase()}</div>
                    <div style={{
                        fontSize:70,
                    }}>

                        {order && order.qty && order.qty.toLocaleString()}</div>
                </div>
            </Box>

        return (
            <div className="pt-card pt-elevation-4" style={containerStyle}>
                <Flex wrap align='left' w={1} p={0}>
                    <Box  w={1/3} p={1}>
                        {stockDetails.logo && <img src={stockDetails.logo.url} width={stockDetails.logo.width}/>}
                    </Box>
                    <Box justify='end' w={2/3} p={0} style={{textAlign:'right'}}>
                        <div className="" style={{
                            fontSize:50,
                            fontFamily:'Arial Black'
                        }}>
                            {stockDetails.code}
                        </div>
                        <div className="" style={{
                        }}>
                            {stockDetails.name}
                        </div>
                    </Box>

                    {contentComponent}
                </Flex>

            </div>
        )
    }
}