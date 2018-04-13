/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { Header, Separator, Icon, Left,Right,Body,Title } from 'native-base';

import { List, ListItem, SearchBar } from 'react-native-elements';

import { EventRegister } from 'react-native-event-listeners';

export default class HomeScreen extends React.Component {


  constructor(){
    super();

    //alert(JSON.stringify(this.props));
    this.state = {
      friends : [],
      loading : false,
      error: '',
      friendname: '',
    }

    this.lookforfriends = this.lookforfriends.bind(this);
    this.messageuser = this.messageuser.bind(this);

    var that = this;
    global.socket.on('foundfriend',function(data){
      that.setState({loading: false, error: ''});

      var list = [{
                    username: data.name,
                    profilepicture: data.profilepicture,
                  }];
      that.setState({friends: list});

    });



    global.socket.on('couldnotfindfriend',function(data){
      that.setState({loading: false});
      that.setState({error: "no such user", friends: []});
    });


  }


  render() {
    let loadingthingie = null;
    if(this.state.loading){
      loadingthingie = <ActivityIndicator size="large" />
    }

    return(
      <View>

      <Header style={{backgroundColor:  '#254e70'}}>
        <Left>
          <TouchableOpacity onPress = {() => {this.props.navigation.navigate('Home')} } >
          <Icon name='md-arrow-back' style={{color: 'white'}}  />
          </TouchableOpacity>
        </Left>
        <Body>
          <Title>
            Add Friend
          </Title>
        </Body>
        <Right>
        <Text></Text>
        </Right>
        </Header>

      <SearchBar
        lightTheme
        round
        onChangeText = { (text) => {this.setState({friendname: text})}}
        onSubmitEditing={(text) => this.lookforfriends(text)}
      />
      {loadingthingie}

      <List containerStyle={styles.list}>
      <FlatList
      data = {this.state.friends}
      keyExtractor= {item => item.username}
      extraData = {this.state}
      renderItem = {({ item }) =>
        <ListItem
          roundAvatar
          title={ item.username }
          avatar = {{uri: 'data:image/gif;base64,'+ item.profilepicture}}
          containerStyle = {styles.listitem}
          rightIcon={ {name:'add-user', color:'black',type: 'entypo'} }
          onPressRightIcon ={ () => this.messageuser(item.username,item.profilepicture)}

        />
      }
      />
      </List>
      <Text>{this.state.error}</Text>
      </View>
    );


  }







  messageuser(uname, profilepicture){
    // alert(uname);
    let name = this.state.friendname;
    global.dbchats.count({ username: uname}, function(err,count){
      if(err){
        alert("problem loading chat");
      }
      else{
        if(count > 0){
          alert("already a Friend")
        }
        else{
          var doc = {
              username: uname,
              name: uname,
              profile_picture: profilepicture,
          };
          global.dbchats.insert(doc,function(err,newDocs){
            if(err){
              alert("could not add friend");
            }
            else{
              mdoc = {
                username: uname,
                messages : [],
              }
              global.dbmessages.insert(mdoc,function(errm,newDocsm){

                if(errm){
                  alert("could not add friend");
                }
                  else{

                    global.dbuser.findOne({},function(err,docs){

                      if(err){
                        //handle error
                      }

                      let d = {
                        user: docs.username,
                        friendusername: uname
                      };

                      // alert(JSON.stringify(d));

                      global.socket.emit('addfriend',d);
                      EventRegister.emit('newmessage','m');
                      alert("Friend added");

                    })



                  }


              })

            }
          });
        }
      }
    });

  }

  lookforfriends(name){
    this.setState({loading:true});
    global.socket.emit('sendfrienddetails',this.state.friendname);
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
  searchbar: {
    flex : 1.6,
  },
  searchview:{
    flexDirection: 'row'
  },
  searchicon:{
    flex:  0.4,
    backgroundColor: 'grey',
  },
  iconback:{
    backgroundColor: 'lightgrey',//'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  }
});


// <TouchableOpacity style={styles.iconback}>
// <Icon name='search'  style={styles.searchicon}/>
// </TouchableOpacity>
