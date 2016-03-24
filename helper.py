# -*- coding: utf-8 -*-
import json
import os
print os.getcwd()
import psycopg2

conn = psycopg2.connect('host = bernardspichtig.ch  dbname = bernards_postgisdb1\
						user = bernards password = 3Ix50o8rqY \
						port = 5432')
print conn.encoding
cur = conn.cursor()
result = open('static/json/output.json').read()
#print result
data = json.loads(result)

if True:
	for obj in data["baumkataster"]:
		with open('file.txt','a') as f:
			f.write(obj['baumart'].encode('utf-8') if obj['baumart'] else 'None')
			"""
		cur.execute('Insert into stg_baumkataster.baumgeo (baumnr, strasse, gruppe, \
			profil, baumart, status, kreis) VALUES (%s,%s,%s,%s,%s,%s, %s)',
		 (obj['baumnr'],obj['strasse'],obj['gruppe'],obj['profil'],
		  obj['baumart'],obj['status'], obj['kreis']))"""
	#for key in obj:
	#	print key, '  ',obj[key]
	#	if key == 'baumnr':
	#		cur.execute('Insert into stg_baumkataster.baumgeo (baumnr) VALUES (%s)', (obj[key],))

conn.commit()

#cur.execute('select baumart from stg_baumkataster.baumgeo limit 50')
#result = cur.fetchall()
#print result[0][0].encode('UTF-8')
cur.close()
conn.close()