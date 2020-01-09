import React, { Component } from 'react';
import { View, TouchableHighlight, Platform, Text } from 'react-native';
import ElevatedView from 'react-native-elevated-view';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import CardView from '../../../components/cardView/CardView';
import base from '../../../base';




export default class Dashboard_1 extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedView: 0
        }
    }


    setView(param) {
        this.setState({ selectedView: param })
    }



    render() {
        let selectedView = this.state.selectedView;
        return (
            <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
                <View style={{ height: heightPercentageToDP('5') }} />
                <ElevatedView elevation={6} style={{ height: heightPercentageToDP(65+5), width: widthPercentageToDP('90'), alignSelf: 'center', backgroundColor: "#e1e1e1", flexDirection: 'column', borderRadius: heightPercentageToDP('5') }}>
                    <View style={{height:heightPercentageToDP(60),width:widthPercentageToDP(90),backgroundColor:'#ffffff',borderBottomLeftRadius:selectedView===0? heightPercentageToDP(0):heightPercentageToDP(5),borderBottomRightRadius: selectedView!==0? heightPercentageToDP(0):heightPercentageToDP(5),borderTopLeftRadius:heightPercentageToDP(5),borderTopRightRadius:heightPercentageToDP(5)}}>
                    <Text style={{alignSelf:'center'}}>selectedView:{selectedView === 0 ? "Unit" : "Admin"}</Text>
                    <Text style={{alignSelf:'center'}}>selectedView:{selectedView === 0 ? "Unit" : "Admin"}</Text>
                    <Text style={{alignSelf:'center'}}>selectedView:{selectedView === 0 ? "Unit" : "Admin"}</Text>
                    <Text style={{alignSelf:'center'}}>selectedView:{selectedView === 0 ? "Unit" : "Admin"}</Text>
                    <Text style={{alignSelf:'center'}}>selectedView:{selectedView === 0 ? "Unit" : "Admin"}</Text>
                    <Text style={{alignSelf:'center'}}>selectedView:{selectedView === 0 ? "Unit" : "Admin"}</Text>
                    <Text style={{alignSelf:'center'}}>selectedView:{selectedView === 0 ? "Unit" : "Admin"}</Text>
                    <Text style={{alignSelf:'center'}}>selectedView:{selectedView === 0 ? "Unit" : "Admin"}</Text>
                    <Text style={{alignSelf:'center'}}>selectedView:{selectedView === 0 ? "Unit" : "Admin"}</Text>
                    <Text style={{alignSelf:'center'}}>selectedView:{selectedView === 0 ? "Unit" : "Admin"}</Text>
                    <Text style={{alignSelf:'center'}}>selectedView:{selectedView === 0 ? "Unit" : "Admin"}</Text>
                    <Text style={{alignSelf:'center'}}>selectedView:{selectedView === 0 ? "Unit" : "Admin"}</Text>
                    <Text style={{alignSelf:'center'}}>selectedView:{selectedView === 0 ? "Unit" : "Admin"}</Text>
                    <Text style={{alignSelf:'center'}}>selectedView:{selectedView === 0 ? "Unit" : "Admin"}</Text>
                    <Text style={{alignSelf:'center'}}>selectedView:{selectedView === 0 ? "Unit" : "Admin"}</Text>
                    <Text style={{alignSelf:'center'}}>selectedView:{selectedView === 0 ? "Unit" : "Admin"}</Text>
                    <Text style={{alignSelf:'center'}}>selectedView:{selectedView === 0 ? "Unit" : "Admin"}</Text>
                    <Text style={{alignSelf:'center'}}>selectedView:{selectedView === 0 ? "Unit" : "Admin"}</Text>
                    <Text style={{alignSelf:'center'}}>selectedView:{selectedView === 0 ? "Unit" : "Admin"}</Text>
                    <Text style={{alignSelf:'center'}}>selectedView:{selectedView === 0 ? "Unit" : "Admin"}</Text>

                    </View>
                    <View style={{ flexDirection: 'row', alignSelf: 'flex-end',borderWidth:0,alignItems:'flex-end' }}>
                        <TouchableHighlight
                            underlayColor={'transparent'}
                            onPress={() => this.setView(0)}>
                            <View style={{ height: heightPercentageToDP(10), elevation: selectedView === 0 ? 10 : 0, 
                                borderBottomLeftRadius: heightPercentageToDP(5), borderBottomRightRadius: heightPercentageToDP(5),
                                 width: widthPercentageToDP('45'), alignSelf: 'center', backgroundColor: selectedView === 0 ? "#ffffff" : "#e1e1e1",}}>
                                

                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            underlayColor={'transparent'}
                            onPress={() => this.setView(1)}>
                            <View style={{ elevation: selectedView != 0 ? 10 : 0, height: heightPercentageToDP(10), 
                                width: widthPercentageToDP('45'), borderBottomLeftRadius: heightPercentageToDP(5),
                                 borderBottomRightRadius: heightPercentageToDP(5), alignSelf: 'center', backgroundColor: selectedView != 0 ? "#ffffff" : "#e1e1e1"}}>
                                {/* <View style={{borderTopLeftRadius:heightPercentageToDP('6'),borderWidth:0,height:heightPercentageToDP('2'),backgroundColor: selectedView !== 0 ? "transparent" : "#e1e1e1",bottom:1,right:1,borderWidth:0}}/>     */}
                            </View>
                        </TouchableHighlight>
                    </View>
                </ElevatedView>


            </View>
        )
    }
}


/**
 * <ElevatedView elevation={6} style={Style.bottomCards}>
                    <CardView
                        height={this.state.myUnitCardHeight}
                        width={this.state.myUnitCardWidth}
                        cardText={'My Unit'}
                        iconWidth={this.state.myUnitIconWidth}
                        iconHeight={this.state.myUnitIconHeight}
                        cardIcon={require('../../../../icons/my_unit.png')}
                        onCardClick={() => this.changeCardStatus('UNIT')}
                        textWeight={'bold'}
                        textFontSize={Platform.OS === 'ios'?8:10}
                        disabled={this.state.isSelectedCard === 'UNIT'}
                    />
                    {this.props.dashBoardReducer.role === 1 &&
                    dropdown1.length !== 0 ? (
                        <CardView
                            height={this.state.adminCardHeight}
                            width={this.state.adminCardWidth}
                            cardText={'Admin'}
                            textWeight={'bold'}
                            iconWidth={this.state.myAdminIconWidth}
                            iconHeight={this.state.myAdminIconHeight}
                            textFontSize={Platform.OS === 'ios'?8:10}
                            onCardClick={() => this.changeCardStatus('ADMIN')}
                            cardIcon={require('../../../../icons/user.png')}
                            disabled={this.state.isSelectedCard === 'ADMIN'}
                        />
                    ) : (
                        <View />
                    )}

                    {/* <CardView
                        height={this.state.offersCardHeight}
                        width={this.state.offersCardWidth}
                        cardText={'Offers Zone'}
                        cardIcon={require("../../../../icons/offers.png")}
                        backgroundColor={base.theme.colors.rosePink}
                        onCardClick={() => this.changeCardStatus("OFFERS")}
                        disabled={this.state.isSelectedCard=== "OFFERS"}
                    />
                    </ElevatedView>
 */