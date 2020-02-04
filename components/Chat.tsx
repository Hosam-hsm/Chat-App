import React from 'react';
import { StyleSheet, Text, View, TextInput, Dimensions, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import firebaseSDK from '../config/firebaseSDK';
import {
    NavigationParams,
    NavigationScreenProp,
    NavigationState
} from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
const { height, width } = Dimensions.get('window')

interface ChatProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>

}

interface ChatState {
    messages:Array<string>
    text: string;
}

class Chat extends React.Component<ChatProps, ChatState> {
    constructor(props) {
        super(props);
        this.state = { 
            messages: [],
            text: ''
         };
    }

    get user() {
        return {
          name: this.props.navigation.state.params.name,
          email: this.props.navigation.state.params.email,
          id: firebaseSDK.uid,
          _id: firebaseSDK.uid
        };
      }

    render() {
        return (
            <View style={styles.container}>
                <KeyboardAvoidingView behavior="padding" style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Type a message"
                        onChangeText={(text) => this.setState({ text })}
                        value={this.state.text}
                        multiline={true}

                    />

                    <TouchableOpacity style={styles.sendButton} activeOpacity={.7}>
                        <Icon name="md-send" size={25} color="#fff" style={{ marginLeft: 5 }} />
                    </TouchableOpacity>

                </KeyboardAvoidingView>

            </View>

        )
    }
}

export default Chat;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    inputContainer: {
        position: 'absolute',
        bottom: 4,
        left: 4,
        flexDirection: 'row'
    },
    textInput: {
        height: 40,
        padding: 6,
        backgroundColor: '#fff',
        width: width - 60,
        borderWidth: 0.5,
        borderRadius: 20
    },
    sendButton: {
        alignItems: 'center',
        justifyContent:'center',
        marginLeft:6,
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: 'red'
    }
});