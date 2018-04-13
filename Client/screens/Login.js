/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';

import global_data from '../global_data';

// import SocketManager from '../SocketManager';

import DatabaseManager from '../DatabaseManager';

import { FormLabel, FormInput, FormValidationMessage, Icon, Overlay } from 'react-native-elements';

import { Form, Input, Label, Item, Button, Picker, Spinner, Thumbnail } from 'native-base';

import { RkCard, RkTextInput, RkAvoidKeyboard } from 'react-native-ui-kitten';

import Flag from 'react-native-flags';

import PopupDialog, { DialogTitle, DialogButton } from 'react-native-popup-dialog';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Modal from 'react-native-modal';

var ImagePicker = require('react-native-image-picker');

var RNFS = require('react-native-fs');

import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';

const { SlideInMenu, Popover } = renderers;

import LocalizedStrings from 'react-native-localization';

export default class Login extends Component {

  componentWillMount(){

    var pp = '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';

    this.setState({profilepicture: pp})

  }


  // let Strings = new LocalizedStrings(global.str);

  constructor(){
    super();


    // let str = global.str;
    // let Strings = new LocalizedStrings(global.str);

    // global.strings.setLanguage('german');

    this.state = {
      loginform: true,
      username: '',
      password: '',
      loginpass: '',
      registerpass: '',
      registerconfirmpass: '',
      usernamerror: '',
      passworderror: '',
      lanauage: 'en',
      pagelanguage: 'EN',
      pagelanguagecode: 'GB',
      registermodal: false,
      registerformnumber: 1,
      registerbuttontext: 'Next',
      registernotetext: '',
      registerusernameerror: '',
      registerusername: '',
      phonenumber: '',
      email: '',
      profilepicture: '',
      loginerror: '',
    };

    // strings = new LocalizedStrings(global.strings);


    this.changeform = this.changeform.bind(this);
    this.login = this.login.bind(this);
    this.Register = this.Register.bind(this);
    this.checkusername = this.checkusername.bind(this);
    this.check_passwords_same = this.check_passwords_same.bind(this);
    this.checkconfirmpass = this.checkconfirmpass.bind(this);
    this.cantregister = this.cantregister.bind(this);
    this.sendregisterrequest = this.sendregisterrequest.bind(this);
    this.RegisterUser = this.RegisterUser.bind(this);
    this.usernameerror = this.usernamerror.bind(this);
    this.changeregistermodalview = this.changeregistermodalview.bind(this);
    this.changeregisterformcontent = this.changeregisterformcontent.bind(this);
    this.cancelregister = this.cancelregister.bind(this);
    this.changeprofilepic = this.changeprofilepic.bind(this);

    var that = this;

    global.socket.on('logindata',function(data){
      that.LoginUser(data);
    });

    global.socket.on('yeahregister',function(data){
      that.RegisterUser();
    });

    global.socket.on('usernametaken',function(data){
      that.cantregister();
    });

    global.socket.on('registered',function(data){
      that.Register();
    });

    global.socket.on('loginerror-nouser',function(data){
      that.usernamerror(1);
    });

    global.socket.on('loginerror-wrongpassword',function(data){
      that.usernamerror(2);
    });

    global.socket.on('checkuserexistsreply',function(ans){
      if(ans == 'true'){
        that.setState({registerusernameerror: global.strings.usernametaken });
        // alert('username taken, please choose another');
      }
      else{
        that.setState({registerusernameerror: '', registerformnumber: 2});
      }
    });
  }

  callalert(){
    alert("asd");
  }


  render(){

    let logopart =<View style={styles.logocontainer} >
           <Image resizeMode="contain" style={styles.logo} source={require('../assets/logo.png')} />
           <Text></Text>
          </View>

    let loginform =
    <View style={styles.formcontainer}>
      <Form>

      <Item style={{alignItems: 'stretch'}} underline={false}>
      <Icon name='user' type='entypo' />
        <Item stackedLabel>
          <Label>{global.strings.username}:</Label>
          <Input onChangeText={(text) => this.setState({username: text})}  />
        </Item>
      </Item>

      <Item style={{alignItems: 'center'}} underline={false}>
      <Icon name='lock' type='entypo' />
        <Item stackedLabel>
          <Label>{global.strings.password}</Label>
          <Input onChangeText={(text)=>this.setState({password: text})} secureTextEntry/>
        </Item>
      </Item>

      <Text style={{alignSelf: 'center',color: 'red'}}>{this.state.loginerror}</Text>

      <TouchableOpacity style={styles.to} onPress={this.login}>
       <View style={styles.buttonv}>
       <Text style={styles.buttonText}>{global.strings.login}</Text>
       </View>
      </TouchableOpacity>

      <Text style={styles.bottomtext}>
        {global.strings.notamember}?
      </Text>
      <TouchableOpacity onPress={() =>{this.setState({registermodal: true}) }} >
        <Text style={styles.bottomtextbutton}>{global.strings.register}</Text>
      </TouchableOpacity>
      </Form>

      <View style={styles.languagepickercontainer}>
      <Menu name="numbers" renderer={SlideInMenu} onSelect= {(value)=> {global.strings.setLanguage(value),this.setState({})}} >
              <MenuTrigger style={styles.trigger}>
                <Flag code={global.strings.flagcode} size={24} />

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

    let registerformstuff = null;
    if(this.state.registerformnumber == 1){
      registerformstuff =

      <View style={styles.registerstuffpart, {justifyContent: 'center', marginTop: 50,alignContent: 'center'}}>
        <FormLabel style={styles.formelment}>Username</FormLabel>
        <FormInput style={styles.formelment} containerStyle={styles.formelment} onChangeText={(text) =>{this.setState({registerusername: text})}} onSubmitEditing={this.changeregisterformcontent}/>
        <FormValidationMessage>{this.state.registerusernameerror}</FormValidationMessage>

        <View style={{flex: 0.5,width: '80%',flexDirection: 'row',paddingHorizontal:'10%'}}>
                <Flag code={global.strings.flagcode} />
                <Picker selectedValue={global.strings.language} style={{width: '70%'}} mode='dropdown' onValueChange={(value)=>{global.strings.setLanguage(value),this.setState({registermodal: true})}} >
                  <Picker.Item label='english' value='english' />
                  <Picker.Item label='हिंदी' value='hindi' />
                  <Picker.Item label='Deutsche' value='german' />
                </Picker>
        </View>

      </View>

    }
    else if(this.state.registerformnumber == 2){
      registerformstuff =
      <View style={styles.registerstuffpart}>
      <FormLabel style={styles.formelment}>Password</FormLabel>
      <FormInput style={styles.formelment} containerStyle={styles.formelment} value={this.state.registerpass} onChangeText={(text)=>this.setState({registerpass: text})} />
      <FormValidationMessage>{this.state.registerpassworderror}</FormValidationMessage>

      <FormLabel style={styles.formelment}>Confirm Password</FormLabel>
      <FormInput style={styles.formelment} containerStyle={styles.formelment} onChangeText={(text)=> this.setState({registerconfirmpass: text})} onSubmitEditing={this.changeregisterformcontent} />
      <FormValidationMessage>{this.state.confirmregisterpassworderror}</FormValidationMessage>
      </View>

    }
    else if(this.state.registerformnumber == 3){

      registerformstuff =
      <View style={styles.registerstuffpart}>
      <FormLabel style={styles.formelment}>Phone Number</FormLabel>
      <FormInput style={styles.formelment} containerStyle={styles.formelment} onChangeText={ (text)=> {this.setState({phonenumber: text})}} keyboardType='numeric'  />
      <FormValidationMessage>{this.state.registerpassworderror}</FormValidationMessage>

      <FormLabel style={styles.formelment}>Email</FormLabel>
      <FormInput style={styles.formelment} containerStyle={styles.formelment} onChangeText={(text)=>{this.setState({email: text})}} keyboardType='email-address' />
      <FormValidationMessage>{this.state.registerpassworderror}</FormValidationMessage>
      </View>

    }
    else if(this.state.registerformnumber == 4) {
      registerformstuff =
      <View style={{width: '100%', alignItems: 'center',justifyContent: 'center',paddingVertical: 30,paddingHorizontal:60, marginLeft:30 }} >

        <Thumbnail source={{uri: 'data:image/gif;base64,'+this.state.profilepicture}} style={{width: 160,height: 160, borderRadius: 80}}/>
        <TouchableOpacity onPress={this.changeprofilepic}>
        <Text>Change</Text>
        </TouchableOpacity>
      </View>
    }

    let regiserterModal =
      <Modal isVisible={this.state.registermodal}>

        <View style={styles.modalContent}>

        <View style={styles.registermodalheader} >
          <Text>Register</Text>
        </View>

        <KeyboardAwareScrollView style={{flex: 0.8}} containerStyle={{padding: 0, justifyContent: 'center'}} extraHeight={false}>
           {registerformstuff}
          <View style={styles.formtext}>
          <Text>{this.state.registernotetext}</Text>
          </View>
        </KeyboardAwareScrollView>

        <View style={styles.bcontainer}>
          <View style={styles.buttonContainer}>
            <Button full light style={{ borderBottomLeftRadius: 8,height: '100%'}} onPress={this.cancelregister}><Text>Cancel</Text></Button>
          </View>
          <View style={styles.buttonContainer}>
            <Button style={{ borderBottomRightRadius: 8,height: '100%'}} full onPress={()=> {this.changeregisterformcontent()} } ><Text>{this.state.registerbuttontext}</Text></Button>
          </View>
        </View>


        </View>
      </Modal>



    return(
      <MenuProvider backHandler>
      <View style={styles.container}>

        {logopart}
        {loginform}
        {regiserterModal}

      </View>
      </MenuProvider>
    )

  }

  // render() {
  //
  //   let button = null;
  //   if(this.state.loading){
  //     button = <ActivityIndicator size="small" />
  //   }
  //
  //   if(this.state.loginform){
  //
  //     return (
  //       <KeyboardAvoidingView style={styles.container}>
  //
  //       <View style={styles.logocontainer} >
  //        <Image resizeMode="contain" style={styles.logo} source={require('../assets/icon.png')} />
  //       </View>
  //
  //       <View style={styles.formcontainer}>
  //       <FormLabel>Username</FormLabel>
  //       <FormInput placeholder="e.g joe" containerStyle={styles.inputbox}
  //       returnKeyType="next"
  //       onChangeText={(text) => this.setState({username: text})}
  //       onSubmitEditing={() => this.passwordInput.focus()}
  //       />
  //       <FormValidationMessage>{this.state.usernamerror}</FormValidationMessage>
  //
  //       <FormLabel>Password</FormLabel>
  //       <FormInput placeholder="passwdord" containerStyle={styles.inputbox}
  //       returnKeyType="go"
  //       onChangeText={(text) => this.setState({password: text})}
  //        ref={(input)=> this.passwordInput = input}/>
  //       <FormValidationMessage>{this.state.passworderror}</FormValidationMessage>
  //
  //
  //       <TouchableOpacity style={styles.to} onPress={this.login}>
  //       <View style={styles.buttonv}>
  //       <Text style={styles.buttonText}>LOGIN</Text>
  //       {button}
  //       </View>
  //       </TouchableOpacity>
  //       </View>
  //
  //       <View style={styles.changecontainer}>
  //       <Text style={styles.bottomtext}>
  //       Not a member?
  //       </Text>
  //       <TouchableOpacity onPress={this.changeform}>
  //       <Text style={styles.bottomtextbutton}>Register</Text>
  //       </TouchableOpacity>
  //       </View>
  //
  //
  //       </KeyboardAvoidingView>
  //     );
  //
  //   }
  //   else{
  //
  //     return (
  //       <KeyboardAvoidingView style={styles.container}>
  //
  //       <View style={styles.reglogocontainer} >
  //        <Image resizeMode="contain" style={styles.logo} source={require('../assets/icon.png')} />
  //       </View>
  //
  //       <View style={styles.regformcontainer}>
  //       <FormLabel>Username</FormLabel>
  //       <FormInput placeholder="e.g jdoe" containerStyle={styles.inputbox}
  //       returnKeyType="next"
  //       onChangeText={(text) => this.setState({username: text})}
  //       onSubmitEditing={(input) => {this.registerpasswordInput.focus()} }
  //       />
  //       <FormValidationMessage>{this.state.usernameerror}</FormValidationMessage>
  //
  //       <FormLabel style={styles.regl}>Password</FormLabel>
  //       <FormInput placeholder="password" containerStyle={styles.inputbox}
  //       returnKeyType="next"
  //       onSubmitEditing={() => this.confirmpasswordInput.focus()}
  //       onChangeText={(text) => this.setState({registerpass: text})}
  //        ref={(input)=> this.registerpasswordInput = input}/>
  //       <FormValidationMessage>{this.state.passworderror}</FormValidationMessage>
  //
  //       <FormLabel>Confirm Password</FormLabel>
  //       <FormInput placeholder="password" containerStyle={styles.inputbox}
  //       returnKeyType="next"
  //       onChangeText={(text) => {
  //                                 this.setState({registerconfirmpass: text});
  //
  //                               } }
  //       onSubmitEditing={() => {this.checkconfirmpass()}}
  //        ref={(input)=> this.confirmpasswordInput = input}/>
  //       <FormValidationMessage>{this.state.passworderror}</FormValidationMessage>
  //
  //
  //       <FormLabel>Language</FormLabel>
  //       <Picker style={styles.picker}
  //         selectedValue = {this.state.lanauage}
  //         onValueChange={(itemValue, itemIndex) => this.setState({lanauage: itemValue})}>
  //         <Picker.Item label="English" value="en"/>
  //         <Picker.Item label="German" value="de"/>
  //       </Picker>
  //
  //
  //
  //       <TouchableOpacity style={styles.to} onPress={this.sendregisterrequest}>
  //       <View style={styles.buttonv}>
  //       <Text style={styles.buttonText}>REGISTER</Text>
  //       {button}
  //       </View>
  //       </TouchableOpacity>
  //       </View>
  //
  //       <View style={styles.changecontainer}>
  //       <Text style={styles.bottomtext}>
  //       Have an account?
  //       </Text>
  //       <TouchableOpacity onPress={this.changeform}>
  //       <Text style={styles.bottomtextbutton}>Login</Text>
  //       </TouchableOpacity>
  //       </View>
  //
  //
  //       </KeyboardAvoidingView>
  //
  //
  //     );
  //
  //   }
  // }

  changeprofilepic(){
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
        source = 'data:image/jpeg;base64,' + response.data;
        that.setState({profilepicture: response.data});



      }
    });

  }

  cancelregister(){
    this.setState({
      registermodal: false,
      registerformnumber: 1,
      registerusername: '',
      registerusernameerror: '',
      registerpass: '',
      confirmregisterpassworderror: '',
      registerconfirmpass: '',
      registerbuttontext: 'Next'
    });
  }

  changeregisterformcontent(){
    if(this.state.registerformnumber == 1){

      if(this.state.registerusername == ''){
        this.setState({registerusernameerror: 'please enter a username'});
      }
      else{
          this.checkusername();
      }
    }
    else if (this.state.registerformnumber == 2) {
      // alert('in');

      if( (this.state.registerpass == '') || (this.state.registerconfirmpass == '')){
        this.setState({confirmregisterpassworderror: 'cannot leave password empty'});
      }
      else if(this.state.registerpass != this.state.registerconfirmpass){
          this.setState({confirmregisterpassworderror: 'passwords do not match'});
      }
      else{
         this.setState({registerformnumber: 3, registernotetext: 'Phone number and Email are not compulsary and can be changed later from settings'});
      }

    }
    else if (this.state.registerformnumber == 3) {
      this.setState({registerformnumber: 4, registerbuttontext: 'REGISTER', registernotetext:'' });

    }
    else if (this.state.registerformnumber == 4) {



      var userdetails = {
        name: this.state.registerusername,
        password: this.state.registerpass,
        language: global.strings.code,
        phonenumber: this.state.phonenumber,
        email: this.state.email,
        profilepicture: this.state.profilepicture,
      }
      global.socket.emit('register',userdetails);

      this.setState({registerbuttontext: 'Next', registerformnumber: 1, registermodal: false});

    }
  }

  changeregistermodalview(one,two,three){
      this.setState({
        registermodal1: one,
        registermodal2: two,
        registermodal3: three
      })
  }

  usernamerror(num){
    if(num == 1){
      this.setState({loading: false,
                      loginerror: "invalid username",
                    });


    }else{
      this.setState({loading: false,
                      loginerror: "invalid password",
                    });

    }
      }

  cantregister(){
    this.setState({usernamerror: "username taken"});
  }

  checkconfirmpass(){
    if(!(this.state.registerpass == this.state.registerconfirmpass)){
      this.setState({passworderror: "passwords do not match"});
    }
    else{
      this.setState({passworderror: ""});
    }
  }

  changeform(){
    this.setState((prevState) => {
      return{ loginform : !prevState.loginform};
    });
  }

  login(){

    if(this.state.username == ''){
      this.setState({loginerror: 'username cant be empty'});
    }
    else {
      let lgt = {
        username: this.state.username,
        password: this.state.password,
        notitoken: global.token,
      };
      global.socket.emit('login',lgt);
      this.setState({loading: true, loginerror: ''});
    }
    // this.props.navigation.navigate('Home');
  }

  sendregisterrequest(){

    if(!(this.state.registerpass == this.state.registerconfirmpass)){
      this.setState({passworderror: "passwords do not match"});
    }
    else{
      if(this.state.registerpass == ""){
        this.setState({passworderror: "password cannot be empty"});

      }
      else{
        if(this.state.username == ""){
          this.setState({usernameerror: " username cannot be empty"});

        }
        else{
          this.setState({passworderror: ""});
          this.setState({usernamerror: ""});
          global.socket.emit("canregister",this.state.username);

        }
      }


    }

  }

  RegisterUser(){
    var userdetails = {
      name : this.state.username,
      password : this.state.registerpass,
      language : this.state.lanauage
    };

    global.socket.emit('register',userdetails);
  }

  Register(){

    global.dbuser.remove({});
    global.dbchats.remove({});
    global.dbmessages.remove({});

    this.setState({loading: false});
    alert("Registration complete\n Login to continue");
    this.changeform();

  }

  checkusername(){
    global.socket.emit('checkuserexists',this.state.registerusername)
  }

  check_passwords_same(){

  }

  LoginUser(data){

    this.setState({loading: true});
    var that = this;
    global.dbuser.remove({});
    global.dbchats.remove({});
    global.dbmessages.remove({});
    let dbuserinserts = { username: data.username,
                          language: data.language,
                          password: data.password,
                          loggedin: true,
                          profilepicture: data.profilepicture,
                          phonenumber: data.phonenumber,
                          email: data.email,
                          mediano: 0
                        };
    let dbchatinserts = data.chats;

    // alert(JSON.stringify(data.messages)  );
    let dbmessagesinserts = data.messages;

    let self = this;

    global.dbuser.insert(dbuserinserts, function(err,newDocs){
      if(err){
        alert('could not load user' + err);
      }
      else{
        global.dbchats.insert(dbchatinserts, function(err,newDocs1){
          if(err){
            alert('could not load chats' + err);

            global.dbmessages.insert(dbmessagesinserts, function(err,newDocs2){

              that.setState({loading: false});
              that.props.navigation.navigate('Home');

            });

          }
          else{
            global.dbmessages.insert(dbmessagesinserts, function(err,newDocs2){

              that.setState({loading: false});
              that.props.navigation.navigate('Home');

            });
          }
        })
      }
    });

  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
     // backgroundColor: '#2c3e50', //'rgb(32,69,77)',
     backgroundColor: 'white',
     justifyContent: 'flex-start',
  },
  logocontainer :{
    flex: 0.4,
    alignItems: 'center',
    justifyContent:  'center',
    backgroundColor: 'white',
  },
  reglogocontainer :{
    flex: 0.3,
    alignItems: 'center',
    justifyContent:  'center',
  },
  formcontainer: {
    flex: 0.6,
    justifyContent: 'space-around',
    width: '100%',
    // alignItems: 'center'
   // justifyContent: 'flex-end',
  },
  regformcontainer: {
    flex: 1.3,
    justifyContent: 'space-around',
  },
  changecontainer: {
    flex: 0.01,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputbox: {
    // width: 600,
    // backgroundColor:'#d5d7e2',
    // backgroundColor:  'transparent',//'rgba(225,225,225,0.2)',//'rgba(3,6,7,0.3)',
    // borderRadius: 10,
    // paddingHorizontal:10,
    // color:'#ffffff',
    // marginVertical: 3
  },
  buttonv:{
    backgroundColor: '#254E70' ,//'#2980b6',
        padding: 15,
        width: '95%',
        // flexDirection:'row',
        alignItems: 'center'

  },
  to: {
    alignItems: 'center',
    paddingVertical: 20,

  },
  buttonText: {
    color: '#fff',
       textAlign: 'center',
       fontWeight: '700'
  },
  logo: {
    width: '150%',
    height: '150%'
  },
  bottomtext: {
    // color: 'grey'
    // paddingTop: '50',
    alignSelf: 'center',
  },
  bottomtextbutton:{
    textDecorationColor: 'white',
    color: 'blue',
    alignSelf: 'center',
  },
  reg:{
    height: '30%',
  },
  regl: {
    padding: 0,
  },
  picker: {
    width: '90%',
    alignSelf: 'center'
  },
  languagepickercontainer: {
    position: 'absolute',
    right: 8,
    bottom: 2,
    padding: 0,
    flexDirection: 'row',
  },
  triggerText: {
    fontSize: 20
  },

  trigger:{
    flexDirection: 'row',
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
  formtext: {
    width: '95%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20

  },
});
