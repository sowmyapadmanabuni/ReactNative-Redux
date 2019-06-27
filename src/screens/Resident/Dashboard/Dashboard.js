import React from 'react';
import {
    View,
    Text,
    StatusBar,
    StyleSheet,
    FlatList,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions
} from 'react-native';
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
        let invoiceList = [{invoiceNumber: 528, bill: 12300, dueDate: '11-May-2019', status: "NOT PAID"},
            {invoiceNumber: 527, bill: 12800, dueDate: '8-May-2019', status: "PAID"}]

        return (
            <View style={styles.container}>
                <View style={styles.dropDownContainer}>
                    <View style={styles.leftDropDown}>
                        <Dropdown
                            value="Building Complex Name"
                            data={associationList}
                            textColor={base.theme.colors.black}
                            dropdownOffset={{top: 10, left: 0}}
                            onChangeText={(value, index) =>
                                this.onAssociationChange(value, index)
                            }
                            pickerStyle={{color: base.theme.colors.primary}}
                        />
                    </View>
                    <View style={styles.rightDropDown}>
                        <Dropdown
                            value="Unit"
                            data={untiList}
                            textColor="#000"
                            dropdownOffset={{top: 10, left: 0}}
                            dropdownPosition={-3}
                            onChangeText={(value, index) => {
                                updateUserInfo({
                                    prop: "SelectedUnitID",
                                    value: unitList[index].unitId
                                });
                            }}
                            pickerStyle={{color: base.theme.colors.primary}}
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
                            cardIcon={require("../../../../icons/view_all_visitors.png")}
                            cardCount={5}
                            marginTop={20}
                            backgroundColor={base.theme.colors.shadedWhite}/>
                        <CardView
                            height={"100%"}
                            width={"25%"} cardText={'Vehicles'}
                            cardIcon={require("../../../../icons/vehicle.png")}
                            cardCount={4}
                            marginTop={20}
                            backgroundColor={base.theme.colors.shadedWhite}/>
                        <CardView
                            height={"100%"}
                            width={"25%"} cardText={'Visitors'}
                            cardIcon={require("../../../../icons/view_all_visitors.png")}
                            cardCount={2}
                            marginTop={20}
                            backgroundColor={base.theme.colors.shadedWhite}/>
                    </View>
                    <View style={styles.elevatedViewSub}>
                        <CardView
                            height={"100%"}
                            width={"39%"} cardText={'Documents'}
                            cardIcon={require("../../../../icons/report.png")}
                            cardCount={0}
                            backgroundColor={base.theme.colors.shadedWhite}
                        />
                        <CardView
                            height={"100%"}
                            width={"39%"} cardText={'Tickets'}
                            cardIcon={require("../../../../icons/tickets.png")}
                            cardCount={2}
                            backgroundColor={base.theme.colors.shadedWhite}
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
                        {invoiceList.length > 0 ?

                            <ScrollView style={styles.scrollView}>
                                <FlatList
                                    data={invoiceList}
                                    extraData={this.state}
                                    style={styles.flatList}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={(item) => this.listOfInvoices(item)}
                                />
                            </ScrollView>
                            :
                            <View style={styles.noDataView}>
                                <Text style={styles.noDataMsg}>No Invoices</Text>
                            </View>
                        }

                    </ElevatedView>
                </ElevatedView>
                <View style={styles.bottomCards}>
                    <CardView
                        height={"90%"}
                        width={"30%"} cardText={'My Unit'}
                        cardIcon={require("../../../../icons/myUnit.png")}
                        onCardClick={() => this.myUnit()}
                        disabled={true}/>
                    <CardView
                        height={"70%"}
                        width={"25%"}
                        cardText={'Admin'}
                        cardIcon={require("../../../../icons/user.png")}/>
                    onCardClick={() => this.props.navigation.navigate('AdminFunction')}
                    <CardView
                        height={"70%"}
                        width={"25%"}
                        cardText={'Offers'}
                        cardIcon={require("../../../../icons/offers.png")}
                        backgroundColor={base.theme.colors.rosePink}
                    />
                </View>
                <View style={styles.supportContainer}>
                    <View style={styles.subSupportView}>
                        <TouchableOpacity>
                            <Image style={[styles.supportIcon]}
                                   source={require("../../../../icons/call.png")}/>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image
                                style={styles.supportIcon}
                                source={require("../../../../icons/chat.png")}/>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image
                                style={styles.supportIcon}
                                source={require("../../../../icons/email.png")}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )

    }

    myUnit() {
        console.log(this.props)
    }

    listOfInvoices(item) {
        base.utils.logger.log(item);
        return (
            <TouchableOpacity>
                <View style={styles.invoiceView}>
                    <View style={styles.invoiceSubView}>
                        <Text style={styles.invoiceNumberText}>Invoice No. {item.item.invoiceNumber}</Text>
                        <Text style={styles.billText}><Text style={styles.rupeeIcon}>{'\u20B9'}
                        </Text> {item.item.bill}</Text>

                    </View>
                    <View style={styles.invoiceSubView}>
                        <Text style={styles.dueDate}>Due No. {item.item.dueDate}</Text>
                        <OSButton
                            height={'80%'}
                            width={'25%'}
                            borderRadius={15}
                            oSBBackground={item.item.status === "PAID" ? base.theme.colors.grey : base.theme.colors.primary}
                            oSBText={item.item.status === "PAID" ? "Paid" : "Pay Now"}/>
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
        // marginBottom: 20,
        //  backgroundColor:base.theme.colors.grey
    },
    leftDropDown: {
        width: '60%'
    },
    rightDropDown: {
        width: '30%'
    },
    bottomCards: {
        height: '15%',
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        alignItems: 'center',
    },
    supportContainer: {
        height: '6%',
        width: '90%',
        alignItems: 'center',
        backgroundColor: base.theme.colors.white,
        borderColor: base.theme.colors.primary,
        borderWidth: 1,
        marginTop: 5,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    supportIcon: {
        height: 25,
        width: 25,
        borderRadius: 5,
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
        color: base.theme.colors.blue,
        fontSize: 14
    },
    invoiceView: {
        width: '100%',
        height: 70,
        backgroundColor: base.theme.colors.lavender,
        marginBottom: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    invoiceSubView: {
        width: "90%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    subSupportView: {
        height: '100%',
        width: '45%',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
    },
    invoiceNumberText: {
        fontSize: 14,
        color: base.theme.colors.black
    },
    dueDate: {
        fontSize: 14,
        color: base.theme.colors.blue
    },
    rupeeIcon: {
        fontSize: 18,
        color: base.theme.colors.primary,
    },
    billText: {
        fontSize: 18,
        color: base.theme.colors.black,
        fontWeight: 'bold',
    },
    flatList: {
        height: '100%',
        width: '100%',
    },
    scrollView: {
        height: '80%',
        width: '90%',
    },
    noDataMsg: {
        fontSize: 18,
        color: base.theme.colors.grey
    },
    noDataView: {
        height: '80%',
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center'
    }

});


const mapStateToProps = state => {
    return {
        userReducer: state.UserReducer,
    };
};

export default connect(mapStateToProps)(Dashboard)