from deep_translator import GoogleTranslator
import spacy
import re


class dataExtractor:
    def __init__(self):
        locations_txt = open("./locations.txt", 'r')
        locations = locations_txt.read()
        locations_list = locations.split("\n")
        locations_txt.close()
        self.locations_list = locations_list
        self.nlp = spacy.load("en_core_web_md")
        self.translate_en = GoogleTranslator(source='auto', target='en')
        self.translate_he = GoogleTranslator(source='auto', target='iw')

    def extract_place(self, message):
        place = ""
        for location in self.locations_list:
            if location.lower() in message.lower() and location != '':  # Case-insensitive keyword matching
                if location == "Aza":
                    return "Gaza"
                return location
        for token in self.nlp(message):
            if token.text.lower() in ["highway", "road", "route"] or token.ent_type_ in ["FAC", "LOC", "PERSON", "CARDINAL"]:
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
        loc = ""
        # Check for road references
        for token in doc:
            if token.ent_type_ == "FAC":
                type = "ROAD_BLOCKED"
        danger_keywords = ["invasion", "danger", "terrorist",
                           "infiltration", "fear", "incident", "shooting", "suspicious"]
        if any(keyword in message.lower() for keyword in danger_keywords):
            type = "DANGER"
        if ("alarms" in message.lower()):
            type = "ALARMS"
        tmp = self.extract_place(message)
        if len(tmp) > 0:
            loc = tmp
        tmp = self.extract_road(message)
        if len(tmp) > 0:
            loc = tmp
        classification = {
            "place": self.translate_he.translate(loc)[::-1],
            "message": self.translate_he.translate(message)[::-1],
            "type": type
        }
        return classification

