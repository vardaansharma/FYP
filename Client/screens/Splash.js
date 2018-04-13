/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';


export default class splash extends Component {

  constructor(){
      super();
    this.state = {
      checking: true,
    }

    this.checkloggedin = this.checkloggedin.bind(this);

  }

  checkloggedin(){

    var self = this;
    global.dbuser.findOne({}, function(err,newDocs){

       if(err){
           alert(err);
         }
         else{
           if(!newDocs){
               self.props.navigation.navigate('Login');
           }
           else{
             if(newDocs.loggedin){

               var logindeats = {
                 username : newDocs.username,
                 password : newDocs.password,
                 notitoken : global.token,
               };
               global.socket.emit('login',logindeats);

               self.props.navigation.navigate('Home');
             }
             else{
               self.props.navigation.navigate('Login');
             }
           }

         }
    });

  }

  render() {
    this.checkloggedin();
    return (
      <View style={styles.container}>
        <Image resizeMode="contain" style={styles.logo} source={require('../assets/logo.png')} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2c3e50',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: '60%',
  }
});
