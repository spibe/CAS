
var link2mapserver = 'http://mapserver.intranet.bs.ch/MapServer_Standard/?link=5544387c3ea74a24';

$("#soflow").chosen(
	{'no_results_text': "Keine Objekt gefunden!!",
	 'placeholder_text_single': "Bitte ein Objekt auswählen",
	 'search_contains':true
	});

var markers =[];
var markers_baum = [];
var feature_group = new L.featureGroup([]);
var raster_group = new L.LayerGroup([]);
var layer_opacity = 0.75;
$.ajaxSetup({async:true});


var map = L.map('map').setView([47.559, 7.60], 13);

L.tileLayer('https://{s}.tiles.mapbox.com/v4/bernardspichtig.lk4f440n/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYmVybmFyZHNwaWNodGlnIiwiYSI6ImUya1RhU0EifQ.3RWJQh5dUiOX-_zXeD3xNQ', {
    attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    maxZoom: 18
}).addTo(map);


var myStyle = {
	"color": "#E34230",
	"weight" : 5,
	"opacity" : 0.75,
	"fillOpacity": 0.1,
	"fillColor": "#FF0DFF"	
};

var myStyleGF ={
	"color":  "#00ff00",
	"weight": 3,
	"opacity": 0.9
};

var myStyleB = {
	"color":  "#A0E80A",
	"weight": 3,
	"opacity": 0.5
	
};


function onEachFeature(feature, layer) {
	if (feature.properties && feature.properties.BEZEICHNUNG) {
		markers.push(layer.
		bindPopup(feature.properties.BEZEICHNUNG.
			concat(feature.properties.HTMLTABLE)));
		}
}


function onEachFeatureBaum(feature, layer) {
	if (feature.properties && feature.properties.ART_TEXT) {
		markers_baum.push(layer.
		bindPopup(feature.properties.ART_TEXT));
	
		}
}

	
var objekte_layer = new L.geoJson(objekte,
	{onEachFeature: onEachFeature,
	style: myStyle
}
);

objekte_layer.addTo(map);
feature_group.addLayer(objekte_layer);

// Gruenflächen layer erstellen, aber noch nicht der Karte hinzufügen
var gf_layer = new L.geoJson(gruenflaechen,
	{onEachFeature: onEachFeature,
	style: myStyleGF
	}
);
feature_group.addLayer(gf_layer);



// Baumlayer erstellen, aber noch nicht der Karte hinzufügen
var baum_layer = new L.geoJson(baeume);

//baum_layer.addTo(map);
feature_group.addLayer(baum_layer);


// Basemap layer and WMS layers
var basemap_stamen = new L.tileLayer('http://a.tile.stamen.com/toner/{z}/{x}/{y}.png', { 
			opacity: layer_opacity,
			attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data: &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'});	
		
var basemap_mapbox = new L.tileLayer('https://{s}.tiles.mapbox.com/v4/bernardspichtig.lk4f440n/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYmVybmFyZHNwaWNodGlnIiwiYSI6ImUya1RhU0EifQ.3RWJQh5dUiOX-_zXeD3xNQ', {
		opacity: layer_opacity,
		attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'});			

var basemap_thunderforest = new L.tileLayer('http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png',{
		opacity: layer_opacity,
		attribution:'Thunderforest'	});	

var basemap_usgs = new L.tileLayer.wms('http://basemap.nationalmap.gov/ArcGIS/services/USGSImageryTopo/MapServer/WMSServer', {
	layers:'0',
	format: 'image/png',
	transparent: true,
	attribution: "USGS"
	});
	
var basemap_wmsbs = new L.tileLayer.wms('http://wms.geo.bs.ch/wmsBS',{
	layers:'1',
	format: 'image/png',
	transparent: true,
	attribution: "GVA BS"
	});
	
var nexrad = L.tileLayer.wms("http://nowcoast.noaa.gov/wms/com.esri.wms.Esrimap/obs", {
layers: 'RAS_RIDGE_NEXRAD',
format: 'image/png',
transparent: true,
attribution: "NOAA/NWS"
}).addTo(map);
	
	var basemaps = {
	'Einfach SW': basemap_stamen,
	'Farbig': basemap_mapbox,
	'Cycle' : basemap_thunderforest//,
//	'USGS' : basemap_usgs,
//	'WMS BS': basemap_wmsbs
	};			
	
// Yipii my first AJAX POST!!
function showObjekt(data) {
	//console.log(data);
	var fid = data;
	//send data to php file and get back html
	var posting= $.post( "getprofile.php",{AuswahlObjekt:data});
	posting.done(function( data ) {
		// insert the html in the div
		$("#externHTML").empty().append(data);
		
		// output all einheiten -> in Zukunft alle einheiten schön darstellen
		$('#externHTML td.einheit').contents().filter(function() {
			return this.nodeType === 3;
		}).replaceWith(function() {
			return this.nodeValue.replace('2', '<sup>2</sup>').replace('1','').replace('St','Stk.');
		});
				
		//alert(data);
		// Search for the selected objekt in the GeoJSON
		$.each(objekte.features, function (index, value){
		//console.log('each:'+ value.properties.FID);

			if (value.properties.FID == fid) {
			//console.log(fid + ': '+ value.properties.BEZEICHNUNG);
			// get mittelpunkt of polygon and center map there
			var mX = value.properties.MITTELPUNKT_X;
			var mY = value.properties.MITTELPUNKT_Y;
		//console.log('map.setView(['+mY+','+mX+'],18');
			map.setView([mY, mX], 16);
			$.each(markers,function (index,value){
				if (value.feature.properties.FID == fid) {
				value.openPopup();	
				} // End if
			})
			} // End if
		}); // end for loop	
	})  ; // end of posting
} // End of funtion 

// Layer Kontrolle oben rechts
L.control.layers(basemaps,{"Objekte":objekte_layer},{collapsed:true}).addTo(map);
// Massstab unten links
L.control.scale({options: {position: 'bottomleft',maxWidth: 100,metric: true,imperial: false,updateWhenIdle: false}}).addTo(map);


function newStyle (obi) {
	obi.setStyle({color:"green"});
	}


function showTable(fid) {
	var data = fid;
	var selected = $('select#soflow option[value='.concat('"',fid,'"',"]"))


}





function onClick(e) {
	//console.log(e.properties);
	console.log(e.geometryType);
//	if (e.properties.FID == '1102') {
//	console.log(e.latlng);
//	console.log(e.properties.FID);
}

map.on('click',onClick);
