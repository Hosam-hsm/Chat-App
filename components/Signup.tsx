import React from 'react';
import { ImagePicker, Permissions } from 'expo';
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

import firebaseSDK from '../config/firebaseSDK';


interface SignupProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

interface SignupState {
    name: string;
    email: string;
    password: string;
}

export default class Signup extends React.Component<SignupProps, SignupState> {

    static navigationOptions = {
        header: null
    };

    state = {
        name: '',
        email: '',
        password: '',
    };

    onPressCreate = async () => {
        try {
            const user = {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password
            };
            await firebaseSDK.createAccount(user);
        } catch ({ message }) {
            console.log('create account failed. catch error:' + message);
        }
    };

    onChangeTextEmail = email => this.setState({ email });
    onChangeTextPassword = password => this.setState({ password });
    onChangeTextName = name => this.setState({ name });

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

                        <TouchableOpacity
                            activeOpacity={0.5}
                            style={styles.button}
                            onPress={() => this.props.navigation.navigate('Login')}
                        >
                            <Text >Login</Text>
                        </TouchableOpacity>
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
        margin: 28,
        justifyContent:'space-between',
        flexDirection:'row'
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