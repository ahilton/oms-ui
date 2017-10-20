import React, {Component} from 'react';

import { Colors, Icon } from "@blueprintjs/core";
import {Box, Flex} from "reflexbox";
import StockCard from "./StockCard";

export default class StockSelection extends Component {

    render() {
        const {lastEvent, pushEvents, handleStockSelect} = this.props
        const stockComponent = Object.keys(this.props.stockDetails).map(
            (key) => {
                var cardProps = {
                    stockDetails:this.props.stockDetails[key],
                    containerStyle:{
                        width:350,
                        height:250,
                        marginRight:20,
                        marginLeft:20
                    },
                    order:{},
                    colorFg: Colors.BLUE3,
                    key: key+"_stockSelection",
                    content: <span style={{
                        fontSize:60,
                        color:Colors.BLUE2
                    }}>
                    {key}
                </span>
                }
                /*
                    TODO:: fix this by reusing the same user from the nexus
                */
                if (pushEvents){
                    cardProps['handleClick']=()=>handleStockSelect('order '+key, lastEvent.channel, lastEvent.conversationId)
                }
                return <StockCard {...cardProps}/>
            }
        )
        return <Flex wrap style={{
            height:'100%',
            backgroundColor:Colors.LIGHT_GRAY1,
            flex:1,
            alignItems:'center', // vertical
            justifyContent: 'center', //horizontal
        }}>
            {stockComponent}
        </Flex>
    }
}