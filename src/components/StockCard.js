import React, {Component} from 'react';

import { Colors, Icon } from "@blueprintjs/core";
import {Box, Flex} from "reflexbox";

export default class StockCard extends Component {

    render() {
        var {stockDetails, order, colorFg, content, footer, containerStyle, handleClick, interactive, selected} = this.props
        if (!containerStyle){
            containerStyle = {
                width:400
            }
        }
        let cardClassName = interactive?'pt-elevation-1 pt-interactive':'pt-elevation-4'
        if (selected){
            cardClassName += ' selected-stock'
        }
        const cardProps = handleClick?{onClick:handleClick}:{}
        const contentComponent = content?
            <Box w={1} style={{textAlign:'center', paddingTop:40, paddingBottom:40}}>
                {content}
            </Box>:
            <Box w={1} style={{textAlign:'center', paddingTop:40, paddingBottom:40}}>
                <div>
                    {order && order.direction &&
                        <div style={{
                            fontSize: 40,
                            fontVariant: 'small-caps',
                            backgroundColor: colorFg,
                            color: 'white',
                            padding: 5,
                            paddingBottom: 10,
                            width: 200,
                            borderRadius: 35,
                            margin: '0 auto 0 auto',
                            marginBottom: '10'
                        }}>
                            {order.direction.toLowerCase()}
                        </div>
                    }
                    <div style={{
                        fontSize:60,
                    }}>
                        {order && order.qty && order.qty.toLocaleString()}</div>
                    {order && order.price && <div style={{fontSize:30, fontWeight:200}}><div style={{color:Colors.GRAY4, marginTop:-5, marginBottom:0}}>@</div><div style={{
                        fontSize:50,

                    }}>{'$'+order.price}</div></div>}
                </div>
            </Box>

        return (
            <div>
            <div className={'pt-card '+ cardClassName} style={containerStyle} {...cardProps}>
                <Flex wrap align='left' w={1} p={0}>
                    <Box  w={1/3} p={1}>
                        <div style={{textAlign:'center', position:'absolute', display:'inline-block', fontSize:40, marginRight:20}}>
                            {(order && order.completed)?
                                (<Icon className="pt-intent-success" iconName="tick-circle" iconSize="inherit"/>)
                            :
                                (stockDetails.logo && <img src={stockDetails.logo.url} width={stockDetails.logo.width}/>)
                            }
                        </div>
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
                {footer && <div style={{
                    marginTop:0
                }}>{footer}</div>}
            </div>
        )
    }
}