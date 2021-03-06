# -*- coding: utf-8 -*-

#Importiere alle nötigen Module
from flask import Flask
import json
from flask import request, render_template, jsonify, flash
from flask import redirect, url_for
import psycopg2
import sys
import jinja2
import datetime
from pgdb import PG_Access
from sandbox import generate_bubble_json_from_baum_json
dapp = Flask(__name__)



@app.route("/")
def go_home():
	return render_template('base.html')

@app.route("/handbuch")
@app.route("/grafiken")
def show_grafiken():
	return render_template("grafiken.html")


@app.route("/kennzahlen")
def show_kennzahlen():
	return render_template('base.html')


@app.route("/to_do_admin")
def to_do_admin():
	return render_template('to_do_admin.html')


@app.route("/d3")
def show_d3():
	return render_template('show_d3.html')


@app.route("/bubble")
def show_baumarten_bubble():
	return render_template('bubble.html')




@app.route("/zeiterfassung")
def get_work_view():
	""" Connect to PG DB (remote) to get all my work done"""

	cas_stundenrapportierung = db_query()
	#print cas_zeit_report

	return render_template('arbeitszeit.html', result_data = cas_stundenrapportierung)


@app.route("/ajax",methods=["POST"])
def get_ajax_info():
	return '<div class="ajax"> Served from Python via AJAX </div>'


#Das funktioniert!! AJAX request mit JSON!
@app.route('/getAjaxData', methods = ["GET", "POST"])
def getAjaxData():

    c = request.json['testdaten']
    b = c.get("radio_button",'kein Radioauswahl')
    txt = c.get("input_text",'kein input text')
    
    res = totalStunden()


    return json.dumps({"testdaten_total":c, "td_inp_text":txt, "td_radio":b,"STUNDEN":res }) 


@app.route('/totalStunden')
def totalStunden():
	result = db_query_summary()
	json_returns = []
	for row in result:
		json_returns.append((row[0],str(row[1]))) 

	return json.dumps({"result":json_returns})


@app.route('/baumsorten_spezial', methods=["GET","POST"])
@app.route('/baumsorten_spezial/<string:filter_objekt>')
def baumsorten_spezial(filter_objekt=False):
	if filter_objekt:
		filter_objekt = filter_objekt.encode("utf-8")
	u = request.args.get("Objekt", "Kein Objekt")
	print 'My String is:' + str(filter_objekt)

	return generate_bubble_json_from_baum_json(filter_objekt)




#Datenbank Helper Funktionen
#Werden für das Tool Zeiterfassung gebraucht
#Im produktiven Betrieb werden dann aber solche Funktionen die Daten
# für die Visualisierungen liefern

def db_query(sqlquery = "SELECT * FROM bs_production.cas_stundenrapportierung  ORDER BY start_zeit DESC"):
	sqlquery = """SELECT * FROM bs_production.cas_stundenrapportierung cas
	 left join bs_production.lut_arbeits_typ lut ON lut.id = cas.arbeits_typ_id
	 ORDER BY start_zeit DESC"""
	obj = PG_Access(sql = sqlquery)
	result = obj.query_all()
	return result


def db_query_summary():
	obj = PG_Access(sql="select txt_value,sum from bs_production.cas_zeit_summary")
	result = obj.query_all()

	return result


def db_update(**kwargs):
	conn = psycopg2.connect('host = bernardspichtig.ch  dbname = bernards_postgisdb1\
						user = bernards password = 3Ix50o8rqY \
						port = 5432')
	cur = conn.cursor()

	time_format = 'YYYY-MM-DD HH24:MM'
	jetzt = datetime.datetime.now()
	start_zeit = kwargs.get("start_zeit",jetzt)
	end_zeit = kwargs.get("end_zeit",jetzt)
	typ = kwargs.get("typ",2 ) #Research as Default
	bemerkung = kwargs.get("bemerkung","") 

	insert_string ="""INSERT INTO bs_production.cas_stundenrapportierung 
	(start_zeit, end_zeit, arbeits_typ_id,bemerkung) VALUES (to_timestamp(\'{0}\','YYYY-MM-DD\"T\"HH24:MI'),
	to_timestamp(\'{1}\','YYYY-MM-DD\"T\"HH24:MI'), {2},'{3}')""".format(start_zeit,end_zeit,typ,bemerkung)
	print insert_string
	try:
		print cur.execute(insert_string)
		# cur.statusmessage
		conn.commit()
		return True
	except:
		return False








#FILTERS JINJA###########
#Die HTML Templates werden durch das Modul Jinja2 geliefert
#Dieses Modul erlaubt u.a. die Erstellung von Filtern
#Hier eine Datum- und Zeitformat Darstellungsfilter
@app.template_filter('strptime')
def _jinja2_filter_datetime(date, fmt=None):
	format = "%a %B %d %H:%M:%S %Y"
	#s = datetime.datetime.strptime(date,format)
	format_strp = '%Y-%d-%mT%H:%M'
	format_out = "%d. %m. %H:%M h"
	return date.strftime(format_out)


##FORMULAR HANDLER ###
#Hier werden die Formulardaten der Zeiterfassung verarbeitet und 
#an die DB Funktionen weitergeleitet

@app.route("/handle_formular",methods=['GET', 'POST'])
@app.route("/handle_formular/<string:my_string>")
def handle_formular():
	start_zeit = request.args.get("start_zeit",'Nichts eingegeben')
	end_zeit = request.args.get("end_zeit", "Nichts eingegeben")
	typ = request.args.get("arbeits_typ","Nichts eingegeben")
	bemerkung = request.args.get("bemerkung","")

	if db_update(start_zeit=start_zeit, end_zeit=end_zeit, typ=typ,bemerkung=bemerkung):
		flash("DB Eintrag erfolgreich!")
		flash("Start_Zeit: " + start_zeit + " End_Zeit: " + end_zeit + " Arbeit: "+ typ +" Bemerkung"+bemerkung)
	else:
		flash("Eintrag in DB fehlgeschlagen!")
	return redirect(url_for('get_work_view'))









@app.route("/data")
@app.route("/data/<int:ndata>")
def data(ndata=100):
	"""
	On request this returns a ndata
	"""
	u = []
	u = request.args.get('wert','kein wert')

	return render_template('layout.html',form_data = u)


@app.route("/data_gk")
@app.route("/data_gk/<string:my_string>")
def data_gk():
	print 'flask data gk'
	u = []
	u = request.args.get('dasselect', 'es kam nichts')
	u += " something completly different"
	return jsonify(result=u)

if __name__ == "__main__":
	import os
	app.secret_key = 'super secret key'
	app.config['SESSION_TYPE'] = 'filesystem'
	port = 5000
	app.debug = True
	app.run(port=port)



