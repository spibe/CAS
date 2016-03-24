

var get_now_time = function() {
  var now = new Date() //.toLocaleString();  
   var datetime = now.getFullYear()+'-'+ ('0' + (now.getMonth()+1)).slice(-2)+'-'+now.getDate(); 
  datetime += 'T'+now.getHours()+':'+('0' + now.getMinutes()).slice(-2);
  return datetime 
};

// Here comes some Ajax stuff...! Lean AJAX the hard way;)
var myAjaxFunc = function(data) {
	console.log("func started");
			
	//console.log(data);
	var inp_text;
	inp_text= $('#startzeit').val();
	var radio_data = buttonCheck();
			//console.log("radiovalue: " + String(radio_data));
	$.ajax({
    type : "POST",
    url : "/getAjaxData",
    data: JSON.stringify({'testdaten':{
											"input_text":inp_text,
											"radio_button":radio_data,
											"func_data":data}}, null, '\t'),
    contentType: 'application/json;charset=UTF-8',
    success: function(result) {
        console.log(result);
			$('#result').html(result);
    						}
			});
};


var buttonCheck = function(){
		var radios =  $("input[name=arbeits_typ]");
		var rad_value ;
		for (var i = 0; i < radios.length; i++ ){
				//console.log(radios[i].checked);
				if (radios[i].checked ){
						rad_value = radios[i].value;
									} 

											}
		return rad_value;
};








// Sobald DOM und Inhalt geladen, werden bei gewissen Events 
// die AJAX Requests ausgeführt kommen 
$(document).ready(function(){ 
$('#btn1').on('click',function(){
			//console.log('changed!'+this.value );
			myAjaxFunc();
			
			
			}); 
});




$(window).load(function(){
  console.log("jQuery loaded!");
   document.getElementById("endzeit").value = get_now_time();
   document.getElementById("startzeit").value = get_now_time();

});