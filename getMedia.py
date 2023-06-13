import requests
mediaUrl = 'http://46.226.110.124:1337/api/whichcontentisreal-mediacontents'
def getMedia(mediaUrl):
    #get all media from api
    resp = requests.get(f"{mediaUrl}?populate=*").json()['data']
    #get media with attribute is_real equal to True
    realMedia = [r["attributes"]["media"]["data"] for r in resp if r["attributes"]['is_real']]
    flattenedRealMedia = [item for sublist in realMedia for item in sublist]
    #keep only url
    realUrls = [{"url":r["attributes"]["url"], "caption":r["attributes"]["caption"]} for r in flattenedRealMedia]
    print(realUrls)
    #get media with attribute is_real equal to Flase
    fakeMedia = [r["attributes"]["media"]["data"] for r in resp if r["attributes"]['is_real']]
    #flatten list of list
    flattenedfakeMedia = [item for sublist in fakeMedia  for item in sublist]
     #keep only url
    fakeUrls = [{"url":r["attributes"]["url"], "caption":r["attributes"]["caption"]} for r in flattenedfakeMedia]
    return realUrls, fakeUrls


getMedia(mediaUrl)