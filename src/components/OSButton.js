import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types'
import base from '../base'


class OSButton extends React.Component {
    static propTypes = {
        height: PropTypes.string,
        width: PropTypes.string,
        borderRadius: PropTypes.number,
        oSBText: PropTypes.string.isRequired,
        oSBBackground: PropTypes.string,
        oSBTextColor: PropTypes.string,
        onButtonClick: PropTypes.func,
        oSBType: PropTypes.oneOf(['normal', 'custom']).isRequired,
    };
    static defaultProps = {
        height: '30%',
        width: '35%',
        borderRadius: 5,
        oSBText: "Confirm",
        oSBBackground: base.theme.colors.primary,
        oSBType: 'normal',
        oSBTextColor: base.theme.colors.white,

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
                                  justifyContent:'center',
                                  borderRadius: (this.props.borderRadius),
                                  backgroundColor: this.props.oSBBackground,
                                  ...this.props.style
                              }]}>
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
        width: 50,
    },

    confirmText: {
        justifyContent: 'center',
        alignItems: 'center', textAlign: 'center',
        alignSelf: 'center',
        //fontFamily:'',
        fontSize: 14,
    },
    customBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        height: "20%",
        width: "35%",
        borderRadius: 5,
    }

});

export default OSButton;
