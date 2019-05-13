//needed for tcp connection
import net from 'net';

import { distanceData, rawData, badges, wifis } from './dataCollection.js';
import KalmanFilter from './kalman.js';
//port # we are using
const PORT = 4321;
// const PORT1 = 41235;
/// run all data through this here kalman filter. 
// the filter should normalize the data 
var filters = [];
for(var i = 0; i < 4; i++){
	var inner_array = []
	for(var j = 0; j <badges.find().count(); j++){
		inner_array.push(new KalmanFilter());
	}
	filters.push(inner_array);
}
class Networking {

	constructor(port) {
		this.port = port;
		//  this.port1 = port1
		// run all data through this here kalman filter. 
		// the filter should normalize the data 
		// var filters = [];
		// for(var i = 0; i < 4; i++){
		// 	filters.push(new KalmanFilter());
		// }

		const server = net.createServer(Meteor.bindEnvironment(function(socket) {
			console.log('Server connected on: ' + socket.localAddress + " from " + socket.remoteAddress);
			//code below causes error
			//console.log('this.board_socket: ' + this.board_socket);
			var board_socket = null;
			board_socket = socket;
			// phone_socket = socket1;

			board_socket.write("CONNECTED TO WEB APP");
			console.log("Sent message to badge");
			//distanceData.update({_id: 'connected'}, {state: "true"});

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
	console.log('---- Web App Received Data ----');
	var dataString = data.toString();
	console.log(dataString);
	console.log("-------------------------------"); 
	var raw = dataString.split(':');

	console.log("Badge no. = " + raw[0]);


	//// BLUETOOTH DATA /////
	if(raw[1] != '') { //if data has gotten through correctly (should always check)
		var all_beacons = raw[1];
		var beacon_array = all_beacons.split("/"); // get individual strings for individual beacons
		// console.log(beacon_array);
		for(var i = 0; i < beacon_array.length-1; i++){
			var beacon_raw = beacon_array[i].split("=");
			console.log("Beacon ID: " + beacon_raw[0]);
			//deal with data here
			if(beacon_raw.length > 0){
				// if data is available
				// console.log(beacon_raw[1]);
				var all_data = beacon_raw[1];
				var data_pairs = all_data.split(".") // now we just have individual pairs 
				for(var j = 0; j < data_pairs.length - 1; j++){
					// console.log(data_pairs[j]);
					var single_pair = data_pairs[j].split(",");
					console.log("Raw: " + single_pair[0] + "   Diff: " + single_pair[1]);
					var final_raw = {badge_id: raw[0], beacon: beacon_raw[0], rssi: single_pair[0], diff: single_pair[1], createdAt: new Date()}
					rawData.insert(final_raw);
					//conversion goes here
					//run through Kalman Filter based on beacon number 
					// console.log(filters[(parseInt(final_raw.beacon) - 1)][(parseInt(final_raw.badge_id)-1)]);
					var new_diff = filters[(parseInt(final_raw.beacon) - 1)][parseInt(final_raw.badge_id)-1].filter(final_raw.diff);
					var exp = final_raw.diff/20;
					var distance_final = Math.pow(10, exp);
					var no_height = Math.pow(distance_final, 2) - 4;
					no_height = Math.sqrt(no_height);
					console.log(distance_final);
					// console.log("Badge #" + final_raw.badge_id + ", Beacon #" + final_raw.beacon);
					distanceData.insert({badge_num:  final_raw.badge_id, beacon: final_raw.beacon, dist: distance_final, createdAt: final_raw.createdAt});
				}
			}
		}
	}


	///// WIFI DATA //////
	if(raw.length > 1 && raw[2] != ''){
		var all_routers = raw[2].split("/");
		for(var i = 0; i < all_routers.length - 1; i++){
			var mac_array = all_routers[i].split("=");
			console.log("MAC address: " + mac_array[0]);
			if(mac_array.length > 1 && mac_array[1] != ''){
				var raw_RSSI = mac_array[1].split(".");
				var tot = 0; 
				for(var j = 0; j < raw_RSSI.length - 1; j++){
					console.log("RSSI " + j + ": " + raw_RSSI[j])
					tot += raw_RSSI[j];
					// WHAT THE FUCK DO I DO WITH THIS //
					
				}
				tot = tot/(raw_RSSI.length-1);
				wifis.insert({mac: mac_array[0], rssi: tot, createdAt: new Date()})
			}
		}
	}
	/// minor is identified before a colon 
	//filter
	//store filtered in db 
	//convert to distance 
	//
	// distanceData.insert({minor: "sample_minor", dist: "12" })
}


//export whole class as an Networking(PORT) object
export default new Networking(PORT);
