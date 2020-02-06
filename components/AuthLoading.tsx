import React, { memo } from "react";
import { ActivityIndicator, View,Dimensions } from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import firebaseSDK from '../config/firebaseSDK';

const { height, width } = Dimensions.get('window')

const AuthLoadingScreen = ({ navigation }) => {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // User is logged in
            navigation.navigate("Chat");
        } else {
            // User is not logged in
            navigation.navigate("Login");
        }
    });

    return (
        <View style={{ marginTop:height/2}}>
            <ActivityIndicator size="large" />
        </View>


    );
};

export default memo(AuthLoadingScreen);