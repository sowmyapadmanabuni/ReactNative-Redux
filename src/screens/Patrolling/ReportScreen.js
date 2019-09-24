/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-07-09
 */

import React from 'react';
import {
    BackHandler,
    Dimensions,
    FlatList,
    Image,
    PermissionsAndroid,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import base from "../../base";
import {connect} from 'react-redux';
import {Cell, Table, TableWrapper} from 'react-native-table-component';
import moment from "moment";
import {Row} from '../../base/services/rows'
import RNHTMLtoPDF from "react-native-html-to-pdf";
import RNFetchBlob from "rn-fetch-blob";
import Share from "react-native-share";
import StaffReportStyle from "../Resident/Visitors/Staff/StaffReportStyle";
import ReportScreenStyles from "./ReportScreenStyles";

let RNFS = require('react-native-fs');


const {height, width} = Dimensions.get('screen');

let inActiveLeftIcon = require('../../../icons/prev.png');
let activeLeftIcon = require('../../../icons/prev1.png');
let inActiveRightIcon = require('../../../icons/next1.png');
let activeRightIcon = require('../../../icons/next.png');


class ReportScreen extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            bottomPageIndicator: [],
            tableHead: [["Date", true], ['Start'], ['Stop'], ['Status'], ['Patrolled By']],
            tableData: [],
            isPermitted: false,
            filePath: '',
            isShowViewPager: false,
            numberOfPages: 0,
            pageLimit: 10,
            pageNumber: 1,
            slotName: '',
            slotTime: '',
            patrollingReport: [],
            data: []
        },
            this.getReport = this.getReport.bind(this);


    }

    componentWillMount() {
        if (Platform.OS === 'android') {
            this.getAndroidPermissions()
        } else {
            this.setState({
                isPermitted: true
            })
        }
        this.setState({
            slotName: this.props.navigation.state.params.detail.slotName,
            slotTime: this.props.navigation.state.params.detail.slotTime
        }, () => this.getReport())

    }

    componentDidUpdate() {
        setTimeout(() => {
            BackHandler.addEventListener('hardwareBackPress', () => this.processBackPress())
        }, 100)
    }

    componentWillUnmount() {
        setTimeout(() => {
            BackHandler.removeEventListener('hardwareBackPress', () => this.processBackPress())
        }, 0)

    }

    processBackPress() {
        console.log("Part");
        const {goBack} = this.props.navigation;
        goBack(null);
    }

    getAndroidPermissions() {
        let that = this;

        async function requestExternalWritePermission() {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'OyeSpace External Storage Write Permission',
                        message:
                            'OyeSpace App needs access to Storage data in your SD Card ',
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    //If WRITE_EXTERNAL_STORAGE Permission is granted
                    //changing the state to show Create PDF option
                    that.setState({isPermitted: true});
                } else {
                    alert('WRITE_EXTERNAL_STORAGE permission denied');
                }
            } catch (err) {
                alert('Write permission err');
                console.warn(err);
            }
        }

        //Calling the External Write permission function
        requestExternalWritePermission();
    }


    async generatePDF() {
        let docFolder = Platform.OS === 'android' ? 'documents' : 'docs';
        let htmlContent = base.utils.validate.patrollingReportData(this.state.tableHead, this.state.patrollingReport);
        let options = {
            html: htmlContent,
            fileName: 'Patrolling Report-' + this.state.slotName,
            directory: docFolder,
        };
        let file = await RNHTMLtoPDF.convert(options);

        if (Platform.OS === 'android' && this.state.isPermitted) {
            const folder = RNFetchBlob.fs.dirs.DownloadDir + "/OyeSpace";
            await RNFS.mkdir(folder);
            const fileName = "Patrolling Report" + ".pdf";

            await RNFS.copyFile(file.filePath, RNFetchBlob.fs.dirs.DownloadDir + "/OyeSpace/" + fileName);

            let shareOptions = {
                type: 'application/pdf',
                url: "file://" + RNFetchBlob.fs.dirs.DownloadDir + "/OyeSpace/" + fileName
            };

            await Share.open(shareOptions).then((res) => {
                console.log("Share options", res)
            })
                .done((res) => {
                    console.log("Share done", res)
                });
            await RNFS.unlink(file.filePath);

        } else {

            let shareOptions = {
                type: 'application/pdf',
                url: file.filePath
            };
            await Share.open(shareOptions).then((res) => {
                console.log("SHARE FILE ", res)
            })
                .catch(err => console.log("SHARE ERROR::", err));
        }
    }

    async getReport(props) {
        let self = this;
        let input = self.props.navigation.state.params.detail;    //Uncpmmet
        // let input = {
        //     "FromDate" : "2019-07-12",
        //     "ToDate"   : "2019-07-30",
        //     "ASAssnID" : 8,
        //     "PSPtrlSID": 1
        // };

        let stat = await base.services.OyeSafeApi.getReport(input);
        let startDate = input.FromDate;
        let endDate = input.ToDate;
        let initialDateString = moment(input.FromDate, "YYYY-MM-DDTHH:mm:ss a");
        let endDateString = moment(input.ToDate, "YYYY-MM-DDTHH:mm:ss a");
        let duration = moment.duration(endDateString.diff(initialDateString));
        base.utils.logger.log(duration.days());
        let difference = duration.as('days');
        base.utils.logger.log(stat);
        try {
            if (stat !== null && stat.data.patrolling.length !== 0) {
                let reportsData = stat.data.patrolling;
                let reprArr = [];
                if (difference !== 0) {
                    for (let i = 0; i <= difference; i++) {
                        console.log(startDate, moment(reportsData[i].ptdCreated).format("YYYY-MM-DD"));
                        if (!reportsData[i] || startDate == moment(reportsData[i].ptdCreated).format('YYYY-MM-DD')) {
                            let arr = [
                                moment(startDate).format('DD-MM-YYYY'),
                                ' Patrolling is not Done'
                            ];
                            reprArr.push(arr)

                        } else {
                            let arr = [
                                moment(reportsData[i].ptdCreated).format('DD-MM-YYYY'),
                                moment(reportsData[i].ptsDateT).format("hh:mm A"),
                                moment(reportsData[i].pteDateT).format("hh:mm A"),
                                reportsData[i].ptStatus === "" ? "N/A" : reportsData[i].ptStatus,
                                reportsData[i].wkfName];
                            reprArr.push(arr)
                        }
                        if (startDate !== endDate) {
                            startDate = moment(startDate).add(1, 'day').format('YYYY-MM-DD');
                        }
                    }

                } else {
                    let arr = [
                        moment(reportsData[0].ptdCreated).format('DD-MM-YYYY'),
                        moment(reportsData[0].ptsDateT).format("hh:mm A"),
                        moment(reportsData[0].pteDateT).format("hh:mm A"),
                        reportsData[0].ptStatus === "" ? "N/A" : reportsData[0].ptStatus,
                        reportsData[0].wkfName];
                    reprArr.push(arr)
                }
                let numberOfPages = reprArr.length / self.state.pageLimit;
                let dataBottomList = [];
                if (numberOfPages !== parseInt(numberOfPages)) {
                    numberOfPages = parseInt(numberOfPages) + 1
                }

                for (let i = 0; i < numberOfPages; i++) {
                    dataBottomList[i] = i + 1
                }

                self.setState({
                    numberOfPages: numberOfPages,
                    bottomPageIndicator: dataBottomList,
                    tableData: reprArr,
                    patrollingReport: reprArr,
                    data: reprArr

                });

                self.changeTheData(self.state.pageNumber)

            } else {
                self.setState({data: []})
            }
        } catch (error) {
            base.utils.logger.log(error)
        }
    }

    render() {
        console.log("Data:", this.state.data);
        return (
            <View style={StaffReportStyle.mainContainer}>
                <View style={ReportScreenStyles.header}>
                    <Text style={ReportScreenStyles.headerText}>Patrolling Report</Text>
                </View>
                <View style={ReportScreenStyles.entryTimeView}>
                    <Image
                        resizeMode={'contain'}
                        style={ReportScreenStyles.entryIcon}
                        source={require('../../../icons/entry_time.png')}
                    />
                    <View style={ReportScreenStyles.slotTimeView}>
                        <Text>{this.state.slotName}</Text>
                        <Text>{this.state.slotTime}</Text>
                    </View>
                    {this.state.data === undefined || this.state.data.length !== 0 ?
                        <TouchableOpacity
                            underlayColor={base.theme.colors.transparent}
                            onPress={() => this.generatePDF()}
                            style={ReportScreenStyles.shareIconView}>
                            <Image
                                resizeMode={'contain'}
                                style={ReportScreenStyles.shareIcon}
                                source={require('../../../icons/share.png')}
                            />
                        </TouchableOpacity> : <View style={ReportScreenStyles.shareIconView}/>}
                </View>

                <ScrollView style={StaffReportStyle.scrollViewTable}>
                    {this.renderViewPagerData()}
                </ScrollView>
                {this.bottomNavigator()}
            </View>
        )
    }

    bottomNavigator() {
        return (
            this.state.numberOfPages > 1 ?
                <View style={StaffReportStyle.bottomView}>
                    <TouchableOpacity style={{alignItems: 'center'}}
                                      onPress={() => this.changeTheData(this.state.pageNumber - 1)}
                                      disabled={this.state.pageNumber === 1}>
                        <Image style={StaffReportStyle.arrowIcon}
                               source={this.state.pageNumber === 1 ? inActiveLeftIcon : activeLeftIcon}
                        />
                    </TouchableOpacity>
                    <View style={StaffReportStyle.viewPagerIcons}>
                        <FlatList
                            data={this.state.bottomPageIndicator}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={(item) => this.arrangeBottomTab(item)}
                            extraData={this.state}
                            horizontal={true}
                        />
                    </View>
                    <TouchableOpacity style={{alignItems: 'center'}}
                                      onPress={() => this.changeTheData(this.state.pageNumber + 1)}
                                      disabled={this.state.pageNumber === this.state.numberOfPages}>
                        <Image style={StaffReportStyle.arrowIcon}
                               source={this.state.pageNumber === this.state.numberOfPages ? inActiveRightIcon : activeRightIcon}
                        />
                    </TouchableOpacity>
                </View>
                :
                <View/>
        );
    }

    arrangeBottomTab(item) {
        return (
            <TouchableOpacity onPress={() => this.changeTheData(item.index + 1)}
                              style={[StaffReportStyle.bottomTabView, {
                                  shadowOffset: {width: 0, height: Platform.OS === 'ios' ? 3 : 2},
                                  shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.8,
                                  backgroundColor: this.state.pageNumber - 1 === item.index ? base.theme.colors.primary : base.theme.colors.white
                              }]}>
                <Text
                    style={{color: this.state.pageNumber - 1 === item.index ? base.theme.colors.white : base.theme.colors.black}}>
                    {item.index + 1}
                </Text>
            </TouchableOpacity>
        )

    }

    renderViewPagerData() {
        console.log("Data:", this.state.data);
        return (
            <View style={{height: hp('65%')}}>
                {this.state.data.length !== 0 ?
                    <Table borderStyle={{borderWidth: 1, borderColor: base.theme.colors.grey}}>
                        <Row data={this.state.tableHead} style={ReportScreenStyles.headRow}
                             textStyle={ReportScreenStyles.textRow}
                             onClickIcon={(item) => this.onCellClick(this.state.pageNumber)}/>
                        {this.state.tableData.map((rowData, index) => (
                            <TableWrapper key={index} style={{height: 40, flexDirection: 'row',}}>
                                {
                                    rowData.map((cellData, cellIndex) => (
                                        <Cell key={cellIndex} style={{
                                            width: rowData.length < 3 && cellIndex === 1 ? '80%' : '20%',
                                            borderWidth: 1,
                                            backgroundColor: rowData.length < 3 && cellIndex === 1 ? 'red' : base.theme.colors.white
                                        }} data={cellData}
                                              textStyle={[{
                                                  color: rowData.length < 3 && cellIndex === 1 ? base.theme.colors.white : base.theme.colors.black,
                                                  fontSize: 12,
                                                  textAlign: 'center'
                                              }]}>
                                        </Cell>

                                    ))
                                }
                            </TableWrapper>
                        ))
                        }
                    </Table> :
                    <View style={{justifyContent: 'center', alignItems: 'center', height: hp('70%')}}>
                        <Text style={{color: base.theme.colors.primary}}>Report not available for this patrol...</Text>
                    </View>}
            </View>
        );
    }


    changeTheData(pageNumber, datToReversOrder) {
        let self = this;
        let tableData = [];
        let patrollingReportData = self.state.patrollingReport;
        if (datToReversOrder) {
            patrollingReportData = datToReversOrder
        }
        let pageStartData = ((pageNumber - 1) * (self.state.pageLimit)) + 1;
        let pageEndData = pageNumber * (self.state.pageLimit);
        if (pageEndData > patrollingReportData.length) {
            pageEndData = patrollingReportData.length
        }
        let j = 0;
        for (let i = pageStartData - 1; i < pageEndData; i++) {
            tableData[j] = patrollingReportData[i];
            j = j + 1
        }
        self.setState({tableData: tableData, pageNumber: pageNumber})
    }

    onCellClick(pageNumber) {
        let self = this;
        let data = self.state.patrollingReport;
        let reverseData = [];
        let j = data.length - 1;
        for (let i = 0; i < data.length; i++) {
            reverseData[i] = data[j];
            j = j - 1;
        }
        self.setState({patrollingReport: reverseData});
        self.changeTheData(pageNumber, reverseData)
    }


}

const mapStateToProps = state => {
    return {
        SelectedAssociationID: state.DashboardReducer.assId,
    }
};

export default connect(mapStateToProps)(ReportScreen)

