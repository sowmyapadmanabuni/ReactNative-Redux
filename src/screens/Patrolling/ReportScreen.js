/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-07-09
 */

import React from 'react';
import {Dimensions, FlatList, ScrollView, StyleSheet, Text, View} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import base from "../../base";
import {connect} from 'react-redux';


const {height, width} = Dimensions.get('screen');


class ReportScreen extends React.Component {
    constructor(props) {
        super(props);
        console.log("Props:", props);

        this.state = {
            tableHead: [{0: "Date"}, {0: 'Start'}, {0: 'Stop'}, {0: 'Status'}, {0: "Patrolled By"}],
            columns:[{},{},{},{},{},{},{}]
    };

        this.getReport = this.getReport.bind(this);
    }

    componentWillMount() {
        this.getReport();
    }

    async getReport() {
        let self = this;
        //let detail = self.props.navigation.state.params.detail;
        let detail = {
            FromDate: "2019-02-22",
            ToDate: "2019-03-22",
            ASAssnID: 8,
            PSPtrlSID: 1
        };

        let stat = await base.services.OyeSafeApi.getReport(detail);

        console.log("Stat:", stat)

    }


    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Patrolling Report</Text>
                </View>
                <FlatList renderItem={(item, index) => this._renderHead(item, index)}
                          data={this.state.tableHead}
                          keyExtractor={(item, index) => index.toString()}
                          horizontal={true}
                />
                {this.state.columns.map((index)=>{
                   return(
                       <FlatList renderItem={(item, index) => this._renderData(item, index)}
                                 data={this.state.columns}
                                 keyExtractor={(item, index) => index.toString()}
                                 horizontal={true}
                       />
                   )
                })}

            </ScrollView>
        )
    }


    _renderHead(item, index) {
        console.log(item)
        return (
            <View style={{
                height: hp('5%'),
                width: wp('20%'),
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop:50
            }}>
                <Text style={{fontSize: 12}}>{item.item[0]}</Text>
            </View>
        )
    }

    _renderData(item, index) {
        return (
            <View style={{
                height: hp('5%'),
                width: wp('20%'),
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Text style={{fontSize: 12}}>sdkcbsdkhv</Text>
            </View>
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
    head: {height: 40, backgroundColor: '#f1f8ff'},
    text: {margin: 6}
});

const mapStateToProps = state => {
    return {
        SelectedAssociationID: state.UserReducer.SelectedAssociationID
    }
};

export default connect(mapStateToProps)(ReportScreen)