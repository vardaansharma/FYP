/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { StackNavigator } from 'react-navigation';

//websocket
// import io from 'socket.io-client'

//screens
import HomeScreen from './screens/HomeScreen';
import Login from './screens/Login';
import Splash from './screens/Splash';
import Chat from './screens/Chat';
import AddFriend from './screens/AddFriend';
import Profile from './screens/Profile';
import Settings from './screens/Settings';
import FriendProfile from './screens/FriendProfile';

import DatabaseManager from './DatabaseManager';

import SocketManager from './SocketManager';
import global_data from './global_data';


var PushNotification = require('react-native-push-notification');

PushNotification.configure({

    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function(token) {
        // alert( JSON.stringify(token));
        global.token = token;
    },

    // (required) Called when a remote or local notification is opened or received
    onNotification: function(notification) {
        // console.log( 'NOTIFICATION:', notification );

        // process the notification

        PushNotification.localNotification({
          foreground: false,
          message: 'new message',
        })

        // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
        // notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
    senderID: "33115202999",

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
        alert: true,
        badge: true,
        sound: true
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
      * (optional) default: true
      * - Specified if permissions (ios) and token (android and ios) will requested or not,
      * - if not, you must call PushNotificationsHandler.requestPermissions() later
      */
    requestPermissions: true,
});



export default class App extends Component<{}> {

  constructor(){
    super();
    this.state = {
      checking: false,
      loggedin: true,
    };


  this.sc = new SocketManager();

  }
  render() {

    const Navigator = StackNavigator({

      Splash: {
        screen: Splash,
        navigationOptions: {
          header : null,
        },
      },

      Home: {
        screen: HomeScreen,
        navigationOptions: {
          header : null,
        },
      },

            Login : {
              screen: Login,
              navigationOptions: {
                header : null,
              },
            },

      FriendProfile : {
        screen: FriendProfile,
        navigationOptions: {
          header: null,
        },
      },

      Chat: {
        screen: Chat,
        navigationOptions: {
          header : null,
        },
      },

      AddFriend: {
        screen: AddFriend,
        navigationOptions: {
          header : null,
        },
      },

            Profile: {
              screen: Profile,
              navigationOptions: {
                header : null,
              }
            },

            Settings: {
              screen : Settings,
              navigationOptions:{
                header: null,
              }
            },

    });

    return <Navigator/>;

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  splash: {
    flex: 1,
  }
});
