import React, {Component} from 'react';

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