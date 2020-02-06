import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Chat from './components/Chat';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Login from './components/Login';
import Signup from './components/Signup';
import AuthLoading from './components/AuthLoading';

export class App extends React.Component {
 

  render() {

    return (
      <View style={styles.container}>
        <Chat  />
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
  Auth: {
    screen: AuthLoading,
  },
  Chat: {
    screen: App,
  },
},
  {
    initialRouteName: "Auth",
    headerMode: "none"
  }
);

export default createAppContainer(AppNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
