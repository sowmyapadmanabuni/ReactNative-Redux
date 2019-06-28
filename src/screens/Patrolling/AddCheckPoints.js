/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-06-25
 */

import React from 'react';
import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} from 'react-native';
import {connect} from 'react-redux';
import base from "../../base";
import {TextField} from "react-native-material-textfield";
import OSButton from "../../components/osButton/OSButton";
import EmptyView from "../../components/common/EmptyView";


class AddCheckPoints extends React.Component {
    constructor(props) {
        super(props);

        this.state = ({
            gpsLocation: "Set GPS Location"
        })

    }


    setPointName(text) {

    }

    render() {
        const keyboardVerticalOffset = Platform.OS === 'ios' ? 10 : 0
        return (
            <ScrollView onPress={() => Keyboard.dismiss()}>
                <KeyboardAvoidingView keyboardShouldPersistTaps='handled'
                                      behavior="position" keyboardVerticalOffset={keyboardVerticalOffset}
                                      style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Add Check Points</Text>
                    </View>
                    <View style={styles.mapBox}>
                    </View>

                    <View style={styles.textView}>
                        <TextField
                            label='Patrolling Check Point Name'
                            fontSize={12}
                            tintColor={base.theme.colors.grey}
                            textColor={base.theme.colors.black}
                            labelHeight={10}
                            activeLineWidth={0.5}
                            returnKeyType='done'
                            onChangeText={(text) => this.setPointName(text)}
                        />
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={styles.gpsView}>
                            <Image
                                resizeMode={'cover'}
                                style={styles.gpsIcon}
                                source={require('../../../icons/location.png')}
                            />
                            <Text>{this.state.gpsLocation}</Text>
                        </View>
                        <TouchableHighlight
                            underlayColor={base.theme.colors.transparent}
                            onPress={() => base.utils.logger.log("dnkjdv")} style={styles.gpsButtonView}>
                            <Text style={styles.gpsButton}>Set GPS</Text>
                        </TouchableHighlight>
                    </View>
                    <EmptyView height={10}/>
                    <View style={styles.buttonView}>
                        <OSButton oSBText={"Cancel"} oSBType={"custom"} oSBBackground={base.theme.colors.red}
                                  height={30}  borderRadius={10}/>
                        <OSButton oSBText={"Add"} oSBType={"custom"} oSBBackground={base.theme.colors.primary}
                                  height={30} borderRadius={10}/>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: base.theme.colors.white
    },
    header: {
        alignItems: 'center',
        justifyContent: "center",
        height: "20%"
    },
    headerText: {
        fontSize: 15,
        fontFamily: base.theme.fonts.medium,
        color: base.theme.colors.primary
    },
    mapBox: {
        height: "75%",
        width: "90%",
        borderWidth: 1,
        alignSelf: 'center'
    },
    textView:{
        marginTop: 20,
        width: '90%',
        alignSelf: 'center'
    },
    gpsView: {
        marginTop: 20,
        width: '50%',
        marginLeft: "5%",
        borderBottomWidth: 0.6,
        flexDirection: 'row',
        alignItems: 'center'
    },
    gpsIcon: {
        height: 30,
        width: 30
    },
    gpsButtonView: {
        borderWidth: 1,
        height: "35%",
        width: "35%",
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: base.theme.colors.primary
    },
    gpsButton: {
        color: base.theme.colors.primary
    },
    buttonView:{
        width: "100%",
        height: "20%",
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row'
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