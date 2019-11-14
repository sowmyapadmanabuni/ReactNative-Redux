import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types'
import base from '../../base'
import OSButtonStyles from "./OSButtonStyles";


class OSButton extends React.Component {
    static propTypes = {
        height: PropTypes.any,
        width: PropTypes.any,
        borderRadius: PropTypes.number,
        oSBText: PropTypes.string.isRequired,
        oSBBackground: PropTypes.string,
        oSBTextColor: PropTypes.string,
        onButtonClick: PropTypes.func,
        oSBType: PropTypes.oneOf(['normal', 'custom']).isRequired,
        disabled:PropTypes.bool
    };
    static defaultProps = {
        height: '30%',
        width: '35%',
        borderRadius: 5,
        oSBText: "Confirm",
        oSBBackground: base.theme.colors.primary,
        oSBType: 'normal',
        oSBTextColor: base.theme.colors.white,
        disabled:false

    };

    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {

        let oSBStyle = OSButtonStyles.confirmButton;
        switch (this.props.oSBType) {
            case 'normal':
                oSBStyle = OSButtonStyles.confirmButton;
                break;
            case 'custom':
                oSBStyle = OSButtonStyles.customBtn;
                break;
        }

        return (

            <TouchableOpacity onPress={this.onButtonClick.bind(this)}
                              disabled={this.props.disabled}
                              style={[oSBStyle, {
                                  height: (this.props.height),
                                  width: (this.props.width),
                                  justifyContent: 'center',
                                  borderRadius: (this.props.borderRadius),
                                  backgroundColor: this.props.oSBBackground,
                                  ...this.props.style
                              }]}>
                <Text style={[OSButtonStyles.confirmText, {
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


export default OSButton;
