import React, {Component} from 'react';
import {Image, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';

export default class CreateCheckPoint extends Component {
    static navigationOptions = {
        title: 'Edit CheckPoints',
        headerStyle: {
            backgroundColor: '#FA9917',
        },
        headerTitleStyle: {
            color: '#fff',
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            currentposition: '',
            lat: '',
            long: '',
            CheckPoint_name: this.props.navigation.state.params.CkPName,
            gps: this.props.navigation.state.params.cpgpsPnt

        };
        console.log('EditCheckPoint constructor', 'bf ' + this.state.CheckPoint_name);
        console.log('EditCheckPoint constructor', 'gps ' + this.state.gps);

    }

    /**
     * { "AssociationID": 30,
     * "OYEMemberID": 1137 ,
     * "CheckPointName": "Haro Om",
     * "GPSPoint": "12.8467595,77.6480607",
     * "CreatedDate": "2018-10-11 03:14:37" }
     */
    CheckpointName = (checkpointname) => {
        this.setState({CheckPoint_name: checkpointname})
    };

    submit = () => {

        // const { params } = this.props.navigation.state;

        mCheckPointName = this.state.CheckPoint_name;
        mlat = this.state.lat;
        mlong = this.state.long;
        console.log('EditCheckPoints maplatlong', this.state.lat + "," + this.state.long);

        if (mCheckPointName.length <= 3) {
            alert("Invalid Checkpoint name");
            // ToastAndroid.show('Invalid Checkpoint name', ToastAndroid.SHORT);
        } else if (this.state.gps == '') {
            alert('Invalid GPS');
        } else {

            //   resp={
            //     "cpChkPntID" : 7,
            //     "cpCkPName":mCheckPointName,
            //     "CPGPSPnt" : mlat+','+mlong,
            //     "ASAssnID" : 25
            // }
            resp = {

                "cpChkPntID": this.props.navigation.state.params.ChkPntID,
                "cpCkPName": mCheckPointName,
                "CPGPSPnt": this.state.gps,
                "ASAssnID": global.SelectedAssociationID
            };
            responseObj = {
                "CPCkPName": mCheckPointName,
                "CPGPSPnt": mlat + ',' + mlong,
                "MEMemID": global.MyOYEMemberID,
                "ASAssnID": global.SelectedAssociationID
            };
            // // console.log('response',responseObj);
            //   anu={"AssociationID":30,
            //   "OYEMemberID":1137,
            //   "CheckPointName":this.state.CheckPoint_name,
            //  "GPSPoint":this.state.lat+','+this.state.long,
            //   "CreatedDate":'2018-10-11 03:14:37'
            // }

            const url = 'http://' + global.oyeURL + '/oye247/api/v1/CheckPointGPS/Update';
            console.log('anu', url);
            fetch(url,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
                    },
                    body: JSON.stringify(resp)
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log('EditCheckPoints responseJson', responseJson);
                    if (responseJson.success) {
                        alert('Updated Successfully');
                        this.props.navigation.navigate('CheckPointListScreen');

                    } else {
                        console.log('ravii123', responseJson);
                        alert('Failed to Updated !');
                    }

                })
                .catch((error) => {
                    console.error('EditCheckPoints err ' + error);
                    alert('Caught error in Edit Check Points!');
                });

        }
    };

    mobilevalidate = () => {

        navigator.geolocation.getCurrentPosition((position) => {
            lat = position.coords.latitude;
            long = position.coords.longitude;

            const currentposition = JSON.stringify(position);
            console.log('suvarna', currentposition);
            this.setState({currentposition, lat, long});
            this.state.lat = lat;
            this.state.long = long;
            this.setState({gps: this.state.lat + "," + this.state.long});
            console.log('set gps', this.state.lat + "," + this.state.long);
            // this.setState({ lat: position.coords.latitude })
            console.log('reset gps', this.state.lat + "," + this.state.long);
        });
    };

    render() {
        const {navigate} = this.props.navigation;
        const {params} = this.props.navigation.state;
        maplat = params.cat;
        mapLong = params.cat1;

        // this.state.lat = maplat
        //  this.state.long = mapLong
        // this.state.lat=params.cat;
        // this.state.long=params.cat1;

        return (
            <View style={styles.container}>
                <View>
                    <View style={{flexDirection: 'row',}}>
                        <View
                            style={{flex: 1, marginTop: 43, marginRight: 0, justifyContent: 'center', marginLeft: 10}}>
                            <TouchableOpacity onPress={() => navigate(('CheckPointListScreen'), {cat: ''})}
                            >
                                <Image source={require('../pages/assets/images/back.png')}
                                       style={{height: 25, width: 25, margin: 5, alignSelf: 'center'}}/>
                            </TouchableOpacity>
                        </View>
                        {/* <TouchableOpacity
                        style={{paddingTop: 2, paddingRight: 2, paddingLeft: 2, flex: 1, alignItems: 'center', flexDirection: 'row',
                            paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',marginTop:'6%'}}
                            onPress={() => this.props.navigation.navigate('SideMenu')}>
                        <Image source={require('../pages/assets/images/menu_button.png')}
                            style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                    </TouchableOpacity> */}
                        <View style={{flex: 5, alignItems: 'center', justifyContent: 'center'}}>
                            <Image source={require('../pages/assets/images/OyespaceRebrandingLogo.png')}
                                   style={{height: 40, width: 95, marginTop: 45, marginBottom: 5}}/>
                        </View>
                        <View style={{flex: 1, marginTop: 45, marginRight: 10, justifyContent: 'center',}}>
                        </View>
                    </View>

                    <View
                        style={{backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1,}}></View>
                    <View
                        style={{backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1,}}></View>

                    <Text style={{fontSize: 16, color: 'black', fontWeight: 'bold', margin: 10}}>Edit Check Point</Text>


                </View>
                <View style={{flexDirection: 'row', marginBottom: 5, marginTop: 25}}>
                    <TextInput
                        style={styles.input}
                        placeholder={'CheckPoint Name'}
                        value={this.state.CheckPoint_name}
                        onChangeText={this.CheckpointName}
                    />
                    <TouchableOpacity
                        style={{
                            flex: 1, backgroundColor: 'white', borderColor: 'orange',
                            height: 40, padding: 10, width: 30
                        }}
                        onPress={() => navigate('EditCheckPointMapScreen', {cat: 2})}>
                        <Image source={require('../pages/assets/images/placeholder.png')}
                               style={{height: 30, width: 30, alignItems: "flex-end",}}/>
                    </TouchableOpacity>

                </View>
                <View>
                    <Text style={{
                        marginLeft: 10,
                        marginRight: 10,
                    }}>
                        {this.state.gps}
                    </Text>

                </View>

                <View style={{flexDirection: 'row', backgroundColor: 'orange', marginLeft: 100}}>

                </View>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                        style={{
                            flex: 1, backgroundColor: 'white', borderColor: 'orange',
                            borderRadius: 2, borderWidth: 1, height: 40, padding: 10, marginBottom: 20, marginLeft: 20,
                            marginRight: 15, alignItems: 'center',

                        }}
                        onPress={this.mobilevalidate.bind(this)}>
                        <Text style={styles.submitButtonText}>Get GPS</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            backgroundColor: 'white',
                            borderColor: 'orange',
                            borderRadius: 2,
                            borderWidth: 1,
                            height: 40,
                            padding: 10,
                            alignItems: 'center',
                            marginLeft: 20,
                            marginRight: 15,
                            marginBottom: 380,
                            marginTop: 5

                        }}
                        onPress={this.submit.bind(this)}
                    >
                        <Text style={styles.submitButtonText}> Update Check Point </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    input: {
        marginLeft: 20,
        marginRight: 15,
        marginBottom: 15,
        height: 40,
        flex: 2,
        borderColor: '#F2F2F2',
        backgroundColor: '#F2F2F2',
        borderWidth: 1.5,
        borderRadius: 2,

    },
    submitButtonText: {
        color: '#FA9917'

    }
});
