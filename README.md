# UvA guesser
## A fun game where you guess which UvA lecture room you are located in. Inspired by Geoguessr

Click [here](https://uvaguessr.quirijndubois.nl) to try!

## Hosting
If you want to host this web-app simply build the docker container with:
```bash
docker build -t uva-guessr .
docker run -p 8080:80 uva-guessr
```

This container automatically downloads the panorama images of all uva rooms in locations.csv from https://rooster.uva.nl. And also generates locations.json, required for the guessing menu.
Next it hosts all of these things with a httpd server.

### Developing
The easiest way to host this web-app in developer mode is by using [docker-compose](https://docs.docker.com/compose/).

First you should run the setup script. This ensures that all assets are downloaded and placed in the correct folder.
```bash
python setup/setup.py dev
docker-compose up
```
The web-app should now be available on localhost:1234

## Contributing
If you read this and want to contribute, please just add some rooms to the locations.csv. For now this is a bit tedious, because you have to manually check if each room exists and has panorama images on https://rooster.uva.nl
