# Auto Match Generator

Auto Match Generator is a simple web-based tool to randomly generate races for Assetto Corsa by selecting a track and a customizable number of cars automatically. Perfect for quickly setting up random races without manual selection.

## Features

- Randomly selects a track from your Assetto Corsa tracks folder.
- Generates a list of unique cars from your Assetto Corsa cars folder.
- API endpoints to fetch cars, tracks, or full race setups.
- Simple, modern UI for easy interaction.
- Prevents repeating cars until all have been used.

## Installation & Setup

### Requirements

- **Operating System:** Windows (tested on Windows 10/11, but can be adapted)
- **Node.js:** Version 16 or higher
- **Assetto Corsa** installed with valid cars and tracks directories

### Configuration

Make sure you update the `CARS_FOLDER` and `TRACKS_FOLDER` paths in the server code to point to your Assetto Corsa installation folders:

```js
const CARS_FOLDER = 'C:/Program Files (x86)/Steam/steamapps/common/assettocorsa/content/cars';
const TRACKS_FOLDER = 'C:/Program Files (x86)/Steam/steamapps/common/assettocorsa/content/tracks';
```
Install Dependencies
Run the following in your project root directory:
```
npm install express
```
Run the Server
```
node server.js
```
By default, the server listens on port 50002
```
http://localhost:50002
```
Open the following URL in your browser to access the Auto Match Generator UI:
### API Endpoints
- `GET /api/cars?count=N`
Returns N unique random cars.

- `GET /api/tracks`
Returns the list of available tracks.

- `GET /api/race?count=N`
Returns a randomly selected track and `N` unique cars for a full race setup.
### Usage
1. Open the web interface.
2. Enter the number of cars you want in the race.
3. Click Generate.
4. The page will display a random track and the list of cars selected.

### License
This project is licensed under the **MIT License**

Feel free to customize the paths and UI as needed for your setup.