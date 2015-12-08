/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  ,login = require('./routes/login')
  ,group = require('./routes/group')
  //,session = require('client-sessions')
  ,navigate=require('./routes/navigate')
  ,event=require('./routes/event');


//URL for the sessions collections in mongoDB
var mongoSessionConnectURL = "mongodb://localhost:27017/sessions";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);
var mongo = require("./routes/mongo");

var app = express();

//configure the sessions with our application
app.use(expressSession({   
	  
	cookieName: 'session',    
	secret: 'facebook',    
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,
	resave:false,
	saveUninitialized:false,
	store: new mongoStore({
		url: mongoSessionConnectURL
	})
}));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
	
app.get('/', routes.index);
app.get('/users', user.list);
app.get('/signup', login.signup);
app.post('/login', login.login);
app.post('/Logout', login.Logout);
app.post('/aftersignup',login.aftersignup);

app.post('/getGroups', group.getGroups);
app.post('/formgroup',group.groupformed);

//Navigation to tabs
app.get('/friends',navigate.friends);
app.get('/home',navigate.home);
app.get('/newsfeeds',navigate.newsfeeds);
app.get('/groups',navigate.groups);
app.get('/addevent',event.addevent);

app.get('/search',navigate.searchfriend);
app.get('/inputfriend',navigate.inputfriend);
app.post('/accept',navigate.acceptfriend);
app.post('/acceptfriendid',navigate.acceptfriendid);
app.post('/rejectfriendid',navigate.rejectfriendid);

mongo.connect(mongoSessionConnectURL,function()
{
	http.createServer(app).listen(app.get('port'), function(){
		  console.log('Express server listening on port ' + app.get('port'));
		});
	});
