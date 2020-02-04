import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity, TextStyle, ViewStyle, ImageBackground } from 'react-native';
import {
    NavigationParams,
    NavigationScreenProp,
    NavigationState
} from 'react-navigation';
import firebaseSDK from '../config/firebaseSDK';


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
}

export default class Login extends React.Component<LoginProps, LoginState> {

    static navigationOptions = {
        header: null
    };

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

    onChangeTextEmail = email => this.setState({ email });
    onChangeTextPassword = password => this.setState({ password });

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
                        onChangeText={this.onChangeTextEmail}
                        value={this.state.email}
                    />
                    <TextInput
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

                        <TouchableOpacity
                            activeOpacity={0.5}
                            style={styles.button}
                            onPress={() => this.props.navigation.navigate('Signup')}
                        >
                            <Text >Signup</Text>
                        </TouchableOpacity>
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
        margin: 28,
        justifyContent:'space-between',
        flexDirection:'row'
    },
    button: {
        height: 40,
        margin:2,
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