import React, {Component} from 'react';
import {ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ActionButton from 'react-native-action-button';
//import { Fonts } from '../pages/src/utils/Fonts';
import {connect} from 'react-redux';
import {updateUserInfo} from '../src/actions';


class CheckPointList extends Component {

    constructor() {
        super(props);
        this.state = {
            dataSource: [],
            isLoading: true
        };
    }

    renderItem = ({item}) => {

        return (
            <TouchableOpacity style={{flex: 1, flexDirection: 'row', marginBottom: 3}}
                              onPress={() => alert(item.subject)}>
                console.log('anu234',item.subject+', '+item.agenda);

                <View style={{flex: 1, justifyContent: 'center', marginLeft: 5}}>
                    <Text style={{fontSize: 18, color: 'green', marginBottom: 15}}>
                        {item.subject}
                    </Text>
                    <Text style={{fontSize: 16, color: 'red'}}>
                        {item.agenda}
                    </Text>
                </View>
            </TouchableOpacity>
        )

    }

    renderSeparator = () => {
        return (
            <View
                style={{height: 1, width: '100%', backgroundColor: 'darkgrey'}}>
            </View>
        )

    }

    componentDidMount() {
        console.log("Global in Checkpoint:", global);
        console.log("Props in Checkpoint:", this.props);
        let url = 'http://' + this.props.oyeURL + '/oye247/api/v1/CheckPoint/GetCheckPointByAssocID/' + this.props.SelectedAssociationID;
        console.log('CheckPointList componentdidmount', '' + url)

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                // console.log('CheckPointList responseJson', responseJson);

                this.setState({
                    dataSource: responseJson.data.checkPointListByAssocID,
                    isLoading: false
                })


                db.transaction(tx => {
                    tx.executeSql('delete  FROM CheckPointList where AssnID=' + this.props.SelectedAssociationID, [], (tx, results) => {
                    });
                });
                for (let i = 0; i < responseJson.data.checkPoint.length; ++i) {
                    this.insert_Guards(
                        responseJson.data.checkPoint[i].cpChkPntID, responseJson.data.checkPoint[i].cpCkPName,
                        responseJson.data.checkPoint[i].cpgpsPnt, responseJson.data.checkPoint[i].asAssnID);
                }


            })
            .catch((error) => {
                console.log('CheckPointList err ' + error)
            })

    }

    insert_Guards(cpChkPntID, cpCkPName, cpgpsPnt, asAssnID) {
        db.transaction(function (tx) {
            tx.executeSql(
                'INSERT INTO Workers (CheckPointId, CheckPointName, GPSPoint, AssnID ' +
                ' ) VALUES (?,?,?,?)',
                [cpChkPntID, cpCkPName, cpgpsPnt, asAssnID],
                (tx, results) => {
//          console.log('inserting workers', results.rowsAffected + ' ' + work_id + ' ' + wk_mobile);
                }
            );
        });
    }

    componentDidUpdate() {

        const url = 'http://' + this.props.oyeURL + '/oye247/api/v1/CheckPoint/GetCheckPointByAssocID/' + this.props.SelectedAssociationID
        // console.log('CheckPointList componentDidUpdate', '' + url)
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                // console.log('CheckPointList componentDidUpdate', responseJson);

                this.setState({
                    dataSource: responseJson.data.checkPointListByAssocID,
                    isLoading: false
                })
                // console.log('CheckPointList count '+this.state.dataSource.length)
            })
            .catch((error) => {
                console.log('CheckPointList err ' + error)
            })

    }

    //   shouldComponentUpdate(nextProps, nextState) {
    //     const isItemChanged = this.props.item != nextProps.item
    //     const isPortraitMode = this.props.isPortraitMode != nextProps.isPortraitMode
    //     return isItemChanged || isPortraitMode
    // }

    render() {
        const {navigate} = this.props.navigation;
        return (
            <View style={{backgroundColor: '#FFF', height: '100%'}}>

                <View style={{flexDirection: 'row',}}>
                    <View style={{flex: 1, marginTop: 43, marginRight: 0, justifyContent: 'center', marginLeft: '2%'}}>
                        <TouchableOpacity onPress={() => navigate(('AdminFunction'), {cat: ''})}
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
                    <View style={{flex: 6, alignItems: 'center', justifyContent: 'center',}}>
                        <Image source={require('../pages/assets/images/OyespaceRebrandingLogo.png')}
                               style={{height: 40, width: 95, marginTop: 45, marginBottom: 5}}/>
                    </View>
                    <View style={{flex: 1, marginTop: 45, marginRight: 10, justifyContent: 'center',}}>
                    </View>
                </View>

                <View style={{backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1,}}></View>
                <View style={{backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1,}}></View>

                <Text style={{fontSize: 16, color: 'orange', fontWeight: 'normal', margin: 10, alignSelf: 'center'}}>Patrolling
                    Check Points</Text>
                {this.state.isLoading
                    ?
                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'white'
                    }}>
                        <ActivityIndicator
                            size="large"
                            color="#330066"
                            animating/>
                    </View>
                    :
                    <ScrollView>
                        <FlatList
                            extraData={this.state.refresh}
                            data={this.state.dataSource}
                            renderItem={({item}) =>
                                <View style={styles.rectangle}>

                                    <View style={{flex: 1, flexDirection: 'row', padding: 2}}>

                                        <View style={{flex: 1, flexDirection: 'column'}}>
                                            <View style={{flex: 8, flexDirection: 'row', padding: 2}}>
                                                <View style={{flex: 6, flexDirection: 'row', padding: 2}}>
                                                    <Text style={styles.title}>{item.cpCkPName}</Text></View>
                                                <TouchableOpacity style={{
                                                    flex: 1, backgroundColor: 'white', borderColor: 'orange',
                                                    borderRadius: 2, height: 40, padding: 10, width: 30
                                                }}
                                                                  onPress={() => navigate('CheckPointListMapScreen', {gps: item.cpgpsPnt})}>

                                                    <Image source={require('../pages/assets/images/placeholder.png')}
                                                           style={{height: 30, width: 30, justifyContent: "flex-start"}}
                                                    />
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={{flex: 1, backgroundColor: 'white', padding: 10,}}
                                                    onPress={() => navigate('EditCheckPointScreen', {
                                                        CkPName: item.cpCkPName,
                                                        ChkPntID: item.cpChkPntID,
                                                        cpgpsPnt: item.cpgpsPnt
                                                    })}>
                                                    <Image source={require('../pages/assets/images/edit.png')}
                                                           style={{height: 30, width: 30, alignItems: "flex-end",}}/>

                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={{flex: 1, backgroundColor: 'white', padding: 10,}}
                                                    onPress={() => navigate('QRCodeGenScreen', {
                                                        name: item.cpCkPName,
                                                        ChkPntID: item.cpChkPntID,
                                                        cpgpsPnt: item.cpgpsPnt
                                                    })}>
                                                    <Image source={require('../pages/assets/images/qr_code_orange.png')}
                                                           style={{height: 30, width: 30, alignItems: "flex-end",}}/>

                                                </TouchableOpacity>
                                            </View>
                                            <Text style={styles.text}>{item.cpgpsPnt} </Text>
                                            <View style={{flex: 1, flexDirection: 'row', marginBottom: 5}}>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                            }
                            keyExtractor={({cpChkPntID}, index) => cpChkPntID}

                            //           data={this.state.dataSource}
                            //  extraData={this.state.dataSource}
                        />
                    </ScrollView>
                }
                <ActionButton buttonColor="#FA9917" onPress={() => navigate('CreateCheckPointScreen', {
                    cat: '',
                    cpList: this.state.dataSource
                })}>
                </ActionButton>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    container: {flex: 1, alignItems: 'center', backgroundColor: 'white'},

    rectangle: {
        flex: 1, backgroundColor: 'white', padding: 10, borderColor: 'orange',
        marginLeft: 5, marginRight: 5, marginTop: 5, borderRadius: 2, borderWidth: 1,
    },

    title: {fontSize: 18, color: 'black', marginBottom: 8, fontWeight: 'bold'},

    text: {fontSize: 10, color: 'black',},

});

const mapStateToProps = state => {
    console.log("state:", state)
    return {
        oyeURL: state.OyespaceReducer.oyeURL,
        champBaseURL: state.OyespaceReducer.champBaseURL,
        oye247BaseURL: state.OyespaceReducer.oye247BaseURL,
        oyeBaseURL: state.OyespaceReducer.oyeBaseURL,
        SelectedAssociationID: state.UserReducer.SelectedAssociationID
    }
};

export default connect(mapStateToProps, {updateUserInfo})(CheckPointList);

