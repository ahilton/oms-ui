import React, {Component} from 'react';
import ToggleButton from "./ToggleButton";

export default class FloatingToggleButton extends Component {

    render() {
        const {fixedStyle, iconName, handleClick} = this.props
        return (
            <div style={{
                ...fixedStyle,
                width:120, height:120,
                position:'fixed',
                display:'flex',
                alignItems:'center', // vertical
                justifyContent: 'center', //horizontal,
            }}>
                <ToggleButton {...{style:{color:'black', opacity:0.2}, iconName:iconName, handleClick:handleClick}}/>
            </div>
        )
    }
}