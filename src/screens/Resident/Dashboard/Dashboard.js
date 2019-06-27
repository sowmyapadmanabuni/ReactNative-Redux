/**
 * Created by Jyoth Menda at Synclovis Systems Pvt. Ltd. on 2019-06-25
 */

import React from 'react';
import {FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import base from '../../../base'
import {connect} from 'react-redux'
import CardView from "../../../components/CardView";
import {Dropdown} from "react-native-material-dropdown";
import ElevatedView from 'react-native-elevated-view'
import OSButton from "../../../components/OSButton";


class Dashboard extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        console.log("Dashboard Props", this.props)
        let associationList = [];
        let untiList = [];
        let invoiceList = [{invoiceNumber: 528, bill: 12300, dueDate: '11-May-2019'},
            {invoiceNumber: 527, bill: 12800, dueDate: '8-May-2019'}]

        return (
            <View style={styles.container}>
                <View style={styles.dropDownContainer}>
                    <View style={styles.leftDropDown}>
                        <Dropdown
                            value="Building Complex Name"
                            data={associationList}
                            textColor="#000"
                            onChangeText={(value, index) =>
                                this.onAssociationChange(value, index)
                            }
                        />
                    </View>
                    <View style={styles.rightDropDown}>
                        <Dropdown
                            value="Unit"
                            data={untiList}
                            textColor="#000"
                            dropdownPosition={-3}
                            onChangeText={(value, index) => {
                                updateUserInfo({
                                    prop: "SelectedUnitID",
                                    value: unitList[index].unitId
                                });
                            }}
                        />
                    </View>
                </View>
                <ElevatedView elevation={10}
                              style={styles.mainElevatedView}
                >
                    <View style={styles.elevatedView}>
                        <CardView
                            height={"100%"}
                            width={"25%"} cardText={' Family Members'}
                            cardIcon={require("../../../../icons/call.png")}
                            cardCount={5}
                            marginTop={20}/>
                        <CardView
                            height={"100%"}
                            width={"25%"} cardText={'Vehicles'}
                            cardIcon={require("../../../../icons/call.png")}
                            cardCount={4}
                            marginTop={20}/>
                        <CardView
                            height={"100%"}
                            width={"25%"} cardText={'Visitors'}
                            cardIcon={require("../../../../icons/call.png")}
                            cardCount={2}
                            marginTop={20}/>
                    </View>
                    <View style={styles.elevatedViewSub}>
                        <CardView
                            height={"100%"}
                            width={"39%"} cardText={'Documents'}
                            cardIcon={require("../../../../icons/call.png")}
                            cardCount={0}
                        />
                        <CardView
                            height={"100%"}
                            width={"39%"} cardText={'Tickets'}
                            cardIcon={require("../../../../icons/call.png")}
                            cardCount={2}
                        />

                    </View>
                    <ElevatedView elevation={12}
                                  style={styles.invoiceCardView}>
                        <View style={styles.invoiceHeadingView}>
                            <Text style={styles.invoiceText}>Invoices</Text>
                            <TouchableOpacity>
                                <Text style={styles.viewMoreText}>View more</Text>
                            </TouchableOpacity>
                        </View>
                        {invoiceList ?

                            <FlatList
                                data={invoiceList}
                                extraData={this.state}
                                style={{flex: 1}}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={(item) => this.listOfInvoices(item)}
                            />
                            :
                            <Text>No Invoices</Text>
                        }
                    </ElevatedView>
                </ElevatedView>
                <View style={styles.bottomCards}>
                    <CardView
                        height={"90%"}
                        width={"25%"} cardText={'My Unit'}
                        cardIcon={require("../../../../icons/call.png")}
                        onCardClick={() => this.myUnit()}/>
                    <CardView
                        height={"90%"}
                        width={"25%"}
                        cardText={'Admin'}
                        onCardClick={() => this.props.navigation.navigate('AdminFunction')}
                        cardIcon={require("../../../../icons/call.png")}/>
                    <CardView
                        height={"90%"}
                        width={"25%"}
                        cardText={'Offers'}
                        cardIcon={require("../../../../icons/call.png")}
                    />
                </View>
                <View style={styles.supportContainer}>
                    <TouchableOpacity>
                        <Image style={[styles.supportIcon]}
                               source={require("../../../../icons/call.png")}/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image
                            style={styles.supportIcon}
                            source={require("../../../../icons/call.png")}/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image
                            style={styles.supportIcon}
                            source={require("../../../../icons/call.png")}/>
                    </TouchableOpacity>
                </View>
            </View>
        )

    }

    myUnit() {
        console.log(this.props)
    }

    listOfInvoices(item) {
        console.log(item);
        return (
            <TouchableOpacity style={{width: '100%', height: '80%', borderWidth: 1}}>
                <View style={styles.invoiceView}>
                    <View style={styles.invoiceSubView}>
                        <Text>Invoice No. {item.item.invoiceNumber}</Text>
                        <Text>{'\u20B9'} {item.item.bill}</Text>
                    </View>
                    <View style={styles.invoiceSubView}>
                        <Text>Due No. {item.item.dueDate}</Text>
                        <OSButton
                            height={'90%'}
                            width={'30%'}
                            borderRadius={15}
                            oSBBackground={base.theme.colors.primary}/>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    dropDownContainer: {
        height: '10%',
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    leftDropDown: {
        width: '60%'
    },
    rightDropDown: {
        width: '30%'
    },
    bottomCards: {
        height: '12%',
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    supportContainer: {
        height: '6%',
        width: '95%',
        alignItems: 'center',
        backgroundColor: base.theme.colors.white,
        borderColor: base.theme.colors.primary,
        borderWidth: 1,
        marginBottom: 5,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    supportIcon: {
        height: 25,
        width: 25,
        borderRadius: 5,
        marginRight: 10
    },
    elevatedView: {
        alignItems: 'center',
        //backgroundColor:base.theme.colors.primary,
        height: '20%',
        justifyContent: 'space-around',
        flexDirection: 'row',
    },
    elevatedViewSub: {
        marginTop: 30,
        height: '20%',
        justifyContent: 'space-around',
        flexDirection: 'row',
        width: '65%',
        //backgroundColor:base.theme.colors.primary,
        alignSelf: 'center',
    },
    mainElevatedView: {
        height: '65%',
        width: '95%',
        borderRadius: 25,
        backgroundColor: base.theme.colors.white
    },
    invoiceCardView: {
        height: '45%',
        width: '95%',
        borderRadius: 5,
        margin: 10,
        backgroundColor: base.theme.colors.white,
        alignItems: 'center'
    },
    invoiceHeadingView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        margin: 5
    },
    invoiceText: {
        color: base.theme.colors.primary,
        fontSize: 14
    },
    viewMoreText: {
        color: "blue",
        fontSize: 14
    },
    invoiceView: {
        backgroundColor: '#876543',
        width: 300,
    },
    invoiceSubView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '80%',
        alignSelf: 'center'
    }
})


const mapStateToProps = state => {
    return {
        userReducer: state.UserReducer,
    };
};

export default connect(mapStateToProps)(Dashboard)