// Function to fetch a random subfolder from rooms.txt
function getRandomID(callback) {
    fetch('locations.csv')
        .then(response => response.text())
        .then(data => {
            const rows = data.trim().split('\n');
            const lastColumn = rows.map(row => row.split(',').pop());
            const randomIndex = Math.floor(Math.random() * (lastColumn.length-1))+1;
            const randomRoom = lastColumn[randomIndex];
            callback(randomRoom);
        })
        .catch(error => {
            console.error('Error fetching subfolders:', error);
            callback(null);
        });
}

function result(ID, guess) {
    document.querySelector('iframe').style.transform = 'scale(0)';
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
                "path": "/%s%y_%x",
                "fallbackPath": "/fallback/%s",
                "extension": "jpg",
                "tileResolution": 512,
                "maxLevel": 1,
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