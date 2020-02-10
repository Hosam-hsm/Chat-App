import React from 'react';
import '@firebase/firestore';
import '@firebase/auth'
import '@firebase/storage'
import { StyleSheet, Text, View, TextInput, Dimensions, KeyboardAvoidingView, TouchableOpacity, ImageBackground, Image } from 'react-native';
import {
    NavigationParams,
    NavigationScreenProp,
    NavigationState,
    FlatList,
    ScrollView
} from 'react-navigation';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from "@firebase/app";
import moment from "moment";
import * as Permissions from 'expo-permissions';
import LottieView from 'lottie-react-native';


const { height, width } = Dimensions.get('window')


interface ChatProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface ChatState {
    messages: Array<object>
    text: string;
    typingUser: string;
    image: any;
    eventImagePer: string;
}


class Chat extends React.Component<ChatProps, ChatState> {

    static navigationOptions = ({ navigation }) => ({
        title: (navigation.state.params || {}).name || 'Chat!'
    });

    constructor(props: any) {
        super(props);
        this.state = {
            messages: [],
            text: '',
            typingUser: '',
            image: null,
            eventImagePer: '0'
        };
        this.chatRef = firebase.firestore().collection("Chat")
        this.usersRef = firebase.firestore().collection("Users")
        this.storageRef = firebase.storage().ref();
    }

    componentDidMount() {
        this.getPermissionAsync();
        this.chatRef.onSnapshot((query) => {
            this.setState({ messages: [] })
            query.forEach((doc) => {
                this.setState({
                    messages: this.state.messages.concat(doc.data())
                })
            })
        })

        this.usersRef.onSnapshot((query) => {
            this.setState({ typingUser: '' })
            query.forEach((doc) => {
                console.log(this.state.typingUser)
                if (doc.data().isTyping)
                    this.setState({
                        typingUser: this.state.typingUser.concat(doc.data().username)
                    })
                else null
            })
        })
    }

    getPermissionAsync = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
        }
    }


    submitMessage = (text: string, username: string, uid: string) => {
        var time = new Date().getTime();
        var formattedTime = moment(time).format("hh:mm A");
        text.trim() !== "" &&
            this.chatRef.doc(new Date().getTime().toString()).set({
                username: username,
                text: text,
                date: new Date().toLocaleDateString(),
                time: formattedTime,
                uid: uid,
            })
        this.setState({ text: '' })
        this.usersRef.doc(firebase.auth().currentUser.uid).update({ isTyping: false })
    }


    renderMessage(item: object, index: number) {
        let uid = firebase.auth().currentUser.uid
        return (
            uid === item.uid ?
                <View style={styles.rightMessage}>
                    <View>
                        <Text style={styles.username}>{item.username}</Text>
                    </View>
                    {item.imageUrl ?

                        <Image style={{ marginTop: 5, alignSelf: 'center', height: height / 3, width: width - 65, resizeMode: 'contain', }} source={{ uri: item.imageUrl }} />

                        : null}
                    <View style={styles.messageContent}>
                        <Text>{item.text}</Text>
                    </View>
                    <Text style={styles.time}>{item.time}</Text>

                </View>
                :
                <View style={styles.leftMessage} >
                    <View>
                        <Text style={styles.username}>{item.username}</Text>
                    </View>
                    {item.imageUrl ?

                        <Image style={{ marginTop: 5, alignSelf: 'center', height: height / 3, width: width - 65, resizeMode: 'contain', }} source={{ uri: item.imageUrl }} />

                        : null}
                    <View style={styles.messageContent}>
                        <Text>{item.text}</Text>
                    </View>
                    <Text style={styles.time}>{item.time}</Text>
                </View>
        )
    }

    checkTyping = (length: number) => {
        length === 0 ?
            this.usersRef.doc(firebase.auth().currentUser.uid).update({ isTyping: false })
            :
            this.usersRef.doc(firebase.auth().currentUser.uid).update({ isTyping: true });
    }

    logout = () => {
        firebase.auth().signOut();
    };


    render() {
        console.disableYellowBox = true;
        const text = this.state.text
        var username = firebase.auth().currentUser.displayName;
        var uid = firebase.auth().currentUser.uid
        return (
            <ImageBackground blurRadius={0} source={require('../assets/bgImage.jpg')} style={{ width: '100%', height: '100%' }}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 22, fontWeight: 'bold' }}>GROUP CHAT</Text>
                            <TouchableOpacity
                                style={{ alignSelf: 'flex-end' }}
                                activeOpacity={0.5}
                                onPress={() => this.logout()}
                            >
                                <Text style={styles.logoutText}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                        {
                            this.state.typingUser ?
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ paddingBottom: 5 }}>{this.state.typingUser} is typing</Text>
                                    <LottieView source={require('../assets/dots.json')}
                                        autoPlay loop
                                        style={{ height: 20, width: 20 }}
                                    />
                                </View>
                                :
                                null
                        }

                    </View>

                    <View>
                        <FlatList
                            ref={(ref) => this.flatList = ref}
                            contentContainerStyle={{ marginTop: 15, paddingBottom: 160 }}
                            data={this.state.messages}
                            renderItem={({ item, index }) => this.renderMessage(item, index)}
                            keyExtractor={(item, index) => item.uid}
                            onContentSizeChange={() =>
                                this.flatList.scrollToEnd({ animated: true })
                            }
                            getItemLayout={(data, index) => (
                                { length: 180, offset: 180 * index, index }
                            )}

                        />
                    </View>

                    <KeyboardAvoidingView behavior="padding" style={styles.inputContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Type a message"
                            onChangeText={(text) => this.setState({ text: text },
                                () => {
                                    this.checkTyping(text.length);
                                })}
                            value={this.state.text}
                            multiline={true}
                        />
                        <Icon onPress={this.submitImage} name="ios-camera" size={25} color="grey" style={styles.cameraIcon} />


                        <TouchableOpacity style={styles.sendButton} onPress={() => this.submitMessage(text, username, uid)} activeOpacity={.7}>
                            <Icon name="md-send" size={25} color="#fff" style={{ marginLeft: 5 }} />
                        </TouchableOpacity>
                    </KeyboardAvoidingView>



                </View >
            </ImageBackground>

        )
    }

    submitImage = async () => {
        var username = firebase.auth().currentUser.displayName;
        var uid = firebase.auth().currentUser.uid
        let result = await ImagePicker.launchImageLibraryAsync({
            base64: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5
        });
        if (!result.cancelled) {
            const response = await fetch(result.uri);
            const blob = await response.blob();
            var ref = firebase.storage().ref().child(`Images/${Math.random()}`);
            ref.put(blob).then((snap) => {
                ref.getDownloadURL().then((url) => {
                    var time = new Date().getTime();
                    var formattedTime = moment(time).format("hh:mm A");
                    this.chatRef.doc(new Date().getTime().toString()).set({
                        username: username,
                        date: new Date().toLocaleDateString(),
                        time: formattedTime,
                        uid: uid,
                        imageUrl: url
                    })
                })
            });
            ref.put(blob).on("state_changed", (snapshot) => {
                var progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0)
                this.setState({ eventImagePer: progress })
            })
        }
    };
}

export default Chat;

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    header: {
        height: 70,
        padding: 10,
        backgroundColor: '#fff',
        elevation: 5,
    },
    logoutText: {
        fontWeight: 'bold',
        color: 'red',
        marginRight: 5
    },
    inputContainer: {
        flex: 1,
        position: 'absolute',
        bottom: 4,
        alignItems: 'center',
        left: 4,
        flexDirection: 'row'
    },
    textInput: {
        flex: 1,
        height: 45,
        padding: 6,
        backgroundColor: '#fff',
        width: width - 60,
        borderRadius: 20
    },
    cameraIcon: {
        padding: 10
    },
    sendButton: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 6,
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: 'red'
    },
    leftMessage: {
        flex: 1,
        maxWidth: width - 60,
        alignSelf: 'flex-start',
        padding: 10,
        margin: 5,
        justifyContent: 'space-between',
        borderRadius: 10,
        backgroundColor: '#fff',

    },
    rightMessage: {
        flex: 1,
        maxWidth: width - 60,
        alignSelf: 'flex-end',
        padding: 10,
        margin: 5,
        justifyContent: 'space-between',
        borderRadius: 10,
        backgroundColor: '#fff',

    },
    username: {
        fontWeight: 'bold'
    },
    messageContent: {

    },
    time: {
        fontSize: 12,
        color: 'grey',
        alignSelf: 'flex-end'
    }
});