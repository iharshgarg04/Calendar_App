# Calendar Application

A simple calendar application that allows you to view and manage tasks and events for different dates.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)

## Features

- Display a monthly calendar with the ability to navigate between months.
- Add, edit, and delete tasks and events for specific dates.
- View holiday events fetched from an external API.
- Responsive design with both a large calendar and a small calendar view.
- Data is stored in the browser's localStorage.

## Getting Started

To run the project locally, follow the steps below.

### Prerequisites

- Node.js (for running a local development server)
- An active internet connection to fetch holiday data from an API

### Installation

1. Clone the repository to your local machine:

   ```bash
   git clone <repository_url>
Navigate to the project directory:

bash
Copy code
cd calendar_app


bash
Copy code
npm install
Start the development server:

bash
Copy code
npm start
The calendar application should now be accessible in your web browser at http://localhost:3000.

##Usage
Navigating Months:

Use the left and right arrow buttons in the top navigation to move between months.
Adding Tasks and Events:

Click on a date to open the task/event panel.
Enter the title and description.
Click the "Save" button to add a new task/event.
Editing Tasks and Events:

Click on an existing task/event to open the edit panel.
Update the title and description.
Click the "Save" button to save your changes.
Deleting Tasks and Events:

Click on an existing task/event to open the edit panel.
Click the "Delete" button to remove the task/event.
Viewing Holiday Events:

Click on a date displaying the holiday event name to view details.

#Configuration
You can configure the base URL for the holiday data API in the fetchFromApi function in the code.

