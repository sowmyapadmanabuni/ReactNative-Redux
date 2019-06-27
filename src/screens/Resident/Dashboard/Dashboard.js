import React from 'react';
import {
    View,
    Text,
    FlatList,
    ScrollView,
    Image,
    TouchableOpacity,
    TouchableHighlight
} from 'react-native';
import base from '../../../base'
import {connect} from 'react-redux'
import CardView from "../../../components/cardView/CardView";
import {Dropdown} from "react-native-material-dropdown";
import ElevatedView from 'react-native-elevated-view'
import OSButton from "../../../components/osButton/OSButton";
import Style from './Style'


class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.props=props;
    }


    render() {
       // base.utils.logger.log(this.props)

        let associationList = [];
        let unitList = [];
        let invoiceList = [{invoiceNumber: 528, bill: "12,300", dueDate: '11-May-2019', status: "NOT PAID"},
            {invoiceNumber: 527, bill: "12,800", dueDate: '8-May-2019', status: "PAID"}]

        return (
            <View style={Style.container}>
                <View style={Style.dropDownContainer}>
                    <View style={Style.leftDropDown}>
                        <Dropdown
                            value="Building Complex Name"
                            data={associationList}
                            textColor={base.theme.colors.black}
                            inputContainerStyle={{ borderBottomColor: 'transparent' }}
                            dropdownOffset={{top: 10, left: 0}}
                            onChangeText={(value, index) =>
                                this.onAssociationChange(value, index)
                            }
                        />
                    </View>
                    <View style={Style.rightDropDown}>
                        <Dropdown
                            value="Unit"
                            data={unitList}
                            inputContainerStyle={{ borderBottomColor: 'transparent' }}
                            textColor="#000"
                            dropdownOffset={{top: 10, left: 0}}
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
                <ElevatedView elevation={6} style={Style.mainElevatedView}>

                    <View style={Style.elevatedView}>
                        <CardView
                            height={"100%"}
                            width={"25%"} cardText={' Family Members'}
                            cardIcon={require("../../../../icons/view_all_visitors.png")}
                            cardCount={5}
                            marginTop={20}
                            backgroundColor={base.theme.colors.cardBackground}/>
                        <CardView
                            height={"100%"}
                            width={"25%"} cardText={'Vehicles'}
                            cardIcon={require("../../../../icons/vehicle.png")}
                            cardCount={4}
                            marginTop={20}
                            backgroundColor={base.theme.colors.cardBackground}/>
                        <CardView
                            height={"100%"}
                            width={"25%"} cardText={'Visitors'}
                            cardIcon={require("../../../../icons/view_all_visitors.png")}
                            cardCount={2}
                            marginTop={20}
                            backgroundColor={base.theme.colors.cardBackground}/>
                    </View>

                    <View style={Style.elevatedViewSub}>
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
                    <ElevatedView elevation={0} style={Style.invoiceCardView}>
                        <View style={Style.invoiceHeadingView}>
                            <Text style={Style.invoiceText}>Invoices</Text>
                            <TouchableOpacity>
                                <Text style={Style.viewMoreText}>View more</Text>
                            </TouchableOpacity>
                        </View>
                        {invoiceList.length > 0 ?

                            <ScrollView style={Style.scrollView}>
                                <FlatList
                                    data={invoiceList}
                                    extraData={this.state}
                                    style={Style.inVoiceFlatList}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={(item) => this.listOfInvoices(item)}
                                />
                            </ScrollView>
                            :
                            <View style={Style.noDataView}>
                                <Text style={Style.noDataMsg}>No Invoices</Text>
                            </View>
                        }

                    </ElevatedView>
                </ElevatedView>
                <View style={Style.bottomCards}>
                    <CardView
                        height={"80%"}
                        width={"25%"} cardText={'My Unit'}
                        cardIcon={require("../../../../icons/my_unit.png")}
                        disabled={true}/>
                    <CardView
                        height={"70%"}
                        width={"22%"}
                        cardText={'Admin'}
                        onCardClick={() => this.props.navigation.navigate('AdminFunction')}
                        cardIcon={require("../../../../icons/user.png")}/>
                    <CardView
                        height={"70%"}
                        width={"22%"}
                        cardText={'Offers'}
                        cardIcon={require("../../../../icons/offers.png")}
                        backgroundColor={base.theme.colors.rosePink}
                    />
                </View>
                <View style={Style.supportContainer}>
                    <View style={Style.subSupportView}>
                        <TouchableOpacity>
                            <Image style={[Style.supportIcon]}
                                   source={require("../../../../icons/call.png")}/>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image
                                style={Style.supportIcon}
                                source={require("../../../../icons/chat.png")}/>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image
                                style={Style.supportIcon}
                                source={require("../../../../icons/email.png")}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )

    }


    listOfInvoices(item) {
        base.utils.logger.log(item);
        return (
            <TouchableHighlight underlayColor={'transparent'}>
                <View style={Style.invoiceView}>
                    <View style={Style.invoiceSubView}>
                        <Text style={Style.invoiceNumberText}>Invoice No. {item.item.invoiceNumber}
                        </Text>
                        <Text style={Style.billText}>
                            <Text style={Style.rupeeIcon}>{'\u20B9'}
                        </Text>
                            {item.item.bill}</Text>

                    </View>
                    <View style={Style.invoiceSubView}>
                        <Text style={Style.dueDate}>Due No. {item.item.dueDate}</Text>
                        <OSButton
                            height={'80%'}
                            width={'25%'}
                            borderRadius={15}
                            oSBBackground={item.item.status === "PAID" ? base.theme.colors.grey : base.theme.colors.primary}
                            oSBText={item.item.status === "PAID" ? "Paid" : "Pay Now"}/>
                    </View>
                </View>
            </TouchableHighlight>

        );
    }

}

const mapStateToProps = state => {
    return {
        userReducer: state.UserReducer,
    };
};

export default connect(mapStateToProps)(Dashboard)