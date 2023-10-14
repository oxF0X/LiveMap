# -*- coding: utf-8 -*-
"""
Created on Mon Oct  9 18:53:11 2023

@author: ruste
"""

import mysql.connector
import json
import os
from datetime import datetime
import schedule 
import time
import threading
from DataModule import dataModule
from datetime import datetime


MYSQL_HOST = os.environ.get('MYSQL_HOST', 'localhost')
MYSQL_USER = os.environ.get('MYSQL_USER', 'root')
MYSQL_PASS = os.environ.get('MYSQL_PASS')
MYSQL_DATABASE = os.environ.get('MYSQL_DATABASE', 'mapdb')


class DBManager:
    def __init__(self):
        self.db = MYSQL_DATABASE    
        self.mydb = mysql.connector.connect(
            host = MYSQL_HOST,
            user = MYSQL_USER,
            passwd = MYSQL_PASS,
            database = MYSQL_DATABASE,
        )    
        #print(self.mydb)
        self.cursor = self.mydb.cursor(buffered = True)

        #self.mod = dataModule()
        self.mod = None
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS mapdata (
            title VARCHAR(255) NOT NULL,
            type VARCHAR(50) NOT NULL,
            time TIME,
            longtitude FLOAT,
            latitude FLOAT
            )""")

        self.cursor.execute(f"""
        SELECT COUNT(*) FROM information_schema.tables
        WHERE table_name = 'mapdata'""")
        self.close()
    
    def open(self):
        self.db = MYSQL_DATABASE
        self.mydb = mysql.connector.connect(
            host = MYSQL_HOST,
            user = MYSQL_USER,
            passwd = MYSQL_PASS,
            database = MYSQL_DATABASE,
        )
        #print(self.mydb)
        self.cursor = self.mydb.cursor(buffered = True)


    def select_rows(self):      
        self.open()
        self.cursor.execute("SELECT * FROM mapdata;")
        results = self.cursor.fetchall()
        self.close()
        rows = []
        for row in results:
            row_dict = {
                "description": row[0],
                "eventType": row[1],
                "startTime": str(row[2]),
                "lang" : row[3],
                "alt": row[4]
            }
            rows.append(row_dict)
    
        return json.dumps(rows)

    #insert JSON data
    def insert_json_data(self):
        print("yay") 
        self.open()
        if self.mod == None:
            self.mod = dataModule()
        #change accordingly
        data = self.mod.Scraping()
        #query to insert data into the table
        insert_query = "INSERT INTO mapdata (title, type, time, longtitude, latitude) VALUES (%s, %s, %s, %s, %s)"
        for event in data:
            print(event)
            check_query = "SELECT title FROM mapdata WHERE title = %s and type = %s"# and longtitude = %s and latitude = %s"
            self.cursor.execute(check_query, (event["message"][::-1], event["type"]))#)), event["place"][1], event["place"][0]))
            existing_id = self.cursor.fetchone()
            #print("reverse", event["message"][::-1])
            if existing_id == None:
                try:
                    now = datetime.now()
                    formatted_date = now.strftime('%Y-%m-%d %H:%M:%S')
                    self.cursor.execute(insert_query, (event["message"][::-1], event["type"], event["time"]+ ":00", event["place"][1], event["place"][0]))
                    self.mydb.commit()
                except mysql.connector.Error as err:
                    print(str(err))
            else:
                print("data exists")
                
            print(self.cursor.execute("SHOW COLUMNS FROM mapdata"))
            
        self.mydb.commit()
        self.close()

    def delete_old_rows(self):
        
        self.open()
        #query to delete rows older than x time       
        
        #execute cursor with changes, will add types once syntax is known
        self.cursor.execute("delete from mapdata WHERE TIMESTAMP(time) <= NOW() - INTERVAL 15 MINUTE and type = 'ALARMS';")
        self.cursor.execute("delete from mapdata WHERE TIMESTAMP(time) <= ABS(NOW() - INTERVAL 120 MINUTE);")
        self.mydb.commit()
        self.close()
        

    def close(self):
        self.cursor.close()
        self.mydb.close()

    def __del__(self):
        self.cursor.close()
        self.mydb.close()

    #multithread the main functions, idk if it's necessary 
    def main_execute(self):
        self.delete_old_rows()
        self.insert_json_data()
        #commit changes
        self.mydb.commit()
