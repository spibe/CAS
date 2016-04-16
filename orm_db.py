
from sqlalchemy import *
from sqlalchemy.orm import create_session
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from sqlalchemy.orm import contains_eager, joinedload
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer
import unittest

#Create and engine and get the metadata
Base = declarative_base()
#postgresql+psycopg2://user:password@host:port/dbname[?key=value&key=value...]
engine = create_engine('postgresql://bernards:3Ix50o8rqY@bernardspichtig.ch:5432/bernards_postgisdb1', echo=False)
metadata = MetaData(bind=engine)


#Funktioniert
#Reflect each database table we need to use, using metadata
comment = """ """
class Arbeitstyp(Base):
	__table__ = Table('lut_arbeits_typ', metadata, 
					#Column("id", Integer, primary_key=True),
					autoload=True, schema='bs_production')


class Stundenrapportierung(Base):
    __table__ = Table('cas_stundenrapportierung', metadata,
    				 autoload=True, schema='bs_production')
    arbeitstypen = relationship("Arbeitstyp", backref="Stundenrapportierung")



class Test(unittest.TestCase):

    def setUp(self):
        #Create a session to use the tables    
        self.session = create_session(bind=engine)        

    def tearDown(self):
        self.session.close()

    def test_withJoins(self):
    	res = self.session.query(Stundenrapportierung)
    	res = res.join(Arbeitstyp)
    	res = res.filter(Arbeitstyp.txt_value == 'Dokumentation')
    	


if __name__ == '__main__':
	unittest.main()




