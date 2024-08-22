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
        const appendButtons = (buttons, menuHeader) => {
            const menuContainer = document.querySelector('.menu-container');
            menuContainer.innerHTML = '';
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
                onClick: () => displayFloors(location)
            }));
            appendButtons(buttons, 'Select a Location');
        }

        // Create a function to display the floors for a location
        const displayFloors = (location) => {
            const buttons = location.floors.map((floor) => ({
                label: floor.name,
                onClick: () => displayRooms(floor, location)
            }));
            appendButtons(buttons, `Floors at ${location.name}`);
        }

        // Create a function to display the rooms for a floor and location
        const displayRooms = (floor, location) => {
            const buttons = floor.rooms.map((room) => ({
                label: room,
                onClick: () => console.log(`Selected room: ${room} on ${floor.name} at ${location.name}`)
            }));
            appendButtons(buttons, `Rooms on ${floor.name} at ${location.name}`);
        }

        // Create a back button
        const backButton = document.createElement('button');
        backButton.className = 'back-button';
        backButton.addEventListener('click', () => {
            if (document.querySelector('.menu-header').textContent === 'Select a Location') {
                // Do nothing
            } else if (document.querySelector('.menu-header').textContent.includes('Floors at')) {
                displayLocations();
            } else if (document.querySelector('.menu-header').textContent.includes('Rooms on')) {
                const locationName = document.querySelector('.menu-header').textContent.split(' at ')[1];
                const location = locations.find((location) => location.name === locationName);
                displayFloors(location);
            }
        });
        document.body.appendChild(backButton);

        // Call the displayLocations function
        displayLocations();
    })