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


class DBManager:
    def __init__(self):
        self.db = "mapdb"    
        self.mydb = mysql.connector.connect(
            host = "localhost",
            user = "root",
            passwd = "abudefduf1",
            database = self.db
        )    

        self.cursor = self.mydb.cursor()

        self.cursor.execute(f"""
        SELECT COUNT(*) FROM information_schema.tables
        WHERE table_name = 'mapdata'""")

        result = self.cursor.fetchone()
        if not result:
            self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS mapdata (
            id INTEGER,
            title VARCHAR(255) NOT NULL,
            content TEXT,
            type VARCHAR(50) NOT NULL,
            addition DATE
            )""")


    def select_rows(self):        
        delete_query = """
        DELETE FROM mapdata
        WHERE DATEDIFF(minute, current_time, addition) > %s AND type = %s
        """
        self.cursor.execute("SELECT * FROM mapdata")
        return self.cursor.fetchall()



    #will change when needed


    #insert JSON data
    def insert_json_data(file):
        json_directory = "/path/to/json"

        with open(os.path.join(json_directory, file), "r") as f:
            data = json.load(f)
        
        check_query = "SELECT id FROM mapdata WHERE id = %s"
        self.cursor.execute(check_query, (data["id"],))
        existing_id = self.cursor.fetchone()
        if not existing_id:
            #query to insert data into the table
            insert_query = "INSERT INTO mapdata (id, title, content, type, addition) VALUES (%s, %s, %s, %s, %s)"
            self.cursor.execute(insert_query, (data["id"], data["title"], data["content"], data["type"], data["addition"] ))
            
        else:
            os.remove(os.path.join(json_directory, file))
                
        mydb.commit()


    def delete_old_rows(self):
        current_time = datetime.now()
        
        #query to delete rows older than 15 minutes
        delete_query = """
        DELETE FROM mapdata
        WHERE DATEDIFF(minute, current_time, addition) > %s AND type = %s
        """
        
        #execute cursor with changes, will add types once syntax is known
        self.cursor.execute(delete_query, (15, ""))
        self.cursor.execute(delete_query, (30, ""))
        #commit the changes
        self.mydb.commit()
        



    #iterate through json files in directory
    def iterator(self):
        for filename in os.listdir(json_directory):
            with open(os.path.join(json_directory, filename), "r") as file:        
                insert_json_data(file)



    #multithread the main functions, idk if it's necessary 
    def main_execute(self):
        
        t1 = threading.Thread(target = iterator)
        #t2 = threading.Thread(target = delete_old_rows)
        
        t1.start() 
        #t2.start() 

        #wait until threads finish their job 
        t1.join() 
        #t2.join() 



        #commit changes and close db
        self.mydb.commit()
        self.mydb.close()

