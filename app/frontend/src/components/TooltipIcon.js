"use strict";

import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import PropTypes from 'prop-types';

/**
 * ItemTable action icon with tooltip
 */
class TooltipIcon extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        if(this.props.active){
            return ( <OverlayTrigger
                placement={this.props.placement} 
                delay={300}
                overlay={
                    <Tooltip>
                        {this.props.children}
                    </Tooltip>
                }>
                    <a className='tooltipicon' onClick={this.props.onClick} style={{padding: '5px', borderRadius: '6px', fontSize: '17px'}}>
                        <FontAwesomeIcon color={this.props.color} icon={this.props.icon} />
                    </a>
                </OverlayTrigger>
            );
        } else {
            return (
                <a style={{padding: '5px', fontSize: '17px'}}>
                    <FontAwesomeIcon color="transparent" icon={this.props.icon} />
                </a>
            );
        }
    }
}

TooltipIcon.propTypes = {
    color: PropTypes.string.isRequired,
    placement: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    icon: PropTypes.object.isRequired,
};

export default TooltipIcon;