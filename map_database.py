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


class DBManager:
    def __init__(self):
        self.db = "mapdb"    
        self.mydb = mysql.connector.connect(
            host = "localhost",
            user = "root",
            passwd = "abudefduf1",
            database = self.db
        )    

        self.cursor = self.mydb.cursor(buffered = True)

        self.mod = dataModule()

        

        
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


    def select_rows(self):        
        delete_query = """
        DELETE FROM mapdata
        WHERE time < DATE_SUB(NOW(), INTERVAL %s) AND type = %s
        """
        self.cursor.execute("SELECT * FROM mapdata")
        return self.cursor.fetchall()


    

    #insert JSON data
    def insert_json_data(self):
        #change accordingly
        data = self.mod.Scraping()
        #query to insert data into the table
        insert_query = "INSERT INTO mapdata (title, type, time, longtitude, latitude) VALUES (%s, %s, %s, %s, %s)"
        for event in data:
            check_query = "SELECT title FROM mapdata WHERE title = %s"
            self.cursor.execute(check_query, (event["message"],))
            existing_id = self.cursor.fetchone()
            if not existing_id:
                try:
                    self.cursor.execute(insert_query, (event["message"], event["type"], event["time"], event["place"][1], event["place"][0]))
                    self.mydb.commit()
                except mysql.connector.Error as err:
                    print(str(err))
            else:
                print("data exists")
                
            print(self.cursor.execute("SHOW COLUMNS FROM mapdata"))
            
        self.mydb.commit()


    def delete_old_rows(self):
        
        
        #query to delete rows older than x time
        delete_query_alarm = """
        DELETE FROM mapdata
        WHERE time < (CURDATE() - INTERVAL %s MINUTE) AND type = %s
        """
        
        delete_query_else = """
        DELETE FROM mapdata
        WHERE time < (CURDATE() - INTERVAL %s HOUR) AND type = %s
        """
        
        #execute cursor with changes, will add types once syntax is known
        self.cursor.execute(delete_query_alarm, (15, 'ALARMS'))
        self.cursor.execute(delete_query_else, (5, "ROAD_BLOCKED"))
        self.cursor.execute(delete_query_else, (5, "DANGER"))
        #commit the changes
        self.mydb.commit()
        



            


    #multithread the main functions, idk if it's necessary 
    def main_execute(self):
        #self.delete_old_rows()
        self.insert_json_data()
        
    #commit changes and close db
        self.mydb.commit()
        self.mydb.close()
    
    
    
            
            
            
    

# Create an instance of DBManager
db_manager_instance = DBManager()

# Call the method to show table data
    
schedule.every(1).minutes.do(db_manager_instance.main_execute) 
  
while True: 
    schedule.run_pending() 
    time.sleep(1) 


