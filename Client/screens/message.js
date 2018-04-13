/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

import { Icon } from 'native-base';

import { RkModalImg } from 'react-native-ui-kitten';

export default class Message extends React.PureComponent {



  render() {

    let styl = this.props.sent ? styles.sent : styles.rec;
    let hasimage = this.props.image;

    if(this.props.image){

      return (
        <View style={styles.container}>
        <View style={[styles.messagecontainer, styl]}>
          <View style = { styles.balloonimage}>
          <RkModalImg
            style={{width: 166, height: 158}}
            source={{uri: 'data:image/png;base64,' + this.props.image}}
        />
          </View>
        </View>
        </View>
      );

    }
    else if(this.props.audio){

      if(this.props.sent){
        return(
          <View style={styles.container}>
          <View style={[styles.messagecontainer, styl]}>
            <View style = { styles.balloonaudio } >
            <TouchableOpacity onPress={ ()=> {this.props.playaudio(this.props.audiopath)}} >
              <Icon name='play' />
            </TouchableOpacity>
            </View>
          </View>
          </View>
        );
      }
      else{
        return(
          <View style={styles.container}>
          <View style={[styles.messagecontainer, styl]}>
          <Text style={{alignSelf: 'center'}}>rec</Text>
            <View style = { styles.balloonaudio } >
              <Text style = {styles.text}>{this.props.title}</Text>
            </View>
          </View>
          </View>
        );
      }
    }
    else{
      return (
        <View style={styles.container}>
        <TouchableOpacity onLongPress={() => this.props.onPressItem(this.props.originalmessage, this.props.sent)} >
        <View style={[styles.messagecontainer, styl]}>
          <View style = { styles.balloon} >
            <Text style = {styles.text}>{this.props.title}</Text>
          </View>
        </View>
        </TouchableOpacity>
        </View>
      );

    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  sent:{
    backgroundColor: 'white',
    alignSelf: 'flex-end',
    // paddingRight: 20
  },
  rec: {
    alignSelf: 'flex-start',
    backgroundColor: '#398ac5',
  },
  messagecontainer: {
  marginVertical: 5,
   flex: 1,
   // flexDirection: 'row',
   backgroundColor:"#eeeeee",
   borderRadius: 20,
   // paddingHorizontal: 20,
  },
  balloon :{
    maxWidth: '80%',
    padding: 5,
    borderRadius: 40,
    paddingHorizontal: 17,
    fontSize: 10,
  },
  balloonaudio: {
    maxWidth: 250,
    padding: 10,
    borderRadius: 40,
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  balloonimage: {
    maxWidth: 250,
    padding: 5,
    borderRadius: 50,
    paddingHorizontal: 5,
    flexDirection: 'row',
  },
  text: {
    fontSize : 24,
  }
});
