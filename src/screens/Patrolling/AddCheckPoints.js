/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-06-25
 */

import React from 'react';
import {StyleSheet, View,Text} from 'react-native';
import {connect} from 'react-redux';
import base from "../../base";


class AddCheckPoints extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text>Add Check Points</Text>
                </View>

            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: base.theme.colors.white
    },
    header:{
        alignItems:'center'
    }
});

const mapStateToProps = state => {
    return {
        oyeURL: state.OyespaceReducer.oyeURL,
        champBaseURL: state.OyespaceReducer.champBaseURL,
        oye247BaseURL: state.OyespaceReducer.oye247BaseURL,
        oyeBaseURL: state.OyespaceReducer.oyeBaseURL,
        userReducer: state.UserReducer,
        SelectedAssociationID: state.UserReducer.SelectedAssociationID
    }
};

export default connect(mapStateToProps)(AddCheckPoints)