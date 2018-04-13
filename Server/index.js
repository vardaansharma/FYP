
//server stuff
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

//hastable for holding the online users and their sockets
//var onlineusers = require('node-hashtable');
var notitokens = require('node-hashtable');
var onlineusers = {
    blah : 'asd'
}

var usersockets = {
    blah : 'asd'
}
//database stuff
var mongoose = require('mongoose');
var User = require('./models/user');
var Message = require('./models/Messages');
var Backupmessages = require('./models/backupmessages');
var Outbox = require('./models/outbox');

 mongoose.connect('mongodb://127.0.0.1:27017/myappdatabase',{
   useMongoClient: true,
 });

var db = mongoose.connection;
db.once('open',function(){
  console.log('connected to database');    
});



//translate stuff
const Translate = require('@google-cloud/translate');
const projectID = "buoyant-world-185610";
const translate = new Translate({
	keyFilename : '/My First Project-9b4c77557f74.json',
	projectId : projectID,
});


const Speech = require('@google-cloud/speech');
const speech = new Speech.SpeechClient({
    keyFilename : '/My First Project-9b4c77557f74.json',
	projectId : projectID,
});

const languagecodes = {
    
    en : {
        googleSTT : 'en-US',
    }
};

var SpeechToText = require('watson-developer-cloud/speech-to-text/v1');

var IBMTranslation = 
    require('watson-developer-cloud/language-translator/v2');

var IBMtranslator = new IBMTranslation({
    "username": "74177e98-fe4b-47ae-976d-b72210dd13fb",
    "password": "1Jhom4qbdoGr",
     "url": "https://gateway.watsonplatform.net/language-translator/api",
});


var STT_IBM = new SpeechToText ({
   "username": "53b44efc-ea0b-46bc-8dc3-3410b237c7f0",
  "password": "WyqHGDLsoHeF" 
});


//push notification GCM stuff
var gcm = require('node-gcm');

var sender = new gcm.Sender('AIzaSyDVyCvnLNTbS6TWhRBbKlm37d4h_aN3uEU');

var push_notification_message = new gcm.Message({
   notification: {
       title: "New Messages"
   }
});


var regToken1 = '';

var fs = require('fs');


//socket stuff
io.sockets.on('connection',function(socket){
  console.log('socket connected on '+ socket.id);

//    socket.emit('alert', 'step1');

    socket.on('register',function(userdetails){
		console.log('registering new user');
		CreateUser(userdetails,socket);
//		console.log(user);
	});

	socket.on('login',function(user){
		console.log('trying to log user in' + user.username);
		Login(user.username,user.password,socket,user.notitoken);

	});
    
    socket.on('logout',function(user){
        
    })

	socket.on('checkuserexists',function(username){
		CheckUserExists(username, socket);
	});

	socket.on('message',function(m){
		console.log('got a message from ' + m.from+ 'for: ' + m.to);
		ProcessMessage(m,socket);
	});

    socket.on('canregister',function(username){
       register(username,socket);
    });

  socket.on('disconnect',function(user){
    console.log('user disconnected ' + socket.id);
    Disconnect(socket.id);
  });

  socket.on('sendfrienddetails',function(name){

	console.log('looking for user' + name);
	sendfrienddetails(name,socket);
  });
  
  socket.on('addfriend',function(details){
	  console.log('adding friend'+ details.friendusername +' for user' + details.user);
	  addfriend(details);
  });

    socket.on('log',function(text){
              console.log(text);
              });
    
    socket.on('sendnoti',function(token){
        console.log('got new token: ', token);
        regToken1 = token;
        var regToken = [token];
        sender.send(push_notification_message,{ registrationTokens: regToken },function(err, reposnse){
           if(err){
               console.log(err);
           }
            else{
                console.log(reposnse);
            }
        });
    });
    
    socket.on('sendnotitohim',function(data){
        console.log('sending to token: ', regToken1);
        var regToken = [regToken1];
        sender.send(push_notification_message,{ registrationTokens: regToken },function(err, reposnse){
           if(err){
               console.log(err);
           }
            else{
                console.log(reposnse);
            }
        });
    });
    
    socket.on('image', function(data){
       console.log('in socket got image');
        saveimage(data);
    });
    
    socket.on('message-with-image',function(data){
        
        console.log('got message with image');
        ProcessImageMessage(data);
        
    });
    
    socket.on('message-with-audio',function(data){
        
        console.log('got message with audio');
        ProcessAudioMessage(data);
        
    });

    socket.on('changeemail', function(data){
        changeuseremail(data);
    } );
    socket.on('changepassword',function(Data){
        changeuserpassword(Data);
    });
    socket.on('changenumber',function(data){
        changeusernumber(data);
    });
    
    socket.on('getuserdetails',function(user){
        getuserdetails(user,socket);
    });
    socket.on('getdp',function(username){
        console.log(username + 'lllllojouvjhvychgc');
        senddp(username,socket);
    });
    socket.on('changeProfilePic', function(data){
        changeProfilePic(data);
    })
    socket.on('showmoretranslations',function(data){
        sendmoretranslations(data,socket);
    })
    
});

function sendmoretranslations(data,socket){
    
    console.log(' request for more translations ' + JSON.stringify(data));
    
    User.findOne({username: data.username}, function(err,docs){
        var tlang = docs.language;
        var text = data.text;
        var flang = data.language;
        
        
        translate
			.translate(text,tlang)
			.then(results => {
                
				const googletranslation = results[0];
                
                IBMtranslator.translate(
                    {
                        text: text,
                        source: flang,
                        target: tlang,
                        
                    },
                    function(err,translation){
                     
                        var IBMtranslation;
                        if(err){
                            IBMtranslation = 'translation error';
                        }
                        else{
                            var IBMtranslation =  translation;
                        }
                        
                        socket.emit('yourtranslations', {
                            originalmessage: text,
                            source1: googletranslation,
                            source2 : IBMtranslation
                        })
                        
                       });//end IBM translation function


			})//end of google translation
			.catch(err => {
				console.error('ERROR: ',err);
			}); 
        
        
    });
    
}

function changeProfilePic(data){
    console.log('changing profile picture');
    User.update({username: data.username}, { $set: {profile_picture: data.profile_picture}}).exec();
}

function senddp(username,soccket){
    User.findOne({username: username}, function(data){
        console.log(data);
       var profile_picture = data.profile_picture;
        
        socket.emit('gotdp', { username: username, profile_picture: profile_picture});
    });
}

function Disconnect(socketid){
    
    var username = usersockets[socketid];
    
    delete usersockets[socketid];
    delete onlineusers[username];
}

function getuserdetails(data,socket){
    
    User.findOne({username: data}, function(err, obj){
       if(err){
           socket.emit('error','soz');
       }
        else{
            data= {
                language: obj.language,
                email: obj.email,
                phone_number: obj.phone_number,
            }
            socket.emit('frienddata',data);
        }
    });
    
}

function changeuseremail(data){
    console.log('changing email');
    User.update({username: data.username}, { $set: {email: data.newemail}}).exec();
}

function changeusernumber(data){
    console.log('changing profile picture');
    User.update({username: data.username}, { $set: {phone_number: data.newnumber}}).exec();
}

function changeuserpassword(data){
 console.log('changing profile picture');
    User.update({username: data.username}, { $set: {password: data.newpassword}}).exec();   
}

function saveimage(imagedata){
    
    var buf = new Buffer(imagedata, 'base64');
    fs.writeFile('image.png',buf);
    
}

//database fuctions
function CheckUserExists(usrname, socket){
	var exists;
	User.count({username: usrname }, function( err, count){
//		if err throw err;
		if(count >0){
		console.log('user exsists');
		//send the data to client who asked
	       socket.emit('checkuserexisitsreply','true');
        }
		else{
//		send the data to the client who asked
		console.log('user does not exist');
            socket.emit('checkuserexistsreply',false);
		}
	});
}

//Login('jondoe','password');
function Login(usrname, pass,socket,token){

	User.findOne({ username : usrname}, function(err,obj){


		if(obj){

			console.log(obj.username + ' ' + obj.password + pass);
			if(obj.password == pass){

                var lang= obj.language;
                

                Backupmessages.findOne({ username : usrname}, function(err,obj1){

                    var mess = obj1.chats;
                    var chatlist = obj1.chatlist;

                    var data = {
                        username : usrname,
                        language : lang,
                        chats: chatlist,
                        messages: mess,
                        password: pass,
                        profilepicture: obj.profile_picture,
                        email: obj.email,
                        phonenumber: obj.phone_number,
                    };
                    
//                    console.log(mess);

                    socket.emit('logindata',data);
                    onlineusers[usrname] = socket.id;
                    usersockets[socket.id] = usrname;
//				    onlineusers.set(usrname,socket.id);
                    notitokens.set(usrname,token.token);
                    console.log(token.token + '' + usrname);
                    sendusermessages(usrname,socket);
                    
                        
                  
                    

                });

            }
			else{
				console.log('not accepted');
				//emit legged in to user
				socket.emit('loginerror-wrongpassword','wrong password');
			}

		}
		else{
			console.log('could not find user');
			socket.emit('loginerror-nouser','could not find user');
		}
	});


}

function LoginFirst(usrname, pass , socket){

}

function addfriend(data){
    
    console.log('in adddfriendd    ');
	
	var user = data.user;
    var tobeadded = data.friendusername;
    
    console.log(tobeadded);
    
    User.findOne({username: tobeadded}, function(err,obj){
        if(err){
            //handle error
        }
        else{
            var newfrienddets = {
                username : obj.username,
                name: obj.username,
                profile_picture: obj.profile_picture,
            };
            
            var newchatsdeats = {
                username: obj.username,
            }
            
            Backupmessages.update({username: user},
                                  {$push : {chatlist : newfrienddets }
                                }).exec();
            
            Backupmessages.update({username: user},
                                  {$push : {chats : newfrienddets }
                                }).exec();
            
            // adding to others database
            
            var othernewfriends = {
                username : user,
            }
            
            var othernewchatdeats = {
                username : user,
                chats:[]
            }
            
            
            Backupmessages.update({username: obj.username},
                                    {$push : {chatlist : othernewfriends}}).exec();
            
            Backupmessages.update({username: obj.username},
                                    {$push: {chats: othernewfriends}}).exec();
        }
    });
	
}

// sendusermessages('newuser');
function sendusermessages(username,socket){
    

//  console.log(username + ' just logged in, ');
  Outbox.findOne( { username : username}, function(err,data){
    
    if(err){
      console.log(err);
    }
    else{
        
        var messages = data.messages;
        for( var i = 0; i <messages.length; i++){
            socket.emit('message',data.messages[i]);
        }
        Outbox.update({username: username},{$set : { messages: [] }  });
    }
    
  });
    

}


function sendfrienddetails(name, socket){
    
    
    User.findOne({username: name}, function(err, data ){
        if(err){
    		console.log('error finding the name');
			socket.emit('couldnotfindfriend','soz');        
        }
        else{
            if(data){
                
                dets = {
                    name: name,
                    profilepicture: data.profile_picture
                };
                
                socket.emit('foundfriend',dets);
                
            }
            else{
                socket.emit('couldnotfindfriend','soz');
            }
        }
    } )

	User.count({username: name }, function( err, count) {
		if(err){
			console.log('error finding the name');
			socket.emit('couldnotfindfriend','soz');
		}
		else{
			if(count > 0){
                dets = {
                    name: name,
                    
                }
				socket.emit('foundfriend',name);
			}
			else{
				socket.emit('couldnotfindfriend','soz');
			}
		}
	});

}

//CreateUser('janedoe','password','en');
function CreateUser(userdetails, socket){

	var name = userdetails.name;
	var pass = userdetails.password;
	var lang = userdetails.language;
    var phonenumber = userdetails.phonenumber;
    var email = userdetails.email;
    var profilepicture = userdetails.profilepicture;    
        
	User.count({username: name }, function( err, count){
		if (err) throw err;
		if(count >0){
			console.log('user already exists');
		//tell that the username exists
			socket.emit('usernametaken','user already exists');
		}
		else{

			var user = User({
				username: name,
				password: pass,
				language: lang,
                profile_picture: profilepicture,
                email: email,
                phone_number: phonenumber,
			});

			var bum = Backupmessages({
				username: name,
				chat: [],
                chatlist: []
			});

            var outbx = Outbox({
               username: name,
                messages: [],
            });

			user.save(function(err){
				if(err) {
//                    return handleError(err);
                }
//					throw err;
				else{
					console.log('made user');

					bum.save(function(err){

						if(err){
//                            return handleError(err);
                        }
//						{}	throw err;
						else{
                            	outbx.save(function(err){

						              if(err){
//                                        return handleError(err);
                                        }
						              else{
							             socket.emit('registered','registered!\nusername: '+ name);
						              }

                                });
						}

					});
				}
			});

		}
	});

}

function ProcessMessage(message,socket){


    console.log(message);
    
    User.findOne({username: message.from }, function(err,fromobj){
                 
    var sourcelang = fromobj.language;
    
	User.findOne({ username: message.to},function(err,obj){
        
        console.log('found user to send the message to')

		//if the user being sent to is registered
		if(obj){
			var lang = obj.language;

        //translating the message (google)
			translate
			.translate(message.message,lang)
			.then(results => {
                
				const googletranslation = results[0];
                
                IBMtranslator.translate(
                    {
                        text: message.message,
                        source: sourcelang,
                        target:  lang,
                        
                    },
                    function(err,translation){
                     
                        var IBMtranslation;
                        if(err){
                            console.log(err + ' IBM translation error');
                        }
                        else{
                            var IBMtranslation =  translation;
                        }
                        
                var translations = (sourcelang == lang)? [message.message]:[googletranslation, IBMtranslation ]; 
                console.log(translations);
				var mess = Message({
							from: message.from,
							to: message.to,
							message: message.message,
							date: new Date,
							translatedmessage: googletranslation
						});

				//checking if the user is online
				notitokens.get(message.to,function(data){
                    
                    var sock = onlineusers[message.to];
                    console.log('socket ' + data);
                    
//                    notitokens.get(message.to, function(d){
                        
//                        console.log(message.to + ' khkjn ' + d);
                        
                        	if(data){
						console.log(message.to + 'is online, sending them the new message');
						//user is online
						io.sockets.to(sock).emit('message',mess);
						console.log('sent '+message.to+' the message');
                        
                        
                       Backupmessages.update(
                            {username : mess.to, 'chats.username': mess.from},
                            {$push : { 'chats.$.messages' : mess }}
                        ).exec(function(err, docs){
                             Backupmessages.update(
                            {username : mess.from, 'chats.username': mess.to},
                            {$push : { 'chats.$.messages' : mess }}
                        ).exec();
                       });
                        
                        
                        //update the chatlist  
                        sender.send(push_notification_message,{ registrationTokens: [data] },function(err, reposnse){
           if(err){
               console.log(err);
           }
            else{
                console.log(reposnse);
            }
        });
                        
					}
					else{
                        
                    console.log('user not online saving message in outbix ' + mess.to);
                        
                        Outbox.update(
                            {username: mess.to},
                            {$push: { messages : mess}}
                        );

                        Backupmessages.update(
                            {username : mess.to, 'chats.username': mess.from},
                            {$push : { 'chats.$.messages' : mess }},{upsert: true}
                        ).exec(function(err, docs){
                             console.log('asdafads');
                             Backupmessages.update(
                            {username : mess.from, 'chats.username': mess.to},
                            {$push : { 'chats.$.messages' : mess }}
                        ).exec();
                       });
                        
                        sender.send(push_notification_message,{ registrationTokens: [data] },function(err, reposnse){
           if(err){
               console.log(err);
           }
            else{
                console.log(reposnse);
            }
        });
                    }
                        
                        
                        
                    });//end notitokens.get
                    
                });//end IBM translation function


			})//end of google translation
			.catch(err => {
				console.error('ERROR: ',err);
			});


		}
		//if the user being sent to is not registered
		else{
			socket.emit('alert','invalid send to user');
		}

	});
        
        });
}

function ProcessImageMessage(message){
    
//        let message = messages.date;
//            console.log('maybe ' + message.to + message.from);
//        console.log('found user to send the image to ' + JSON.stringify(message));        
  
    let  from = message.from;
    let to = message.to;
    let themessage = message.message;
    
    User.findOne({ username: message.to}, function(err,obj){
        console.log('found user to send the image to ');    
        if(err){
            console.log(err);
        }
        
       
        var message = Message({
            from: from,
            to: to,
            message: themessage,
            date: new Date,
            image: true,
        })
        
        notitokens.get(message.to, function(data){
            
            var sock = onlineusers[message.to];
            
            if(sock){
                
                console.log('user is online');
                io.sockets.to(sock).emit('message',message);
                
                Backupmessages.update(
                            {username : message.to, 'chats.username': message.from},
                            {$push : { 'chats.$.messages' : message }}
                        ).exec(function(err, docs){
                             Backupmessages.update(
                            {username : message.from, 'chats.username': message.to},
                            {$push : { 'chats.$.messages' : message }}
                        ).exec();
                       });
                sender.send(push_notification_message,
                            {registrationTokens: [data]},
                            function(err,response){
                                if(err){
                                    console.log(err);
                                }
                                else{
                                    console.log(response);
                                }
                            }
                           
                           )
                
            }
            else{
                console.log('user is offline');
                
                Outbox.update({username: message.to},
                             {$push: {messages: message}});
                
                 Backupmessages.update(
                            {username : message.to, 'chats.username': message.from},
                            {$push : { 'chats.$.messages' : message }}
                        ).exec(function(err, docs){
                             Backupmessages.update(
                            {username : message.from, 'chats.username': message.to},
                            {$push : { 'chats.$.messages' : message }}
                        ).exec();
                       });
                sender.send(push_notification_message,
                            {registrationTokens: [data]},
                            function(err,response){
                                if(err){
                                    console.log(err);
                                }
                                else{
                                    console.log(response);
                                }
                            }
                           
                           )
            }
            
            
        })
        
        
    });
    
}

//ProcessAudioMessage();
function ProcessAudioMessage(data){
//    console.log('in the function');
    let audiobase64 = data.message;
    let sendto = data.to;
    let from = data.from;
    let transcribed;
//    var buffer = new Buffer(audiobase64,'base64');
//    fs.writeFile('testaudio.wav',buffer);
//    console.log('after writefile');
    
    
//    var file = fs.readFileSync('testaudio.wav');
//    var audiobytes = file.toString('base64');
    
//    console.log('ad' + audiobytes);
    console.log(data.languagecode);
 const sampleRateHertz = 8000;
 const languageCode = data.languagecode;

const config = {
  encoding: 'AMR',
  sampleRateHertz: sampleRateHertz,
  languageCode: languageCode,
};
const audio = {
// uri: 'gs://cloud-samples-tests/speech/brooklyn.flac',
    content: audiobase64,
};
const request = {
  config: config,
  audio: audio,
};

// Detects speech in the audio file
speech
  .recognize(request)
  .then(data => {
    const response = data[0];
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log(response);
    console.log(`Transcription: ` + transcription);
    
    transcribed = transcription;
    
    User.findOne({username: from }, function(err,fromobj){
                 
    var sourcelang = fromobj.language;
    
	User.findOne({ username: sendto},function(err,obj){
        
        console.log('found user to send the message to')

		//if the user being sent to is registered
		if(obj){
			var lang = obj.language;

        //translating the message (google)
			translate
			.translate(transcribed,lang)
			.then(results => {
                
				const translation = results[0];
                
//                IBMtranslator.translate(
//                    {
//                        text: transcribed,
//                        source: sourcelang,
//                        target:  lang,
//                    },
//                    function(err,translation){
//                     
//                        var IBMtranslation;
//                        if(err){
//                            console.log(err + ' IBM translation error');
//                        }
//                        else{
//                            var IBMtranslation =  translation;
//                        }
//                        
                var translations = (sourcelang == lang)? transcribed:translation; 
//                console.log(translations);
				var mess = Message({
							from: from,
							to: sendto,
							message: audiobase64,
							date: new Date,
							translatedmessage: translation,
                            audio: true,
						});

				//checking if the user is online
				notitokens.get(sendto,function(data){
                    
                    var sock = onlineusers[sendto];
                    console.log('socket ' + data);
                    
//                    notitokens.get(message.to, function(d){
                        
//                        console.log(message.to + ' khkjn ' + d);
                        
                        	if(data){
						console.log(sendto + 'is online, sending them the new message');
						//user is online
						io.sockets.to(sock).emit('message',mess);
						console.log('sent '+mess.to+' the message');
                        
                        
                       Backupmessages.update(
                            {username : mess.to, 'chats.username': mess.from},
                            {$push : { 'chats.$.messages' : mess }}
                        ).exec(function(err, docs){
                             Backupmessages.update(
                            {username : mess.from, 'chats.username': mess.to},
                            {$push : { 'chats.$.messages' : mess }}
                        ).exec();
                       });
                        
                        
                        //update the chatlist  
                        sender.send(push_notification_message,{ registrationTokens: [data] },function(err, reposnse){
           if(err){
               console.log(err);
           }
            else{
                console.log(reposnse);
            }
        });
                        
					}
					else{
                        
                    console.log('user not online saving message in outbix ' + mess.to);
                        
                        Outbox.update(
                            {username: mess.to},
                            {$push: { messages : mess}}
                        );

                        Backupmessages.update(
                            {username : mess.to, 'chats.username': mess.from},
                            {$push : { 'chats.$.messages' : mess }},{upsert: true}
                        ).exec(function(err, docs){
                             console.log('asdafads');
                             Backupmessages.update(
                            {username : mess.from, 'chats.username': mess.to},
                            {$push : { 'chats.$.messages' : mess }}
                        ).exec();
                       });
                        
                        sender.send(push_notification_message,{ registrationTokens: [data] },function(err, reposnse){
           if(err){
               console.log(err);
           }
            else{
                console.log(reposnse);
            }
        });
                    }
                        
                        
                        
                    });//end notitokens.get
                    
//                });//end IBM translation function


			})//end of google translation
			.catch(err => {
				console.error('ERROR: ',err);
			});


		}
		//if the user being sent to is not registered
		else{
//			socket.emit('alert','invalid send to user');
		}

	});
        
        });
    
    
  })//end get speech 
  .catch(err => {
    console.error('ERROR:', err);
  });
 
}//end process audimessage function

function register(usrname,socket){

    User.count({username: usrname }, function( err, count){
//		if err throw err;
		if(count >0){
		//console.log('user exsists');
		//send the data to client who asked
        socket.emit("usernametaken",usrname);
		}
		else{
        socket.emit("yeahregister",usrname);
		//send the data to the client who asked
		//console.log('user does not exist');
		}
	});

}

function addbackupmessage(){
    
}

server.listen(80, function(){
	console.log('listening on 3000');
});
