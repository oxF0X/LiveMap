from deep_translator import GoogleTranslator
import spacy
from pprint import pprint
nlp = spacy.load('en_core_web_sm')
translator_en = GoogleTranslator(source='auto', target='en')  
translator_he = GoogleTranslator(source='auto', target='iw')  

def extract_places_and_descriptions(paragraph):
    doc = nlp(paragraph)

    places = []
    descriptions = []
    for ent in doc.ents:
        print(f"{ent.text} : {ent.label_}")
        if ent.label_ in ["GPE"]:  # Check if the entity is a geographical place
            places.append(ent.text)
            sentence = ent.sent
            descriptions.append(sentence.text)

    return places, descriptions

t = input('Enter text: ')

places, descriptions = extract_places_and_descriptions(translator_en.translate(t))  


for place, description in zip(places, descriptions):
   print(f"Place: {translator_he.translate(place.strip('[]'))[::-1]}")
   print(f"What's happening there: {translator_he.translate(description.strip('[]'))[::-1]}\n")