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
            const menuContainer = document.querySelector('.menu-container');
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
            appendButtons(buttons, 'Locations');
        }

        // Create a function to display the buildings for a location
        const displayBuildings = (location) => {
            const buttons = location.buildings.map((building) => ({
                label: building.name,
                onClick: () => displayFloors(building, location)
            }));
            appendButtons(buttons, `Buildings at ${location.name}`, () => displayLocations());
        }

        // Create a function to display the floors for a building and location
        const displayFloors = (building, location) => {
            const buttons = building.floors.map((floor) => ({
                label: floor.name,
                onClick: () => displayRooms(floor, building, location)
            }));
            appendButtons(buttons, `Floors in ${building.name} at ${location.name}`, () => displayBuildings(location));
        }

        // Create a function to display the rooms for a floor, building, and location
        const displayRooms = (floor, building, location) => {
            const buttons = floor.rooms.map((room) => ({
                label: room,
                onClick: () => console.log(`Selected room: ${room} on ${floor.name} in ${building.name} at ${location.name}`)
            }));
            appendButtons(buttons, `Rooms on ${floor.name} in ${building.name} at ${location.name}`, () => displayFloors(building, location));
        }

        // Start by displaying the locations
        displayLocations();

    });

