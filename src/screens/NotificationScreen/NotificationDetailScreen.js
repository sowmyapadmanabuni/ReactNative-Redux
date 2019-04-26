import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Button } from 'react-native-elements';
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
            axios.post(`${CLOUD_FUNCTION_URL}/sendUserNotification`, {
                sbSubID: item.sbSubID,
                ntTitle: 'Request Approved',
                ntDesc: 'Your request to join ' + item.unitName + ' unit in' + item.associationName + ' association has been approved'
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
        Alert.alert("***********",`${item.sbRoleID}`)
    }

    renderButton = () => {
        const { loading } = this.state;
        const { navigation } = this.props;
        const details = navigation.getParam('details', 'NO-ID');

        if(loading) {
            return (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator />
                </View>
            )
        } else return (
            <View style={styles.buttonContainer}>
                <Button
                    containerStyle={{ flex: 1}} 
                    onPress={() => this.approve(details)}
                    type="solid"
                    title="Approve" 
                    icon={
                        <Icon
                        name="check"
                        size={15}
                        color="white"
                        />
                    }
                    buttonStyle={{ backgroundColor: 'green', margin: 5  }}
                />
                <Button 
                    containerStyle={{ flex: 1}} 
                    type="solid"
                    title="Reject"
                    onPress={() => this.props.navigation.navigate('ResDashBoard')}
                    icon={
                        <Icon
                        name="close"
                        size={15}
                        color="white"
                        />
                    }
                    buttonStyle={{ backgroundColor: 'red', margin: 5 }}
                /> 
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
                <Text style={styles.titleStyle}> {details.ntDesc} </Text> 
                {this.renderButton()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 15,
    },

    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 15,
    },

    titleStyle: {
        fontSize: 16,
        marginBottom: 5,
        textAlign: 'center'
    }
})

export default NotificationDetailScreen