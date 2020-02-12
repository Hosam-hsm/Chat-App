import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity, TextStyle, ViewStyle, ImageBackground } from 'react-native';
import {
    NavigationParams,
    NavigationScreenProp,
    NavigationState
} from 'react-navigation';
import firebaseSDK from '../config/firebaseSDK';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


interface LoginProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

interface LoginState {
    name: string;
    email: string;
    password: string;
}

interface Styles {
    container: ViewStyle;
    header: ViewStyle;
    headerText: TextStyle;
    title: TextStyle;
    nameInput: TextStyle;
    buttonContainer: ViewStyle;
    button: ViewStyle;
    buttonText: TextStyle;
    signup: ViewStyle;
}

export default class Login extends React.Component<LoginProps, LoginState> {



    state = {
        name: '',
        email: '',
        password: '',
    };

    onPressLogin = async () => {
        const user = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
        };
        console.log(user);
        const response = firebaseSDK.login(
            user,
            this.loginSuccess,
            this.loginFailed
        );
    };

    loginSuccess = () => {
        console.log('login successful, navigate to chat.');
        this.props.navigation.navigate('Chat', {
            name: this.state.name,
            email: this.state.email,
        });
    };

    loginFailed = () => {
        alert('Login failure. Please try again.');
    };

    onChangeTextEmail = (email: string) => this.setState({ email });
    onChangeTextPassword = (password: string) => this.setState({ password });

    render() {
        return (
            <ImageBackground blurRadius={0} source={require('../assets/bgImage.jpg')} style={{ width: '100%', height: '100%' }}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Chat App</Text>
                    </View>
                    <TextInput
                        style={styles.nameInput}
                        placeholder="Email"
                        returnKeyType={"next"}
                        blurOnSubmit={false}
                        onSubmitEditing={() => { this.secondTextInput.focus(); }}
                        onChangeText={this.onChangeTextEmail}
                        value={this.state.email}
                    />
                    <TextInput
                        ref={(input) => { this.secondTextInput = input }}
                        style={styles.nameInput}
                        secureTextEntry={true}
                        placeholder="Password"
                        onChangeText={this.onChangeTextPassword}
                        value={this.state.password}
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            style={styles.button}
                            onPress={this.onPressLogin}
                        >
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>

                        <View style={styles.signup}>
                            <Text style={{ color: '#fff', marginBottom: 3 }}>Don't have an account yet?</Text>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                style={styles.button}
                                onPress={() => this.props.navigation.navigate('Signup')}
                            >
                                <Text style={{ fontWeight: 'bold' }}>Signup</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create<Styles>({
    container: {
        flex: 1,

    },
    header: {
        height: 150,
        alignItems: 'center',
        marginTop: 50,
    },
    headerText: {
        marginTop: 50,
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff'
    },
    title: {
        marginTop: 16,
        marginLeft: 16,
        fontSize: 16
    },
    nameInput: {
        height: 40,
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
    signup: {
        marginTop: 60
    },
    button: {
        height: 40,
        margin: 2,
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