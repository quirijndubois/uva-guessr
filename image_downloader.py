import requests
import os

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

def save_image(room,title):
    create_folder_if_not_exists(f"images/{room}")

    url = f"https://rooster.uva.nl/uvazalen/{room}%20pano1/1/{title}.jpg"  # Replace with your image URL
    file_path = f"images/{room}/{title}.jpg"  # Path where you want to save the image
    download_image(url, file_path)

def read_rooms(filename):
    try:
        with open(filename, 'r') as file:
            rooms_list = [line.strip() for line in file.readlines() if line.strip()]
        return rooms_list
    except FileNotFoundError:
        print(f"Error: {filename} not found.")
        return []


rooms = read_rooms("rooms.txt")
for room in rooms:
    for side in ["f","r","l","u","d","b"]:
        title = f"{side}0_0"
        save_image(room,title)
