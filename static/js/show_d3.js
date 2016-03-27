"use strict";

var the_data;
var nestKreisGruppe;
var nestKreis;
var nestBaumart;
var nestBaumart_arr;
var nestBaumart_arr_top10;
var nestGattung_arr;
var nestGattung_arr_top10;
var nestGattung_obj;
var nestObjekt_arr;
var nestObjekt_arr_top10;
var nest;
var the_full_data;
var the_full_data_gk;
var nestProfile_gk_anz;
var nestProfile_gk_sumf;
var nest4select;
var nestProfile_gk_objekt;
var nest4select_objekt;
var destBilder;
var svg_width = 950;
var svg_height = 500;
var barPadding = 2;
var padding = 40;
var scale;




var callback = function(data) {
	//console.log("funktion erreicht!");
	//console.log(data);
	the_data = data;
	nestKreisGruppe = d3.nest()
							.key(function(d){return d.kreis;})
							.key(function(d){return d.gruppe;})
							.rollup(function(leaves){return leaves.length;}) //Anzahl pro gruppe
							//.rollup(function(leaves){return {"length":leaves.length, ""}})
							.entries(the_data.baumkataster); // returns Array!!

	nestBaumart = d3.nest()
						.key(function(d){return d.baumart;})
						.rollup(function(leaves){return leaves.length;})
						.map(the_data.baumkataster); // returns Objekt !!!



	/*myFirstD3func(the_data.baumkataster);	*/

};

var do_the_replace = function(mystring) {
	var mystring = mystring || 'kein Text vorhanden';
	return mystring.replace(/ /g,"\n");


};

var do_multiline = function() {
	d3.selectAll("text").text(function(d) {return do_the_replace(d.key);})



};

d3.select("#foot").on("click", function(){
			d3.json("static/json/outLimit.json",callback);
		} );


var callback_output = function(data) {
	the_full_data = data;
	//nurGattung = the_full_data.baumkataster[0].baumart.split(' ')[0];

	add_gattung(data);
	// filter out projektiert und gruppe privat

	the_full_data.baumkataster = the_full_data.baumkataster.filter(function(data){
		return data.status !== 'Projektiert' 
		&& data.gruppe !== "Privatbäume" 
		&& data.status === "Im Bestand"});

	nestGattung_arr = d3.nest()
					.key(function(d){return d.gattung;})
					.rollup(function(leaves){return leaves.length;})
					.entries(the_full_data.baumkataster);

	nestGattung_arr_top10 = nestGattung_arr.sort(function(a,b) {
								return b.values - a.values;
								}).slice(0,10);


	nestGattung_obj = d3.nest() 
						.key(function(d){return d.gattung;})
						.rollup(function(leaves){return leaves.length;})
						.map(the_full_data.baumkataster);

	nestBaumart_arr = d3.nest()
						.key(function(d){return d.baumart;})
						.rollup(function(leaves){return leaves.length;})
						.entries(the_full_data.baumkataster); // returns Objekt !!!

	nestBaumart_arr_top10 =	nestBaumart_arr.sort(function(a,b) {
								return b.values - a.values;
								}).slice(0,10);	


	nestObjekt_arr = d3.nest()
						.key(function(d){return d.objekt;})
						.rollup(function(leaves){return leaves.length;})
						.entries(the_full_data.baumkataster);

	nestObjekt_arr_top10 = nestObjekt_arr.sort(function(a,b) {
								return b.values - a.values;
								}).slice(0,10);										
						
	do_bar_plot(nestGattung_arr_top10,"#barplot1");
	do_bar_plot(nestBaumart_arr_top10,"#barplot2");
	do_bar_plot(nestObjekt_arr_top10 ,"#barplot3");


	//do_multiline();
	return nestGattung_obj;


};

var add_gattung = function(data) {
	for (var i = 0; i<data.baumkataster.length ;i++) 
	{
		if (data.baumkataster[i].baumart)  {
			/*<!--console.log(data.baumkataster[i].baumart.split(' '));-->*/
			var n_gattung = data.baumkataster[i].baumart.split(' ')[0];
			the_full_data.baumkataster[i].gattung = n_gattung;


	} else {
		//console.log(data.baumkataster[i]);
	}

	}
	return the_full_data;

};


var process_gruenkataster = function(data) {
	the_full_data_gk = data;
	nestProfile_gk_anz = d3.nest()
							.key(function(d){return d.profil;})
							.rollup(function(leaves){return leaves.length;})
							.map(the_full_data_gk.gruenkataster);

	
	nestProfile_gk_sumf = d3.nest()
							.key(function(d){return d.profil;})
							.rollup(function(leaves){return {"length":leaves.length,
							 "total_flaeche": d3.sum(leaves,function(d) {return parseFloat(d.flaeche_m2);})}; }) // summe flaeche
							.map(the_full_data_gk.gruenkataster);

	
	nest4select = d3.nest()
					.key(function(d){return d.profil}).sortKeys(d3.ascending)
					.rollup(function(leaves){return leaves.length;})
					.entries(the_full_data_gk.gruenkataster);


	nestProfile_gk_objekt = d3.nest()
						.key(function(d){return d.bezeichnung}).sortKeys(d3.ascending)
						.key(function(d){return d.profil}).sortKeys(d3.ascending)
						.rollup(function(leaves){return {"length":leaves.length,
							 "total_flaeche": d3.sum(leaves,function(d) {return parseFloat(d.flaeche_m2);})}; })
						.map(the_full_data_gk.gruenkataster);


	nest4select_objekt = d3.nest()
					.key(function(d){return d.bezeichnung}).sortKeys(d3.ascending)					
					.rollup(function(leaves){return leaves.length;})
					.entries(the_full_data_gk.gruenkataster);	
	
	// hier wird die Select mit werten gefüllt
	// Select List auf Template show_d3.html
	// 2tes Select mit Objekten
	var list_objekt = d3.select("#myobjekt").append("select")
						.attr("name","objektselekt").attr("id","objektselekt")
						.on("change",objekt_auswahl)
						.selectAll("option")
						.data(nest4select_objekt)
						.enter()
						.append("option")
						.attr("value",function(d){return d.key;})
						.text(function(d){return d.key; });



  var list_objekte_bubble = d3.select("#myobjektauswahl").append("select")
            .attr("name","objektselektbubble").attr("id","objektselektbubble")
            .on("change",getBubbleObjekt)
            .selectAll("option")
            .data(nest4select_objekt)
            .enter()
            .append("option")
            .attr("value",function(d){return d.key;})
            .text(function(d){return d.key; });



	// hier wird die Select mit werten gefüllt
	// Select List auf Template show_d3.html			
	var list = d3.select("#myselect").append("select")
			.attr("name", "dasselect").on("change", my_func)
			.selectAll("option")
			.data(nest4select)
			.enter()
			.append("option")
			.attr("value", function(d) {return d.key;})
			.text(function(d) {return d.key; });				

};


/*
var change = function(data){
	console.log('yes 1');
	//d3.json("/data_gk",my_func);
	my_func();
};
*/
// Das ist die Callback Funktion bei der Select liste on change
//its Ajax
var my_func = function(data){
        $.getJSON('/data_gk', {
          dasselect: $('select').val()
        }, function(data) {
          $("#result").text(data.result);
        });

};

var objekt_auswahl = function(data){
	$("#result_objekt").text($("#objektselekt").val());
	console.log("func objektauswahl!");




};



//****************************************
// Callback Grafiken Profile 
// ----------------------------------------------

var grafiken_profile = function(data) {
	//console.log(data);
	destBilder = data;

d3.select(".grafiken").selectAll("img")
									.data(data.svg_files)
									.enter()
									//.append("div")
									//.attr("class","row")
									.append("div")
									.attr("class","one-third column")
									.append("img")
									.attr("src",function(d){return d["src"];})
									.attr("width",'128px')
									.attr("height", '128px')
									.attr("class",'icon_profile')
									.attr("title",function(d){return d["profil"] +"\n"+d["src"];})
									.attr('id',function(d){return d["code"];});
									//showTitleProfile();
d3.selectAll("div.one-third").insert("h6","img")
									.data(data.svg_files)
									.text(function(d){return d["profil"];});
									

									wrapper_images();
									return destBilder;
									};

									



									
var showFlaechen = function (){
	return 'string';
			};

var showTitleProfile = function (){
			d3.select(".grafiken")
				.insert("h2")
				.attr("class",'icon_title')
				.attr("text",'Mein Test Title')


	};
//****************************************
// BAR PLOTS
//----------------------------------------
// this is the work in progress
var do_bar_plot = function(dataset, p_selektor) {
	p_selektor = p_selektor || ".barplots";
	//console.log(p_selektor);
	var svg = d3.select(p_selektor)
				.append("svg")
				.attr("width",svg_width)
				.attr("height",svg_height)
				.attr("class", "my_svg");


	var tip = d3.tip()
  				.attr('class', 'd3-tip')
  				.offset([-10, 0])
  				.html(function(d) {
    			return "<strong>Anzahl:</strong> <span style='color:red'>" + d.values + " "+ d.key+"</span>";
  				});

  				svg.call(tip);

   	var yScale = d3.scale.linear()
   						.domain([0,d3.max(dataset,function(d){return d.values;})])
   						.range([svg_height-padding,0+padding]);
	
	var bkeys = []; // Here is the list with names for ordinal scale 
		for (var obj in dataset) {
			//console.log("1 ", dataset[obj].key);
			bkeys.push(dataset[obj].key);//.replace(/ /g,"\n"));
		}
	//console.log(bkeys);



   	var xScale = d3.scale.ordinal()
   				.domain(bkeys)
                //.domain(d3.range(dataset.length))
                .rangeBands([0+padding, svg_width-padding], 0.15);

    scale = xScale;

	var rects  = svg.selectAll("rect")
   					.data(dataset)
					.enter()
				    .append("rect")
			    	.attr("x", function(d, i) {
      							return xScale(d.key); })         // <-- Set x values})
					.attr("y", function(d) {return  yScale(d.values);})
					.attr("width", xScale.rangeBand())
					.attr("height", function(d) {return yScale(0) - yScale(d.values);})
					.attr("class", "bar")
					.attr("fill", "teal")
					.on('mouseover', tip.show)
      				.on('mouseout', tip.hide);

	var labels = svg.selectAll("text")
					.data(dataset)
					.enter()
					.append("text")
					.text(function(d){return d.key;})
					//.attr("x",function(d, i) {return xScale(d.key);})
					//.attr("y",function(d) {return  yScale(d.values);})
					.attr("transform", function (d,i)
						 {  var xText = xScale(d.key)+(xScale.rangeBand()/2); //in der XMitte des Balken
						 	var yText = yScale(d.values) + ((yScale(0) - yScale(d.values))/2); // zentral in der YMitte des Balkens = halbe Höhe der Höhe des Balkens
						 	return "translate("+xText+","+yText+") rotate(-90)";})
					.attr("class", "arttext")
					.attr("font-family", "sans-serif")
   					.attr("font-size", "11px")
   					.attr("fill", "red")
   					.attr("text-anchor","middle");				



/*
   	var label_n = svg.selectAll("text")
   					 .data(dataset)
   					 .enter()
   					 .append("text")
   					 .attr("class", "artn")
   					 .text(function(d){return d.key;})
					.attr("x",function(d, i) {return xScale(d.key);})
					.attr("y",function(d) {return  yScale(d.values);})
					.attr("font-family", "sans-serif")
   					.attr("font-size", "11px")
   					.attr("fill", "red")
   					.attr("text-anchor","middle");

*/


   	var xAxis = d3.svg.axis()
   					.scale(xScale)
   		//			.orient("bottom")
   		//			.ticks(3);

   	var yAxis = d3.svg.axis()
   					.scale(yScale)
   					.orient("left")
   		//			.ticks(5);
 ;
   	
   	d3.select(p_selektor + "> svg").append("g")
   					.attr("class", "x axis")
   					.attr("transform", "translate(0," + (svg_height - padding) + ")")
   					.call(xAxis);

   	d3.select(p_selektor + "> svg").append("g")
   					.attr("class", "y axis")
   					.attr("transform", "translate(" + padding + ",0)")
   					.call(yAxis);


};




// *******************************************************
// LOAD JSON AND CALLBACK WHEN LOADED
//--------------------------------------------------------

d3.json("static/json/outLimit.json",callback);
d3.json("static/json/output.json",callback_output);
d3.json("static/json/output_profile_gk.json",process_gruenkataster);
d3.json("static/json/allFiles.json", grafiken_profile);


var myFirstD3func = function(mydata) {
	d3.select("#grafiken").selectAll("p")
  	.data(mydata)
  	.enter()
  	.append("p")
  	.text(function (d,i) {
  	//console.log("funktion ende");
  	return 'i = ' +i + ' data =  '+d.baumart; } )};
/*<!-- .attr("onchange",'submit()')
	d3.select("#grafiken").selectAll("p")
  	.data(data.baumkataster)
  	.enter()
  	.append("p")
  	.text(function (d,i) {
  	console.log("funktion ende");
  	return 'i = ' +i + ' data =  '+d; } ); 

$(function() {
      $('#myselect').bind('onchange', function() {
        $.getJSON('/data_gk', {
          dasselect: $('select').val()
        }, function(data) {
          $("#result").text(data.result);
        });
        return false;
      });
    });

*/

var wrapper_images = function() {
 var stuffToBeWrapped = d3.selectAll("div.one-third");

 var profile_pro_row = 3
 var pos_1 = 0;
 var pos_2 = 3;
 var letzte_pos;
 var anzahl_profile = stuffToBeWrapped[0].length;
 var count2ceil = Math.ceil(anzahl_profile / 3);
 var rest = anzahl_profile % profile_pro_row;

 for(var i = 0; i<=count2ceil; i++) {
	$(stuffToBeWrapped[0].slice(pos_1,pos_2)).wrapAll( "<div class='row' />");
	pos_1 += profile_pro_row;
	pos_2 += profile_pro_row;

}

};

