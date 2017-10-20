import React, {Component} from 'react';

import {connect} from 'react-redux'

import 'normalize.css/normalize.css'
import '@blueprintjs/core/dist/blueprint.css'
import 'react-table/react-table.css'
import './App.css';

import {
    getCompletedOrders,
    getLastEvent
} from './redux/order'

import {
    webChatEnabled,
    channelKeys, blotterEnabled
} from "./redux/settings"

import {
    webChatToggle,
    blotterToggle,
    pushChannelEvent
} from "./action"

import { Colors, Icon } from "@blueprintjs/core";
import {Box, Flex} from "reflexbox";

import StockCard from "./components/StockCard";
import Footer from "./components/Footer";
import StockSelection from "./components/StockSelection";
import ToggleButton from "./components/ToggleButton";
import FloatingToggleButton from "./components/FloatingToggleButton";
import Blotter from "./components/Blotter";


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

        return <StockSelection {...{
            stockDetails: this.stockDetails,
            pushEvents: pushEvents,
            lastEvent: lastEvent,
            handleStockSelect:this.handleStockSelect
        }}/>
    }

    renderToggleButton = (fixedStyle, iconName, handleClick) => {
        return (
            <FloatingToggleButton {...{fixedStyle, iconName, handleClick}}/>
        )
    }

    renderFooter = (lastEvent) => {
        return (
            <Footer {...{
                lastSystemMessage:lastEvent.lastSystemMessage
            }}>
                <ToggleButton {...{style:{marginRight:25, color:Colors.BLUE5}, iconName:'chat', handleClick:this.toggleWebChat}}/>
            </Footer>
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

    toggleView = () => {
        this.props.dispatch(blotterToggle())
    }

    pageGrowStyle = {
        display:'flex',
        flexDirection:'column',
        height:'100%',
        flex:1
    }

    render() {
        const {lastEvent, completedOrders, webChatEnabled, blotterEnabled} = this.props
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
                {blotterEnabled && <div style={this.pageGrowStyle}>
                    <Blotter {...{stockDetails:this.stockDetails, completedOrders}}/>
                    {this.renderToggleButton({left:0, top:0}, 'cell-tower', this.toggleView)}
                </div>}
                {!blotterEnabled && <div style={this.pageGrowStyle}>
                    {this.renderToggleButton({left:0, top:0}, 'dashboard', this.toggleView)}
                    {orderComponent}
                    {!webChatEnabled && this.renderFooter(lastEvent)}
                    {webChatEnabled && this.renderToggleButton({left:0, bottom:0}, 'chat', this.toggleWebChat)}
                </div>}
                {webChatEnabled && this.renderWebchat()}
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        completedOrders: getCompletedOrders(state),
        lastEvent: getLastEvent(state),
        blotterEnabled: blotterEnabled(state),
        webChatEnabled: webChatEnabled(state),
        channelKeys: channelKeys(state)
    }
}

export default connect(mapStateToProps)(App);
