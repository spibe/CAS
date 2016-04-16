# -*- coding: utf-8 -*-

import psycopg2

class PG_Access(object):
	RDBMS = 'PostgreSQL'

	def __init__(self,**kwargs):
		self.host = kwargs.get("host","bernardspichtig.ch")
		self.dbname = kwargs.get("dbname", "bernards_postgisdb1")
		self.user = kwargs.get("user","bernards")
		self.password = kwargs.get("password","3Ix50o8rqY")
		self.port = kwargs.get("port", 5432)
		self.sql = kwargs.get("sql","SELECT current_timestamp")

	def conn(self):
		self.conn_string = """dbname={dbname} host={host} 
		user={user} password={pw} port={port}
		""".format(dbname=self.dbname,host=self.host,
					user=self.user,pw=self.password,port=self.port)
		self.connection = psycopg2.connect(self.conn_string)
		return self.connection

	def curse(self):
		self.cursor =  self.conn().cursor()
		return self.cursor

	def query_all(self):
		self.curse().execute(self.sql)
		self.result = self.cursor.fetchall()
		return self.result

	def __str__(self):
		return "So wird das Objekt beschrieben: "



#Test
if __name__ == "__main__":

	obj = PG_Access()
	obj.conn()
	obj.curse()

	print obj

	obj.query_all()





