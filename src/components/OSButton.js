import React from 'react';
import {StyleSheet, Text,View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types'
import base from '../base'


class OSButton extends React.Component {
    static propTypes = {
        height: PropTypes.number,
        width: PropTypes.number,
        borderRadius: PropTypes.number,
        oSBText: PropTypes.string.isRequired,
        oSBBackground: PropTypes.string,
        oSBTextColor: PropTypes.string,
        onButtonClick: PropTypes.func,
        oSBType: PropTypes.oneOf(['normal', 'custom']).isRequired,
    };
    static defaultProps = {
        height:'20%',
        width:'35%',
        borderRadius:5,
        oSBText: "Confirm",
        oSBBackground:base.theme.colors.primary,
        oSBType: 'normal',
        oSBTextColor:"#ffffff",

    };

    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {

        let oSBStyle = styles.confirmButton;
        switch (this.props.oSBType) {
            case 'normal':
                oSBStyle = styles.confirmButton;
                break;
            case 'custom':
                oSBStyle = styles.customButton;
                break;
        }

        return (

            <TouchableOpacity onPress={this.onButtonClick.bind(this)}
                              style={[oSBStyle, {
                                  height: (this.props.height),
                                  width: (this.props.width),
                                  borderRadius: (this.props.borderRadius),
                                  ...this.props.style}]}>
                <Text style={[styles.confirmText, {
                    color: this.props.oSBTextColor
                }]}>{this.props.oSBText}</Text>
            </TouchableOpacity>

        )
    }

    onButtonClick() {
        if (this.props.onButtonClick) {
            this.props.onButtonClick()
        }
    }


}

const styles = StyleSheet.create({

    confirmButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"#000000",
    },

    confirmText: {
        justifyContent: 'center',
        alignItems: 'center', textAlign: 'center',
        alignSelf: 'center',
        //fontFamily:'',
        //fontSize:'10%',
    },
    customBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        height:"20%",
        width:"35%",
        borderRadius:5,
        backgroundColor:"#ffffff",
    }

});

export default OSButton;
