import React from 'react';
import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, Dimensions, TouchableOpacity } from 'react-native';
import {
    NavigationParams,
    NavigationScreenProp,
    NavigationState
} from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

const { height, width } = Dimensions.get('window')

interface DetailsProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

interface DetailsState {
    text: string;
    disabled: boolean;
}

export class Details extends React.Component<DetailsProps, DetailsState>  {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            disabled: true
        };
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={styles.mainContainer}>
                <View style={styles.container}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Type your name"
                        onChangeText={(text) => this.setState({ text, disabled: false })}
                        value={this.state.text}
                        multiline={true}
                    />
                    <TouchableOpacity disabled={this.state.disabled} style={styles.submit} activeOpacity={.7} onPress={() => navigation.navigate('Chat')}>
                        <Text style={{ color: "red" }}>Enter Chat</Text>
                        <Icon name="md-send" size={25} color="red" style={{ marginLeft: 5 }} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flexDirection: 'column',
        alignItems: 'center',

    },
    textInput: {
        height: 50,
        padding: 6,
        backgroundColor: '#fff',
        width: width - 60,
        elevation:1,
        borderRadius: 6,
        marginBottom: 20
    },
    submit: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginLeft: 6,
        height: 40,
        width: 100,
        borderRadius: 4,
        backgroundColor: '#fff',
        elevation:2
    }
});