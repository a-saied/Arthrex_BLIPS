import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
import './../imports/svg.js';
import s from 'svg-intersections';
import { badges, distanceData } from './../imports/dataCollection.js';
import KalmanFilter from './../imports/kalman.js';

var update_interval = 5000; //test value 
var possible_colors = ['#A93226', '#884EA0', '#2471A3', '#17A589', '#229954', '#D4AC0D', '#CA6F1E', '#839192', '#2E4053', 'CB4335']
Template.display.helpers({
	badge_count(){
		return badges.find().count();
	},
	beacon_count(){
		return 4;
		draw.circle()
	},
	table_data(){
		// console.log(badges.find());
		var cnt = document.getElementsByClassName('badge_row');
		// console.log(cnt.length);
		const stat = cnt.length;
		for(i = 1; i < stat; i++){
			console.log(i);
			var elem = cnt[1];
			elem.parentNode.removeChild(elem);
		}
		badges.find().forEach(function(doc){
			var store = document.getElementsByClassName('badge_row');
		  var final = store[store.length - 1].cloneNode(true);
		  final.getElementsByTagName('th')[0].innerHTML = doc.badge_id;
		  final.getElementsByTagName('th')[1].innerHTML = doc.badge_num;
		  final.getElementsByTagName('th')[0].style.backgroundColor = doc.color;
		  // final.getElementsByTagName('th')[2].innerHTML = "";
		  if(doc.pos_x == null){
			  final.getElementsByTagName('td')[0].innerHTML = "a";
			}else{
				final.getElementsByTagName('td')[0].innerHTML = doc.pos_x;
			}


		  if(doc.pos_y == null){
			  final.getElementsByTagName('td')[1].innerHTML = "b";
			}else{
				final.getElementsByTagName('td')[1].innerHTML = doc.pos_y;
			}
	 		var t_body = document.getElementsByClassName('table_body');
	  	t_body[0].appendChild(final);
		});

		console.log(cnt.length);

	}
})

Template.display.onRendered(function(){
	// Display Table Setup //
	

	/////////////////////////
	/// ALL DRAWING STUFF ///
	/////////////////////////
	var w = screen.width;
	var h = screen.height;
	var VALID_X_MIN = 325; 
	var VALID_X_MAX = 925;
	var VALID_Y_MIN = 100;
	var VALID_Y_MAX = 700;
 
	var draw = SVG('layout');
	//basic room shape 
	var polygon = draw.polygon('125,100 725,100 725,700 125,700').fill('#fff').stroke({ color: '#000', width: 6, linecap: 'round', linejoin: 'round' });

	//addding circles 
	var first_radius = 400;
	var second_radius = 440;
	var third_radius = 460; 
	var fourth_radius = 460;
	var first = draw.circle(first_radius*2).cx(125).cy(100).opacity('0.5').fill('#485167');
	var second = draw.circle(second_radius*2).cx(725).cy(100).opacity('0.5').fill('#485167');
	var third = draw.circle(third_radius*2).cx(725).cy(700).opacity('0.5').fill('#485167');
	var fourth = draw.circle(fourth_radius*2).cx(125).cy(700).opacity('0.5').fill('#485167');
	//find intersection of three circles (bare minimum)
	// var inter = first.clipWith(second);
	// var final = fourth.clipWith(inter);
	//var sec = second.clipWith(third);
	// console.log(final);
	var x_coord = [375, 375, 375, 375, 375, 375, 375, 400, 425, 450, 475, 475, 475, 475, 475, 475, 475, 450, 425, 400, 375];
	var y_coord = [200, 225, 250, 275, 300, 325, 350, 350, 350, 350, 350, 325, 300, 275, 250, 225, 200, 200, 200, 200, 200];

	//////////////////////////
	/// LOOP FOR ANIMATION ///
	//////////////////////////

	// for(var i = 0; i < x_coord.length; i++){
	// 	first_radius = Math.sqrt(((x_coord[i] - 125)*(x_coord[i] - 125)) + ((y_coord[i] - 100)*(y_coord[i] - 100)));
	// 	//console.log(parseInt(first_radius, 10));

	// 	second_radius = Math.sqrt(((x_coord[i] - 725)*(x_coord[i] - 725)) + ((y_coord[i] - 100)*(y_coord[i] - 100)));

	// 	fourth_radius = Math.sqrt(((x_coord[i] - 125)*(x_coord[i] - 125)) + ((y_coord[i] - 700)*(y_coord[i] - 700)));
	// 	second.animate(1000).attr({r: second_radius+5});
	// 	first.animate(1000).attr({r: first_radius + 5});
	// 	fourth.animate(1000).attr({r: fourth_radius + 5});
	// 	final.animate(1000).attr({cx: x_coord[i], cy: y_coord[i]});
	// }

	var beacon_store = [first, second, third, fourth]; 
	var intersect_lines = []; 

	setInterval(function(){ 
		updateData(); 
	}, update_interval)

	var svgIntersections = require('svg-intersections');
  var intersect = svgIntersections.intersect;
  var shape = svgIntersections.shape;
	function updateData(){
		badges.find().forEach(function(doc){
			var new_radii = []
			// console.log(distanceData.findOne({}, {sort: {createdAt:-1}}));
			// make sure not to recycle the use of radii from other badges
			var one_r = distanceData.findOne({$and: [{beacon: "1"},  {badge_num: doc.badge_num.toString()}]}, {sort: {createdAt: -1}}); // * some multiplier to convert to a pixel value;
			if(one_r != null && one_r.dist < 10) {
				first_radius = one_r.dist * 85;
			}else{
				console.log(doc.radii);
				first_radius = doc.radii[0];
			}
			new_radii.push(first_radius);
			console.log(first_radius);
			var two_r = distanceData.findOne({$and: [{beacon: "2"},  {badge_num: doc.badge_num.toString()}]}, {sort: {createdAt: -1}}); // * some multiplier to convert to a pixel value;
			if(two_r != null && two_r.dist < 10){
				second_radius = two_r.dist * 85;
			}else{
				second_radius = doc.radii[1];
			}
			new_radii.push(second_radius);
			var three_r = distanceData.findOne({$and: [{beacon: "3"},  {badge_num: doc.badge_num.toString()}]}, {sort: {createdAt: -1}}); // * some multiplier to convert to a pixel value;
			if(three_r != null && three_r.dist < 10) {
				third_radius = three_r.dist * 85;
			}else{
				third_radius = doc.radii[2]; 
			}
			new_radii.push(third_radius);
			var four_r = distanceData.findOne({$and: [{beacon: "4"},  {badge_num: doc.badge_num.toString()}]}, {sort: {createdAt: -1}}); // * some multiplier to convert to a pixel value;
			if(four_r != null && four_r.dist < ) {
				fourth_radius = four_r.dist * 85;
			}else{
				fourth_radius = doc.radii[3]
			}
			new_radii.push(fourth_radius);
			badges.update(doc._id, {$set: {radii: new Array(first_radius, second_radius, third_radius, fourth_radius)}});

			first.attr({r: first_radius});
			second.attr({r: second_radius});
			third.attr({r: third_radius});
			fourth.attr({r: fourth_radius});
			var beacon_count = 4;
			var intersect_pts = [];  
			for(var i = 0; i < beacon_count - 1; i++){
				for(var j = i + 1; j < beacon_count; j++){
					var int = intersect(shape("circle", beacon_store[i].attr()), shape("circle", beacon_store[j].attr()))
					for(var k = 0; k < int.points.length; k++){
						if(int.points[k].x > VALID_X_MIN && int.points[k].x < VALID_X_MAX && int.points[k].y > VALID_Y_MIN && int.points[k].y < VALID_Y_MAX){
							intersect_pts.push(int.points[k])
						}
					}
				}
			}
			var badge_circle = null; 
			var badge_shadow = null;
			/// do something with the collected intersection points 
			// console.log(intersect_pts);
			var x_coord = 0; 
			var y_coord = 0;
			for(var i = 0; i <intersect_pts.length; i++){
				x_coord += intersect_pts[i].x;
				y_coord += intersect_pts[i].y;
			}
			x_coord = x_coord/intersect_pts.length;
			y_coord = y_coord/intersect_pts.length;
			badges.update(doc._id, { $set: {pos_x: parseInt((x_coord-125),10), pos_y: parseInt((y_coord-100),10)}})
			badge_circle = draw.circle(10).cx(x_coord).cy(y_coord).fill(doc.color);
			//now create the larger circle 
			var dist_store = []; 
			var max_range = 10; 
			for(var i = 0; i < intersect_pts.length; i++){
				var diff1 = x_coord - intersect_pts[i].x;
				var diff2 = y_coord - intersect_pts[i].y;

				var dist = Math.sqrt((diff1 * diff1) + (diff2 * diff2));
				dist_store.push(dist);
			}
			dist_store.sort();
			if(dist_store.length != 0){
				if(dist_store.length >3){
					max_range = dist_store[3];
				}
				else{
					max_range = dist_store[(dist_store.length -1)]
				}
			}



			badge_shadow = draw.circle(max_range*2).cx(x_coord).cy(y_coord).opacity('0.1').fill(doc.color);
		});
	}
	// var svgIntersections = require('svg-intersections');
 //  var intersect = svgIntersections.intersect;
 //  var shape = svgIntersections.shape;

 //  var one_two = intersect(shape("circle", first.attr()), shape("circle", second.attr()));
 //  var two_four = intersect(shape("circle", second.attr()), shape("circle", fourth.attr()));
 //  var one_four = intersect(shape("circle", first.attr()), shape("circle", fourth.attr()));
 //  console.log(one_two.points);
 //  console.log(two_four.points);
 //  console.log(one_four.points);

 //  var p_1 = draw.line(one_two.points[0].x, one_two.points[0].y, one_two.points[1].x, one_two.points[1].y)
 //  var p_2 = draw.line(two_four.points[0].x, two_four.points[0].y, two_four.points[1].x, two_four.points[1].y)
 //  var p_3 = draw.line(one_four.points[0].x, one_four.points[0].y, one_four.points[1].x, one_four.points[1].y)
 //  var final = intersect(shape("line", p_1.attr()), shape("line", p_2.attr()));
 //  console.log(final.points);


 //  var loc = draw.circle(10).cx(final.points[0].x).cy(final.points[0].y);
 //  var valid_points = [];
  //check if we're within the drawings boundaries;

});


// Template.hello.helpers({
//   counter() {
//     return Template.instance().counter.get();
//   },
// });

Template.display.events({

  'click .add_badge'(event, instance) {
    // increment the counter when button is clicked
    //get unique id entry in there sometime this weekend 
    console.log("button pressed"); 
    var info = prompt("Please enter the ID of the badge you are adding": "Ex: 1234");
    if(info != null && info.trim() != ""){
	    // var store = document.getElementsByClassName('badge_row');
  	  // var final = store[store.length - 1].cloneNode(true);
  	  // final.getElementsByTagName('th')[0].innerHTML = info;
  	  badges.insert({badge_id: info, badge_num: (badges.find().count() + 1), color: possible_colors[badges.find().count()], pos_x: null, pos_y: null, radii: new Array(400, 440, 460, 460)});
   		// var t_body = document.getElementsByClassName('table_body');
    	// t_body[0].appendChild(final);
    }else{
    	window.alert("Sorry invalid entry");
    }
    console.log(badges.find().count());
  },
});

// every time MONGO DB database is updataded, we must redraw and recalculate location
// Images.find().observeChanges({
//    added: function (id, fields) {
//        runFunction();
//    },
//    changed: function (id, fields) {
//        runFunction();
//    },
//    removed: function (id) {
//        runFunction();
//   }
// });

