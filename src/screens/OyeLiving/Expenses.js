/*
 * @Author: Sarthak Mishra 
 * @Date: 2019-10-07 11:58:24 
 * @Last Modified by: Sarthak Mishra
 * @Last Modified time: 2019-10-09 13:05:47
 */


import React from 'react';
import { Image, Text, TouchableHighlight, View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { Dropdown } from 'react-native-material-dropdown';
import Modal from 'react-native-modal';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { connect } from 'react-redux';
import ProgressLoader from 'rn-progress-loader';
import base from '../../base';
import CheckBox from 'react-native-check-box';
import SelectMultiple from 'react-native-select-multiple';

const fruits = ['Input', 'Review Rejected', 'Review Accepted','Approved','Rejected','Invoiced'];




class Expenses extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            isDataVisible: false,
            unitList: [],
            dropdownData: [],
            expenseDetail: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
            isModalVisible: false,
            collapse1: false,
            isChecked: false,
            selectedFruits: []
        }

        console.log("Props in Expenses", props)

        this.getUnitList = this.getUnitList.bind(this);
    }

    componentWillMount() {
        this.getUnitList()
    }

    onSelectionsChange = (selectedFruits) => {
        this.setState({ selectedFruits })
    }



    async getUnitList() {
        let self = this;
        self.setState({ isLoading: true })
        let associationId = self.props.SelectedAssociationID;
        console.log("Props in Expenses@@@@@@", associationId)
        self.setState({ isLoading: false })
        try {
            let stat = await base.services.OyeLivingApi.getUnitListByAssociationId(parseInt(associationId));
            console.log("Unit List in Expenses:", stat)
            if (stat.success) {
                let dwMenu = [];
                for (let i in stat.data.unit) {

                    let dropDownObj = {
                        value: stat.data.unit[i].unUniName
                    }
                    dwMenu.push(dropDownObj)
                }
                self.setState({
                    isDataVisible: true,
                    unitList: stat.data.unit,
                    dropdownData: dwMenu
                })
            }
        }
        catch (e) {
            console.log(e)
        }

    }


    onModalOpen() {
        this.setState({
            isModalVisible: !this.state.isModalVisible,
            collapse1: true
        })
    }

    renderModal() {
        return (
            <Modal isModalVisible={this.state.isModalVisible}>
                <View style={{ height: hp('30'), width: wp('50'), backgroundColor: base.theme.colors.primary, alignSelf: 'center' }}>
                    <Text>I am the modal content!</Text>
                </View>
            </Modal>
        )
    }


    render() {
        console.log("State:", this.state)
        return (
            <View style={{ flex: 1, backgroundColor: this.state.isModalVisible ? "#d1d1d1" : base.theme.colors.white }}>
                {this.state.isDataVisible ?
                    <View>
                        <View style={{ position: 'absolute' }}>
                            {this.renderModal()}
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: wp('95'), alignSelf: 'center' }}>
                            <Dropdown
                                label='Select Block'
                                containerStyle={{ width: wp('50') }}
                                data={this.state.dropdownData}
                            />
                            <TouchableHighlight
                                underlayColor={base.theme.colors.transparent}
                                onPress={() => this.onModalOpen()}
                            >
                                <View style={{
                                    flexDirection: 'row', alignItems: 'center', width: wp('45'),
                                    borderBottomWidth: 1, justifyContent: 'flex-start', top: 8, left: 5, borderBottomColor: '#d1d1d1',
                                }}>
                                    <Text>Filter</Text>
                                    <Image
                                        resizeMode={'contain'}
                                        style={{ tintColor: base.theme.colors.primary, alignSelf: 'center', left: wp('30') }}
                                        source={require('../../../icons/filter.png')}
                                    />
                                </View>
                            </TouchableHighlight>
                        </View>
                        {this.state.isModalVisible ?
                            <View style={{ height: hp('60'), width: wp('50'), backgroundColor: base.theme.colors.white, alignSelf: 'flex-end' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: hp('5'), width: wp('49.5'), backgroundColor: base.theme.colors.shadedWhite, alignItems: 'center', alignSelf: 'center' }}>
                                    <Text>Filter by:</Text>
                                    <TouchableHighlight
                                        underlayColor={base.theme.colors.transparent}
                                        onPress={() => this.onModalOpen()}
                                    >
                                        <Text style={{ color: base.theme.colors.blue }}>Clear All</Text>
                                    </TouchableHighlight>
                                </View>
                                <View style={{ flexDirection: 'column', justifyContent: 'center', height: undefined, width: wp('49.5'), backgroundColor: base.theme.colors.white, alignSelf: 'center', borderBottomWidth: 0.5 }}>
                                    <TouchableHighlight
                                        underlayColor={base.theme.colors.transparent}
                                        onPress={() => this.setState({ collapse1: !this.state.collapse1 })}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                            <Text style={{ color: base.theme.colors.black }}>Status</Text>
                                            <Image
                                                resizeMode={'contain'}
                                                style={{ height: hp('5'), width: wp('5'), tintColor: base.theme.colors.black, left: wp('30') }}
                                                source={!this.state.collapse1 ? require('../../../icons/show_less.png') : require('../../../icons/show_more.png')}
                                            />
                                        </View>

                                    </TouchableHighlight>
                                    <Collapsible collapsed={this.state.collapse1}>
                                        <SelectMultiple
                                            items={fruits}
                                           // renderLabel={this.renderLabel}
                                            selectedItems={this.state.selectedFruits}
                                            onSelectionsChange={this.onSelectionsChange} />
                                    </Collapsible>
                                </View>
                            </View> : <View />}

                    </View>
                    :
                    <View />}
                <ProgressLoader
                    visible={this.state.isLoading}
                    isModal={true} isHUD={true}
                    hudColor={"#000000"}
                    color={"#FFFFFF"} />

            </View>
        )
    }

     renderLabel(label, style){
        return (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{marginLeft: 10}}>
              <Text style={style}>{label}</Text>
            </View>
          </View>
        )
      }
}

const mapStateToProps = state => {
    return {
        oyeURL: state.OyespaceReducer.oyeURL,
        champBaseURL: state.OyespaceReducer.champBaseURL,
        oye247BaseURL: state.OyespaceReducer.oye247BaseURL,
        oyeBaseURL: state.OyespaceReducer.oyeBaseURL,
        userReducer: state.UserReducer,
        SelectedAssociationID: state.DashboardReducer.assId
    }
};


export default connect(mapStateToProps)(Expenses);
