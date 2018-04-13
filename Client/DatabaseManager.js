/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';


  var Datastore = require('react-native-local-mongodb')
  , dbmessages = new Datastore({ filename: 'messages', autoload: true });

  let dbchats = new Datastore({ filename: 'chats', autoload: true});

  let dbuser = new Datastore({ filename: 'user', autoload: true});

  let dbmessageids = new Datastore({ filename: 'messageids', autoload: true});


  global.dbmessages = dbmessages;
  global.dbchats = dbchats;
  global.dbuser = dbuser;
  global.dbmessageids = dbmessageids;

export default class DatabaseManager {

  constructor(){

  }




   AddMessage( message ){



   }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
