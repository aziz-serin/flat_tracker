# What does this app do?

I created this app while I was searching for a flat last summer. It basically
takes flats from the website [RightMove](https://www.rightmove.co.uk/) (one of the largest websites
to find a flat in England), and returns all the available flats for you on discord. This app sends you the
alerts every hour on weekdays and Saturday from 9 am to 5 pm (because estate agents do not work on Sundays, there are no updates
on the website on Sundays). You can change these preferences on the crone job which is initialised on
[index.js](./index.js) file.

## How to run this app?

To run the app, you need to set up a discord server and register a bot with that server. This can be
easily done on the discord developer website. Then you take token, client_id, guild_id and channel id
from the discord developer website, and place that into a config.json file you can create at the top
directory. To fetch the search results you desire e.g. Flats in London, Westminster, 2 bedroom unfurnished,
you navigate [RightMove](https://www.rightmove.co.uk/), do the search you want with the criteria you desire,
then copy the url into a constant called [url](/scrape/scraper.js) in the linked file (there is already an url
in there which I used, just replace it with yours). Then you are ready to go! Just run these two commands
to install the dependencies and run the app!

```
npm install
node run index.js
```

### Note about Docker

I have also created a [Dockerfile](./Dockerfile) to create a docker image, but it runs very slowly on my machine
(Macbook Pro with M1 Pro), so use it on your own discretion.