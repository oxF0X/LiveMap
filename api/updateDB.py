from map_database import *
import schedule
import time

# Create an instance of DBManager
db_manager_instance = DBManager()

# Call the method to show table data
    
#schedule.every(1).minutes.do(db_manager_instance.main_execute) 

while True: 
    db_manager_instance.main_execute()
    db_manager_instance.delete_old_rows()
    time.sleep(60)

