import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
import { Button, Header, Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { CLOUD_FUNCTION_URL } from '../../../constant';
import { connect } from 'react-redux';
import { updateApproveAdmin } from '../../actions/AppAction';
import _ from 'lodash';

class NotificationDetailScreen extends Component {
    state = {
        loading: false
    }

    approve = (item, status) => {
        // const { approvedAdmins } = this.props;
        // let unitId = item.sbUnitID;
        // let status = _.includes(approvedAdmins, unitId)

        if(status) {
            Alert.alert(
                'Oyespace',
                'You have already responded to this request!',
                [
                    {text: 'Ok', onPress: () => { }},
                ],
                {cancelable: false},
            );
        } else {
            let MemberID = global.MyOYEMemberID;
            this.setState({ loading: true });

            const headers = {
                "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
                "Content-Type": "application/json"
            }

            console.log('_____ITEM________')
            console.log(item)

            axios.post('http://apidev.oyespace.com/oyeliving/api/v1/MemberRoleChangeToAdminOwnerUpdate', {
                MRMRoleID : item.sbRoleID,
                MEMemID  : item.sbMemID,
                UNUnitID : item.sbUnitID
            }, {
                headers: headers
            })
            .then(response => {
                console.log('________RESPONSE___________')
                // console.log(response.data);
                // console.log(item.unitName)
                // console.log(item.associationName)

                axios.post(`${CLOUD_FUNCTION_URL}/sendUserNotification`, {
                    sbSubID: item.sbSubID,
                    ntTitle: 'Request Approved',
                    ntDesc: 'Your request to join' + item.mrRolName + ' unit in ' + item.asAsnName + ' association has been approved',
                    ntType: 'Join_Status',
                
                })
                .then(() => {
                    axios.get(`http://apidev.oyespace.com/oyesafe/api/v1/NotificationActiveStatusUpdate/${item.ntid}`, {
                        headers: {
                            "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
                            "Content-Type": "application/json"
                        }
                    })
                    .then(() => {
                        axios.post(`http://apidev.oyespace.com/oyeliving/api/v1/Unit/UpdateUnitRoleStatusAndDate`,
                        {
                            MemberID: item.sbMemID,
                            MemberRoleID: item.sbRoleID,
                            UnitID: item.sbUnitID,
                            SoldDate: item.unSldDate,
                        },
                        {
                            headers: headers
                        }).then(() => {
                            this.props.updateApproveAdmin(this.props.approvedAdmins, item.sbSubID)
                            this.setState({ loading: false })
                        }).catch(error => {
                            alert(error.message)
                            this.setState({ loading: false })
                        })
                        
                    }).catch(error => {
                        alert(error.message)
                        this.setState({ loading: false })
                    })
                })
                .catch(error => {
                    alert(error.message)
                    this.setState({ loading: false })
                })
            })
            .catch(error => {
                alert(error.message)
                this.setState({ loading: false })
            })
        }
        // Alert.alert("***********",`${item.sbRoleID}`)
    }

    reject = (item, status) => {
        // const { approvedAdmins } = this.props;
        // let unitId = item.sbUnitID;
        // let status = _.includes(approvedAdmins, unitId)

        if(status) {
            Alert.alert(
                'Oyespace',
                'You have already responded to this request!',
                [
                    {text: 'Ok', onPress: () => { }},
                ],
                {cancelable: false},
            );
        } else {
            this.setState({ loading: true });

            const headers = {
                "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
                "Content-Type": "application/json"
            }

            axios.get(`http://apidev.oyespace.com/oyeliving/api/v1/GetMemberListByMemberID/${item.sbMemID}`, {
                headers: headers
            })
            .then(() => {
                axios.get(`http://apidev.oyespace.com/oyesafe/api/v1/NotificationActiveStatusUpdate/${item.ntid}`, {
                    headers: {
                        "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
                        "Content-Type": "application/json"
                    }
                })
                .then(() => {
                    axios.post(`${CLOUD_FUNCTION_URL}/sendUserNotification`, {
                        sbSubID: item.sbSubID,
                        ntTitle: 'Request Declined',
                        ntDesc: 'Your request to join' + item.mrRolName + ' unit in ' + item.asAsnName + ' association has been declined',
                        ntType: 'Join_Status',
                    })
                    .then(() => {
                        this.setState({ loading: false })
                        this.props.updateApproveAdmin(this.props.approvedAdmins, item.sbSubID)
                        setTimeout(() => {
                            this.props.navigation.navigate('ResDashBoard')
                        }, 300)
                    })
                    .catch(error => {
                        alert(error.message)
                        this.setState({ loading: false })
                    })
                }).catch(error => {
                    alert(error.message)
                    this.setState({ loading: false })
                })
            })
            .catch(error => {
                alert(error.message)
                this.setState({ loading: false })
            })
        }
    }

    renderButton = () => {
        
        const { loading } = this.state;
        const { navigation, approvedAdmins } = this.props;
        const details = navigation.getParam('details', 'NO-ID');

        let subId = details.sbSubID;
        let status = _.includes(approvedAdmins, subId)

        if(loading) {
            return (
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <ActivityIndicator />
                </View>
            )
        } else return (
            <View style={styles.buttonContainer}>
                <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Avatar 
                        onPress={() => this.reject(details, status)}
                        overlayContainerStyle={{ backgroundColor: 'red'}}
                        rounded 
                        icon={{ name: 'close', type: 'font-awesome', size: 15, color: '#fff' }}
                    />
                    <Text style={{ color: 'red'}}> Reject </Text>
                </View>
                <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center'}}>
                    <Avatar 
                        onPress={() => this.approve(details, status)}
                        overlayContainerStyle={{ backgroundColor: 'orange'}}
                        rounded  
                        
                        icon={{ name: 'check', type: 'font-awesome', size: 15, color: '#fff' }}
                    />
                    <Text style={{ color: 'orange'}}> Approve </Text>
                </View>
            </View>
        )
    }

    render() {
        const { navigation } = this.props;
        const details = navigation.getParam('details', 'NO-ID');
        // console.log('****************')
        // console.log(details)
        // console.log('****************')
        return (
            <View style={styles.container}>
                <Header 
                    leftComponent={{ 
                        icon:'arrow-left', 
                        color: '#ED8A19', 
                        type: "material-community",
                        onPress: () => navigation.pop()
                    }}
                    containerStyle={{ borderBottomColor: '#ED8A19', borderBottomWidth: 2 }}
                    centerComponent={
                        <Image 
                            source={require('../../../pages/assets/images/OyeSpace.png')}
                            style={{ height: 90, width: 90 }}
                        />
                    }
                    backgroundColor="#fff"
                />
                <Text style={styles.titleStyle}> {details.ntDesc} </Text> 
                {this.renderButton()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginTop: 15,
    },

    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 15,
    },

    titleStyle: {
        fontSize: 16,
        marginBottom: 5,
        textAlign: 'center'
    }
})

const mapStateToProps = state => {
    return {
        approvedAdmins: state.AppReducer.approvedAdmins,
    }
}
export default connect(mapStateToProps, { updateApproveAdmin })(NotificationDetailScreen)