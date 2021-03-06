import React, {Component} from 'react';

import { Colors, Icon } from "@blueprintjs/core";
import {Box, Flex} from "reflexbox";
import StockCard from "./StockCard";

export default class StockSelection extends Component {

    render() {
        const {lastEvent, pushEvents, handleStockSelect, stickySelect} = this.props
        const selectedStock = stickySelect&&stickySelect.stock?stickySelect.stock:undefined
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
                    interactive: pushEvents&&!selectedStock,
                    selected: key===selectedStock,
                    content: <span className="stock-select-name">
                    {key}
                </span>
                }
                if (pushEvents){
                    cardProps['handleClick']=()=>handleStockSelect(key, lastEvent)
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