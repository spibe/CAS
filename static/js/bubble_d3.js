d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

d3.selection.prototype.moveToBack = function() { 
    return this.each(function() { 
        var firstChild = this.parentNode.firstChild; 
        if (firstChild) { 
            this.parentNode.insertBefore(this, firstChild); 
        } 
    }); 
};

var baum_bubble = function(){

var diameter = 960,
    format = d3.format(",d"),
    color = d3.scale.category20c();

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

var svg = d3.select("#bubble").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

d3.json("static/json/baumsorten_python.json", function(error, root) {
  if (error) throw error;

  var node = svg.selectAll(".node")
      .data(bubble.nodes(classes(root))
      .filter(function(d) { return !d.children; }))
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.append("title")
      .text(function(d) { return d.className + ": " + format(d.value); });

  node.append("circle")
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d) { return color(d.packageName); });

  node.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.className.substring(0, d.r / 3); })
      .attr("class", "texttooltip")
      /*
      .on("mouseover", function(d,i) {
                return d3.select(this)
                         .attr("class",'blabla')
                         .text(function(d) { return d.className; }); })
      .on("mouseout", function(d,i) {
                return d3.select(this).attr("class", "texttooltip")
                //.moveToBack()
                .text(function(d) { return d.className.substring(0, d.r / 3); })
      });
      */
});

// Returns a flattened hierarchy containing all leaf nodes under the root.
function classes(root) {
  var classes = [];

  function recurse(name, node) {
    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    else classes.push({packageName: name, className: node.name, value: node.size});
  }

  recurse(null, root);
  return {children: classes};
}

d3.select(self.frameElement).style("height", diameter + "px");

};

// Führe obenstehende Funktion aus
baum_bubble();





var profile_bubble = function() {

var diameter = 960,
    format = d3.format(",d")/*,
    color = d3.scale.category10(),
    my_own_color_range = ["#58A01E","#A09A1A","#A37C35","#4D88A3","#AFAFAF",
                          "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
    color.range = my_own_color_range;
    */

var color = d3.scale.ordinal()
  .domain(["1 Rasen", "2 Bepflanzung", "3 Beläge", " 4 Wasser", "5 Exogen"])
  .range(["#9AE979","#8AC71B","#E4BE4C","#4D88A3","#AFAFAF",
                          "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"]);


var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

var svg = d3.select("#bubble_profile").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");


d3.json("static/json/profile_python.json", function(error, root) {
  if (error) throw error;

  var node = svg.selectAll(".node")
      .data(bubble.nodes(classes(root))
      .filter(function(d) { return !d.children; }))
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.append("title")
      .text(function(d) { return d.className + ": " + format(d.value); });

  node.append("circle")
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d) { return color(d.packageName); });

  node.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.className.substring(0, d.r / 3); })
      .attr("class", "texttooltip")
      /*
      .on("mouseover", function(d,i) {
                return d3.select(this)
                         .attr("class",'blabla')
                         .text(function(d) { return d.className; }); })
      .on("mouseout", function(d,i) {
                return d3.select(this).attr("class", "texttooltip")
                //.moveToBack()
                .text(function(d) { return d.className.substring(0, d.r / 3); })
      });
      */
});

// Returns a flattened hierarchy containing all leaf nodes under the root.
function classes(root) {
  var classes = [];

  function recurse(name, node) {
    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    else classes.push({packageName: name, className: node.name, value: node.flaeche});
  }

  recurse(null, root);
  return {children: classes};
}

d3.select(self.frameElement).style("height", diameter + "px");



};

profile_bubble();



var buttonCheck_bubble = function(){
    var radios =  $("input[name=bk_or_gk]");
    var rad_value;
    for (var i = 0; i < radios.length; i++ ){
        //console.log(radios[i].checked);
        if (radios[i].checked ){
            rad_value = radios[i].value;
                  } 

                      }
    return rad_value;
};

//***********************************
// Beginn Spezial Funktion baum_bubble_variable
// nimmt zusätzlich ein Argument "Parkanlage/Objekt"
//***********************************






var baum_bubble_variable = function(p_objekt){

var diameter = 960,
    format = d3.format(",d"),
    color = d3.scale.category20c();

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

var svg = d3.select("#bubble_spez").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");




d3.json("/baumsorten_spezial/"+p_objekt, function(error, root) {
  if (error) throw error;
  console.log(root);
  
  var node = svg.selectAll(".node")
      .data(bubble.nodes(classes(root))
      .filter(function(d) { return !d.children; }))
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.append("title")
      .text(function(d) { return d.className + ": " + format(d.value); });

  node.append("circle")
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d) { return color(d.packageName); });

  node.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.className.substring(0, d.r / 3); })
      .attr("class", "texttooltip")

});



// Returns a flattened hierarchy containing all leaf nodes under the root.
function classes(root) {
  var classes = [];

  function recurse(name, node) {
    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    else classes.push({packageName: name, className: node.name, value: node.size});
  }

  recurse(null, root);
  return {children: classes};
}

d3.select(self.frameElement).style("height", diameter + "px");
d3.selectAll("#bubble_spez").insert("h5","svg").text("Objekt: "+p_objekt);


};

//Funktion ausführen:
//baum_bubble_variable("Uni Schönbeinstrasse 6");
// ENDE FUNKTION baum_bubble_variable
//***********************************



var getBubbleObjekt = function(){
  baum_bubble_variable($('#objektselektbubble').val());




};



//***********************************
// Ausführen sobald das HTML Dokument vollständig geladen ist
$(document).ready(function(){
  console.log("jquery ready!");








  $("input[name=bk_or_gk]:radio").change(function() {
  if (buttonCheck_bubble()==="GK"){
    //console.log("its GK");
    $("#bubble").addClass("hidden");
    //profile_bubble();
    $("#bubble_profile").toggleClass("hidden");

  }
  if (buttonCheck_bubble() === "BK") {
    $("#bubble_profile").addClass("hidden");
    //baum_bubble();
    $("#bubble").removeClass("hidden");
  }
});

});







