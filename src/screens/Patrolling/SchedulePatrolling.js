/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-06-24
 */

import React from 'react';
import {FlatList, StyleSheet, Text, View,Image} from 'react-native';
import {Container, Subtitle} from 'native-base';
import {connect} from 'react-redux';


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

    getPatrollingList() {
        let self = this;

    }


    render() {
        return (
            <Container style={styles.container}>
                <Subtitle style={{color: 'orange', fontSize: 20}}>Patrolling Check Points</Subtitle>
                <View style={{justifyContent: 'center', width: "98%", alignSelf: 'center'}}>
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.patrollingCheckPoint}
                        renderItem={(item, index) => this._renderPatrollingCheckPoints(item, index)}/>
                </View>
            </Container>
        )
    }

    _renderPatrollingCheckPoints(item, index) {
        return (
            <View style={{borderWidth: 1,flexDirection:'row',alignItems:'center'}}>
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
        height: "100%",
        width: "100%",
        backgroundColor: "white"
    }
});


const mapStateToProps = state => {
    return {
        oyeURL: state.OyespaceReducer.oyeURL,
        champBaseURL: state.OyespaceReducer.champBaseURL,
        oye247BaseURL: state.OyespaceReducer.oye247BaseURL,
        oyeBaseURL: state.OyespaceReducer.oyeBaseURL,
        SelectedAssociationID: state.UserReducer.SelectedAssociationID
    }
};


export default connect(mapStateToProps)(SchedulePatrolling);