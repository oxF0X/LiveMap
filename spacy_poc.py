from deep_translator import GoogleTranslator
import spacy
import re
translator_en = GoogleTranslator(source='auto', target='en')  
translator_he = GoogleTranslator(source='auto', target='iw')  

locations_txt = open("./locations.txt",'r')
locations = locations_txt.read() 
locations_list = locations.split("\n") 
locations_txt.close()



class LocationExtractor:
    def __init__(self, locations_list):
        self.locations_list = locations_list
        self.nlp = spacy.load("en_core_web_md")

    def extract_place(self, message):
        for location in self.locations_list:
            if location.lower() in message.lower() and location != '': # Case-insensitive keyword matching
                return location
        place = ""
        for token in self.nlp(message):
            #print(f"{token.text}:{token.ent_type_}")
            if token.text.lower() in ["highway","road","route"] or token.ent_type_ in ["FAC","LOC","PERSON","CARDINAL"]: 
                place += token.text + " "
        return place
    def extract_road(self, message):
        road = ""
        for token in self.nlp(message):
            if token.ent_type_ == "FAC":
                road += token.text + " "
        return road
    
    def classify_message(self, message):        
        doc = self.nlp(message)
        type = None
        loc = None
        # Check for road references
        for token in doc:
           if token.ent_type_ == "FAC":
               type = "ROAD_BLOCKED"
        danger_keywords = ["invasion", "danger", "terrorist","infiltration","fear","incident","shooting"]
        if any(keyword in message.lower() for keyword in danger_keywords):
            type = "DANGER"
        if("alarms" in message.lower()):
            type = "ALARMS"
        tmp = self.extract_place(message) 
        if len(tmp) > 0:
            loc = tmp
        tmp = self.extract_road(message)
        if len(tmp) > 0: 
            loc = tmp
        classification = {
            "place": translator_he.translate(loc)[::-1],
            "message": translator_he.translate(message)[::-1],
            "type": type
        }
        return classification

location_extractor = LocationExtractor(locations_list)

t = input('Enter text: ')

classification = location_extractor.classify_message(translator_en.translate(t))

print(classification)
