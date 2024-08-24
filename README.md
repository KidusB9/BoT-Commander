#Robotics: BoT Summoning Interface

## Overview

The **BoT Summoning Interface** is a comprehensive React application designed for managing and interacting with robotic devices. The interface allows users to add, modify, and delete devices, view and select groups and robots, and issue summon commands to robots. This application integrates with a backend API to manage devices and simulate user interactions.

## Features

- **Device Management**: Add, modify, and delete devices.
- **Dynamic Interaction**: Select devices, groups, robots, and destinations dynamically.
- **Simulated User Interactions**: Simulate user interactions and perform load testing.
- **CSV Export**: Export load test reports to CSV.

## Getting Started

### Installation

To set up the application, clone the repository and install the necessary dependencies:

```bash
git clone https://github.com/KidusB9/BoT-Commander.git
cd Bot-Summoning
npm install


```markdown
### Configuration

#### API Setup
Ensure your backend API is running locally on [http://127.0.0.1:9050](http://127.0.0.1:9050) or adjust the URLs in the code to match your API endpoint.

#### Environment Variables
- Create a `.env` file in the root directory and configure it if needed.

### Running the Application

To start the application, use:

```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Usage

Once the application is running, you can interact with the interface to manage devices and issue commands:

- **Add a Device**: Click on "Add a Device" and enter the device details.
- **Modify Device Name**: Click on "Modify Device Name" to update existing device names.
- **Delete a Device**: Click on "Delete a Device" to remove a device from the list.
- **Summon a Bot**: Select a device, group, robot, and destination to issue a summon command.

### Code Overview

The application is built using React and includes the following key components:

- `SummonOption.tsx`: The main component handling device interactions and user inputs.
- `SummonOption.scss`: The accompanying stylesheet for styling the component.

#### Code Snippet: `SummonOption.tsx`

```typescript
```markdown
### Configuration

#### API Setup
Ensure your backend API is running locally on [http://127.0.0.1:9050](http://127.0.0.1:9050) or adjust the URLs in the code to match your API endpoint.

#### Environment Variables
- Create a `.env` file in the root directory and configure it if needed.

### Running the Application

To start the application, use:

```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Usage

Once the application is running, you can interact with the interface to manage devices and issue commands:

- **Add a Device**: Click on "Add a Device" and enter the device details.
- **Modify Device Name**: Click on "Modify Device Name" to update existing device names.
- **Delete a Device**: Click on "Delete a Device" to remove a device from the list.
- **Summon a Bot**: Select a device, group, robot, and destination to issue a summon command.

### Code Overview

The application is built using React and includes key components:

- `SummonOption.tsx`: Handles device interactions and user inputs.
- `SummonOption.scss`: Styles the `SummonOption` component.

For the full implementation of the code, refer to the source files in the repository.

### Example Component

Here is a brief example of the `SummonOption.tsx` component:

```typescript
import React, { useState } from 'react'
import axios from 'axios'
import './SummonOption.scss'

function SummonOption() {
  const [newDevice, setNewDevice] = useState({
    deviceName: '',
    deviceId: '',
    deviceSecret: '',
    region: '',
  })

  // Function to handle adding a new device
  const addDevice = () => {
    if (Object.values(newDevice).some(value => value === '')) {
      alert('Please fill in all the fields!')
      return
    }

    axios.post('http://127.0.0.1:9050/api/add/device', newDevice)
      .then(response => {
        alert('Device added successfully!')
      })
      .catch(error => {
        console.error(error)
        alert('Failed to add device!')
      })
  }

  // Other state and functions...

  return (
    <div>
      {/* Render UI elements */}
    </div>
  )
}

export default SummonOption
```

Refer to the full code in the repository for a complete view of all components and their interactions.
```


