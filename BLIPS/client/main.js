import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
import './../imports/svg.js';
import s from 'svg-intersections';


// Template.hello.onCreated(function helloOnCreated() {
//   // counter starts at 0
//   this.counter = new ReactiveVar(0);
// });

Template.display.onRendered(function(){
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
	var first_radius = Math.sqrt((250*250) + (100*100)) + 10;
	var second_radius = Math.sqrt((400 * 400) + (100*100)) + 10;
	var fourth_radius = Math.sqrt((200*200) + (500*500)) + 10;
	var first = draw.circle(first_radius).cx(125).cy(100).opacity('0.5').fill('#485167');
	var second = draw.circle(first_radius).cx(725).cy(100).opacity('0.5').fill('#485167');
	//var third = draw.circle(first_radius).move(925 - (first_radius/2),700 - (first_radius/2)).opacity('0.2').fill('#036');
	var fourth = draw.circle(fourth_radius).cx(125).cy(700).opacity('0.5').fill('#485167');
	//find intersection of three circles (bare minimum)
	// var inter = first.clipWith(second);
	// var final = fourth.clipWith(inter);
	var x_coord = [375, 375, 375, 375, 375, 375, 375, 400, 425, 450, 475, 475, 475, 475, 475, 475, 475, 450, 425, 400, 375];
	var y_coord = [200, 225, 250, 275, 300, 325, 350, 350, 350, 350, 350, 325, 300, 275, 250, 225, 200, 200, 200, 200, 200];
	var final = draw.circle(10).cx(375).cy(200).fill('#000');

	for(var i = 0; i < x_coord.length; i++){
		first_radius = Math.sqrt(((x_coord[i] - 125)*(x_coord[i] - 125)) + ((y_coord[i] - 100)*(y_coord[i] - 100)));
		//console.log(parseInt(first_radius, 10));

		second_radius = Math.sqrt(((x_coord[i] - 725)*(x_coord[i] - 725)) + ((y_coord[i] - 100)*(y_coord[i] - 100)));

		fourth_radius = Math.sqrt(((x_coord[i] - 125)*(x_coord[i] - 125)) + ((y_coord[i] - 700)*(y_coord[i] - 700)));
		second.animate(1000).attr({r: second_radius+5});
		first.animate(1000).attr({r: first_radius + 5});
		fourth.animate(1000).attr({r: fourth_radius + 5});
		final.animate(1000).attr({cx: x_coord[i], cy: y_coord[i]});



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
    var store = document.getElementsByClassName('badge_row');
    var final = store[store.length - 1].cloneNode(true);
    final.getElementsByTagName('th')[0].innerHTML = "Name " + (store.length + 1);
    var t_body = document.getElementsByClassName('table_body');
    t_body[0].appendChild(final);
    //console.log(final);
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

