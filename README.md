# UvA guesser
## A fun game where you guess which UvA lecture room you are located in. Inspired by Geoguessr

Click [here](https://uvaguessr.quirijndubois.nl) to try!

## Hosting

Get started by installing requirements and running setup.py (Should work in any newer version of python)
```bash
pip install requests json pandas
```
```bash
python setup.py
```
This script downloads the panorama images of all uva rooms in locations.csv from https://rooster.uva.nl. This also generates locations.json, required for the guessing menu.

### Docker-compose
The easiest way to host is by using docker-compose:
```bash
docker-compose up -d
```

## Contributing
If you read this and want to contribute, please just add some rooms to the locations.csv. For now this is a bit tedious, because you have to manually check if each room exists and has panorama images on https://rooster.uva.nl
