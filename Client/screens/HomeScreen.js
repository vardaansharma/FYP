/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  Image,
  Platform,
  TouchableOpacity,

} from 'react-native';

import { Icon, SearchBar, Badge } from 'react-native-elements';
import HeaderButtons from 'react-navigation-header-buttons';

import { EventRegister } from 'react-native-event-listeners';

import { Header, Left, Body, Right, Title, Item,Input, List, ListItem, Thumbnail, Subtitle } from 'native-base';

import {RkText} from 'react-native-ui-kitten';

import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';

const { SlideInMenu }  = renderers;

export default class HomeScreen extends React.Component {

  constructor(){
    super();
    this.state = {
      chats : [],
      check : "",
      numberst: 'asd',
      searchon: false,
      selectedchat: '',
    };

    this.getdata = this.getdata.bind(this);
    this.goto = this.goto.bind(this);
    this.logout = this.logout.bind(this);
    this.deleteselectedchat = this.deleteselectedchat.bind(this);
    this.gotofriendprofile = this.gotofriendprofile.bind(this);
  }

  componentWillMount(){
    this.getdata();

    this.listener = EventRegister.addEventListener('newmessage', (data) => {
          this.getdata();
          // global.chatopen = 'none';
       });
       global.chatopen = 'none';


  }

  gotofriendprofile(){
    var that = this;
    this.props.navigation.navigate('FriendProfile',{
      username: that.state.selectedchat
    });
  }

  deleteselectedchat(){
    let that = this;
    global.dbchats.remove({username: this.state.selectedchat}, function(err,data){
      alert('deleted the chat');
      global.dbmessages.remove({username: this.state.selectedchat}, function(err,data){
        that.setState({forrefresh:''});
      })
    })

  }

  getdata(){

    var that = this;

    global.dbchats.find({}, function(err,newDocs){

       if(err){
           return err;
         }
         else{
           that.setState({chats: newDocs});
         }
    });

    var number = 0;
    var string = 'lof';
    var nostring = string + number;
    this.setState({numberst: nostring});
  }

  render() {

    let menu =
              <View>
              <Menu name="types">
                          <MenuTrigger style={styles.trigger}>
                            <Icon name='menu' type='entypo' color='white' onPress = { this.goback} />
                          </MenuTrigger>
                          <MenuOptions customStyles={{ optionText: styles.text }} >
                            <MenuOption style={{flexDirection: 'row',paddingVertical: 5}} onSelect={()=>{this.goto('Profile')}}>
                              <Icon name='person' type='materialicons' />
                              <RkText style={styles.menutext}>Profile</RkText>
                            </MenuOption>
                            <MenuOption style={{flexDirection: 'row',paddingVertical: 5}} disabled={true} onSelect={()=>{this.goto('Settings')}}>
                              <Icon name='settings' type='materialcommunityicons' />
                              <RkText style={styles.menutext}>Settings</RkText>
                            </MenuOption>
                            <MenuOption style={{flexDirection: 'row',paddingVertical: 5}} onSelect= {this.logout} >
                              <Icon name='log-out' type='entypo' />
                              <RkText style={styles.menutext}>Logout</RkText>
                            </MenuOption>
                          </MenuOptions>
                        </Menu>
              </View>;

    let chatselectmenu =
            <Menu ref={men =>(this.listitemnenu = men)} name='types2' renderer={SlideInMenu} onClose={()=>{this.setState({selectedchat: ''})}}>
              <MenuTrigger/>
              <MenuOptions>
              <MenuOption value='N/A' disabled={true} text={'Options '+this.state.selectedchat} />
              <MenuOption onSelect={this.gotofriendprofile}>
                <Text>View Profile</Text>
              </MenuOption>
              <MenuOption onSelect={this.deleteselectedchat}>
                <Text>Delete Chat</Text>
              </MenuOption>
              </MenuOptions>
            </Menu>

    let header = null;
    if(this.state.searchon){
      header = <Header searchBar rounded style={{backgroundColor: '#254e70'}}>
      <Item>
          <TouchableOpacity onPress={ ()=>{this.setState({searchon: false})} }>
            <Icon name='cross' type='entypo' color='black'  />
          </TouchableOpacity>
          <Input placeholder="Search..." backgroundColor={48} returnKeyType='search'/>
          <TouchableOpacity>
          <Icon name='search' type='feather' color='black' onPress = { this.goback}  containerStyle={{paddingRight: 20}}/>
          </TouchableOpacity>
      </Item>

      </Header>
    }
    else{
      header = <Header androidStatusBarColor="#254e70" style={{backgroundColor: '#254e70'}}>
      <Left>
        <TouchableOpacity onPress ={ () =>{this.goto('AddFriend')} }>
        <Icon name='add-user' type='entypo' color='white' />
        </TouchableOpacity>
      </Left>
      <Body>
        <Title>
          OneChat
        </Title>
        <Subtitle></Subtitle>
        <Badge containerStyle={{backgroundColor: global.connected?'green':'red', width: 3}} />
      </Body>
      <Right>
        <TouchableOpacity onPress={() => {this.setState({searchon: true})}}>
        <Icon name='search' type='feather' color='white'   containerStyle={{paddingRight: 20}}/>
        </TouchableOpacity>
        {menu}
      </Right>
      </Header>
    }

    let list =
      <List dataArray = {this.state.chats}
        renderRow={(item) =>
          <ListItem avatar onPress={()=>{ this.props.navigation.navigate('Chat', {username: item.username, name: item.name} ) }} onLongPress={()=> {this.setState({selectedchat: item.username}),this.listitemnenu.open()} }  >
            <Left >
              <Thumbnail source={ {uri: 'data:image/gif;base64,'+ item.profile_picture}} />
            </Left>
            <Body>
              <Text style={{fontSize: 20}}>
                {item.name}
              </Text>
              <Text>{item.username}</Text>
            </Body>
            <Right>
              <Badge value=' ' containerStyle={{backgroundColor: item.newmessage ? '#aef3e7' : 'transparent' }} />
            </Right>
          </ListItem>
        }
      >
      </List>

    // <List containerStyle={styles.list}>
    //     <FlatList
    //     data = {this.state.chats}
    //     keyExtractor= {item => item.name}
    //     // ItemSeparatorComponent={this.seperatorrender}
    //     // extraData = {this.state}
    //     renderItem = {({ item }) =>
    //       <ListItem
    //         roundAvatar
    //         title={ item.name }
    //         subtitle={ item.username}
    //         avatar = {require('../assets/pp.png')}
    //         containerStyle = {styles.listitem}
    //         onPress = { () => {
    //           this.props.navigation.navigate('Chat', {
    //              username: item.username
    //            })
    //         }
    //        }
    //        // badge = {{ value: ' ', containerStyle: {backgroundColor: item.newmessage ? 'green' : 'transparent' }} }
    //
    //
    //       />
    //
    //     }
    //     // ListHeaderComponent = { () => <SearchBar lightTheme round
    //     //                                   icon={{ type: 'font-awesome', name: 'search' }}
    //     //                                   />}
    //     />
    //     </List>;

    return(
      <MenuProvider backHandler>
      <View>
      {header}

      {list}
      {chatselectmenu}

      </View>
      </MenuProvider>
    );

  }

  itempressed(us){

  }

  logout(){

    global.dbuser.findOne({},function(err,data){
      if(err){}
      else{
        global.socket.emit('loggingout',data.username);
      }
    })

    global.dbuser.remove({});
    global.dbchats.remove({});
    global.dbmessages.remove({});
    this.props.navigation.navigate('Login');

  }

  goto(where){
    this.props.navigation.navigate(where);
  }

  _renderitem = ({item}) => (
    <ListItem
     id={item.name}
     title= {item.name}
   />
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list:{
    // flex: 1,
    // alignItems: 'flex-start'
    borderTopWidth: 0,
    borderBottomWidth: 0,
    marginTop: 0,
  },
  listitem:{
    // borderBottomWidth: 0,
  },
  icon_button:{
  padding: 20,
},
  menutext:{
    paddingHorizontal: 5,
  }
});
