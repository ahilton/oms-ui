import React, {Component} from 'react';

import Progress from "react-progress-2";
import { Colors } from "@blueprintjs/core";

export default class LoadingB extends Component {

    render() {
        return (
            <div style={{ pointerEvents: 'none'}}>
                <Progress.Component style={{height:10}} thumbStyle={{background: Colors.ROSE3 }}/>
            </div>
        )
    }

    componentDidMount() {
        Progress.show();
    }

    componentWillUnmount(){
        Progress.hide();
    }

}