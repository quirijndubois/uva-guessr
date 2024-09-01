// Function to fetch a random subfolder from rooms.txt
function getRandomID(callback) {
    fetch('locations.csv')
        .then(response => response.text())
        .then(data => {
            const rows = data.trim().split('\n');
            const lastColumn = rows.map(row => row.split(',').pop());
            const randomIndex = Math.floor(Math.random() * (lastColumn.length - 1)) + 1;
            const randomRoom = lastColumn[randomIndex];
            callback(randomRoom);
        })
        .catch(error => {
            console.error('Error fetching subfolders:', error);
            callback(null);
        });
}

function result(ID, guess) {
    document.querySelector('#menu').style.transform = 'scale(0)';
    if (ID == guess) {
        console.log("correct");
        document.getElementById("correct-text").style.display = "block";
        document.getElementById("incorrect-text").style.display = "none";
    }
    else {
        console.log("incorrect");
        document.getElementById("incorrect-text").style.display = "block";
        document.getElementById("correct-text").style.display = "none";
    }

    // Create a new element to display the randomID
    const randomIDElement = document.createElement('div');
    randomIDElement.textContent = "Answer ID: " + ID;
    randomIDElement.classList.add('answer');

    // Append the randomIDElement to the body
    document.body.appendChild(randomIDElement);

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.classList.add('next-button');

    nextButton.addEventListener('click', function () {
        window.location.reload();
    });

    document.body.appendChild(nextButton);
}

// Get a random subfolder and set it as the basePath
getRandomID(function (randomID) {
    if (randomID) {
        pannellum.viewer('panorama', {
            "type": "multires",
            "autoLoad": true,
            "multiRes": {
                "basePath": "images/" + randomID.trim(), // Modify basePath here
                "path": "/%l/%s%y%x",
                "extension": "jpg",
                "tileResolution": 1,
                "maxLevel": 3,
                "cubeResolution": 10000
            }
        });
    } else {
        console.error('Failed to get random subfolder.');
    }
    window.addEventListener("message", function (event) {
        const guess = event.data;
        result(randomID, guess);
    });
});

// Load the locations from the JSON file
fetch('locations.json')
    .then(response => response.json())
    .then(locations => {

        // Create a function to create a button element
        const createButton = (label) => {
            const button = document.createElement('button');
            button.className = 'button';
            button.textContent = label;
            return button;
        }

        // Create a function to append buttons to the menu container
        const appendButtons = (buttons, menuHeader, backButton) => {
            const menuContainer = document.querySelector('#menu');
            menuContainer.innerHTML = '';
            if (backButton) {
                const backButtonElement = createButton();
                backButtonElement.className = 'back-button';
                backButtonElement.addEventListener('click', backButton);
                menuContainer.appendChild(backButtonElement);
            }
            const header = document.createElement('div');
            header.className = 'menu-header';
            header.textContent = menuHeader;
            menuContainer.appendChild(header);
            buttons.forEach((button) => {
                const buttonElement = createButton(button.label);
                buttonElement.addEventListener('click', button.onClick);
                menuContainer.appendChild(buttonElement);
            });
        }

        // Create a function to display the locations
        const displayLocations = () => {
            const buttons = locations.map((location) => ({
                label: location.name,
                onClick: () => displayBuildings(location)
            }));
            appendButtons(buttons, 'Location');
        }

        // Create a function to display the buildings for a location
        const displayBuildings = (location) => {
            const buttons = location.buildings.map((building) => ({
                label: building.name,
                onClick: () => displayFloors(building, location)
            }));
            appendButtons(buttons, `Building`, () => displayLocations());
        }

        // Create a function to display the floors for a building and location
        const displayFloors = (building, location) => {
            const buttons = building.floors.map((floor) => ({
                label: floor.name,
                onClick: () => displayRooms(floor, building, location)
            }));
            appendButtons(buttons, `Floor`, () => displayBuildings(location));
        }

        // Create a function to display the rooms for a floor, building, and location
        const displayRooms = (floor, building, location) => {
            const buttons = floor.rooms.map((room) => ({
                label: room.name,
                onClick: () => {
                    const confirmButton = {
                        label: 'Confirm',
                        onClick: () => {
                            window.parent.postMessage(room.id, '*'); // The '*' allows the message to be sent to any domain.
                        }
                    };
                    const cancelButton = {
                        label: 'Cancel',
                        onClick: () => displayRooms(floor, building, location)
                    };
                    appendButtons([confirmButton, cancelButton], `${room.name}?`);
                }
            }));
            appendButtons(buttons, `Room`, () => displayFloors(building, location));
        }

        // Start by displaying the locations
        displayLocations();

    });

