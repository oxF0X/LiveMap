import map_database

# Create an instance of DBManager
db_manager_instance = DBManager()

# Call the method to show table data
    
schedule.every(1).minutes.do(db_manager_instance.main_execute) 

while True: 
    schedule.run_pending() 
    time.sleep(1)