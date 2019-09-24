import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import base from "../../base";

class SubscriptionManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            offerTailsList: [1, 2, 3, 4, 5]
        }
    }

    render() {
        return (
            <View style={{height: '100%', width: '100%'}}>
                <View style={{height: '10%', width: '100%', alignItems: 'center', justifyContent: 'center',}}>
                    <Text style={{fontSize: 14, color: base.theme.colors.primary}}>Subscription</Text>
                </View>
                <View style={{height: '90%', width: '100%'}}>
                    <View style={{height: '5%', alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontSize: 14, color: base.theme.colors.black}}>Choose Your Plan</Text>
                    </View>
                    <View style={{height: '95%', backgroundColor: base.theme.colors.rosePink}}>
                        <ScrollView style={{height: '100%', width: '100%'}} showsVerticalScrollIndicator={false}>

                            <View style={{height: '100%',}}>


                            </View>
                            <View style={{height: '100%'}}>

                            </View>
                            <View style={{
                                height: 50,
                                backgroundColor: base.theme.colors.primary,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Text style={{fontSize: 20, color: base.theme.colors.white}}>Pay Now</Text>
                            </View>
                        </ScrollView>


                    </View>
                </View>

            </View>
        );
    }

}

export default SubscriptionManagement;