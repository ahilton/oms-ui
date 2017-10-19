import React, {Component} from 'react';

import {connect} from 'react-redux'

import 'normalize.css/normalize.css'
import '@blueprintjs/core/dist/blueprint.css'
import './App.css';

import {
    getCompletedOrders,
    getLastEvent
} from './redux/order'

import {
    webChatEnabled,
    channelKeys
} from "./redux/settings"

import {
    webChatToggle,
    pushChannelEvent
} from "./action"

import { Colors, Icon } from "@blueprintjs/core";
import {Box, Flex} from "reflexbox";

import StockCard from "./components/StockCard";


class App extends Component {

    /*

      lastEvent: {
      conversationId: null,
      channel: null,
      lastUserMessage: null,
      lastOrderState: {
        stock: 'Apple',
        qty: 1000,
        direction: 'Sell',
        completed: true
      },
      lastSystemMessage: null,
      choices: null
    },

    * */

    stockDetails = {
        apple: {
            logo: {url: 'http://cdn.instantlogosearch.com/png?id=svgporn-apple', width:60},
            code: 'AAPL',
            name: 'Apple Inc.'
        },
        microsoft: {
            logo: {url: 'http://cdn.instantlogosearch.com/png?id=svgporn-microsoft', width:120},
            code: 'MSFT',
            name: 'Microsoft Corporation'
        },
        ibm: {
            logo: {url: 'http://cdn.instantlogosearch.com/png?id=logomono-ibm-mono', width:100},
            code: 'IBM',
            name: 'IBM Corp.'
        },
        sony: {
            logo: {url: 'http://cdn.instantlogosearch.com/png?id=logomono-sony-mono', width:120},
            code: 'SNE',
            name: 'Sony Corp (ADR)'
        },
        dell: {
            logo: {url: 'http://cdn.instantlogosearch.com/png?id=logomono-dell-mono', width:90},
            code: 'DELL',
            name: 'Dell Inc.'
        }
    }

    getDetailsForStock = (stock) => {
        return this.stockDetails[stock.toLowerCase()]
    }

    getColorChart = (order) => {
        const defaultColors = {
            bg:Colors.LIGHT_GRAY1,
            fg:Colors.BLUE3
        }
        if (order){
            if (order.completed){
                return {
                    bg:Colors.BLUE3,
                    fg:Colors.BLUE3
                }
            }
            if (order.direction){
                switch(order.direction.toLowerCase()) {
                    case 'sell':
                        return {
                            bg:Colors.RED3,
                            fg:Colors.RED2
                        }
                    case 'buy':
                        return {
                            bg:Colors.GREEN3,
                            fg:Colors.GREEN2
                        }
                }
            }
        }
        return defaultColors
    }

    renderOrderComponent = (order) => {
        const stockDetails = order&&order.stock?this.getDetailsForStock(order.stock):{
            code: '',
            name: ''
        }
        const colorChart = this.getColorChart(order)
        return <div style={{
            backgroundColor:colorChart.bg,
            display:'flex',
            flex:1,
            alignItems:'center', // vertical
            justifyContent: 'center', //horizontal
        }}>
            <StockCard {...{
                stockDetails:stockDetails,
                order:order,
                colorFg: colorChart.fg
            }}/>
        </div>
    }

    handleStockSelect = (stock, channel, conversationId) => {
        this.props.dispatch(pushChannelEvent(stock, this.props.channelKeys[channel], conversationId))
    }

    renderStockSelection = (pushEvents, lastEvent) => {

        const stockComponent = Object.keys(this.stockDetails).map(
            (key) => {
                var cardProps = {
                    stockDetails:this.stockDetails[key],
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
                if (pushEvents){
                    cardProps['handleClick']=()=>this.handleStockSelect(key, lastEvent.channel, lastEvent.conversationId)
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

    renderToggle = (style) => {
        return (
            <a role="button" className=""  style={style} tabIndex="0">
                <Icon iconName="chat" iconSize="inherit" onClick={this.toggleWebChat} style={{fontSize:60}}/>
            </a>
        )
    }

    renderFooter = (lastEvent) => {
        return (
            <div>
                {/*USE A PHANTOM BLOCK TO PREVENT THE FOOTER AFFECTING PAGE FLOW*/}
                <div style={{
                    display:'block',
                    height:150,
                    width:'100%'
                }}/>
                {/*FIXED FOOTER*/}
                <div style={{
                    height:150,
                    position:'fixed', left:0, bottom:0,
                    width:'100%',
                    backgroundColor:Colors.BLUE1,
                    display:'flex',
                    alignItems:'center', // vertical
                    justifyContent: 'center', //horizontal
                }}>
                    <div style={{
                        color:Colors.LIGHT_GRAY4,
                        fontWeight: 500,
                        fontSize: 30
                    }}
                    >
                        {this.renderToggle({marginRight:25, color:Colors.BLUE5})}
                        {lastEvent.lastSystemMessage}
                    </div>
                </div>
            </div>
        )
    }

    renderWebchat = () => {
        return (
            <div style={{
                display:'flex',
                height:'100%',
                width:400
            }}>
                <iframe
                    style={{height:'100%', width:400}}
                    src={'https://webchat.botframework.com/embed/VenusBot?s='+this.props.channelKeys.webchat}>
                </iframe>
            </div>
        )
    }

    toggleWebChat = () => {
        this.props.dispatch(webChatToggle())
    }

    render() {
        const {lastEvent, completedOrders, webChatEnabled} = this.props
        const order = lastEvent?lastEvent.lastOrderState:{}

        const pushEvents = lastEvent&&lastEvent.channel==='webchat'

        const orderComponent = (order && order.stock)?
            this.renderOrderComponent(order):
            this.renderStockSelection(pushEvents, lastEvent)

        return (
            <div style={{
                display:'flex',
                flexDirection:'row',
                height:'100%'
            }}>
                <div className="App"  style={{
                    display:'flex',
                    flexDirection:'column',
                    height:'100%',
                    flex:1
                }}>
                    {orderComponent}
                    {!webChatEnabled && this.renderFooter(lastEvent)}
                    {webChatEnabled && <div style={{
                        width:120, height:120,
                        position:'fixed', left:0, bottom:0,
                        display:'flex',
                        alignItems:'center', // vertical
                        justifyContent: 'center', //horizontal,
                    }}>
                        {this.renderToggle({color:Colors.BLUE1})}
                    </div>}
                </div>
                {webChatEnabled && this.renderWebchat()}
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        completedOrders: getCompletedOrders(state),
        lastEvent: getLastEvent(state),
        webChatEnabled: webChatEnabled(state),
        channelKeys: channelKeys(state)
    }
}

export default connect(mapStateToProps)(App);
