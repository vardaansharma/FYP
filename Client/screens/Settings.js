/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { List, Header, ListItem, Separator, Icon, Left,Right,Body,Title } from 'native-base';

import { RkCard, RkText } from 'react-native-ui-kitten';
import Flag from 'react-native-flags';
import Modal from 'react-native-modal';
import { Form, Input, Label, Item, Button, Picker, Spinner, Thumbnail } from 'native-base';

import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';

import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';

const { SlideInMenu, Popover } = renderers;


export default class Settings extends Component {

  constructor(){
    super();

    this.state = {
      email: '',
      colorScheme: '',
      language: '',
      number: '',
      changingpass: false,
      showmodal: false,
      newemail: '',
      newnumber: '',
      newpassword: '',
    }

    this.getdata = this.getdata.bind(this);
    this.sendchange = this.sendchange.bind(this);
    this.showchangemodal = this.showchangemodal.bind(this);
    this.changelanguage = this.changelanguage.bind(this);
  }

  componentWillMount(){
    this.getdata();
  }

  getdata(){

    var that = this;

    global.dbuser.findOne({},function(err,data){
      if(err){
        alert('error');
        that.props.navigation.navigate('HomeScreen');
      }
      else{
        // alert(data.language);
        that.setState({
          email : data.email,
          language: data.language,
          number: data.number,
          username: data.username,
        });
      }
    });

  }

changelanguage(){
  var that = this;
  global.socket.emit('changelanguage',{
    username: that.state.username,
    newlanguage: global.strings.language
  }
)
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

  showchangemodal(number,header){
    this.setState({
      showmodal: true,
      changemodalno: number,
      header: header,
    })
  }
  render() {

    let header =
    <Header androidStatusBarColor="#254e70" >
      <Left>
        <TouchableOpacity onPress = {() => {this.props.navigation.navigate('Home')} } >
        <Icon name='md-arrow-back' style={{color: 'white'}}  />
        </TouchableOpacity>
      </Left>
      <Body>
        <Title>
          Settings
        </Title>
      </Body>
      <Right>
      <Text></Text>
      </Right>
      </Header>

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
      <MenuProvider>
      <View style={styles.container}>

      {header}

      {changemodal}

        <RkCard rkType='shadowed' style={{ margin: 5, borderRadius: 10}}>
          <View rkCardHeader>
            <RkText rkType='header' >App</RkText>
          </View>

          <View rkCardContent style={{flexDirection: 'row' }}>
          <View style={ {flex: 1,alignItems: 'flex-start'}}>
            <RkText>Color Scheme</RkText>
          </View>
          <View style={ {flex: 0.2,alignItems: 'flex-end', justifyContent: 'flex-end'} }>
          </View>
          </View>
        </RkCard>

        <RkCard rkType='shadowed' style={{ margin: 5, borderRadius: 10}}>
          <View rkCardHeader>
            <RkText rkType='header' >User</RkText>
          </View>
          <View rkCardContent style={{flexDirection: 'row'}}>
          <View style={ {flex: 1,alignItems: 'flex-start'}}>
            <Text>Language:</Text>
            <RkText>{this.state.language}</RkText>
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
            <RkText >{this.state.email}</RkText>
          </View>
          <View style={ {flex: 0.2,alignItems: 'flex-end', justifyContent: 'flex-end'} }>
            <Icon name='md-create' onPress={()=>{ this.showchangemodal(2,'Change email') }}/>
          </View>
          </View>

          <View rkCardContent style={{flexDirection: 'row'}}>
          <View style={ {flex: 1,alignItems: 'flex-start'}}>
            <Text>Number:</Text>
            <RkText>{this.state.number}</RkText>
          </View>
          <View style={ {flex: 0.2,alignItems: 'flex-end', justifyContent: 'flex-end'} }>
            <Icon name='md-create' onPress={()=>{this.showchangemodal(3,'Change number')}}/>
          </View>
          </View>

          <View rkCardContent style={{flexDirection: 'row'}}>
          <View style={ {flex: 1,alignItems: 'flex-start'}}>
          <TouchableOpacity onPress={()=>{this.showchangemodal(4,'Change Password')}} >
            <RkText>Change Password</RkText>
          </TouchableOpacity>
          </View>
          </View>
        </RkCard>
      </View>
      </MenuProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  seperator: {
    backgroundColor: 'grey',
    paddingVertical: 30,
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
  },
});
