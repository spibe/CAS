# -*- coding: utf-8 -*-

import json
import psycopg2
import datetime



def generate_bubble_json_from_baum_json(filter_objekt=False):
	""" Reads in output.json and reformats the data to 
	be used in bubble d3."""
	result = open('static/json/output.json').read()
	#print result
	data = json.loads(result)

	temp_dict = {"name":"Gattung", "children":[]}
	arten_dict= {}
	alle_gattungen = []
	for obj in data["baumkataster"]:
		if obj["baumart"]:
			baumart = obj["baumart"]
			gattung = obj["baumart"].split(' ')[0]
			objekt = obj["objekt"] 
			obj["Gattung"] = gattung
			
			if not filter_objekt:
				alle_gattungen.append(gattung)
				arten_dict[baumart] = arten_dict.get(baumart,0) +1
			else:
				if filter_objekt.encode('utf-8') == unicode(objekt).encode('utf-8'):
					alle_gattungen.append(gattung)
					arten_dict[baumart] = arten_dict.get(baumart,0) +1
		else:
			obj["Gattung"] = None

	for gatt in set(alle_gattungen):
		temp_dict["children"].append({"name":gatt, "children":[]})



	for key, value in arten_dict.items():
		for i,liEl in enumerate(temp_dict["children"]):
			if liEl["name"] == key.split(' ')[0]:
				temp_dict["children"][i]["children"].append({"name":key, "size": value})

		#	if key.split(' ')[0] == gatt:
		#		temp_dict["children"].append({"name":key, "size": value})		


	#print temp_dict
	suffix = filter_objekt.encode('utf-8') if filter_objekt else "alle"

	with open('static/json/baumsorten_python_{suff}.json'.format(suff=suffix), 'w') as outfile:
	    json.dump(temp_dict, outfile,sort_keys = True, indent = 4)

	return json.dumps(temp_dict)    


def bubble_baum_objekt():
	"""Generate bubble json from baum json 
	grouped by STG Objects """

	

	

def generate_bubble_json_from_profile_json():
	""" Reads in output_profile_gk.json and reformats the data to 
	be used in bubble d3."""
	result = open("static/json/output_profile_gk.json").read()
	data = json.loads(result)

	temp_dict = {"name":"Schema", "children":[]}
	profile_dict = {}
	schemata = ["1 Rasen", "2 Bepflanzung", u"3 Beläge", " 4 Wasser", "5 Exogen"]
	alle_schema = [sch for sch in range(1,6,1)]

	for obj in data["gruenkataster"]:
		if obj["profil"]:
			profil = obj["profil"]
			flaeche_m2 = obj["flaeche_m2"]
			if profil in profile_dict:
				profile_dict[profil]["size"] = profile_dict[profil].get("size",0) +1
				profile_dict[profil]["flaeche"] = profile_dict[profil].get("flaeche") + flaeche_m2

			else:
				profile_dict[profil] = {"size":0, "flaeche":0}
 
	for schema in schemata:
		temp_dict["children"].append({"name":schema,"children":[]})	



	for key, value in profile_dict.items():
		for i, liEl in enumerate(temp_dict["children"]):
			if liEl["name"].split(' ')[0] == key[0]:
				temp_dict["children"][i]["children"].append({"name":key, "size": value["size"], "flaeche": value["flaeche"]})


	with open("static/json/profile_python.json",'w') as outfile:
		json.dump(temp_dict,outfile, indent = 4)	


if __name__ == "__main__":
	#generate_bubble_json_from_profile_json()
	generate_bubble_json_from_baum_json("Kannenfeldstrasse")
	generate_bubble_json_from_baum_json(u"Schönbeinstrasse")
	generate_bubble_json_from_baum_json(u"Vogesenstrasse, Mülhauserstrasse - St. Johanns-Ring")



