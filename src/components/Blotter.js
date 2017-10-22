import React, {Component} from 'react';

import { PieChart, Pie, Sector, Cell } from 'recharts';

import { Colors, Icon } from "@blueprintjs/core";
import {Box, Flex} from "reflexbox";
import StockCard from "./StockCard";
import ReactTable from "react-table";

export default class ToggleButton extends Component {

    /*
    *
    *   completedOrders: [
    {
      stock: 'dell',
      qty: 670,
      direction: 'Buy',
      completed: true
    },
    {
      stock: 'sony',
      qty: 500000,
      direction: 'Buy',
      completed: true
    },
    {
      stock: 'Microsoft',
      qty: 1000000,
      direction: 'Sell',
      completed: true
    }
  ]
}
    *
    * */



    render() {
        const {completedOrders, stockDetails} = this.props


        const data = [{name: 'Group A', value: 400}, {name: 'Group B', value: 300},
            {name: 'Group C', value: 300}, {name: 'Group D', value: 200}];
        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

        const RADIAN = Math.PI / 180;
        const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x  = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy  + radius * Math.sin(-midAngle * RADIAN);

            return (
                <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
                    {`${(percent * 100).toFixed(0)}%`}
                </text>
            );
        };



        const columns = [
            {
                Header: 'Code',
                id: 'code',
                accessor: o=>stockDetails[o.stock.toLowerCase()].code
            }, {
                Header: 'Stock',
                accessor: 'stock' // String-based value accessors!
            }, {
                Header: 'B/S',
                accessor: 'direction',
                Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
            }, {
                id: 'friendName', // Required because our accessor is not a string
                Header: 'Qty',
                accessor: 'qty',
                Cell: props => props.value.toLocaleString(),
                style:{textAlign:'right'}
            }
        ]

        return (
            <div style={{
                display:'flex',
                flex:1,
                alignItems:'center', // vertical
                justifyContent: 'center', //horizontal
                }}>

                <PieChart width={800} height={400} onMouseEnter={this.onPieEnter}>
                    <Pie
                        data={data}
                        cx={300}
                        cy={200}
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        fill="#8884d8"
                    >
                        {
                            data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
                        }
                    </Pie>
                </PieChart>

                <ReactTable
                    {...{
                        data:completedOrders,
                        columns:columns,
                        minRows:0,
                        showPagination: false,
                    }}
                >

                </ReactTable>
            </div>
        )
    }
}