<?php
// Autor: Bernard Spichtig
// Letzte Aenderung 01.04.2015
// Date Variablen
//mb_internal_encoding("utf-8");
date_default_timezone_set('Europe/Paris');
$heute = date("oW", time());
$jetzt = date('d.m.o',time());
$nr_weeks = $ende-$heute;


// Verbindung
$Connection = odbc_connect('sf_baumgruen', 'sf_gruenkataster', 'sf_gruenkataster');
//Abfragen
$totalObjekteSubmission = odbc_exec($Connection, 'SELECT count(*) AS ANZAHLOBJ FROM VOBJEKTE');
$mycount = odbc_fetch_array($totalObjekteSubmission);

$AnzahlObjekteTotal = odbc_exec($Connection,'SELECT count(*) AS TOTOBJ FROM OBJEKT WHERE LOESCHDATUM IS NULL');
$TotObj = odbc_fetch_array($AnzahlObjekteTotal);

$FidNameObjekte = odbc_exec($Connection,'SELECT FID,BEZEICHNUNG, ID_KREIS FROM OBJEKT WHERE LOESCHDATUM IS NULL AND ID_SUBMISSION IN (6,7,8,9) ORDER BY BEZEICHNUNG');
$myRow = odbc_fetch_array($FidNameObjekte);

?>



<!DOCTYPE HTML>
<html lang="de">
<head>
<meta charset="ISO-8859-1">

<meta name="viewport" content="width=device-width, initial-scale=1">

<title> Objekte im Gr&uuml;nkataster</title>
<meta name="description" content ="Beschreibung der Objekte anhand der zugeteilten Profile und Pflegeklassen">
<script src="jquery-1.11.2.min.js"></script>
<link rel="stylesheet" href="leaflet.css" />
<link rel="stylesheet" href="styles.css" />
<link rel="stylesheet" href="_css/chosen.css" />
<script src="chosen.js"></script>

<!--<link rel="stylesheet" href = "jQuery/jquery-ui\jquery-ui.min.css"/>
<link rel="stylesheet" href = "jQuery/jquery-ui\jquery-ui.min.js"/> -->

<!--
<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/themes/smoothness/jquery-ui.css">
<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/jquery-ui.min.js"></script>

-->

<!--<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css"> -->
<!--<link rel="stylesheet" type="text/css "href="styles.css"> -->
<script src="leaflet.js"></script>
<!--<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>-->
</head>
<body>
<header id = "mainHeader" role = "banner">
	<h1>Objekte im Gr&uuml;nkataster</h1>
	<p>Profile und Pflegeklassen in den Anlagen der STG</p>

	<nav class "navigation" id="mynav" role ="navigation">
		
		<ul>
			<li><a href="index-Gruenkataster.php" title="Index Kennzahlen" target="_blank">Index Kennzahlen</a></li>
			<li><a href="Kennzahlen-Gruenkataster-Profile.php" title="Projekt Kennzahlen" target="_blank">Projekt Kennzahlen</a></li>
			<li><a href="http://www.stadtgaertnerei.bs.ch" title="Zur Stadtgärtnerei Homepage" target="_blank">Home (Homepage Stadtgärtnerei)</a></li>
			</ul>
		</nav>
</header>






<article>
<h2>Einzelne Objekte abfragen</h2>

<div class="selectForm" id="selectForm">
	<form method="POST" >
	Objekt auswählen:
	<select id ="soflow" class="andere" name="AuswahlObjekt" onchange = "showObjekt(this.form.AuswahlObjekt.value);">

<?php 
while ($myRow = odbc_fetch_array($FidNameObjekte))
{	
	IF (isset($_POST["AuswahlObjekt"]) and $myRow["FID"] == $_POST["AuswahlObjekt"])
	{
		echo '<OPTION  ';
	} else {
		echo '<OPTION ';
	}
	
	echo ' value ="'.$myRow["FID"].'">'.$myRow["BEZEICHNUNG"]. '</option>';
	
	}?>
	
	</select>
	
<!--	<input type="radio" name="Kreise" value="1"> Ost <br>
	<input type="radio" name="Kreise" value="2"> West <br>
	<input type="radio" name="Kreise" value="3"> Kleinbasel <br>
	<input type="radio" name="Kreise" value="4"> Hörnli <br> -->
	
	</form>
	
</div>

<h3>Kennzahlen Profilzuteilung</h3>
<div id="externHTML">

</div>
</article>

<article class ="Karte">
<h3>Karte aller gelieferten Objekte</h3>
<div id="map" class="map"></div>
<script src="geojson/objekte.js"></script>
<script src="geojson/gruenflaechen.js"></script>
<script src="geojson/baeume.js"></script>



<script src="script-profile.js"></script>
</article>

<footer>


<p> Copyright: STG Basel, Bernard Spichtig, <?php echo $jetzt;?> </p>
</footer>
</body>
</html>