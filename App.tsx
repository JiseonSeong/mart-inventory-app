import 'react-native-gesture-handler';
import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";
import {GestureHandlerRootView} from "react-native-gesture-handler";
//import { initializeApp } from "firebase/app";
import {firebaseConfig} from "./firebase/firebaseConfig";

export default function App() {
    //firebase 초기화
    //const app = initializeApp(firebaseConfig);
    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <NavigationContainer>
                <AppNavigator/>
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}