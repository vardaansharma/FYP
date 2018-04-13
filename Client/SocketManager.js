/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import io from 'socket.io-client';

import DatabaseManager from './DatabaseManager';

import incomingmessagemanager from './incomingmessagemanager';

import { EventRegister } from 'react-native-event-listeners';

import LocalizedStrings from 'react-native-localization';

export default class SocketManager {
// http://  138.68.186.45  138.68.186.45  147.252.137.5  159.65.229.135 147.252.137.41
  constructor(){
    global.socket =  this.socket = io("http://192.168.43.159:80",{
      transports: ['websocket'],
    });

    global.logggedinserver = false;
    global.loggedin = false;

    global.stro = 'asd';
    global.chatopen = 'none';

    global.strings = new LocalizedStrings({
      "english" : {
        flagcode: "US",
        code: "en",
        language: "english",
        languagecode: 'en-US',
        username: 'username',
        password: 'password',
        login: 'LOGIN',
        settings: 'settings',
        logout: 'logout',
        profie: 'profile',
        email: 'email',
        phonenumber: 'phone number',
        notamember: 'not a member?',
        register: 'register',
        cancel: 'Cancel',
        Send: 'send',
        viewprofile: 'View profile',
        deletechat: 'Delete Chat',
        image: 'Image',
        record: 'record',
        usernametaken: 'usernametaken',
      },
      "hindi": {
        flagcode: "IN",
        code: "hi",
        language: "hindi",
        username: "उपयोगकर्ता नाम",
        usernametaken: "नाम लीया हुआ हेह ",
        password: "पारण",
        login: "लॉग इन",
        notamember: "सदस्य नहीं है",
        register: "रजिस्टर",

      },
      "german": {
        flagcode: "DE",
        code: "de",
        language: "german",
        username: "Benutzername",
        usernametaken: "Benutzername vergeben",
        password: "Passwort",
        login: "Anmeldung",
        notamember: "kein Mitglied",
        register: "registrieren",


            }
    });


    global.colorone = '#254e70';
    // global.strings.setLanguage('german');

    global.socket.on('alert',function(text){
      alert(text);
    });

    var that = this;

    global.socket.on('message',function(message){

      //add to dbmessages
      that.AddMessage(message);

    });

    global.socket.on('gotdp',function(data){
        global.dbchats.update({username: data.username}, { $set: {profile_picture: data.profile_picture}});
    });

    global.socket.on('connect',function(data){
     // alert('connected to server');
     global.connected = true;
     global.dbuser.findOne({}, function(err,newDocs){

        if(err){
            alert(err);
          }
          else{
            if(newDocs){
              if(newDocs.loggedin){

                var logindeats = {
                  username : newDocs.username,
                  password : newDocs.password,
                  notitoken : global.token,
                };
                global.socket.emit('login',logindeats);
              }
            }

          }
     });

    });

    global.socket.on('disconnect',function(data){
      // alert('disconnected');
      global.connected= false;
    })


  }


  AddMessage( message ){

    alert(message.from);

    //check if user is in list

    global.dbchats.findOne({username: message.from},function(err,newDocs){

      if(err){
        alert(err);
      }

      if(newDocs){
//           global.socket.emit('getdp',message.from);
        // alert('in if ' + message.from);
        global.dbmessages.update({username: message.from}, { $push: {messages: message } }, function(err,newDocs){
          if(message.from == global.chatopen){
            EventRegister.emit('newmessage','m');
          }else{
            global.dbchats.update({username: message.from} , { $set : {newmessage: true}}, function(err,numchanged){
                  EventRegister.emit('newmessage','m');
                });
          }
          });
      }
      else{
        // alert('in else ' + message.from);
//        global.socket.emit('getdp',message.from);
        var doc = {
            username: message.from,
            name: message.from
        };
        global.dbchats.insert(doc,function(err,newDocs){
          if(err){
            alert(err);
          }
          else{
            mdoc = {
              username: message.from,
              messages : [],
            }
            global.dbmessages.insert(mdoc,function(errm,newDocsm){

              if(errm){
                // alert("could not add friend");
              }
              else{

                  global.dbmessages.update({username: message.from}, { $push: {messages: message } }, function(err,newDocs){

                    EventRegister.emit('newmessage','m');
                    if(message.from == global.chatopen){

                    }else{
                      global.dbchats.update({username: message.from} , { $set : {newmessage: true}}, function(err,numchanged){
                            EventRegister.emit('newmessage','m');
                          });
                    }

                  });
              }
            })
          }
        });

      }

    });

    //if user not add else just put it in bithc


  }

}
