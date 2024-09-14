

if (localStorage.getItem('round_finished') === null) {
    localStorage.setItem('round_finished', false);
}

if (localStorage.getItem('round_finished') === 'false') {
    localStorage.setItem('points', 0);
    localStorage.setItem('round', 1);
}
localStorage.setItem('round_finished', false);


window.addEventListener("beforeunload", function (e) {
    if (localStorage.getItem('round_finished') === 'false') {
        e.preventDefault();
    }
});

// Function to fetch a random subfolder from rooms.txt
function getRandomID(callback) {
    fetch('locations.csv')
        .then(response => response.text())
        .then(data => {
            const rows = data.trim().split('\n');
            const lastColumn = rows.map(row => row.split(',').pop());
            const randomIndex = Math.floor(Math.random() * (lastColumn.length - 1)) + 1;
            const randomRow = rows[randomIndex].split(',').slice(0, 5);

            callback(randomRow);
        })
}

function result(random, guess) {
    const ID = random[4];

    const commonElements = random.filter(element => guess.includes(element));
    const points = commonElements.length;


    document.querySelector('#menu').style.transform = 'scale(0)';
    if (points == 5) {
        document.getElementById("result-text").style.display = "block";
        document.getElementById("result-text").textContent = "Correct!";
        document.querySelector('.result-message').style.color = 'green';
    }
    else if (points >= 3) {
        document.getElementById("result-text").style.display = "block";
        document.getElementById("result-text").textContent = "Almost!";
        document.querySelector('.result-message').style.color = 'orange';
    }
    else {
        document.getElementById("result-text").style.display = "block";
        document.getElementById("result-text").textContent = "Incorrect!";
        document.querySelector('.result-message').style.color = 'red';
    }

    // Make a element showing the score out of 5
    const scoreElement = document.createElement('div');
    scoreElement.textContent = 'Score: ' + points + '/5';
    scoreElement.classList.add('score');
    document.body.appendChild(scoreElement);

    // Create a new element to display the randomID
    const randomIDElement = document.createElement('div');
    // add a newline between answer and id
    randomIDElement.textContent = 'Answer: ' + random[0] + "\n" + random[3];

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

    // check if localStorage has points item
    if (!localStorage.getItem("points")) {
        localStorage.setItem("points", 0);
    }


    const oldPoints = localStorage.getItem("points");
    const oldRound = localStorage.getItem("round");

    localStorage.setItem("points", parseInt(oldPoints) + points);
    localStorage.setItem("round", parseInt(oldRound) + 1);

    const totalPoints = localStorage.getItem("points");
    const round = localStorage.getItem("round");

    // Make a element showing the score out of 5
    const totalScoreElement = document.createElement('div');
    totalScoreElement.textContent = 'Total score: ' + totalPoints + "/" + oldRound * 5;
    totalScoreElement.classList.add('total-score');
    document.body.appendChild(totalScoreElement);

    localStorage.setItem('round_finished', true);
}

// Get a random subfolder and set it as the basePath
getRandomID(function (randomID) {
    if (randomID) {
        pannellum.viewer('panorama', {
            "type": "multires",
            "autoLoad": true,
            "multiRes": {
                "basePath": "images/" + randomID[4].trim(), // Modify basePath here
                "path": "/%l/%s%y%x",
                "extension": "jpg",
                "tileResolution": 1,
                "maxLevel": 1,
                "cubeResolution": 10000
            }
        });
    } else {
        console.error('Failed to get random subfolder.');
    }



    window.addEventListener("message", function (event) {
        const guess = event.data;

        for (let i = 0; i < guess.length; i++) {
            guess[i] = guess[i].toString();
        }

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
                            window.parent.postMessage([location.name, building.name, floor.name, room.name, room.id]);
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

