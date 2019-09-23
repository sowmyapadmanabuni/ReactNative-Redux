import {Platform, StatusBar, View} from "react-native";
import React from "react";
import base from "../base";

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

export function StatusBarPlaceHolder() {
    return (
        <View style={{
            width: "100%",
            height: STATUS_BAR_HEIGHT,
            backgroundColor: base.theme.colors.primary
        }}>
            <StatusBar
                barStyle="light-content"
            />
        </View>
    );
}

