# This python script downloads all required panorama images from
# https://rooster.uva.nl
# and creates locations.json based on the rooms.csv file.

import requests
import shutil
import sys
import os
import pandas as pd
import json


def create_folder_if_not_exists(folder_path):
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
        print(f"Folder '{folder_path}' created.")


def download_image(url, file_path):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            with open(file_path, 'wb') as file:
                file.write(response.content)
        else:
            print(f"Error downoading: {url}")
    except Exception as e:
        print(f"An error occurred: {e}")


def save_image(room, title):
    create_folder_if_not_exists(f"public/images/{room}")

    # Replace with your image URL
    url = f"https://rooster.uva.nl/uvazalen/{room}%20pano1/1/{title}.jpg"
    # Path where you want to save the image
    file_path = f"public/images/{room}/{title}.jpg"
    download_image(url, file_path)


def read_rooms(filename):
    try:
        with open(filename, 'r') as file:
            rooms_list = [line.strip()
                          for line in file.readlines() if line.strip()]
        return rooms_list
    except FileNotFoundError:
        print(f"Error: {filename} not found.")
        return []


def locations_to_json(locations):
    locations_grouped = locations.groupby('Location')

    data = []

    for campus, group in locations_grouped:
        campus_data = {'name': campus, 'buildings': []}

        buildings_grouped = group.groupby('Building')

        for building, building_group in buildings_grouped:
            building_data = {'name': building, 'floors': []}

            floors_grouped = building_group.groupby('Floor')

            for floor, floor_group in floors_grouped:
                rooms = []
                for index, row in floor_group.iterrows():
                    room_data = {
                        'id': row['ID'],
                        'name': row['Room'],
                    }
                    rooms.append(room_data)

                building_data['floors'].append({'name': floor, 'rooms': rooms})

            campus_data['buildings'].append(building_data)

        data.append(campus_data)

    return json.dumps(data, indent=4)


if __name__ == "__main__":
    if len(sys.argv) != 2 or sys.argv[1].lower() != 'docker' and sys.argv[1].lower() != 'dev':
        print("Please supply either 'docker' or 'dev' as argument.")
        exit(1)

    locations = pd.read_csv("public/locations.csv")
    with open('public/locations.json', 'w') as f:
        json.dump(json.loads(locations_to_json(locations)), f, indent=4)
        print("locations.json created.")
    locations_json = locations_to_json(locations)
    rooms = locations["ID"].tolist()
    for room in rooms:
        for side in ["f", "r", "l", "u", "d", "b"]:
            title = f"{side}0_0"
            save_image(room, title)
