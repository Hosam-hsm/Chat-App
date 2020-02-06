import React from 'react';
import '@firebase/firestore';
import '@firebase/auth'
import '@firebase/storage'
import { StyleSheet, Text, View, TextInput, Dimensions, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import firebaseSDK from '../config/firebaseSDK';
import {
    NavigationParams,
    NavigationScreenProp,
    NavigationState,
    ScrollView,
    FlatList
} from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from "@firebase/app";
import moment from "moment";


const { height, width } = Dimensions.get('window')
var ColorCode = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
 
interface ChatProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;

}

interface ChatState {
    messages: Array<object>
    text: string;
    Color : any
}

class Chat extends React.Component<ChatProps, ChatState> {

    static navigationOptions = ({ navigation }) => ({
        title: (navigation.state.params || {}).name || 'Chat!'
    });

    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            text: '',
            Color : ColorCode
        };
        this.chatRef = firebase.firestore().collection("Chat")
    }

    componentDidMount() {
        this.chatRef.onSnapshot((query) => {
            this.setState({ messages: [] })
            query.forEach((doc) => {
                this.setState({
                    messages: this.state.messages.concat(doc.data())
                })
            })
        })
    }


    submitMessage = (text, username, color) => {
        console.log(color)
        var time = new Date().getTime();
        var formattedTime = moment(time).format("hh:mm A");
        text.trim() !== "" &&
            this.chatRef.doc(new Date().getTime().toString()).set({
                username: username,
                text: text,
                date: new Date().toLocaleDateString(),
                time: formattedTime,
                color: color
            })
        this.setState({ text: '' })
    }


    renderMessage(item, index) {
        return (
            <View style={styles.message} >
                <View>
                    <Text style={{color: item.color}}>{item.username}</Text>
                </View>
                <View style={styles.messageContent}>
                    <Text>{item.text}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                </View>

            </View>
        )
    }

    logout = () => {
        firebase.auth().signOut();
    };

    render() {
        const text = this.state.text
        var username = firebase.auth().currentUser.displayName;
        var color =this.state.Color
       
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={{ fontSize: 22, fontWeight: 'bold' }}>GROUP CHAT</Text>
                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                        <Text>Logged in as {username}</Text>
                        <TouchableOpacity
                            style={{ alignSelf: 'flex-end' }}
                            activeOpacity={0.5}
                            onPress={() => this.logout()}
                        >
                            <Text style={{color:'red'}}>Logout</Text>
                        </TouchableOpacity>
                    </View>

                </View>

                <View>
                    <FlatList
                        ref={(list) => this.flatList = list}
                        contentContainerStyle={{ paddingBottom: 140 }}
                        data={this.state.messages}
                        renderItem={({ item, index }) => this.renderMessage(item, index)}
                        keyExtractor={(item, index) => item.key}
                        onContentSizeChange={() =>
                            this.flatList.scrollToEnd({ animated: true })
                        }
                        getItemLayout={(data, index) => (
                            { length: 100, offset: 100 * index, index }
                        )}

                    />
                </View>
                <KeyboardAvoidingView behavior="padding" style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Type a message"
                        onChangeText={(text) => this.setState({ text })}
                        value={this.state.text}
                        multiline={true}

                    />

                    <TouchableOpacity style={styles.sendButton} onPress={() => this.submitMessage(text, username, color)} activeOpacity={.7}>
                        <Icon name="md-send" size={25} color="#fff" style={{ marginLeft: 5 }} />
                    </TouchableOpacity>

                </KeyboardAvoidingView>

            </View >

        )
    }
}

export default Chat;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        height: 80,
        padding: 15,
        backgroundColor:'#fff',
        elevation:5
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
        justifyContent: 'center',
        marginLeft: 6,
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: 'red'
    },
    message: {
        flex: 1,
        padding: 15,
        marginBottom: 5,
        marginLeft: 5,
        justifyContent: 'space-between',
        borderRadius: 10,
        elevation: 1,
        backgroundColor: '#fff',

    },
    username: {
       
    },
    messageContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'

    },
    time: {
        alignSelf: 'flex-end',
        fontSize: 12,
        color: 'grey'
    }
});