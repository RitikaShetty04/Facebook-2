var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/facebook";

var checkLoggedInUser = require("./checkLoggedInUser.js");
var myConnection = require("./myConnection.js");

exports.home = function(req, res) {
	if (checkLoggedInUser.checkLoggedInUser(req, res) === true) {
	
		var username = req.session.loggedInUserName;
		mongo.connect(mongoURL, function(){
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = mongo.collection('users');
		var events;
		  coll.findOne({user_name: username}, function(err, user){
			  events=user.events;
			  res.render('navhome', {
					'title' : "Facebook",
					'user_events' : events,
					'user' : req.session,
					'message' : ""
				});
		  });
		});
			}
	 else {
		res.render('login');
	}
};


exports.newsfeeds = function(req, res) {
	if (checkLoggedInUser.checkLoggedInUser(req, res) === true) {
		var m_id = req.session.loggedInUserId;
		var username = req.session.loggedInUserName;
		
		mongo.connect(mongoURL, function(){
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = mongo.collection('users');
			var friends=[];
			coll.findOne({user_name: username},function(err, user){
				if (user) {
						if(typeof user.friends !== "undefined")
							{
							for(var j=0;j<user.friends.length;j++)
								{
						if(user.friends[j].status===2)
							{
							friends[j]=user.friends[j].friendname;
							console.log(friends[j]);
							}
						}
							}
						coll.find( { user_name: { $in:  friends  } }).toArray(function(err, user){
							
						if(user)
							{
							console.log("Length:"+user.length);
							console.log("Users:"+user);
							res.render("newsfeeds", {
							"rows" : user,
							'user' : req.session
						});
							}
						
						});
						}
					
				});
				
			});

	} else {
		res.render('login');
	}
};


exports.groups = function(req, res) {
	if (checkLoggedInUser.checkLoggedInUser(req, res) === true) {
		
		var username = req.session.loggedInUserName;
		
		mongo.connect(mongoURL, function(){
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = mongo.collection('users');
			var groups;
						  coll.findOne({user_name: username}, function(err, user){
							  groups=user.groups;
							  res.render('groups', {
									'rows' : groups,
									'user' : req.session,
								});
						  						 
							  }		 
						  
				);
		});

	} else {
		res.render('login');
	}
};

exports.friends = function(req, res) {
	if (checkLoggedInUser.checkLoggedInUser(req, res) === true) {
		var m_id = req.session.loggedInUserId;
		var username = req.session.loggedInUserName;
		var section = "Friendlist";
		
		mongo.connect(mongoURL, function(){
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = mongo.collection('users');
			var obj;
			coll.find({user_name:username}).toArray(function(err, user){
				if (user) {
					
					var friends=[];
					for(var i=0;i<user.length;i++)
						{
						if(typeof user[i].friends !== "undefined")
							{
							for(var j=0;j<user[i].friends.length;j++)
								{
						if(user[i].friends[j].status===2)
							{
							friends[j]=user[i].friends[j].friendname;
							console.log("Friends:"+friends[j]);
							}
						}
							}
				}
					console.log("Friends list:"+friends);
					//console.log("Friend: " +obj);
					res.render("friends", {
						section : section,
						"rows" : friends,
						name : '',
						message : '',
						'user' : req.session,
						friendrequest : ''
					});
				}
				});
				
			});
	}
};

exports.searchfriend = function(req, res) {

	if (checkLoggedInUser.checkLoggedInUser(req, res) === true) {

		var searchrequest = req.param("searchrequest");

		
		mongo.connect(mongoURL, function(){
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = mongo.collection('users');
			var obj;
			coll.find({user_name: searchrequest}).toArray(function(err, user){
				if (user) {
					obj=user;
					//console.log("Friend: " +obj);
					res.render('friends', {
						title : 'Express',
						'section' : '',
						'rows' : '',
						name : obj,
						message : '',
						'user' : req.session,
						friendrequest : ''
					});
				}
				});
				
			});
	} else {
		res.render('login');
	}
};

exports.inputfriend = function(req, res) {
	if (checkLoggedInUser.checkLoggedInUser(req, res) === true) {
		
		var frname = req.param("confirm");
		var username = req.session.loggedInUserName;
		var m_id = req.session.loggedInUserId;
		var today = new Date();
		var date = today.toISOString().substring(0, 10);
		console.log("Req to:"+frname);

		
		mongo.connect(mongoURL, function() {
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = mongo.collection('users');
			console.log("FR from" +username);
			coll.update(
					{user_name : username }, 
				{
				$push : {
					"friends" : {
						"friendname" : frname,
						"status" : 1
					}
				}
			}, function(err, user) {

				if (user) {
					coll.update(
					{user_name : frname }, 
						{
						$push : {
							"friends" : {
								"friendname" : username,
								"status" : 0
							}
						}
					}, function(err, user) 
					{
						if(user)
						{	
						console.log("Friend req sent");
						res.render('friends', {
							'section' : '',
							'rows' : '',
							name : '',
							message : 'Friend request sent',
							'user' : req.session,
							friendrequest : ''
					}
						
				);
					}
					});
				}
			});

		
		});
		
	} else {
		res.render('login');
	}
};

exports.acceptfriend = function(req, res) {
	if (checkLoggedInUser.checkLoggedInUser(req, res) === true) {
		
		var m_id = req.session.loggedInUserId;
		var username = req.session.loggedInUserName;
		
		mongo.connect(mongoURL, function() {
			
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = mongo.collection('users');
			var obj;
			coll.find({user_name: username}).toArray(function(err, user){
				
				if(user)
					{
					var pending=[];
					for(var i=0;i<user.length;i++)
						{
						if(typeof user[i].friends!=="undefined")
						{
							for(var j=0;j<user[i].friends.length;j++)
								{
						if(user[i].friends[j].status===0)
							{
							console.log(user[i].friends[j].friendname);
							pending[j]=user[i].friends[j].friendname;
							console.log("Pending:"+pending[j]);
							}
								}
						}
					}	
					console.log("Length:"+pending.length);
					res.render('friends', {
						'section' : '',
						'rows' : '',
						name : '',
						message : '',
						'user' : req.session,
						friendrequest : pending
					});
					}
			});
			
			
		});

	} else {
		res.render('login');
	}
};

exports.acceptfriendid = function(req, res) {
	if (checkLoggedInUser.checkLoggedInUser(req, res) === true) {
		

		var m_id = req.param("m_id"); //friend name
		var f_id = req.param("f_id"); //lodgged in user name

		mongo.connect(mongoURL, function() {
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = mongo.collection('users');
			
			coll.update(
					   { user_name: m_id, "friends.status": 0, "friends.friendname":f_id },
					   { $set: { "friends.$.status" : 2 } },
					   function(err, user){
							  if(user)
								  {
								  coll.update(
										   { user_name: f_id, "friends.status": 1, "friends.friendname":m_id },
										   { $set: { "friends.$.status" : 2 } },
										   function(err, user){
												  if(user)
													  {
													  var result="Accepted";
													  res.send(result);
													  }
													  });
								  }
								  }
					);
		});
		
	} else {
		res.render('login');
	}
};

exports.rejectfriendid = function(req, res) {

	if (checkLoggedInUser.checkLoggedInUser(req, res) === true) {

		var m_id = req.param("m_id");
		var f_id = req.param("f_id");
		
		mongo.connect(mongoURL, function() {
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = mongo.collection('users');
			
			coll.update(
					   { user_name: m_id, "friends.status": 0 },
					   { $set: { "friends.$.status" : 4 } },
					   function(err, user){
							  if(user)
								  {
								  coll.update(
										   { user_name: f_id, "friends.status": 0 },
										   { $set: { "friends.$.status" : 4 } },
										   function(err, user){
												  if(user)
													  {
													  var result="Accepted";
													  res.send(result);
													  }
													  });
								  }
								  }
					);
		});
	

	} else {
		res.render('login');
	}
};