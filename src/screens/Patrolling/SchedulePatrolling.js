/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-06-24
 */

import React from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import {Container, Subtitle} from 'native-base';
import {connect} from 'react-redux';
import base from '../../base';
import FloatingButton from "../../components/FloatingButton";


class SchedulePatrolling extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            patrollingCheckPoint: [{}, {}, {}, {}, {}, {}]
        };

        this.getPatrollingList = this.getPatrollingList.bind(this);

    }

    componentWillMount() {
        this.getPatrollingList();
    }

    async getPatrollingList() {
        let self = this;

        let stat = await base.services.OyeSafeApi.getPatrollingShiftListByAssociationID(this.props.SelectedAssociationID);
        console.log("Stat in schedule patrolling", stat);
        try {
            if (stat.success) {
                self.setState({
                    patrollingCheckPoint: stat.data.patrolling
                })
            }
        } catch (e) {
            console.log(e)
        }


    }


    render() {
        console.log("State:", this.props)
        return (
            <Container style={styles.container}>
                <Subtitle style={styles.subtitle}>Patrolling Schedule</Subtitle>
                <View style={styles.childView}>
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.patrollingCheckPoint}
                        renderItem={(item, index) => this._renderPatrollingCheckPoints(item, index)}/>
                </View>
                <FloatingButton onBtnClick={() => this.props.navigation.navigate('patrollingCheckPoint')}/>

            </Container>
        )
    }

    _renderPatrollingCheckPoints(item, index) {
        return (
            <View style={styles.flatListView}>
                <Image
                    resizeMode={'contain'}
                    source={require('../../../icons/entry_time.png')}
                />
                <Text>khfvkjhdfkjvdf</Text>
                <Text>khfvkjhdfkjvdf</Text>
                <Text>khfvkjhdfkjvdf</Text>


            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "white"
    },
    subtitle: {
        color: 'orange', fontSize: 20
    },
    childView: {
        justifyContent: 'center',
        width: "98%",
        alignSelf: 'center'
    },
    flatListView: {
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center'
    }
});


const mapStateToProps = state => {
    console.log(state)
    return {
        oyeURL: state.OyespaceReducer.oyeURL,
        champBaseURL: state.OyespaceReducer.champBaseURL,
        oye247BaseURL: state.OyespaceReducer.oye247BaseURL,
        oyeBaseURL: state.OyespaceReducer.oyeBaseURL,
        userReducer: state.UserReducer,
        SelectedAssociationID: state.UserReducer.SelectedAssociationID
    }
};


export default connect(mapStateToProps)(SchedulePatrolling);