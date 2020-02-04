import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Chat from './components/Chat';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Login from './components/Login';
import Signup from './components/Signup';

export class App extends React.Component {
  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <View style={styles.container}>
        <Chat />
      </View>
    );
  }

}


const AppNavigator = createStackNavigator({

  Login: {
    screen: Login,
  },
  Signup: {
    screen: Signup,
  },
  Chat: {
    screen: App,
  },
});

export default createAppContainer(AppNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
