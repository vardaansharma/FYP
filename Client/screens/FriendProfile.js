/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';

import {Avatar, FormLabel, FormInput, FormValidationMessage} from 'react-native-elements';
import { RkCard, RkText } from 'react-native-ui-kitten';
import { Header, Left, Body, Right, Button, Title,Subtitle, Item, Icon } from 'native-base';
// import { Icon } from 'react-native-e'

import Modal from 'react-native-modal';

var ImagePicker = require('react-native-image-picker');

export default class FriendProfile extends Component {


  constructor(){
    super();
    this.goback = this.goback.bind(this);
    this.getData = this.getData.bind(this);
    this.showchangemodal = this.showchangemodal.bind(this);
    this.sendchange = this.sendchange.bind(this);

    this.state = {
      username : '',
      email: '',
      phonenumber: '',
      language: '',
      profilepicbase: '',
    }

    var that = this;

    global.socket.on('frienddata', function(data){
      that.setState({
        language: data.language,
        email : data.email,
        phonenumber: data.phone_number,
      })
    });

    global.socket.on('error',function(data){
      alert('error getting details');
    });


  }

  componentWillMount(){


    const { params } = this.props.navigation.state;
    this.state.username = params ? params.username : null;

    this.getData();
    global.socket.emit('getuserdetails',this.state.username);

  }

  getData(){
    let that = this;

    // global.dbchats.find({u})

    global.dbchats.findOne({username: this.state.username},function(err,data){

      // alert(JSON.stringify(data));
      that.setState({
        username: data.username,
        name: data.name,
        newname: data.name,
        language: data.language,
        profilepicbase: data.profile_picture,
      })
    })
  }

  goback(){
    this.props.navigation.navigate('Home');
  }

  sendchange(){
    var that = this;
    global.dbchats.update({username: this.state.username}, { $set : { name : this.state.newname} }, function(err,data){
      that.getData();
    })
  }

  showchangemodal(number,header){
    // alert('hey');
    this.setState({
      showmodal: true,
      header: 'change name',
    })
  }

  render() {

    let changemodalinside =
      <View style={styles.registerstuffpart, {justifyContent: 'center', marginTop: 60,alignContent: 'center'}}>
        <FormLabel style={styles.formelment}>New Name:</FormLabel>
        <FormInput style={styles.formelment} containerStyle={styles.formelment} onChangeText={(text) =>{this.setState({newname: text})}} />
        <FormValidationMessage>{this.state.registerusernameerror}</FormValidationMessage>
      </View>

    let changemodal =
    <Modal isVisible={this.state.showmodal}>
        <View style={styles.modalContent}>

        <View style={styles.registermodalheader} >
          <Text>{this.state.header}</Text>
        </View>

        <View style={{flex: 0.8}}>
          {changemodalinside}
        </View>

        <View style={styles.bcontainer}>
          <View style={styles.buttonContainer}>
            <Button full light style={{ borderBottomLeftRadius: 8,height: '100%'}} onPress={() => {this.setState({showmodal: false})} }><Text>Cancel</Text></Button>
          </View>
          <View style={styles.buttonContainer}>
            <Button style={{ borderBottomRightRadius: 8,height: '100%'}} full onPress={()=> {this.sendchange()} } ><Text>Change</Text></Button>
          </View>
        </View>
      </View>
    </Modal>


    return (
      <View style={styles.container}>

        <Header androidStatusBarColor="#254e70" style={{backgroundColor:  '#254e70'}}>
        <Left>
          <Icon name='md-arrow-back' type='entypo' style={{color: 'white'}} onPress = { this.goback} />
        </Left>
        <Body>
          <Title>
            Profile
          </Title>
          <Subtitle>
          {this.state.username}
          </Subtitle>
        </Body>
        <Right>
        </Right>
        </Header>

        {changemodal}
        <View style={styles.avatarcontainer}>
        <Avatar
          rounded
          xlarge
          avatarStyle={styles.avatar}
          size = {900}
          // height= {240}
          // width = '70%'
          source={ {uri: 'data:image/gif;base64,'+this.state.profilepicbase}}
          onPress={() => console.log("Works!")}
          icon ='plus'
        />

        </View>
        <View style={styles.bodycontainer}>
          <RkCard rkType='shadowed'>
            <View rkCardHeader>
              <Text>Details</Text>
            </View>

            <View rkCardContent style={{flexDirection: 'row'}}>
            <View style={ {flex: 1,alignItems: 'flex-start'}}>
              <Text>username:</Text>
              <RkText rkType='large'>{this.state.username}</RkText>
            </View>
            </View>

            <View rkCardContent style={{flexDirection: 'row'}}>
            <View style={ {flex: 1,alignItems: 'flex-start'}}>
              <Text>Name:</Text>
              <RkText rkType='large'>{this.state.name}</RkText>
            </View>
            <View style={ {flex: 0.2,alignItems: 'flex-end', justifyContent: 'flex-end'} }>
              <TouchableOpacity onPress={()=>{ this.showchangemodal(2,'Change email') }}>
                <Icon name='md-create'/>
              </TouchableOpacity>
            </View>
            </View>

            <View rkCardContent style={{flexDirection: 'row'}}>
            <View style={ {flex: 1,alignItems: 'flex-start'}}>
              <Text>Language:</Text>
              <RkText rkType='large'>{this.state.language}</RkText>
            </View>
            </View>


            <View rkCardContent style={{flexDirection: 'row'}}>
            <View style={ {flex: 1,alignItems: 'flex-start'}}>
              <Text>email:</Text>
              <RkText rkType='large'>{this.state.email}</RkText>
            </View>
            </View>

            <View rkCardContent style={{flexDirection: 'row'}}>
            <View style={ {flex: 1,alignItems: 'flex-start'}}>
              <Text>Number:</Text>
              <RkText rkType='large'>{this.state.phonenumber}</RkText>
            </View>
            </View>


          </RkCard>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatarcontainer: {
    flex: 1,
    backgroundColor: '#aef3e7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    // height: 250,
    // width: 250,
  },
  bodycontainer: {
    flex: 1.5,
  },
  changeppicon: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  modalContent: {
  backgroundColor: "white",
  // padding: 12,
  justifyContent: "center",
  alignItems: 'baseline',
  borderRadius: 8,
  borderColor: "rgba(0, 0, 0, 0.1)",
  flex: 0.6,
},
bcontainer: {
    flex: 0.25,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    backgroundColor: 'black',
  },
  buttonContainer: {
    // flex: 1,
    justifyContent: 'flex-end',
    width: '50%',
    height: '100%',
    backgroundColor: 'green',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  registerstuffpart: {
    // flex: 1,
    justifyContent: 'center',
    // padding: 14,
    alignItems: 'flex-start',
    width: '100%',
    // backgroundColor: 'green',

  },
  registermodalheader: {
    flex: 0.25,
    width: '100%',
    padding: 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    alignItems: 'center',
    backgroundColor: 'grey',
    justifyContent: 'center'
  },
  formelment: {
    width: '80%',
    borderBottomWidth: 1,
  },

});
