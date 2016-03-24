document.addEventListener('DOMContentLoaded', function(){
 
var my_data;
var showProfile = function(data) {
	//console.log(data);
	my_data = data;

d3.select(".grafiken").selectAll("img")
									.data(data)
									.enter()
									.append("g")
									.attr("class","new_group")
									.append("img")
									.attr("src",function(d){return d["src"];})
									.attr("width",'128px')
									.attr("height", '128px')
									.attr("class",'icon_profile')
									.attr("title",function(d){return d["profil"] +"\n"+d["src"];})
									.attr('id',function(d){return d["code"];});
									//showTitleProfile();
d3.selectAll("g").insert("h5","img")
									.data(data)
									.text(function(d){return d["profil"];});
									
									return my_data;
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
			
									
d3.json("/getimages", showProfile);
d3.json("/getdata" ,showFlaechen);




}, false);




