/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';

import {Avatar, FormLabel, FormInput, FormValidationMessage} from 'react-native-elements';
import { RkCard, RkText } from 'react-native-ui-kitten';
import { Header,Icon, Left, Body, Right, Button, Title, Item } from 'native-base';
// import { Icon } from 'react-native-e'

import Flag from 'react-native-flags';
import Modal from 'react-native-modal';

const { SlideInMenu, Popover } = renderers;

var ImagePicker = require('react-native-image-picker');

import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';

export default class Profile extends Component {


  constructor(){
    super();
    this.goback = this.goback.bind(this);
    this.changeProfilePic = this.changeProfilePic.bind(this);
    this.getData = this.getData.bind(this);
    this.sendchange = this.sendchange.bind(this);

    this.state = {
      username : '',
      email: '',
      number: '',
      profilepicpath: '../assets/pp.png',
      language: '',
      profilepicbase: '',
      changingpass: false,
      showmodal: false,
      newemail: '',
      newnumber: '',
      newpassword: '',
    }
  }

  componentWillMount(){
    this.getData();
  }

  getData(){
    let that = this;
    global.dbuser.findOne({},function(err,data){
      that.setState({
        username: data.username,
        language: data.language,
        profilepicbase: data.profilepicture,
        email: data.email,
        phonenumber: data.phonenumber,
      })
    })
  }

  goback(){
    this.props.navigation.navigate('Home');
  }

  changeProfilePic(){

      var options = {
        title: 'Select Avatar',
        customButtons: [
            {name: 'fb', title: 'Choose Photo from Facebook'},
          ],
        storageOptions: {
          skipBackup: true,
          path: 'images'
        }
        };

        let that = this;

        ImagePicker.showImagePicker(options, (response) => {
        console.log('Response = ', response);

        if (response.didCancel) {
          console.log('User cancelled image picker');
        }
        else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        }
        else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        }
        else {
          let source;

          // You can display the image using either data...
          source = { uri: 'data:image/jpeg;base64,' + response.data };
          // that.setState({profilepicbase: response.data});

          global.dbuser.update({},{ $set: { profilepicture: response.data}},function(){
            that.getData();
            global.socket.emit('changeProfilePic',{
              username: that.state.username,
              profile_picture: response.data,
            })
          });
            // alert(Platform.OS);
          // Or a reference to the platform specific asset location
          if (Platform.OS === 'android') {
            source = { uri: response.uri };
              // alert(source.uri);

          } else {
            source = { uri: response.uri.replace('file://', '') };
          }
        }
      });

  }

  sendchange(){

    let that = this;

    if(this.state.changemodalno == 2){
      global.socket.emit('changeemail',{
        username: that.state.username,
        newemail : that.state.newemail,
      })
      global.dbuser.update({}, {$set: { email: that.state.newemail}});
      that.setState({showmodal: false, newemail: ''})
    }
    else if (this.state.changemodalno == 3) {
      global.socket.emit('changenumber',{
        username: that.state.username,
        newnumber: that.state.newnumber,
      });
      global.dbuser.update({}, {$set: { number: that.state.newnumber}});
      that.setState({showmodal: false, newnumber: ''})
    }
    else if (this.state.changemodalno == 4) {
      if(that.state.newpassword == ''){
        alert('password cannot be empty');
      }
      else {
        global.socket.emit('changepassword',{
          username: that.state.username,
          newpassword: that.state.newpassword
        });
        that.setState({showmodal: false, newpassword: ''})
      }
    }

  }

  render() {



    let changemodalinside;
    if(this.state.changemodalno == 1){
      changemodalinside =
      <View style={{flex: 0.5,width: '80%',flexDirection: 'row',paddingHorizontal:'10%'}}>
              <Flag code={global.strings.flagcode} />
              <Picker selectedValue={global.strings.language} style={{width: '70%'}} mode='dropdown' onValueChange={(value)=>{global.strings.setLanguage(value),this.setState({registermodal: true})}} >
                <Picker.Item label='english' value='english' />
                <Picker.Item label='हिंदी' value='hindi' />
                <Picker.Item label='Deutsche' value='german' />
              </Picker>
      </View>

    }
    else if(this.state.changemodalno == 2){
      changemodalinside =
      <View style={styles.registerstuffpart, {justifyContent: 'center', marginTop: 60,alignContent: 'center'}}>
        <FormLabel style={styles.formelment}>New email:</FormLabel>
        <FormInput style={styles.formelment} containerStyle={styles.formelment} onChangeText={(text) =>{this.setState({newemail: text})}} />
        <FormValidationMessage>{this.state.registerusernameerror}</FormValidationMessage>
      </View>
    }
    else if(this.state.changemodalno == 3){
      changemodalinside =
      <View style={styles.registerstuffpart, {justifyContent: 'center', marginTop: 60,alignContent: 'center'}}>
        <FormLabel style={styles.formelment}>New number:</FormLabel>
        <FormInput style={styles.formelment} containerStyle={styles.formelment} onChangeText={(text) =>{this.setState({newnumber: text})}} />
        <FormValidationMessage>{this.state.registerusernameerror}</FormValidationMessage>
      </View>

    }
    else if(this.state.changemodalno == 4){
      changemodalinside =
      <View style={styles.registerstuffpart, {justifyContent: 'center', marginTop: 60,alignContent: 'center'}}>
        <FormLabel style={styles.formelment}>New Password:</FormLabel>
        <FormInput style={styles.formelment} containerStyle={styles.formelment} onChangeText={(text) =>{this.setState({newpassword: text})}} />
        <FormValidationMessage>{this.state.registerusernameerror}</FormValidationMessage>
      </View>

    }

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
      <MenuProvider >
      <View style={styles.container}>

        <Header androidStatusBarColor="#254e70" style={{backgroundColor:  '#254e70'}}>
        <Left>
          <Icon name='md-arrow-back' type='entypo' style={{color: 'white'}}  onPress = { this.goback} />
        </Left>
        <Body>
          <Title>
            Profile
          </Title>
        </Body>
        <Right>
        <Text></Text>
        </Right>
        </Header>

        {changemodal}

        <View style={styles.avatarcontainer}>

        <TouchableOpacity style={styles.changeppicon} onPress={this.changeProfilePic} >
        <Icon  name='md-create' style={{color: 'white'}}  size={28} />
        </TouchableOpacity>



        <Avatar
          rounded
          xlarge
          avatarStyle={styles.avatar}
          size = {1300}
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
            <View style={ {flex: 0.2,alignItems: 'flex-end', justifyContent: 'flex-end'} }>
            </View>
            </View>

            <View rkCardContent style={{flexDirection: 'row'}}>
            <View style={ {flex: 1,alignItems: 'flex-start'}}>
              <Text>Language:</Text>
              <RkText rkType='large'>{this.state.language}</RkText>
            </View>
            <View style={ {flex: 0.2,alignItems: 'flex-end', justifyContent: 'flex-end'} }>
              <Menu name="numbers" renderer={SlideInMenu} onSelect= {(value)=> {global.strings.setLanguage(value),this.setState({}), this.changelanguage()}} >
                      <MenuTrigger style={styles.trigger}>
                        <Icon name='md-create'/>
                      </MenuTrigger>
                      <MenuOptions customStyles={{ optionText: [styles.text, styles.slideInOption]}} >
                        <MenuOption value='N/A' disabled={true} text='Select language' />
                        <MenuOption value='english' text='English' />
                        <MenuOption value='german' text='Deutsche' />
                        <MenuOption value='hindi' text='हिंदी' />
                      </MenuOptions>
                    </Menu>
            </View>
            </View>


            <View rkCardContent style={{flexDirection: 'row'}}>
            <View style={ {flex: 1,alignItems: 'flex-start'}}>
              <Text>email:</Text>
              <RkText rkType='large'>{this.state.email}</RkText>
            </View>
            <View style={ {flex: 0.2,alignItems: 'flex-end', justifyContent: 'flex-end'} }>
              <TouchableOpacity onPress={()=>{ this.showchangemodal(2,'Change email') }}>
                <Icon name='md-create'/>
              </TouchableOpacity>
            </View>
            </View>

            <View rkCardContent style={{flexDirection: 'row'}}>
            <View style={ {flex: 1,alignItems: 'flex-start'}}>
              <Text>Number:</Text>
              <RkText rkType='large'>{this.state.phonenumber}</RkText>
            </View>
            <View style={ {flex: 0.2,alignItems: 'flex-end', justifyContent: 'flex-end'} }>
            <TouchableOpacity onPress={()=>{this.showchangemodal(3,'Change number')}}>
              <Icon name='md-create'/>
            </TouchableOpacity>
            </View>
            </View>

            <View rkCardContent style={{flexDirection: 'row'}}>
            <View style={ {flex: 1,alignItems: 'flex-start'}}>
              <TouchableOpacity onPress={()=>{this.showchangemodal(4,'Change Password')}}>
              <RkText rkType='large'>Change Password</RkText>
              </TouchableOpacity>
            </View>
            </View>

          </RkCard>
        </View>
      </View>
      </MenuProvider>
    );
  }

  showchangemodal(number,header){
    this.setState({
      showmodal: true,
      changemodalno: number,
      header: header,
    })
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
    flex: 1.7,
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
