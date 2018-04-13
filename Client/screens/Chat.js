/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';

import { Input, Avatar } from 'react-native-elements';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { EventRegister } from 'react-native-event-listeners';

import Message from './message';

var ImagePicker = require('react-native-image-picker');

import { Player, Recorder } from 'react-native-audio-toolkit';

import Modal from 'react-native-modal';

import SoundRecorder from 'react-native-sound-recorder';

import { Button, Header,  Left,Right,Body,Title ,Icon } from 'native-base';

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

// import ImagePicker from 'react-native-image-crop-picker';

// var Datastore = require('react-native-local-mongodb')
// , db = new Datastore({ filename: 'messages', autoload: true });


export default class Chat extends Component {

  constructor(){
    super();

    this.state = {
      err: false,
      chat: [],
      test: "test",
      showmediaselection: false,
      showrecordpopup: false,
      recording: false,
      recorded: false,
      playing: false,
      mediacount: 0,
    }

      this.getData =  this.getData.bind(this);
      this.setdata = this.setdata.bind(this);
      this.sendmessage = this.sendmessage.bind(this);
      this.back = this.back.bind(this);
      this.wanttosendimage = this.wanttosendimage.bind(this);
      this.wanttosendrecording = this.wanttosendrecording.bind(this);
      this.ToggleRecord = this.ToggleRecord.bind(this);
      this.TogglePlay = this.TogglePlay.bind(this);
      this.Sendrecording = this.Sendrecording.bind(this);
      this.playaudio = this.playaudio.bind(this);
      this.onPressMessage = this.onPressMessage.bind(this);

      global.socket.on('yourtranslations',function(data){

        Alert.alert( 'more translations',' The original message: ' + data.originalmessage + '\n translation1: '+ data.source1 + '\n translation2: '+ data.source2 );

      });
  }


  back(){
    global.chatopen = 'none';
    this.props.navigation.navigate('Home');
  }

  getData(){
    var self = this;
    global.dbmessages.find({username: this.state.username},function(err,newDocs){

       if(err){
         alert(err);
         }
         else{
            // alert(JSON.stringify(newDocs));
            var opp = newDocs[0].messages.reverse();
           self.setState({chat: opp});
           // self.flatList.scrollToEnd();
           global.dbchats.findOne({username: self.state.username},function(err,docs){
             self.setState({profilepicture: docs.profile_picture});

             global.dbuser.findOne({},function(err,data){
               self.setState({mediano: data.mediano});
             })

             // alert(docs.profile_picture);
           })

         }
    });
  }


  setdata(data){
    alert(JSON.stringify(data));
    // this.setState({chat: data});
  }
  componentWillMount(){

    const { params } = this.props.navigation.state;
    // alert(params.username);
    this.state.username = params ? params.username : null;
    this.state.name = params.name;
    this.getData();

    global.chatopen = params ? params.username : 'none';


    this.listener = EventRegister.addEventListener('newmessage', (data) => {
          this.getData();
       });

       global.dbchats.update({username: this.state.username} , { $set : {newmessage: false}}, function(err,numchanged){
             // EventRegister.emit('newmessage','m');
           });


    // this.recorder = null;
    // this.loadRecorder();


  }

  // loadRecorder(){
  //
  //   var number = '0';
  //
  //   global.dbuser.findOne({username: this.state.username}, function(err,docs){
  //
  //     if(docs.mediano){
  //       global.duser.update({username: this.sate.username}, { $set: { mediano: 0} } )
  //
  //     }
  //     else{
  //       var number = docs.media;
  //     }
  //
  //   })
  //   var newmedianame = this.state.username + number;
  //
  //   this.recorder = new Recorder(newmedianame, {
  //     bitrate: 256000,
  //     channels: 2,
  //     sampleRate: 44100,
  //     quality: 'max'
  //     //format: 'ac3', // autodetected
  //     //encoder: 'aac', // autodetected
  //   });
  //
  // }

  componentWillUnMount(){

    // alert("in ");
    global.chatopen = 'none';
    global.dbchats.update({username: this.state.username} , { $set : {newmessage: false}}, function(err,numchanged){
          // EventRegister.emit('newmessage','m');
        });

  }

  render() {

    let footer = null;
    if(this.state.keyboardopen){
    footer = <View style={styles.keyboardtop}></View>
    }

    let header =  <Header androidStatusBarColor="#254e70" style={{backgroundColor:  '#254e70'}}>
      <Left>
        <TouchableOpacity onPress = {() => {this.props.navigation.navigate('Home')} } >
        <Icon name='md-arrow-back' type='' style={{color: 'white'}}  />
        </TouchableOpacity>
      </Left>
      <Body>
        <Title>
          {this.state.name}
        </Title>
      </Body>
      <Right>
      <Avatar
        rounded
        avatarStyle={styles.avatar}
        source={ {uri: 'data:image/gif;base64,'+this.state.profilepicture}}
        onPress={() => {this.props.navigation.navigate('FriendProfile', {username: this.state.username} )}}
        icon ='plus'
      />
      </Right>
      </Header>

    let chat =   <View style={styles.messageslist}>
          <FlatList
            ref={elm => this.flatList = elm}
            data = {this.state.chat}
            keyExtractor = { item => item.id}
            renderItem = {this._renderitem}
            extraData = {this.state}
            inverted
          />
      </View>

    let itemselectmenu = <Menu ref={menu =>(this.itemselectmenu = menu)}>
    <MenuTrigger />
    <MenuOptions>
      <MenuOption>
        <Text>Play message</Text>
      </MenuOption>
      <MenuOption>
        <Text>origial message & translations</Text>
      </MenuOption>
    </MenuOptions>
    </Menu>

    let audioitemselectmenu = <Menu ref={menu=>(this.audioitemselectmenu = menu)}>
      <MenuTrigger />
      <MenuOptions>
        <MenuOption>
          <Text>Play message</Text>
          </MenuOption>
          <MenuOption>
          <Text>Play original audio</Text>
          </MenuOption>
          <MenuOption>
          <Text>View More Translations</Text>
        </MenuOption>
      </MenuOptions>
    </Menu>

    let keyboardtopstuff =     <View style={styles.keyboardtop}>
          <View style={styles.plusbutton}>
            <Icon name="md-attach" onPress={() =>{this.mediamenu.open(); }} />
          </View>
          <View style = {styles.inputcontainer}>
            <TextInput
              style = {styles.input}
              placeholder= "enter message here"
              multiline = {true}
              onChangeText = { (text) => { this.setState({message: text})}}
              returnKeyType ='send'
              // onFocus= {()=>{ this.flatList.scrollToEnd()}}
              onBluer= {()=>{this.setState({keyboardopen: false})}}
              ref={input => { this.textInput = input }}
            />
          </View>
          <View style={styles.sendbutton}>
            <Icon name="md-send" onPress={() =>{this.sendmessage()}} />
          </View>
        </View>

    let sendrecordingmodal =
    <Modal isVisible={this.state.showrecordpopup}>
        <View style={styles.modalContent}>

        <View style={styles.registermodalheader} >
          <Text>Record</Text>
        </View>


        <View style={{flex: 0.8, alignItems: 'center',justifyContent: 'space-around', marginLeft: '25%', flexDirection: 'row'}}>
        <TouchableOpacity onPress={this.ToggleRecord} style={{marginRight: 60}}>
        <Icon name='md-mic' type='entypo' style={{  fontSize: 80, color: this.state.recording?'red':'black'}}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.TogglePlay} style={{marginHorizontal: 40}}>
        <Icon name={this.state.playing?'md-pause':'md-play'} type='entypo' style={{ fontSize: 80}}/>
        </TouchableOpacity>

        </View>

        <View style={styles.bcontainer}>
          <View style={styles.buttonContainer}>
            <Button full light style={{ borderBottomLeftRadius: 8,height: '100%'}} onPress={() => {this.setState({showrecordpopup: false, recorded: false})} }><Text>Cancel</Text></Button>
          </View>
          <View style={styles.buttonContainer}>
            <Button style={{ borderBottomRightRadius: 8,height: '100%'}} full onPress={()=> {this.Sendrecording()} } ><Text>Send</Text></Button>
          </View>
        </View>


      </View>
    </Modal>

    let selectmediamodel =
    <Modal isVisible={this.state.showmediapopup}>
    </Modal>

    let selectmediamenu =
    <Menu ref={menu =>(this.mediamenu = menu)} >
      <MenuTrigger />
      <MenuOptions style={{paddingVertical: 10}}>
        <MenuOption onSelect={this.wanttosendimage}>
          <Text>Image</Text>
        </MenuOption>
        <MenuOption onSelect={this.wanttosendrecording}>
          <Text>Record</Text>
        </MenuOption>
      </MenuOptions>
    </Menu>


    if(!this.state.username || this.state.err){
      return (
          <View style={styles.error}>
            <Text>Error</Text>
          </View>
      );

    }
    else{
      return (
        <MenuProvider backHandler>
        <View style={styles.container}>

          {header}
          {chat}
          {keyboardtopstuff}
          {selectmediamenu}
          {sendrecordingmodal}
          {itemselectmenu}
          {audioitemselectmenu}
        </View>
        </MenuProvider>

      );
    }



  }//end render

  wanttosendimage(){

    var options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
      };

      let that = this;

      ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {}
      else if (response.error) {
          alert('there was a problem' + response.error)
      }
      else {
        let source;

        source = { uri: 'data:image/jpeg;base64,' + response.data };

        // alert('asd');
        global.dbuser.findOne({},function(err,data){

          // alert(data.username);
          let date = new Date();
          let message = {
            from: data.username,
            to: that.state.username,
            image: true,
            date: date,
            message: response.data,
          };

          global.dbmessages.update({username: that.state.username}, { $push: {messages: message } }, {}, function(err,newDocs){
              // alert(JSON.stringify(message));
              global.socket.emit('message-with-image',message);
              that.getData();
              that.setState({message: ''});
              that.textInput.clear();

          });

        });




      }
    });

  }

  wanttosendrecording(){
    this.setState({showrecordpopup: true});

  }

  ToggleRecord(){


    if(!this.state.recording){
    let path;
    let filename = this.state.username + this.state.mediacount;
      if( Platform.OS == 'android'){
        path = RNFS.DocumentDirectoryPath + '/' + filename + '.wav';

      }
      else{
        path = RNFS.MainBundlePath + '/' + filename + '.wav';
      }

    var that = this;
    SoundRecorder.start(path)
    .then(function(){
      let mediano = that.state.mediano;
      that.setState({recording: true});
    });

    }
    else{
      var that = this;
      SoundRecorder.stop()
      .then(function(path){
        that.setState({recording: false, recorded: true});
        // alert(path);
      })

    }

  }

  TogglePlay(){

    if(this.state.playing){
      this.player = null;
          this.setState({playing: false});
    }
      else {
          let path;
          let filename = this.state.username + this.state.mediacount;
          if( Platform.OS == 'android'){
            path = RNFS.DocumentDirectoryPath + '/' + filename + '.wav';
            // alert(path);
          }
            else{
              path = RNFS.MainBundlePath + '/' + filename + '.wav';
            }

            this.player = new Player(path);
            this.player.play();
            this.setState({playing: true});
          }


  }

  Sendrecording(){

    if(!this.state.recorded){
      alert('record something before sending it');
    }
    else{

      let path;
      let filename = this.state.username + this.state.mediacount;
      if( Platform.OS == 'android'){
        path = RNFS.DocumentDirectoryPath + '/' + filename + '.wav';
        // alert(path);
      }
      else{
        path = RNFS.MainBundlePath + '/' + filename + '.wav';
      }

      // alert('before')

      let that = this;

      RNFS.readFile(path,'base64')
      .then((filedata)=>{
        // alert(filedata);

        global.dbuser.findOne({},function(err,data){
          alert(global.strings.languagecode);
          let message = {
            from: data.username,
            to: that.state.username,
            audio: true,
            message: filedata,
            audiolocal: path,
            languagecode: global.strings.languagecode,
          }

          global.dbmessages.update({username: that.state.username}, { $push: {messages: message } }, {}, function(err,newDocs){
              global.socket.emit('message-with-audio',message);
              that.getData();
              global.dbuser.update({}, { $inc: { mediano: 1}});
        })

      })
    })
      .catch((err)=>{
        alert('sorry could not send the recording' + err);
      });

      // RNFS.exists(path)
      // .then((success) => { alert('yeah'); })
      // .catch((err) => { alert(err)});


    }

  }

  sendmessage(){

    var self = this;

    global.dbuser.findOne({},function(err,newDocs){

      let username = newDocs.username;
      var datee = new Date();
      var message = {
        from: username,
        to: self.state.username,
        message: self.state.message,
        date: datee
      }
      global.dbmessages.update({username: self.state.username}, { $push: {messages: message } }, {}, function(err,newDocs){
          global.socket.emit('message',message);
          self.getData();
          self.setState({message: ''});
          self.textInput.clear();

      });


    });

  }

  playaudio(path){
    alert('gonna play');
    this.player = new Player(path);
    this.player.play();


  }

  onPressMessage(show,sent){
    if(sent){

    }else{
        alert(show);
        var that = this;
        global.dbuser.findOne({},function(err,data){
          global.socket.emit('showmoretranslations',{text: show, username: that.state.username, language: data.language} );
        });


    }


  }

  _renderitem = ({item}) => (

    <Message
      id = {item.message}
      title = {(this.state.username == item.from)? item.translatedmessage : item.message}
      sent = {(this.state.username == item.from)?false : true }
      onPressItem = {this.onPressMessage}
      image = {(item.image)?item.message : false}
      audio = {(item.audio)?true : false}
      playaudio = {this.playaudio}
      audiopath = {(item.audiolocal)?item.audiolocal: false}
      originalmessage = {item.message}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  error:{
    flex:1,
    backgroundColor: '#2c3e50',
  },
  keyboardtop: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    height:60,
    width: '100%',
    backgroundColor: '#eeeeee',
    paddingHorizontal:10,
    padding:5,
  },
  messageslist:{
    flex: 1,
    // paddingBottom: 62,
  },
  inputcontainer:{
    width: '80%',
  },
  plusbutton:{
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendbutton:{
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    // paddingLeft: 5
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
buttonContainer: {
  // flex: 1,
  justifyContent: 'flex-end',
  width: '50%',
  height: '100%',
  backgroundColor: 'green',
  borderBottomLeftRadius: 8,
  borderBottomRightRadius: 8,
},
bcontainer: {
    flex: 0.25,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    backgroundColor: 'black',
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
});
