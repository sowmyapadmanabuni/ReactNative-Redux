import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
import { Button, Header, Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { CLOUD_FUNCTION_URL } from '../../../constant';

class NotificationDetailScreen extends Component {
    state = {
        loading: false
    }


    approve = (item) => {
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
            console.log(response.data);
            console.log(item.unitName)
            console.log(item.associationName)
            axios.post(`${CLOUD_FUNCTION_URL}/sendUserNotification`, {
                sbSubID: item.sbSubID,
                ntTitle: 'Request Approved',
                ntDesc: 'Your request to join' + item.mrRolName + ' unit in ' + item.asAsnName + ' association has been approved'
                // ntDesc: 'Your request to join association has been approved',
            })
            .then(() => {
                this.setState({ loading: false })
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
        // Alert.alert("***********",`${item.sbRoleID}`)
    }

    reject = (item) => {
        console.log(item)
        this.setState({ loading: true });

        axios.post(`${CLOUD_FUNCTION_URL}/sendUserNotification`, {
            sbSubID: item.sbSubID,
            ntTitle: 'Request Declined',
            ntDesc: 'Your request to join' + item.mrRolName + ' unit in ' + item.asAsnName + ' association has been declined'
            // ntDesc: 'Your request to join association has been approved',
        })
        .then(() => {
            this.setState({ loading: false })
            setTimeout(() => {
                this.props.navigation.navigate('ResDashBoard')
            }, 300)
        })
        .catch(error => {
            alert(error.message)
            this.setState({ loading: false })
        })
    }

    renderButton = () => {
        const { loading } = this.state;
        const { navigation } = this.props;
        const details = navigation.getParam('details', 'NO-ID');

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
                        onPress={() => this.reject(details)}
                        overlayContainerStyle={{ backgroundColor: 'red'}}
                        rounded 
                        icon={{ name: 'close', type: 'font-awesome', size: 15, color: '#fff' }}
                    />
                    <Text style={{ color: 'red'}}> Reject </Text>
                </View>
                <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center'}}>
                    <Avatar 
                        onPress={() => this.approve(details)}
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
        console.log('****************')
        console.log(details)
        console.log('****************')
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

export default NotificationDetailScreen