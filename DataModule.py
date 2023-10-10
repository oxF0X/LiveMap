from bs4 import BeautifulSoup
import requests

class dataMoudle:
    def __innit__(self):
        self

    def Scraping(self):
        data = {

        }
        url = "https://hamal.co.il/main"

        try:
            response = requests.get(url)

            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')

            else:
                print(f"Failed to retrieve the webpage. Status code: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"An error occurred: {str(e)}")

        articlesSoup = soup.find_all(attrs={'class':'styles_article__Mwzjl'})
        articles = []
        linkComponents = []
        for article in articlesSoup:
            linkComponent = article.find(attrs={'class':'styles_bodyContainer__w4Y99'})
            linkComponents.append(linkComponent)

        links = []

        for link in linkComponents:
            actualLinkComponent = link.find('a')
            linkString = str(actualLinkComponent)
            linkString = linkString[9:-6]
            links.append(linkString)

        print(links)


        for link in links:
            url = f"https://hamal.co.il{link}"
            print(url)

            try:
                response = requests.get(url)

                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, 'html.parser')

                    # print(soup.prettify())
                else:
                    print(f"Failed to retrieve the webpage. Status code: {response.status_code}")
            except requests.exceptions.RequestException as e:
                print(f"An error occurred: {str(e)}")


            title = str(soup.find(attrs={"class":"styles_title__QOrfi"}).get_text())
            content = str(soup.find(attrs={"class":"styles_action__8YDU4 styles_mail__6E83G"}))

            data[title] = content


        return data


