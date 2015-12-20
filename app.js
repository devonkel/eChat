var express = require('express'),
	app = express(),
	path = require('path'),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	users = [],
	port = 4400;

// Set view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

// Set static path
app.use(express.static(path.join(__dirname, 'public')));

// Connect to socket
io.sockets.on('connection', function (socket){
	socket.on('set user', function (data, callback){
		if(users.indexOf(data)!= -1){
			callback(false);
		} else {
			callback(true);
			console.log('New Chat User: '+data);
			socket.username = data;
			users.push(socket.username);
			console.log('+++ Adding User:'+socket.username);
			updateUsers(socket);
		}
	});

	function updateUsers(socket){
		console.log('-----------------');
		console.log('# Users:'+users.length);
		for(i = 0; i < users.length; i++){
			console.log('User ' + i + ': ' + users[i]);
		}
		console.log('-----------------');
		socket.emit('users', users);
	}

	socket.on('send message', function(data){
		console.log('Sending message ++++');
		console.log('User: '+socket.username);
		console.log('Msg:'+data);
		io.sockets.emit('show message',{msg: data, user: socket.username});
	});

	socket.on('disconnect', function (data, callback){
		if(!socket.username) return;

		console.log('--- Dropping user: '+socket.username);
		users.splice(users.indexOf(socket.username), 1);
		updateUsers(socket);
	})
});

// Define Index Route
app.get('/', function (req,res){
	res.render('index');
});

// Start server
server.listen(port);
console.log('+++ Server started on port:', port);

