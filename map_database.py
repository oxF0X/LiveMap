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

mydb = mysql.connector.connect(
    host = "localhost",
    user = "root",
    passwd = "abudefduf1",
    database = "mapdb"
)    


#query to create a table
create_table_query = """
CREATE TABLE IF NOT EXISTS mapdata (
    id INTEGER,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    type VARCHAR(50) NOT NULL,
    addition DATE
)
"""
cursor = mydb.cursor()
#create table query
cursor.execute(create_table_query)



#will change when needed
json_directory = "/path/to/json"

#insert JSON data
def insert_json_data(file):
    
    with open(os.path.join(json_directory, file), "r") as f:
        data = json.load(f)
    
    check_query = "SELECT id FROM your_table_name WHERE id = %s"
    cursor.execute(check_query, (data["id"],))
    existing_id = cursor.fetchone()
    if not existing_id:
        #query to insert data into the table
        insert_query = "INSERT INTO mapdata (id, title, content, type, addition) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(insert_query, (data["id"], data["title"], data["content"], data["type"], data["addition"] ))
        
    else:
        os.remove(os.path.join(json_directory, file))
            
    mydb.commit()


def delete_old_rows():
    current_time = datetime.now()
    
    #query to delete rows older than 15 minutes
    delete_query = """
    DELETE FROM your_table_name
    WHERE DATEDIFF(minute, current_time, addition) > %s AND type = %s
    """
    
    #execute cursor with changes, will add types once syntax is known
    cursor.execute(delete_query, (15, ""))
    cursor.execute(delete_query, (30, ""))
    # Commit the changes
    mydb.commit()
    



#iterate through json files in directory
def iterator():
    for filename in os.listdir(json_directory):
        with open(os.path.join(json_directory, filename), "r") as file:        
            insert_json_data(file)


#schedule to do tasks every minute
schedule.every(1).minutes.do(iterator(), delete_old_rows()) 
  
while True: 
    schedule.run_pending() 
    time.sleep(1)




#commit changes and close db
mydb.commit()
mydb.close()
