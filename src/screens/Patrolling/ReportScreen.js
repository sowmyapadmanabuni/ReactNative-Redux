/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-07-09
 */

import React from 'react';
import {Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import base from "../../base";
import {connect} from 'react-redux';
import {Row, Rows, Table} from 'react-native-table-component';
import moment from "moment";
import ElevatedView from 'react-native-elevated-view'
import EmptyView from "../../components/common/EmptyView";


const {height, width} = Dimensions.get('screen');


class ReportScreen extends React.Component {
    constructor(props) {
        super(props);
        console.log("Props:", props);

        this.state = {
            tableHead: ["Date", 'Start', 'Stop', 'Status', 'Patrolled By'],
            data: [],
            selectedPage: parseInt('1'),
            slicedArray: [],
            page: [{page: 1, isSelected: true}, {page: 2, isSelected: false}, {page: 3, isSelected: false}]
        };

        this.getReport = this.getReport.bind(this);
    }

    componentWillMount() {
        this.getReport();
    }

    async getReport() {
        let self = this;
        // let detail = self.props.navigation.state.params.detail;
        let detail = {
            FromDate: "2019-02-22",
            ToDate: "2019-03-22",
            ASAssnID: 8,
            PSPtrlSID: 1
        };

        let stat = await base.services.OyeSafeApi.getReport(detail);
        console.log("Stat:", stat);
        try {
            if (stat !== null) {
                let reportData = stat.data.patrolling;
                let reprArr = [];

                for (let i in reportData) {
                    let arr = [
                        moment(reportData[i].ptsDateT).format('DD-MM-YYYY'),
                        moment(reportData[i].ptsDateT).format("HH:MM A"),
                        moment(reportData[i].pteDateT).format("HH:MM A"),
                        reportData[i].ptStatus === "" ? "N/A" : reportData[i].ptStatus,
                        reportData[i].wkfName];
                    reprArr.push(arr)
                }

                let chunkSize = 10;
                let tempArray = [];
                for (let i = 0; i < reprArr.length; i += chunkSize) {
                    let newChunk = reprArr.slice(i, i + chunkSize);
                    tempArray.push(newChunk)
                }
                this.setState({
                    slicedArray: tempArray
                }, () => this.setData())
            } else {
                this.setState({data: stat})
            }
        } catch (e) {
            console.log(e)
        }
    }

    setData() {
        console.log("PAge:", this.state.selectedPage);
        let offSetPage = 1;
        let page = +(this.state.selectedPage - offSetPage);
        let slicedArray = this.state.slicedArray;
        this.setState({
            data: slicedArray[page]
        })
    }


    render() {
        console.log('state:', this.state)
        return (
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Patrolling Report</Text>
                </View>
                {this.state.data !== null ?
                    <Table borderStyle={{borderWidth: 1, borderColor: base.theme.colors.grey}}>
                        <Row data={this.state.tableHead} style={styles.headRow} textStyle={styles.textRow}/>
                        <Rows data={this.state.data} style={styles.row} textStyle={styles.text}/>
                    </Table> :
                    <View style={{justifyContent: 'center', alignItems: 'center', height: hp('70%')}}>
                        <Text>Report not available</Text>
                    </View>}

                {this.renderNavigator()}

            </ScrollView>
        )
    }

    renderNavigator() {
        return (
            <View style={{
                height: hp('10%'),
                width: wp('90%'),
                justifyContent: 'space-around',
                alignItems: 'center',
                alignSelf: 'center',
                flexDirection: 'row'
            }}>
                {this.state.selectedPage !== 1 ?
                    <TouchableHighlight onPress={() => this.changePage(0)}>
                        <Image
                            source={require('../../../icons/prev.png')}
                        />
                    </TouchableHighlight> : <View/>}
                <View style={{borderWidth: 0, alignItems: 'center', width: wp('50%')}}>
                    <FlatList
                        renderItem={(item, index) => this._renderPage(item, index)}
                        data={this.state.page}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal={true}
                        extraData={this.state}
                    />
                </View>
                {this.state.selectedPage !== 3 ?
                    <TouchableHighlight onPress={() => this.changePage(1)}>
                        <Image
                            source={require('../../../icons/next.png')}
                        />
                    </TouchableHighlight> : <EmptyView width={50}/>}
            </View>
        )
    }

    changePage(val) {
        let selectedPage = this.state.selectedPage;
        let pageArr = this.state.page;
        let index = selectedPage - 1;
        if (val === 0) {
            if (index !== 0) {
                this.setState({
                    selectedPage: selectedPage - 1
                }, () => index = index - 1);
            }
        }
        if (val === 1) {
            this.setState({
                selectedPage: selectedPage + 1
            }, () => index = index + 1);
        }
        console.log("Index:",index)
        this.setData();
    }

    onSelect(data) {
        let pageArr = this.state.page;
        let selectedPage = 1;
        for (let i in pageArr) {
            pageArr[i].isSelected = data.item.page === pageArr[i].page;
            if (pageArr[i].isSelected) {
                selectedPage = data.item.page;
            }
        }

        this.setState({
            page: pageArr,
            selectedPage: selectedPage
        }, () => this.setData())

    }

    _renderPage(item, index) {
        return (
            <TouchableHighlight
                underlayColor={base.theme.colors.transparent}
                onPress={() => this.onSelect(item)}
                style={{
                    height: hp('5%'),
                    width: hp('5%'),
                    borderRadius: hp('2.5%'),
                    backgroundColor: item.item.isSelected ? base.theme.colors.primary : base.theme.colors.white,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center'
                }}>
                <ElevatedView elevation={5}>
                    <Text
                        style={{color: item.item.isSelected ? base.theme.colors.white : base.theme.colors.black}}>{item.item.page}</Text>
                </ElevatedView>

            </TouchableHighlight>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: hp('100%'),
        width: wp('100%'),
        color: base.theme.colors.white,

    },
    header: {
        alignItems: 'center',
        justifyContent: "center",
        height: "10%"
    },
    headerText: {
        fontSize: 15,
        fontFamily: base.theme.fonts.medium,
        color: base.theme.colors.primary
    },
    headRow: {height: 40, width: wp('100%'), backgroundColor: base.theme.colors.primary},
    textRow: {margin: 6, color: base.theme.colors.white},
    text: {fontSize: 12, textAlign: 'center'},
    row: {
        height: 40,
        width: wp('100%'),
        backgroundColor: base.theme.colors.white,
        borderColor: base.theme.colors.grey,
        borderWidth: 1
    }
});

const mapStateToProps = state => {
    return {
        SelectedAssociationID: state.UserReducer.SelectedAssociationID
    }
};

export default connect(mapStateToProps)(ReportScreen)