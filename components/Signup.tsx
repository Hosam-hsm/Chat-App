import React from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Button,
    ImageEditor,
    TouchableOpacity,
    ImageBackground
} from 'react-native';
import {
    NavigationParams,
    NavigationScreenProp,
    NavigationState
} from 'react-navigation';

import firebase from "@firebase/app";

import firebaseSDK from '../config/firebaseSDK';

var ColorCode = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';

interface SignupProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

interface SignupState {
    name: string;
    email: string;
    password: string;
    Color: string
}

export default class Signup extends React.Component<SignupProps, SignupState> {

    static navigationOptions = {
        header: null
    };

    constructor(props:any) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            Color: ColorCode
        };
        this.usersRef = firebase.firestore().collection("Users")
    }




    onPressCreate = async () => {
        try {
            const user = {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
                color: this.state.Color
            };
            await firebaseSDK.createAccount(user);
        } catch ({ message }) {
            console.log('create account failed. catch error:' + message);
        }
    };

    onChangeTextEmail = (email:string) => this.setState({ email });
    onChangeTextPassword = (password:string) => this.setState({ password });
    onChangeTextName = (name:string) => this.setState({ name });

    render() {
        return (
            <ImageBackground blurRadius={0} source={require('../assets/bgImage.jpg')} style={{ width: '100%', height: '100%' }}>
                <View style={styles.container}>
                    <TextInput
                        style={styles.nameInput}
                        placeholder="Name"
                        onChangeText={this.onChangeTextName}
                        value={this.state.name}
                    />
                    <TextInput
                        style={styles.nameInput}
                        placeholder="Email"
                        onChangeText={this.onChangeTextEmail}
                        value={this.state.email}
                    />
                    <TextInput
                        style={styles.nameInput}
                        placeholder="Password"
                        onChangeText={this.onChangeTextPassword}
                        value={this.state.password}
                        secureTextEntry={true}
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            style={styles.button}
                            onPress={this.onPressCreate}
                        >
                            <Text style={styles.buttonText}>Signup</Text>
                        </TouchableOpacity>

                        <View style={styles.login}>
                            <Text style={{ color: '#fff', marginBottom: 3 }}>Already have an account?</Text>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                style={styles.button}
                                onPress={() => this.props.navigation.navigate('Login')}
                            >
                                <Text style={{fontWeight:'bold'}} >Login</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </ImageBackground>
        );
    }
}

const offset = 16;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    title: {
        marginTop: offset,
        marginLeft: offset,
        fontSize: offset
    },
    nameInput: {
        height: 45,
        paddingHorizontal: 16,
        margin: 16,
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderRadius: 20
    },
    buttonContainer: {
        alignItems: 'center',
        margin: 20,
        justifyContent: 'space-between',  
    },
    login:{
        marginTop: 60
    },
    button: {
        height: 40,
        marginTop: 10,
        width: 150,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        elevation: 4
    },
    buttonText: {
        fontSize: 17,
        color: "red",
        fontWeight: 'bold'
    }
});