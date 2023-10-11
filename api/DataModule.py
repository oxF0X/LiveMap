from bs4 import BeautifulSoup
import requests
from deep_translator import GoogleTranslator
from spacy_poc import dataExtractor
import googlemaps


class dataModule:
    def __init__(self):
        self.translate_en = GoogleTranslator(source='auto', target='en')
        self.translate_he = GoogleTranslator(source='auto', target='iw')
        self.dex = dataExtractor()
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

    def Scraping(self):
        data = {}
        hebrew_alphabet = [
            'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ך', 'ל', 'מ',
            'ם', 'נ', 'ן', 'ס', 'ע', 'פ', 'ף', 'צ', 'ץ', 'ק', 'ר', 'ש', 'ת'
        ]

        symbols = [
            ' ', '!', '#', '$' "'", '(', ')', ',', '.',
            ':', '[', ']', '^', '`', '{', '|', '}', '~', '׳', '־', '׀', 'ׁ', 'ׂ', '׃', '׆', 'ׇ'
        ]
        url = "https://hamal.co.il/main"

        try:
            response = requests.get(url)

            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')

                # print(soup.prettify())
            else:
                print(
                    f"Failed to retrieve the webpage. Status code: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"An error occurred: {str(e)}")

        articlesSoup = soup.find_all(attrs={'class': 'styles_article__Mwzjl'})
        articles = []
        linkComponents = []
        for article in articlesSoup:
            linkComponent = article.find(
                attrs={'class': 'styles_bodyContainer__w4Y99'})
            linkComponents.append(linkComponent)

        links = []

        for link in linkComponents:
            actualLinkComponent = link.find('a')
            linkString = str(actualLinkComponent)
            linkString = linkString[9:-6]
            links.append(linkString)

        for link in links:
            url = f"https://hamal.co.il{link}"

            try:
                response = requests.get(url)

                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, 'html.parser')

                    # print(soup.prettify())
                else:
                    print(
                        f"Failed to retrieve the webpage. Status code: {response.status_code}")
            except requests.exceptions.RequestException as e:
                print(f"An error occurred: {str(e)}")

            title = str(soup.find(attrs={"class": "styles_title__QOrfi"}))
            content = str(
                soup.find(attrs={"class": "styles_action__8YDU4 styles_mail__6E83G"}))
            parsedTitle = ""
            if len(title) != 0:
                for letter in title:
                    if (letter in hebrew_alphabet or letter in symbols):
                        parsedTitle += letter

            parsedContent = ""
            for letter in content:
                if (letter in hebrew_alphabet or letter in symbols):
                    parsedContent += letter
            data[parsedTitle] = parsedContent
        events = []
        for key in data.keys():
            tmp = self.dex.classify_message(
                self.translate_en.translate(key))
            if tmp["type"] != None and tmp["place"] != '':
                print(tmp)
                tmp["place"] = self.getGeoCode(tmp['place'][::-1])
                events.append(tmp)
        print(events)
        return events


dm = dataModule()
dm.Scraping()
# for event in dm.Scraping():
#    print(event)
