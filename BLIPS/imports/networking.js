//needed for tcp connection
import net from 'net';

import { distanceData } from './dataCollection.js';
//port # we are using
const PORT = 4321;
// const PORT1 = 41235;

class Networking {
	constructor(port) {
		this.port = port;
		// this.port1 = port1


		const server = net.createServer(Meteor.bindEnvironment(function(socket) {
			console.log('Server connected on: ' + socket.localAddress + " from " + socket.remoteAddress);
			//code below causes error
			//console.log('this.board_socket: ' + this.board_socket);
			var board_socket = null;
			board_socket = socket;
			// phone_socket = socket1;

			board_socket.write("CONNECTED TO WEB APP");
			Connections.update({_id: 'connected'}, {state: "true"});

			board_socket.on('data', Meteor.bindEnvironment(logData)); // when u get data, use receive_func, when u get error use socket error

			board_socket.on('error', function(e) {
	  			console.log("SOCKET ERROR!");
	  			console.log(e);
		  	});
		  	board_socket.on('end', function(e) {
		  		console.log("A badge has signaled to disconnect");
		  	});
		  	board_socket.on('close', function(e) {
		  		console.log("Socket fully closed.");
		  	});
		  	board_socket.on('connection', function(e){
		  		console.log("A new badge has connected to the server");
		  	})
				// phone_socket.on('close', function(e) {
		  	// 	console.log("Socket fully closed.");
		  	// });

		  	board_socket.on('timeout', function(e) {
		  		console.log("Socket timeout");
		  	});

	  	

		})).on('error', (err) => {
		   console.log(`Server error:\n${err.stack}`);
		   server.close();
		});

		server.listen(this.port);
		console.log("Server dashboard listening on port " + this.port + "...");

		// phone_server.listen(this.port1);
		// console.log("... also listening on port " + this.port1 + " for the android app")
	}
	connected() {
		return (board_socket != null);
	}
	// phone_connected(){
	// 	return (phone_socket != null);
	// }
}

// function to run when we receive a data signal from the socket
var logData = function(data) {
	console.log('---- Socket Received Data ----');
	var dataString = data.toString();
	console.log(dataString);
	//split data with \n and parse each of them
	DistanceData.insert({minor: "sample_minor", dist: "12", })
}


//export whole class as an Networking(PORT) object
export default new Networking(PORT);
