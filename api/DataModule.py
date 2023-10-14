from bs4 import BeautifulSoup
from deep_translator import GoogleTranslator
from spacy_poc import dataExtractor
import googlemaps
import requests
import re
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager


class dataModule:
    def __init__(self):
        self.translate_en = GoogleTranslator(source='auto', target='en')
        self.translate_he = GoogleTranslator(source='auto', target='iw')
        self.dex = dataExtractor()
        op = webdriver.ChromeOptions()
        op.add_argument('headless')
        op.add_argument('--disable-gpu')
        self.driver = webdriver.Chrome(options=op)
        self.gmaps = googlemaps.Client(
            key='AIzaSyDhCenCnlhAr2oth9wQFOrUBAOFZ9j63V4')

    def getGeoCode(self, address):
        try:
            geocode_result = self.gmaps.geocode(address)
            lat = geocode_result[0]["geometry"]["location"]["lat"]
            lon = geocode_result[0]["geometry"]["location"]["lng"]
            return (lat, lon)
        except:
            return (0, 0)

    def get_times(self, url):
        self.driver.get(url)
        pattern = r'\d{2}:\d{2}'
        source = (self.driver.page_source)
        text_content = BeautifulSoup(source, 'html.parser').get_text()
        matches = re.findall(pattern, text_content)
        return matches

    def Scraping(self):
        events = []
        url = "https://hamal.co.il/main"
        try:
            response = requests.get(url)

            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
            else:
                print(
                    f"Failed to retrieve the webpage. Status code: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"An error occurred: {str(e)}")

        headers = soup.find_all(attrs={'class': 'styles_title__Tr6kY'})
        for header in headers:
            events.append(header.text)
        times = self.get_times(url)
        i = 0
        exEvents = []
        for e in events:
            tmp = self.dex.classify_message(
                self.translate_en.translate(e))
            if tmp["type"] != None and tmp["place"] != '':
                tmp["place"] = self.getGeoCode(tmp['place'][::-1])
                tmp["time"] = times[i]
                exEvents.append(tmp)
            i = i+1
        return exEvents


#dm = dataModule()
#dm.Scraping()
#for event in dm.Scraping(): print(event)


