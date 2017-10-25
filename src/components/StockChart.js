import React, {Component} from 'react';

import { Colors, Icon } from "@blueprintjs/core";
import {Box, Flex} from "reflexbox";
import {Area, AreaChart, Line, LineChart} from "recharts";
import ReactLoading from 'react-loading';


export default class StockChart extends Component {

    render() {
        const {stockDetails, tickData} = this.props
        const data = [
            {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
            {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
            {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
            {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
            {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
            {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
            {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
        ];

        return (
            <Flex wrap align='center' w={1} p={0} className={''} style={{
                width:400
            }}>
                <Box w={1/2} p={1} className={''} style={{
                    textAlign:'center',
                }} >
                    <AreaChart width={200} height={150} data={data}
                               margin={{top: 5, right: 0, left: 0, bottom: 5}} style={
                        {
                            opacity:0.16
                        }}>
                        <Area type='monotone' dataKey='uv' stroke='#000000' fill='#000000' />
                        Hello
                    </AreaChart>
                    <LineChart width={200} height={150} data={data} style={{
                        marginTop:-150
                    }}>
                        <Line type='monotone' dataKey='pv' stroke='#00B3A4' strokeWidth={2} />
                    </LineChart>
                </Box>
                <Box w={1/2} p={1} className={''} style={{
                    textAlign:'center',
                }} >
                    {tickData.price?
                    <span style={{
                        fontFamily:'HelveticaNeue-Light',
                        fontSize:45,
                    }}
                    >{tickData.price.toFixed(2)}</span>:
                    <div style={{marginLeft:50}}><ReactLoading type={'bubbles'} color={Colors.BLUE5} height='80' width='100' />
                    </div>}
                </Box>
                <Box w={1} p={1} className={''} style={{
                    textAlign:'center',
                    //color:Colors.GRAY3,
                    opacity:0.4
                }} >
                    <div style={{
                        fontSize:20,

                    }}>{stockDetails.name+' ('+stockDetails.code+')'}</div>
                </Box>
            </Flex>
        )
    }
}