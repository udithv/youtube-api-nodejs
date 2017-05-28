var clientId = '183442599206-lt5tu13bntjtfqdl8hl2p5u2960v0qk0.apps.googleusercontent.com';

var clientSecret = 'DyZPVFD0UUy7LAY1HL1SkLcS';

var callback =  'http://localhost:3000/callback'

var express = require('express');
var app = express();

var google = require('googleapis');
var opn = require('opn');
var OAuth2 = google.auth.OAuth2;


var oauth2Client = new OAuth2(
	clientId,
	clientSecret,
	callback
);


var scopes = [
	'https://www.googleapis.com/auth/youtube.force-ssl'
];

var url = oauth2Client.generateAuthUrl({
	access_type: 'offline',
	scope: scopes,
});


console.log(url);
opn(url,{app: 'firefox'});

app.get('/', function(req, res){
	res.send('Hello World!');

});

app.get('/callback', function(req, res){
	var code = req.query.code;
	
	oauth2Client.getToken(code, function (err, tokens) {
	  // Now tokens contains an access_token and an optional refresh_token. Save them.
	  if (!err) {
	    oauth2Client.setCredentials(tokens);
	  }

	  //insert_comment(oauth2Client);
	  //getComments(oauth2Client);
	  //delete_comment(oauth2Client);
	  //insert_reply(oauth2Client);

	});
	res.send('Comments have be iterated');
});

function getComments(auth){
	var service = google.youtube('v3');
  service.commentThreads.list({
    auth: auth,
    part: 'snippet',
    videoId: 'wtLJPvx7-ys',
    textFormat:"plainText"

  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }

   var comments = response.items;

   var text = comments.map(function(comment){
   	  var c = comment.snippet.topLevelComment.snippet
   	 	return c.authorDisplayName +" Said :  "+ c.textDisplay;
   });

   console.log(text);

});

}



//Insert Comment

function insert_comment(auth){
	var service = google.youtube('v3');
	service.commentThreads.insert({
    auth: auth,
    part: 'snippet',
    resource:{
    	snippet: {
	//	  "channelId": "UC_x5XG1OV2P6uZZ5FSM9Ttw",
		  "topLevelComment": {
		   "snippet": {
		    "textOriginal": "The Uman has landed....!"
		   }
		  },
		  "videoId": "MILSirUni5E"
		 }
    }

  

  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }

 console.log(response);

});
}

//Insert Reply

function insert_reply(auth){
	var parentId = 'z135ivspvqe2h13nq230yvky5xmgw1yw204';
	var service = google.youtube('v3');
	service.comments.insert({
    auth: auth,
    part: 'snippet',
    resource:{
    	snippet: {

		    "textOriginal": "The Uman has Commented....!",
			"parentId": parentId
		  }
		  
		 }
    
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }

 console.log(response);

});
}

//Delete comment

function delete_comment(auth){
	var id = 'z135ivspvqe2h13nq230yvky5xmgw1yw204';
	var service = google.youtube('v3');
	service.comments.delete({
    auth: auth,
    id: id
    
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }

 console.log(response);

});
}





app.listen(3000, function(){
	console.log('Example app is listening on port 3000');
});