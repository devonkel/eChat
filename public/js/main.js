$(document).ready(function (){
	var messages = [],
		socket = io('http://localhost:4400'),
		chatForm = $('#chatForm'),
		message = $('#chatInput'),
		chatWindow = $('#chatWindow'),
		userForm = $('#userForm'),
		username = $('#username'),
		users = $('#users'),
		error = $('#error');

	//Submit the user form
	userForm.submit(function (e){
		e.preventDefault();
		socket.emit('set user', username.val(), function (data){
			if(data) {
				$('#userFormWrap').hide();
				$('#mainWrap').show();
				//$('#chatform').body = users;
			} else {
				console.log('Username is already taken');
				error.html('Username is already taken');
			}
		});
	});

	chatForm.submit(function(e){
		e.preventDefault();
		socket.emit('send message', message.val());
		message.val('');
	});

	socket.on('show message', function(data){
		console.log('Adding msg: '+data.msg+'from: '+data.user);
		chatWindow.append('<strong>'+data.user+'</strong>: '+data.msg+'<br>');
	});

	// Display Usernames
	socket.on('users', function(data){
		var html = '';
		for(i = 0; i < data.length; i++){
			html += '<li class="list-group-item">'+data[i]+'</li>';
		}
		users.html(html);
	});
})