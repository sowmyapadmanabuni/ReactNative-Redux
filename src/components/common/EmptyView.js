/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-06-27
 */


import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import base from '../../base'


export default class EmptyView extends React.Component {
    constructor(props) {
        super(props);

    }

    static propTypes = {
        height: PropTypes.number,
        width: PropTypes.number,
        backgroundColor: PropTypes.string
    };

    static defaultProps = {
        height: "10%",
        width: '100%',
        backgroundColor: base.theme.colors.white
    };


    render() {
        return (
            <View style={{
                height: this.props.height,
                width: this.props.width,
                backgroundColor: this.props.backgroundColor
            }}/>
        )
    }
}
