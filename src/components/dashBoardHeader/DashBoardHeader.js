import React from 'react';
import { Text, View, TouchableOpacity, Image} from 'react-native';
import base from '../../base';
import {connect} from "react-redux";
import HeaderStyles from "./HeaderStyles";


class DashBoardHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        base.utils.logger.log(this.props.viewImageURL +
            "PERSON" +
            this.props.MyAccountID +
            ".jpg" +
            "?random_number=" +
            new Date().getTime())

        return (
            <View style={HeaderStyles.container}>
                <View style={HeaderStyles.subContainerLeft}>
                    <TouchableOpacity>
                        <Image style={HeaderStyles.imageStyles}
                               source={{uri:'https://via.placeholder.com/150/ff8c00/FFFFFF'}}>
                        </Image>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={HeaderStyles.textContainer}>
                            <Text style={HeaderStyles.residentName}      //{this.props.userName} {this.props.userStatus}
                                  numberOfLines={1}>Jyothi</Text>
                            <Text style={HeaderStyles.statusText}
                                  numberOfLines={1}>Owner</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={HeaderStyles.subContainerRight}>
                    <Image style={HeaderStyles.appLogoStyles}
                           source={require("../../../icons/headerLogo.png")}>
                    </Image>
                </View>
                <View style={HeaderStyles.subContainerRight}>
                    <TouchableOpacity>
                        <Image style={HeaderStyles.logoStyles}
                               source={require("../../../icons/notifications.png")}>
                        </Image>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}



const mapStateToProps = state => {
    return {
        OyespaceReducer: state.OyespaceReducer,
        oyeURL: state.OyespaceReducer.oyeURL,
        MyAccountID: state.UserReducer.MyAccountID,
        MyFirstName: state.UserReducer.MyFirstName,
        viewImageURL: state.OyespaceReducer.viewImageURL
    };
};

export default connect(mapStateToProps)(DashBoardHeader)