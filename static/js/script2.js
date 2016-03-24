// 
var dataset = [20,34,20,10,30];

// Width and heigth
var w = 500;
var h = 300;
var barPadding = 2;

// Create an SVG Element

var svg = d3.select('#d3svg')
			.append('svg')
			.attr('width',w)
			.attr('height',h);

svg.selectAll("rect")
   .data(dataset)
   .enter()
   .append("rect")
   .attr("x", function(d,i) {return i* w / dataset.length;}) // later with scales
   .attr("y", function(d,i){return h - d*4;}) //sonst bars von oben
   .attr("width", w / dataset.length - barPadding)
   .attr("height", function(d,i){return d*4;})
   .attr("fill", function(d,i) {return 'rgb(20,40,' + (d*3)+')';});
/*
oder so via multiple value maps:
   .attr({
        x: function(d, i) { return i * (w / dataset.length); },
        y: function(d) { return h - (d * 4); },
        width: w / dataset.length - barPadding,
        height: function(d) { return d * 4; },
        fill: function(d) { return "rgb(0, 0, " + (d * 10) + ")"; }
   })
*/

svg.selectAll("text")
   .data(dataset)
   .enter()
   .append("text")
   .text(function(d) {
        return d;
   })
   .attr("x", function(d, i) {
        return i * (w / dataset.length) + (w / dataset.length - barPadding)/2;  // +5
   })
   .attr("y", function(d) {
        return h - (d * 4) + 14;              // +15
   })
   .attr("font-family", "sans-serif")
   .attr("font-size", "11px")
   .attr("fill", "white")
   .attr("text-anchor",'middle');




